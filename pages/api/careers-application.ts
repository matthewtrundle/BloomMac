import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import formidable, { IncomingForm, File } from 'formidable';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

interface ApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  availability: string;
  motivation: string;
  additionalInfo?: string;
  resumeFile?: File;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const form = new IncomingForm({
      uploadDir: '/tmp',
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB max file size
    });

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>(
      (resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve([fields, files]);
        });
      }
    );

    // Extract form data
    const applicationData: ApplicationData = {
      firstName: Array.isArray(fields.firstName) ? fields.firstName[0] : fields.firstName || '',
      lastName: Array.isArray(fields.lastName) ? fields.lastName[0] : fields.lastName || '',
      email: Array.isArray(fields.email) ? fields.email[0] : fields.email || '',
      phone: Array.isArray(fields.phone) ? fields.phone[0] : fields.phone || '',
      position: Array.isArray(fields.position) ? fields.position[0] : fields.position || '',
      experience: Array.isArray(fields.experience) ? fields.experience[0] : fields.experience || '',
      availability: Array.isArray(fields.availability) ? fields.availability[0] : fields.availability || '',
      motivation: Array.isArray(fields.motivation) ? fields.motivation[0] : fields.motivation || '',
      additionalInfo: Array.isArray(fields.additionalInfo) ? fields.additionalInfo[0] : fields.additionalInfo || '',
    };

    // Validate required fields
    if (!applicationData.firstName || !applicationData.lastName || !applicationData.email || !applicationData.position) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Handle resume file if uploaded
    let resumeAttachment;
    if (files.resume) {
      const resumeFile = Array.isArray(files.resume) ? files.resume[0] : files.resume;
      if (resumeFile && resumeFile.filepath) {
        const fileBuffer = fs.readFileSync(resumeFile.filepath);
        const fileName = resumeFile.originalFilename || 'resume.pdf';
        
        // Validate file type
        const allowedTypes = ['.pdf', '.doc', '.docx'];
        const fileExt = path.extname(fileName).toLowerCase();
        if (!allowedTypes.includes(fileExt)) {
          return res.status(400).json({ error: 'Invalid file type. Please upload PDF, DOC, or DOCX files only.' });
        }

        resumeAttachment = {
          filename: fileName,
          content: fileBuffer,
        };

        // Clean up temporary file
        fs.unlinkSync(resumeFile.filepath);
      }
    }

    // Send application email to the practice
    await sendApplicationEmail(applicationData, resumeAttachment);

    // Send confirmation email to applicant
    await sendApplicationConfirmation(applicationData);

    console.log('Career application submitted:', {
      name: `${applicationData.firstName} ${applicationData.lastName}`,
      email: applicationData.email,
      position: applicationData.position,
      hasResume: !!resumeAttachment,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: 'Application submitted successfully. We\'ll be in touch soon!'
    });

  } catch (error) {
    console.error('Career application error:', error);
    return res.status(500).json({ error: 'Failed to submit application' });
  }
}

