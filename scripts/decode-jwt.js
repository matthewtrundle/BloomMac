const jwt = require('jsonwebtoken');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluLXVzZXIiLCJ1c2VySWQiOiJhZG1pbi11c2VyIiwiZW1haWwiOiJhZG1pbkBibG9vbS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDg0MzU2ODYsImV4cCI6MTc0ODUyMjA4Nn0.yfcJ8r35azE5hwhWyO4CATMwYpPH6KR47XfyPn-F7M8";

console.log('Decoding JWT token...\n');

// Decode without verification to see the payload
const decoded = jwt.decode(token);
console.log('Payload:', JSON.stringify(decoded, null, 2));

// Try to verify with the secret
const JWT_SECRET = 'bloom-admin-secret-key-change-in-production';
try {
  const verified = jwt.verify(token, JWT_SECRET);
  console.log('\n✅ Token is valid!');
  console.log('Verified payload:', JSON.stringify(verified, null, 2));
} catch (error) {
  console.log('\n❌ Token verification failed:', error.message);
}