# Converting HTML Slides to PowerPoint

## Option 1: Direct Browser Method (Easiest)

### Step 1: Open HTML Slides
1. Open the HTML file in Chrome/Edge
2. Press F11 for fullscreen
3. Navigate through all slides once

### Step 2: Save as PDF
1. Press Ctrl/Cmd + P (Print)
2. Destination: "Save as PDF"
3. Layout: Landscape
4. Margins: None
5. Scale: 100%
6. Save PDF

### Step 3: Import to PowerPoint
1. Open PowerPoint
2. File → Open → Browse
3. Change file type to "All Files"
4. Select your PDF
5. PowerPoint converts each page to a slide

---

## Option 2: Screenshot Method (Most Control)

### Using Windows Steps Recorder or Mac Screenshot
1. Open HTML in fullscreen (F11)
2. For each slide:
   - Windows: Win + Shift + S
   - Mac: Cmd + Shift + 4
3. Save all screenshots
4. In PowerPoint:
   - Insert → Pictures → From File
   - Select all screenshots
   - One per slide

---

## Option 3: Professional Export Tool

### Using DeckTape (Free, Command Line)
```bash
# Install Node.js first, then:
npm install -g decktape

# Convert HTML to PDF
decktape generic file:///path/to/week1-slides-lesson1.html slides.pdf --size 1920x1080

# Then import PDF to PowerPoint as above
```

---

## Option 4: Google Slides Bridge

1. **Upload HTML to Web Server**
   - Use GitHub Pages (free)
   - Or any web hosting

2. **Import to Google Slides**
   - Create new presentation
   - File → Import slides
   - Enter URL

3. **Download as PPTX**
   - File → Download → Microsoft PowerPoint

---

## Option 5: Manual Recreation (Best Quality)

### PowerPoint Template Setup
1. **Create Master Slides**
   - View → Slide Master
   - Set fonts: Montserrat, Open Sans, Playfair Display
   - Set colors: #8B9A82, #D4A5A5, #F5F5DC

2. **Import Assets**
   - Download all images from website
   - Insert → Pictures
   - Set transparency as needed

3. **Use Provided Content**
   - Copy text from HTML
   - Apply formatting
   - Add animations

---

## Quick PowerPoint Tips

### Setting Brand Colors
1. Design → Variants → Colors → Customize Colors
2. Add your hex codes:
   - Sage: #8B9A82
   - Pink: #D4A5A5
   - Cream: #F5F5DC
   - Charcoal: #4A4A4A

### Consistent Fonts
1. Design → Fonts → Customize Fonts
2. Headings: Montserrat or Playfair Display
3. Body: Open Sans

### Slide Transitions
1. Transitions → Fade
2. Duration: 0.50 seconds
3. Apply to All Slides

---

## Recommended: Hybrid Approach

1. **Use HTML slides for reference**
   - Open in browser
   - Keep visible while working

2. **Build in PowerPoint**
   - Create new presentation
   - Use HTML as exact guide
   - Copy/paste text
   - Insert images

3. **Benefits**
   - Native PowerPoint features
   - Easy to edit later
   - Better quality
   - Smaller file size

---

## PowerPoint Shortcuts

### Speed Building
- Duplicate slide: Ctrl+D
- Copy formatting: Ctrl+Shift+C, then Ctrl+Shift+V
- Align objects: Select all → Arrange → Align
- Group elements: Ctrl+G

### Quick Layouts
- Right-click slide → Layout
- Choose from templates
- Customize as needed

---

## File Management

### Naming Convention
```
PWF-Week1-Lesson1-Welcome.pptx
PWF-Week1-Lesson2-YourBody.pptx
PWF-Week1-Lesson3-Emotions.pptx
PWF-Week1-Lesson4-Foundation.pptx
```

### Folder Structure
```
Course Materials/
├── Week 1/
│   ├── Slides/
│   ├── Scripts/
│   ├── Workbooks/
│   └── Videos/
```