const sendApplicationEmail = async (data: ApplicationData, resumeAttachment?: any) => {
  const applicationHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Career Application - Bloom Psychology</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #6B21A8 0%, #A855F7 100%); padding: 30px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">New Career Application</h1>
          <p style="color: #E9D5FF; margin: 10px 0 0 0; font-size: 16px;">Bloom Psychology</p>
        </div>

        <!-- Application Details -->
        <div style="padding: 30px;">
          <h2 style="color: #6B21A8; margin-bottom: 20px;">Applicant Information</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #6B21A8; width: 140px;">Name:</td>
              <td style="padding: 10px; border-bottom: 1px solid #E5E7EB;">${data.firstName} ${data.lastName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #6B21A8;">Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #E5E7EB;"><a href="mailto:${data.email}" style="color: #A855F7;">${data.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #6B21A8;">Phone:</td>
              <td style="padding: 10px; border-bottom: 1px solid #E5E7EB;"><a href="tel:${data.phone}" style="color: #A855F7;">${data.phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #6B21A8;">Position:</td>
              <td style="padding: 10px; border-bottom: 1px solid #E5E7EB;">${data.position}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #6B21A8;">Availability:</td>
              <td style="padding: 10px; border-bottom: 1px solid #E5E7EB;">${data.availability}</td>
            </tr>
          </table>

          <h3 style="color: #6B21A8; margin-bottom: 15px;">Experience & Background</h3>
          <div style="background-color: #F3F4F6; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 0; white-space: pre-wrap;">${data.experience}</p>
          </div>

          <h3 style="color: #6B21A8; margin-bottom: 15px;">Motivation & Interest</h3>
          <div style="background-color: #F3F4F6; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 0; white-space: pre-wrap;">${data.motivation}</p>
          </div>

          ${data.additionalInfo ? `
            <h3 style="color: #6B21A8; margin-bottom: 15px;">Additional Information</h3>
            <div style="background-color: #F3F4F6; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
              <p style="margin: 0; white-space: pre-wrap;">${data.additionalInfo}</p>
            </div>
          ` : ''}

          <div style="background-color: #EBF8FF; padding: 15px; border-radius: 6px; border-left: 4px solid #A855F7;">
            <p style="margin: 0; font-size: 14px; color: #1F2937;">
              <strong>Next Steps:</strong> Review the application and resume, then schedule an interview if interested. 
              Respond directly to the applicant's email address above.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #F9FAFB; padding: 20px; text-align: center; border-top: 1px solid #E5E7EB;">
          <p style="margin: 0; color: #6B7280; font-size: 12px;">
            Bloom Psychology Career Application System<br>
            Submitted on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailData: any = {
    from: 'Bloom Psychology Careers <noreply@bloompsychologynorthaustin.com>',
    to: 'jana@bloompsychologynorthaustin.com',
    subject: `New Career Application: ${data.firstName} ${data.lastName} - ${data.position}`,
    html: applicationHtml,
  };

  if (resumeAttachment) {
    emailData.attachments = [resumeAttachment];
  }

  await resend.emails.send(emailData);
};

const sendApplicationConfirmation = async (data: ApplicationData) => {
  const confirmationHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Application Received - Bloom Psychology</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #6B21A8 0%, #A855F7 100%); padding: 30px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Application Received!</h1>
          <p style="color: #E9D5FF; margin: 10px 0 0 0; font-size: 16px;">Thank you for your interest in joining our team</p>
        </div>

        <!-- Main Content -->
        <div style="padding: 30px;">
          <h2 style="color: #6B21A8; margin-bottom: 20px;">Hello ${data.firstName},</h2>
          
          <p style="margin-bottom: 20px; color: #4B5563;">
            Thank you for submitting your application for the <strong>${data.position}</strong> position at Bloom Psychology. 
            We have received your application and will review it carefully.
          </p>

          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #6B21A8; margin-top: 0;">Application Summary</h3>
            <ul style="margin: 10px 0; padding-left: 20px; color: #4B5563;">
              <li>Position: ${data.position}</li>
              <li>Availability: ${data.availability}</li>
              <li>Submitted: ${new Date().toLocaleDateString()}</li>
            </ul>
          </div>

          <h3 style="color: #6B21A8; margin-bottom: 15px;">What Happens Next?</h3>
          <ul style="margin-bottom: 20px; padding-left: 20px; color: #4B5563;">
            <li>Our team will review your application and resume within 5-7 business days</li>
            <li>If you're a good fit, we'll contact you to schedule an initial interview</li>
            <li>The interview process typically includes 2-3 rounds depending on the position</li>
            <li>We'll keep you updated throughout the process</li>
          </ul>

          <p style="margin-bottom: 20px; color: #4B5563;">
            If you have any questions about your application or the position, please don't hesitate to reach out to us 
            at <a href="mailto:jana@bloompsychologynorthaustin.com" style="color: #A855F7;">jana@bloompsychologynorthaustin.com</a>.
          </p>

          <p style="margin-bottom: 0; color: #4B5563;">
            Thank you again for your interest in Bloom Psychology. We look forward to learning more about you!
          </p>

          <p style="margin-top: 30px; margin-bottom: 0; color: #4B5563;">
            Best regards,<br>
            <strong style="color: #6B21A8;">The Bloom Psychology Team</strong>
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #F9FAFB; padding: 20px; text-align: center; border-top: 1px solid #E5E7EB;">
          <p style="margin: 0; color: #6B7280; font-size: 14px;">
            <strong>Bloom Psychology</strong><br>
            13706 N Highway 183, Suite 114<br>
            Austin, TX 78750<br>
            (512) 898-9510
          </p>
          <div style="margin-top: 15px;">
            <a href="https://bloompsychologynorthaustin.com" style="color: #A855F7; text-decoration: none; margin: 0 8px; font-size: 14px;">Website</a>
            <a href="mailto:jana@bloompsychologynorthaustin.com" style="color: #A855F7; text-decoration: none; margin: 0 8px; font-size: 14px;">Contact</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: 'Bloom Psychology <noreply@bloompsychologynorthaustin.com>',
    to: data.email,
    subject: 'Your Application Has Been Received - Bloom Psychology',
    html: confirmationHtml,
  });
};