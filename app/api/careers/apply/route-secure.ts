import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase-server';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { z } from 'zod';

// Input validation schema
const applicationSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email().max(255),
  phone: z.string().regex(/^\+?[\d\s()-]+$/).max(20).optional(),
  position: z.string().min(1).max(100),
  experience: z.string().max(500).optional(),
  availability: z.string().optional(),
  motivation: z.string().max(5000).optional(),
  additionalInfo: z.string().max(2000).optional()
});

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const identifier = 
    request.headers.get('x-forwarded-for') || 
    request.headers.get('x-real-ip') ||
    'anonymous';
    
  const rateLimitResult = await rateLimit(RATE_LIMITS.careers, identifier);
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { 
        error: 'Too many applications', 
        message: `Please wait before submitting another application. Try again after ${rateLimitResult.reset.toLocaleTimeString()}.` 
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toISOString(),
          'Retry-After': Math.ceil((rateLimitResult.reset.getTime() - Date.now()) / 1000).toString(),
        }
      }
    );
  }
  
  try {
    const formData = await request.formData();
    
    // Extract form fields
    const formFields = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      position: formData.get('position') as string,
      experience: formData.get('experience') as string,
      availability: formData.get('availability') as string,
      motivation: formData.get('motivation') as string,
      additionalInfo: formData.get('additionalInfo') as string
    };
    
    const resume = formData.get('resume') as File;

    // Validate form fields
    let validatedData;
    try {
      validatedData = applicationSchema.parse(formFields);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { 
            error: 'Invalid input',
            details: validationError.errors
          },
          { status: 400 }
        );
      }
      throw validationError;
    }

    // Handle resume upload
    let resumeUrl = null;
    let resumeMetadata = null;

    if (resume && resume.size > 0) {
      // Validate file type
      const allowedTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(resume.type)) {
        return NextResponse.json(
          { error: 'Resume must be a PDF, DOC, or DOCX file' },
          { status: 400 }
        );
      }

      // Validate file size (5MB max)
      if (resume.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Resume file size must be less than 5MB' },
          { status: 400 }
        );
      }

      // Create anonymous Supabase client for storage
      const { supabase } = createSupabaseRouteHandlerClient(request);

      // Generate unique filename
      const fileExt = resume.name.split('.').pop();
      const fileName = `${Date.now()}_${validatedData.lastName}_${validatedData.firstName}.${fileExt}`;
      const filePath = `career-applications/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, resume, {
          contentType: resume.type,
          upsert: false
        });

      if (uploadError) {
        console.error('Resume upload error:', uploadError);
        // Continue without resume - don't fail the application
      } else {
        resumeUrl = filePath;
        resumeMetadata = {
          originalName: resume.name,
          size: resume.size,
          type: resume.type,
          uploadedAt: new Date().toISOString()
        };
      }
    }

    // Get additional info
    const page = request.headers.get('referer') || '/careers';
    const userAgent = request.headers.get('user-agent') || '';

    // Calculate experience years from text
    let experienceYears = 0;
    if (validatedData.experience) {
      const yearMatch = validatedData.experience.match(/(\d+)/);
      if (yearMatch) {
        experienceYears = parseInt(yearMatch[1]);
      }
    }

    // Create anonymous Supabase client (public endpoint)
    const { supabase } = createSupabaseRouteHandlerClient(request);

    // Save to database (RLS should allow public inserts to career_applications)
    const { data: application, error: dbError } = await supabase
      .from('career_applications')
      .insert({
        first_name: validatedData.firstName.trim(),
        last_name: validatedData.lastName.trim(),
        email: validatedData.email.toLowerCase().trim(),
        phone: validatedData.phone?.trim() || null,
        position: validatedData.position.trim(),
        experience_years: experienceYears,
        current_role: validatedData.experience?.trim() || null,
        resume_url: resumeUrl,
        cover_letter: validatedData.motivation?.trim() || null,
        availability_date: validatedData.availability || null,
        referral_source: 'website',
        status: 'new',
        metadata: {
          page,
          user_agent: userAgent,
          ip_address: identifier,
          additional_info: validatedData.additionalInfo?.trim() || null,
          resume_metadata: resumeMetadata,
          submitted_at: new Date().toISOString()
        },
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      
      // Check if it's a RLS policy error
      if (dbError.code === '42501') {
        return NextResponse.json(
          { error: 'Database permissions error. Please contact support.' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to save application' },
        { status: 500 }
      );
    }

    // Send notification emails separately
    try {
      const { sendEmail } = await import('@/lib/resend-client');
      
      // Notification to HR
      await sendEmail({
        to: 'jana@bloompsychologynorthaustin.com',
        subject: `New Career Application: ${validatedData.position} - ${validatedData.firstName} ${validatedData.lastName}`,
        html: `
          <h2>New Career Application Received</h2>
          <p><strong>Position:</strong> ${validatedData.position}</p>
          <p><strong>Name:</strong> ${validatedData.firstName} ${validatedData.lastName}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          ${validatedData.phone ? `<p><strong>Phone:</strong> ${validatedData.phone}</p>` : ''}
          <p><strong>Experience:</strong> ${validatedData.experience || 'Not specified'}</p>
          <p><strong>Availability:</strong> ${validatedData.availability || 'Not specified'}</p>
          ${validatedData.motivation ? `<h3>Motivation:</h3><p>${validatedData.motivation}</p>` : ''}
          ${resumeUrl ? `<p><strong>Resume uploaded:</strong> Yes</p>` : ''}
          <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/careers/${application.id}">View Application</a></p>
        `,
        tags: [
          { name: 'type', value: 'career_application_notification' },
          { name: 'position', value: validatedData.position }
        ]
      });

      // Confirmation to applicant
      await sendEmail({
        to: validatedData.email,
        subject: 'Application Received - Bloom Psychology',
        html: `
          <h2>Thank you for your application</h2>
          <p>Dear ${validatedData.firstName},</p>
          <p>We've received your application for the <strong>${validatedData.position}</strong> position.</p>
          <p>Our team will review your application and get back to you within 5-7 business days.</p>
          <p>If you have any questions in the meantime, please feel free to contact us.</p>
          <p>Best regards,<br>Bloom Psychology HR Team</p>
        `,
        tags: [
          { name: 'type', value: 'career_application_confirmation' }
        ]
      });
    } catch (emailError) {
      console.error('Email notification error:', emailError);
      // Don't fail the application submission
    }

    // Track analytics event
    try {
      await supabase
        .from('analytics_events')
        .insert({
          type: 'career_application_submission',
          page,
          session_id: crypto.randomUUID(),
          data: {
            position: validatedData.position,
            experience_years: experienceYears,
            has_resume: !!resumeUrl,
            has_phone: !!validatedData.phone
          },
          ip_address: identifier,
          user_agent: userAgent
        });
    } catch (analyticsError) {
      console.error('Analytics error:', analyticsError);
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your application! We will review it and get back to you within 5-7 business days.',
      application_id: application.id
    });
    
  } catch (error) {
    console.error('Career application error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// SQL needed for RLS:
/*
-- Allow public to insert career applications
CREATE POLICY "Public can submit career applications" ON career_applications
  FOR INSERT TO anon
  WITH CHECK (true);

-- Create resumes bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Allow public to upload resumes
CREATE POLICY "Public can upload resumes" ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (bucket_id = 'resumes');
*/