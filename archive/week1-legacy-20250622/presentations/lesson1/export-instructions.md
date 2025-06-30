# Exporting Reveal.js Slides to PowerPoint

## Quick Export Steps

### 1. Export to PDF (Best Quality)

1. Open the presentation in Chrome or Edge browser
2. Add `?print-pdf` to the URL:
   ```
   http://localhost:3000/presentations/week1/lesson1/index.html?print-pdf
   ```
3. Press `Ctrl/Cmd + P` to print
4. Settings:
   - Destination: Save as PDF
   - Layout: Landscape
   - Margins: None
   - Background graphics: Yes
5. Save the PDF

### 2. Convert PDF to PowerPoint

#### Option A: Using PowerPoint (Recommended)
1. Open PowerPoint
2. Go to Insert → Object → Adobe Acrobat Document
3. Select your PDF file
4. PowerPoint will convert it to editable slides

#### Option B: Using Adobe Acrobat
1. Open PDF in Adobe Acrobat
2. Export to → Microsoft PowerPoint
3. Save as PPTX

#### Option C: Using Online Tools
- SmallPDF (smallpdf.com/pdf-to-ppt)
- ILovePDF (ilovepdf.com/pdf_to_powerpoint)
- Adobe's online converter

### 3. Fine-tuning in PowerPoint

After conversion:
1. Check slide layouts and adjust as needed
2. Replace any web fonts with PowerPoint-safe fonts
3. Adjust image positions if necessary
4. Add slide transitions if desired
5. Save as .pptx template for future use

## Alternative: Direct HTML to PPTX

For automated conversion in the future, consider:
1. Aspose.Slides API (paid)
2. PptxGenJS library (for programmatic generation)
3. Puppeteer + screenshot approach

## Tips for Best Results

- The PDF method preserves visual fidelity best
- Fragments (animations) will become separate slides
- Speaker notes are preserved in the PDF
- Test the export before important presentations