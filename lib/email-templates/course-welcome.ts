export const courseWelcomeTemplate = (data: {
  firstName: string;
  courseName: string;
  loginEmail: string;
  tempPassword: string;
  loginUrl: string;
  supportEmail: string;
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ${data.courseName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #2d3748;
            background-color: #f7fafc;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #e53e3e 0%, #d53f8c 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 24px;
            margin-bottom: 8px;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 30px 20px;
        }
        
        .welcome-message {
            background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%);
            border-left: 4px solid #38a169;
            padding: 20px;
            margin-bottom: 30px;
            border-radius: 8px;
        }
        
        .credentials-box {
            background: #f7fafc;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .credential-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .credential-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        
        .credential-label {
            font-weight: 600;
            color: #4a5568;
        }
        
        .credential-value {
            font-family: 'Courier New', monospace;
            background: #edf2f7;
            padding: 4px 8px;
            border-radius: 4px;
            color: #2d3748;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #e53e3e 0%, #d53f8c 100%);
            color: white !important;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            transition: transform 0.2s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        .next-steps {
            background: #fef5e7;
            border-left: 4px solid #ed8936;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
        }
        
        .next-steps h3 {
            color: #c05621;
            margin-bottom: 12px;
        }
        
        .next-steps ul {
            margin-left: 20px;
        }
        
        .next-steps li {
            margin-bottom: 8px;
            color: #744210;
        }
        
        .support-section {
            background: #ebf8ff;
            border-left: 4px solid #4299e1;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
        }
        
        .footer {
            background: #2d3748;
            color: #e2e8f0;
            padding: 20px;
            text-align: center;
            font-size: 14px;
        }
        
        .footer a {
            color: #90cdf4;
            text-decoration: none;
        }
        
        .security-note {
            background: #fed7d7;
            border: 1px solid #fc8181;
            border-radius: 6px;
            padding: 15px;
            margin: 15px 0;
            font-size: 14px;
        }
        
        .security-note strong {
            color: #c53030;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 0;
                border-radius: 0;
            }
            
            .content {
                padding: 20px 15px;
            }
            
            .credential-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌸 Welcome to Your Course!</h1>
            <p>Your journey to wellness starts now</p>
        </div>
        
        <div class="content">
            <div class="welcome-message">
                <h2>Welcome, ${data.firstName}! 🎉</h2>
                <p>Thank you for enrolling in <strong>${data.courseName}</strong>. I'm so excited to guide you through this transformative journey to emotional wellness and self-discovery.</p>
            </div>
            
            <h3>Your Course Access Details</h3>
            <div class="credentials-box">
                <div class="credential-item">
                    <span class="credential-label">Email:</span>
                    <span class="credential-value">${data.loginEmail}</span>
                </div>
                <div class="credential-item">
                    <span class="credential-label">Temporary Password:</span>
                    <span class="credential-value">${data.tempPassword}</span>
                </div>
            </div>
            
            <div class="security-note">
                <strong>Important:</strong> Please change your password after your first login for security. You can do this in your account settings.
            </div>
            
            <div style="text-align: center;">
                <a href="${data.loginUrl}" class="cta-button">Access Your Course Now →</a>
            </div>
            
            <div class="next-steps">
                <h3>🚀 Getting Started</h3>
                <ul>
                    <li><strong>Login:</strong> Use the credentials above to access your course portal</li>
                    <li><strong>Change Password:</strong> Update your password in account settings</li>
                    <li><strong>Start Module 1:</strong> Begin with the first lesson at your own pace</li>
                    <li><strong>Join the Community:</strong> Connect with other moms in our private group</li>
                    <li><strong>Download Materials:</strong> Access your workbooks and resources</li>
                </ul>
            </div>
            
            <div class="support-section">
                <h3>💬 Need Help?</h3>
                <p>I'm here to support you every step of the way. If you have any questions about accessing your course or need technical support, please don't hesitate to reach out.</p>
                <p><strong>Email:</strong> <a href="mailto:${data.supportEmail}">${data.supportEmail}</a></p>
                <p><strong>Response Time:</strong> Within 24 hours (usually much faster!)</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <p><strong>What to Expect:</strong></p>
                <ul style="margin-left: 20px; margin-top: 10px;">
                    <li>Self-paced learning that fits your schedule</li>
                    <li>Practical tools you can use immediately</li>
                    <li>Lifetime access to all materials</li>
                    <li>A supportive community of fellow moms</li>
                    <li>Regular check-ins and encouragement</li>
                </ul>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: #f0fff4; border-radius: 8px; text-align: center;">
                <p style="font-style: italic; color: #38a169; margin-bottom: 10px;">
                    "Remember, asking for help is a sign of strength, not weakness. You're taking a brave step toward your wellness."
                </p>
                <p style="font-weight: 600; color: #2f855a;">– Dr. Jana Rundle</p>
            </div>
        </div>
        
        <div class="footer">
            <p>This email was sent because you purchased a course from Bloom Psychology.</p>
            <p>© 2024 Bloom Psychology | <a href="https://bloompsychology.com">bloompsychology.com</a></p>
            <p style="margin-top: 10px; font-size: 12px; opacity: 0.8;">
                If you didn't make this purchase or have concerns, please contact us immediately.
            </p>
        </div>
    </div>
</body>
</html>
  `;
};

export const courseWelcomeTextTemplate = (data: {
  firstName: string;
  courseName: string;
  loginEmail: string;
  tempPassword: string;
  loginUrl: string;
  supportEmail: string;
}) => {
  return `
Welcome to ${data.courseName}, ${data.firstName}!

Thank you for enrolling in your wellness journey. Here are your course access details:

LOGIN CREDENTIALS:
Email: ${data.loginEmail}
Temporary Password: ${data.tempPassword}

IMPORTANT: Please change your password after first login for security.

Access your course: ${data.loginUrl}

GETTING STARTED:
1. Login with the credentials above
2. Change your password in account settings
3. Start with Module 1 at your own pace
4. Join our private community group
5. Download your workbooks and resources

WHAT TO EXPECT:
- Self-paced learning that fits your schedule
- Practical tools you can use immediately
- Lifetime access to all materials
- Supportive community of fellow moms
- Regular check-ins and encouragement

NEED HELP?
Email: ${data.supportEmail}
Response time: Within 24 hours

"Remember, asking for help is a sign of strength, not weakness. You're taking a brave step toward your wellness." - Dr. Jana Rundle

© 2024 Bloom Psychology
bloompsychology.com

If you didn't make this purchase, please contact us immediately.
  `;
};