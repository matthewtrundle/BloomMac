#!/usr/bin/env node

/**
 * Test 4: Career Application Testing
 * Tests application submission, file upload, data storage, and rate limiting
 */

const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const API_ENDPOINT = `${BASE_URL}/api/careers/apply`;

let testsPassed = 0;
let testsFailed = 0;

function logTest(testName, passed, error = null) {
  if (passed) {
    console.log(`✅ ${testName}`);
    testsPassed++;
  } else {
    console.log(`❌ ${testName}`);
    if (error) console.log(`   Error: ${error}`);
    testsFailed++;
  }
}

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Create a test PDF file
function createTestPDF() {
  const testPDFPath = path.join(__dirname, 'test-resume.pdf');
  const pdfContent = Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/MediaBox [0 0 612 792]\n/Contents 5 0 R\n>>\nendobj\n4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n5 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(Test Resume) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000260 00000 n\n0000000353 00000 n\ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n450\n%%EOF');
  
  fs.writeFileSync(testPDFPath, pdfContent);
  return testPDFPath;
}

async function testCareerApplication() {
  console.log('\n💼 Testing Career Application API...\n');
  
  const testTimestamp = Date.now();
  const testEmail = `career-test-${testTimestamp}@automated-test.com`;
  const testPDFPath = createTestPDF();
  
  // Test 4.1: Valid application submission
  console.log('Testing valid application submission...\n');
  
  try {
    const form = new FormData();
    form.append('firstName', 'Career');
    form.append('lastName', 'Tester');
    form.append('email', testEmail);
    form.append('phone', '555-0126');
    form.append('position', 'Test Position');
    form.append('experience', '5+ years of automated testing');
    form.append('availability', 'Immediate');
    form.append('motivation', 'Passionate about testing career application forms');
    form.append('additionalInfo', 'This is an automated test submission');
    form.append('resume', fs.createReadStream(testPDFPath), 'test-resume.pdf');
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });
    
    const result = await response.json();
    
    logTest('Application submission returns 200', response.status === 200);
    logTest('Response indicates success', result.success === true);
    logTest('Response includes application ID', !!result.applicationId);
    
    // Verify data in database
    await wait(1000);
    
    const { data: application, error: dbError } = await supabase
      .from('career_applications')
      .select('*')
      .eq('email', testEmail)
      .single();
    
    logTest('Application saved to database', !dbError && !!application);
    logTest('First name saved correctly', application?.first_name === 'Career');
    logTest('Last name saved correctly', application?.last_name === 'Tester');
    logTest('Email saved correctly', application?.email === testEmail);
    logTest('Phone saved correctly', application?.phone === '555-0126');
    logTest('Position saved correctly', application?.position === 'Test Position');
    logTest('Status is "new"', application?.status === 'new');
    logTest('Resume URL saved', !!application?.resume_url);
    
    // Check if resume was uploaded to storage
    if (application?.resume_url) {
      const resumeFilename = application.resume_url.split('/').pop();
      const { data: resumeFile } = await supabase.storage
        .from('resumes')
        .list('', {
          search: resumeFilename
        });
      
      logTest('Resume uploaded to storage', resumeFile && resumeFile.length > 0);
    }
    
  } catch (err) {
    logTest('Valid application submission', false, err.message);
  }
  
  // Test 4.2: Missing required fields
  console.log('\n\nTesting form validation...\n');
  
  const requiredFields = ['firstName', 'lastName', 'email', 'position'];
  
  for (const missingField of requiredFields) {
    try {
      const form = new FormData();
      if (missingField !== 'firstName') form.append('firstName', 'Test');
      if (missingField !== 'lastName') form.append('lastName', 'User');
      if (missingField !== 'email') form.append('email', 'test@test.com');
      if (missingField !== 'position') form.append('position', 'Test Position');
      
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: form,
        headers: form.getHeaders()
      });
      
      logTest(`Validation: missing ${missingField}`, response.status === 400);
    } catch (err) {
      logTest(`Validation: missing ${missingField}`, false, err.message);
    }
  }
  
  // Test 4.3: Email validation
  console.log('\n\nTesting email validation...\n');
  
  try {
    const form = new FormData();
    form.append('firstName', 'Test');
    form.append('lastName', 'User');
    form.append('email', 'invalidemail');
    form.append('position', 'Test Position');
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });
    
    logTest('Rejects invalid email format', response.status === 400);
  } catch (err) {
    logTest('Email validation', false, err.message);
  }
  
  // Test 4.4: File size limit (5MB)
  console.log('\n\nTesting file size limit...\n');
  
  const largePDFPath = path.join(__dirname, 'large-test-resume.pdf');
  const largePDFContent = Buffer.alloc(6 * 1024 * 1024); // 6MB
  fs.writeFileSync(largePDFPath, largePDFContent);
  
  try {
    const form = new FormData();
    form.append('firstName', 'Test');
    form.append('lastName', 'User');
    form.append('email', 'filesize@test.com');
    form.append('position', 'Test Position');
    form.append('resume', fs.createReadStream(largePDFPath), 'large-resume.pdf');
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });
    
    logTest('Rejects files over 5MB', response.status === 400);
  } catch (err) {
    logTest('File size validation', false, err.message);
  }
  
  // Test 4.5: File type validation
  console.log('\n\nTesting file type validation...\n');
  
  const invalidFilePath = path.join(__dirname, 'test-resume.exe');
  fs.writeFileSync(invalidFilePath, 'Not a PDF');
  
  try {
    const form = new FormData();
    form.append('firstName', 'Test');
    form.append('lastName', 'User');
    form.append('email', 'filetype@test.com');
    form.append('position', 'Test Position');
    form.append('resume', fs.createReadStream(invalidFilePath), 'test-resume.exe');
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });
    
    logTest('Rejects non-PDF files', response.status === 400);
  } catch (err) {
    logTest('File type validation', false, err.message);
  }
  
  // Test 4.6: Rate limiting (2 per hour)
  console.log('\n\nTesting rate limiting...\n');
  
  let rateLimitHit = false;
  const rateLimitIP = `career-test-${testTimestamp}`;
  
  for (let i = 1; i <= 4; i++) {
    try {
      const form = new FormData();
      form.append('firstName', 'Rate');
      form.append('lastName', 'Test');
      form.append('email', `ratelimit-${i}@test.com`);
      form.append('position', 'Test Position');
      
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: form,
        headers: {
          ...form.getHeaders(),
          'X-Forwarded-For': rateLimitIP
        }
      });
      
      if (response.status === 429) {
        logTest(`Rate limit enforced after ${i-1} requests`, i === 3);
        rateLimitHit = true;
        break;
      }
      
      await wait(100);
    } catch (err) {
      logTest('Rate limiting test', false, err.message);
      break;
    }
  }
  
  if (!rateLimitHit) {
    logTest('Rate limit enforced', false, 'Rate limit not triggered');
  }
  
  // Test 4.7: Application without resume
  console.log('\n\nTesting application without resume...\n');
  
  try {
    const form = new FormData();
    form.append('firstName', 'No');
    form.append('lastName', 'Resume');
    form.append('email', `no-resume-${testTimestamp}@test.com`);
    form.append('phone', '555-0127');
    form.append('position', 'Test Position');
    form.append('experience', 'No resume provided');
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });
    
    logTest('Accepts application without resume', response.status === 200);
  } catch (err) {
    logTest('Application without resume', false, err.message);
  }
  
  // Cleanup
  console.log('\n\n🧹 Cleaning up test data...\n');
  
  try {
    // Delete test applications
    const { error } = await supabase
      .from('career_applications')
      .delete()
      .like('email', '%@automated-test.com')
      .like('email', '%@test.com');
    
    logTest('Test data cleaned up', !error);
    
    // Remove test files
    [testPDFPath, largePDFPath, invalidFilePath].forEach(file => {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    });
    
  } catch (err) {
    console.log('⚠️  Cleanup failed:', err.message);
  }
  
  // Summary
  console.log('\n📊 Career Application Test Summary:');
  console.log(`   ✅ Passed: ${testsPassed}`);
  console.log(`   ❌ Failed: ${testsFailed}`);
  
  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
testCareerApplication().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});