#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

async function removePricingFromServices() {
  console.log('Removing pricing information from services.ts...\n');
  
  try {
    const servicesPath = path.join(process.cwd(), 'lib', 'data', 'services.ts');
    let content = await fs.readFile(servicesPath, 'utf-8');
    
    // Find and remove all pricing blocks
    // This regex looks for pricing: { ... }, handling nested objects
    const pricingRegex = /pricing:\s*\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\},?\s*/g;
    
    const matches = content.match(pricingRegex);
    if (matches) {
      console.log(`Found ${matches.length} pricing sections to remove`);
      
      // Remove each pricing block
      content = content.replace(pricingRegex, '');
      
      // Clean up any double commas that might result
      content = content.replace(/,\s*,/g, ',');
      
      // Write back the file
      await fs.writeFile(servicesPath, content);
      console.log('✅ Successfully removed all pricing information from services.ts');
    } else {
      console.log('No pricing sections found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

removePricingFromServices();