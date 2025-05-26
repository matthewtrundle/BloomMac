import { NextApiRequest, NextApiResponse } from 'next';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'bloom-admin-2024';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Show login form
    const redirect = req.query.redirect || '/admin/analytics';
    const error = req.query.error || '';
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Admin Login - Bloom Psychology</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: #f5f5f5;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
            }
            .login-container {
              background: white;
              padding: 2rem;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              width: 100%;
              max-width: 400px;
            }
            h1 {
              color: #333;
              margin-bottom: 1.5rem;
              text-align: center;
            }
            .form-group {
              margin-bottom: 1rem;
            }
            label {
              display: block;
              margin-bottom: 0.5rem;
              color: #666;
              font-size: 14px;
            }
            input {
              width: 100%;
              padding: 0.75rem;
              border: 1px solid #ddd;
              border-radius: 4px;
              font-size: 16px;
              box-sizing: border-box;
            }
            input:focus {
              outline: none;
              border-color: #C73980;
            }
            button {
              width: 100%;
              padding: 0.75rem;
              background: #C73980;
              color: white;
              border: none;
              border-radius: 4px;
              font-size: 16px;
              cursor: pointer;
              margin-top: 1rem;
            }
            button:hover {
              background: #B03979;
            }
            .error {
              color: red;
              font-size: 14px;
              margin-top: 0.5rem;
              text-align: center;
            }
            .logo {
              text-align: center;
              margin-bottom: 2rem;
              color: #C73980;
              font-size: 24px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="login-container">
            <div class="logo">Bloom Psychology</div>
            <h1>Admin Access</h1>
            <form method="POST" action="/api/admin-login">
              <input type="hidden" name="redirect" value="${redirect}">
              <div class="form-group">
                <label for="password">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  required 
                  autofocus
                  placeholder="Enter admin password"
                >
              </div>
              <button type="submit">Login</button>
              ${error ? `<div class="error">${error}</div>` : ''}
            </form>
          </div>
        </body>
      </html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } else if (req.method === 'POST') {
    const { password, redirect } = req.body;
    
    if (password === ADMIN_PASSWORD) {
      // Set auth cookie
      const token = Buffer.from(`bloom-admin-${Date.now()}`).toString('base64');
      
      // Store token in environment for validation
      process.env.ADMIN_AUTH_TOKEN = token;
      
      res.setHeader('Set-Cookie', `bloom-admin-auth=${token}; Path=/; HttpOnly; Max-Age=86400; SameSite=Strict`);
      res.redirect(redirect || '/admin/analytics');
    } else {
      // Invalid password
      const redirectUrl = `/api/admin-login?error=Invalid%20password&redirect=${encodeURIComponent(redirect || '/admin/analytics')}`;
      res.redirect(redirectUrl);
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}