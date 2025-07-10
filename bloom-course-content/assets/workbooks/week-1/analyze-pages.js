const fs = require('fs');
const path = require('path');

// Read the HTML file
const html = fs.readFileSync(path.join(__dirname, 'week-1-workbook.html'), 'utf8');

// Extract page content
const pageRegex = /<div class="page[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?=<div class="page|<\/body>)/g;
const pages = [];
let match;
let pageNum = 1;

while ((match = pageRegex.exec(html)) !== null) {
    const pageContent = match[1];
    
    // Extract text content and structure
    const cleanContent = pageContent
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, '\n')
        .replace(/\n\s*\n/g, '\n')
        .trim();
    
    // Count elements
    const inputs = (pageContent.match(/<input/g) || []).length;
    const textareas = (pageContent.match(/<textarea/g) || []).length;
    const headings = (pageContent.match(/<h[1-6]/g) || []).length;
    
    // Estimate content height (rough calculation)
    const lines = cleanContent.split('\n').filter(line => line.trim()).length;
    
    pages.push({
        pageNumber: pageNum++,
        contentLength: cleanContent.length,
        lineCount: lines,
        inputs: inputs,
        textareas: textareas,
        headings: headings,
        preview: cleanContent.substring(0, 200) + '...'
    });
}

// Create analysis report
let report = 'WORKBOOK PAGE ANALYSIS\n';
report += '=====================\n\n';
report += `Total Pages: ${pages.length}\n\n`;

pages.forEach(page => {
    report += `PAGE ${page.pageNumber}\n`;
    report += '-'.repeat(50) + '\n';
    report += `Content Length: ${page.contentLength} chars\n`;
    report += `Estimated Lines: ${page.lineCount}\n`;
    report += `Form Elements: ${page.inputs} inputs, ${page.textareas} textareas\n`;
    report += `Headings: ${page.headings}\n`;
    report += `Preview: ${page.preview}\n`;
    report += '\n';
});

// Save report
fs.writeFileSync(path.join(__dirname, 'page-analysis.txt'), report);
console.log('Analysis saved to page-analysis.txt');

// Also create a detailed content file
let detailed = 'DETAILED PAGE CONTENT\n';
detailed += '====================\n\n';

// Re-extract with more detail
const pageMatches = html.match(/<div class="page[^"]*"[^>]*>[\s\S]*?(?=<div class="page|<\/body>)/g);
if (pageMatches) {
    pageMatches.forEach((page, index) => {
        detailed += `\n\nPAGE ${index + 1}\n`;
        detailed += '='.repeat(80) + '\n\n';
        
        // Extract meaningful content while preserving some structure
        const content = page
            .replace(/<div class="page[^>]*>/g, '')
            .replace(/<h1[^>]*>/g, '\n### H1: ')
            .replace(/<h2[^>]*>/g, '\n## H2: ')
            .replace(/<h3[^>]*>/g, '\n# H3: ')
            .replace(/<p[^>]*>/g, '\n')
            .replace(/<input[^>]*placeholder="([^"]*)"[^>]*>/g, '\n[INPUT: $1]')
            .replace(/<textarea[^>]*placeholder="([^"]*)"[^>]*>/g, '\n[TEXTAREA: $1]')
            .replace(/<li>/g, '\n• ')
            .replace(/<[^>]+>/g, '')
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n')
            .trim();
        
        detailed += content;
    });
}

fs.writeFileSync(path.join(__dirname, 'page-content-detailed.txt'), detailed);
console.log('Detailed content saved to page-content-detailed.txt');