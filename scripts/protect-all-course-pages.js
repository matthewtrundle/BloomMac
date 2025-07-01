#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all course lesson pages
const coursePages = glob.sync('app/course/**/lesson*/page.tsx');

console.log(`Found ${coursePages.length} unprotected course pages`);

let protectedCount = 0;
let alreadyProtected = 0;

coursePages.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check if already protected
  if (content.includes('CourseAuthWrapper')) {
    console.log(`✓ Already protected: ${filePath}`);
    alreadyProtected++;
    return;
  }
  
  // Extract the function name (could be different in each file)
  const functionMatch = content.match(/export default function (\w+)\(/);
  if (!functionMatch) {
    console.log(`⚠️  Couldn't find function in: ${filePath}`);
    return;
  }
  
  const functionName = functionMatch[1];
  const contentFunctionName = functionName.replace('Page', 'Content');
  
  // Add import at the top
  let newContent = content;
  const importStatement = "import CourseAuthWrapper from '@/components/CourseAuthWrapper';\n";
  
  // Find where to insert the import (after other imports)
  const lastImportIndex = content.lastIndexOf('import ');
  const insertIndex = content.indexOf('\n', lastImportIndex) + 1;
  newContent = content.slice(0, insertIndex) + importStatement + content.slice(insertIndex);
  
  // Rename the main function
  newContent = newContent.replace(
    `export default function ${functionName}()`,
    `function ${contentFunctionName}()`
  );
  
  // Add the wrapper function at the end
  const wrapperFunction = `

export default function ${functionName}() {
  return (
    <CourseAuthWrapper courseSlug="postpartum-wellness-foundations">
      <${contentFunctionName} />
    </CourseAuthWrapper>
  );
}`;
  
  newContent = newContent.trimEnd() + wrapperFunction;
  
  // Write the file
  fs.writeFileSync(filePath, newContent);
  console.log(`✅ Protected: ${filePath}`);
  protectedCount++;
});

console.log(`
Summary:
- Already protected: ${alreadyProtected}
- Newly protected: ${protectedCount}
- Total course pages: ${coursePages.length}

Your course content is now protected! 🔒
`);