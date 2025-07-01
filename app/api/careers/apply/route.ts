import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const position = formData.get('position') as string;
    const experience = formData.get('experience') as string;
    const availability = formData.get('availability') as string;
    const motivation = formData.get('motivation') as string;
    const additionalInfo = formData.get('additionalInfo') as string;
    const resume = formData.get('resume') as File;

    // Validate required fields
    if (!firstName || !lastName || !email || !position) {
      return NextResponse.json(
        { error: 'First name, last name, email, and position are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Handle resume upload (for now, just store file info)
    let resumeUrl = null;
    let resumeInfo = null;

    if (resume && resume.size > 0) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
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

      resumeInfo = {
        name: resume.name,
        size: resume.size,
        type: resume.type
      };

      // TODO: In production, upload to Supabase Storage or S3
      // For now, we'll store file info only
      resumeUrl = `resume_${Date.now()}_${resume.name}`;
    }

    // Get additional info
    const page = request.headers.get('referer') || '/careers';
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';

    // Calculate experience years from text
    let experienceYears = 0;
    if (experience) {
      const yearMatch = experience.match(/(\d+)/);
      if (yearMatch) {
        experienceYears = parseInt(yearMatch[1]);
      }
    }

    // Save to database
    const { data: application, error: dbError } = await supabase
      .from('career_applications')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        position,
        experience_years: experienceYears,
        current_role: experience || null,
        resume_url: resumeUrl,
        cover_letter: motivation || null,
        availability_date: availability ? new Date(availability).toISOString().split('T')[0] : null,
        referral_source: 'website',
        status: 'new',
        metadata: {
          page,
          user_agent: userAgent,
          ip_address: ip,
          additional_info: additionalInfo,
          resume_info: resumeInfo,
          submitted_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save application' },
        { status: 500 }
      );
    }

    // Track analytics event
    await supabase
      .from('analytics_events')
      .insert({
        type: 'career_application_submission',
        page,
        session_id: crypto.randomUUID(),
        data: {
          position,
          experience_years: experienceYears,
          has_resume: !!resume,
          has_phone: !!phone
        }
      });

    // TODO: Send notification emails to admins
    // TODO: Send auto-response to applicant

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