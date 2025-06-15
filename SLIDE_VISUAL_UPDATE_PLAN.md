# Slide Visual Content Update Plan

## Current Placeholder Locations

### Slide 1: Brain Scan Image
- **Current**: `<img src="/api/placeholder/500/400" alt="Brain scan showing maternal changes">`
- **Location**: Inside the brain changes slide showing 6% gray matter reorganization
- **Recommended Update**: Replace with actual brain scan image showing maternal brain changes

### Slide 2: Hormone Chart
- **Current**: `<canvas id="hormoneChart">` (requires JavaScript rendering)
- **Location**: Hormone crash visualization slide
- **Recommended Update**: Replace with static SVG or image chart showing hormone drops

### Slide 3: 3D Brain Model
- **Current**: `<img src="/api/placeholder/500/500" alt="3D brain model">`
- **Location**: Brain region visualization slide
- **Recommended Update**: Replace with actual brain diagram or 3D model visualization

## Implementation Options

### Option 1: Direct Database Update (Recommended for Quick Updates)
1. Upload images to `/public/images/course/week1/` directory
2. Create a database update script to replace placeholder URLs
3. Update the `slides_html` content in the database

```javascript
// Example update script
const updateSlideImages = async () => {
  const { data, error } = await supabase
    .from('course_lessons')
    .select('id, slides_html')
    .eq('week_id', 'WEEK_1_ID')
    .eq('lesson_number', 1)
    .single();

  if (data) {
    let updatedSlides = data.slides_html;
    
    // Replace placeholders
    updatedSlides = updatedSlides.replace(
      '/api/placeholder/500/400',
      '/images/course/week1/brain-scan.jpg'
    );
    
    updatedSlides = updatedSlides.replace(
      '<canvas id="hormoneChart"',
      '<img src="/images/course/week1/hormone-chart.svg" alt="Hormone levels chart"'
    );
    
    updatedSlides = updatedSlides.replace(
      '/api/placeholder/500/500',
      '/images/course/week1/brain-3d-model.png'
    );

    // Update database
    await supabase
      .from('course_lessons')
      .update({ slides_html: updatedSlides })
      .eq('id', data.id);
  }
};
```

### Option 2: Admin Interface Update
1. Use the admin course editing interface at `/admin/courses/[id]/edit`
2. Navigate to Week 1, Lesson 1
3. Edit the slides HTML content directly
4. Replace placeholder URLs with actual image paths

### Option 3: Create Updated Slide Generation Script
1. Modify the `create-data-driven-lesson1.js` script
2. Replace placeholder URLs with actual image paths
3. Re-run the script to update the database

## Image Requirements

### Brain Scan Image (Slide 1)
- **Size**: 500x400px or similar aspect ratio
- **Format**: JPG or PNG
- **Content**: MRI or fMRI scan showing maternal brain changes
- **Citation**: Include source attribution in the slide

### Hormone Chart (Slide 2)
- **Size**: 800x400px (wide format for chart)
- **Format**: SVG (preferred) or PNG with transparency
- **Content**: Line graph showing estrogen/progesterone drop over 3 days
- **Style**: Match the slide's color scheme (reds and blues)

### 3D Brain Model (Slide 3)
- **Size**: 500x500px (square format)
- **Format**: PNG with transparency or JPG
- **Content**: 3D brain model or anatomical diagram with highlighted regions
- **Regions to highlight**: Amygdala, prefrontal cortex, hippocampus

## File Organization
```
/public/images/course/
  /week1/
    /lesson1/
      brain-scan.jpg
      hormone-chart.svg
      brain-3d-model.png
```

## Alternative: Use Stock Medical Images
If custom images aren't available, consider these resources:
- Medical illustration libraries
- Scientific publication figures (with permission)
- Creative Commons medical images
- Generated medical visualizations using tools like BioRender

## Static Hormone Chart HTML/SVG Alternative
Instead of canvas, use a static SVG chart:

```html
<div style="width: 100%; height: 400px; position: relative;">
  <svg viewBox="0 0 800 400" style="width: 100%; height: 100%;">
    <!-- Grid lines -->
    <g stroke="#e0e0e0" stroke-width="1">
      <line x1="50" y1="350" x2="750" y2="350" />
      <line x1="50" y1="50" x2="50" y2="350" />
    </g>
    
    <!-- Estrogen line (red) -->
    <path d="M 50 100 Q 200 105 400 340 T 750 345" 
          fill="none" stroke="#dc2626" stroke-width="3" />
    
    <!-- Progesterone line (blue) -->
    <path d="M 50 150 Q 200 155 400 320 T 750 325" 
          fill="none" stroke="#2563eb" stroke-width="3" />
    
    <!-- Labels -->
    <text x="400" y="30" text-anchor="middle" font-size="20" font-weight="bold">
      Hormone Levels: The 72-Hour Cliff
    </text>
    
    <!-- Legend -->
    <g transform="translate(600, 80)">
      <rect x="0" y="0" width="20" height="3" fill="#dc2626" />
      <text x="25" y="5" font-size="14">Estrogen</text>
      
      <rect x="0" y="20" width="20" height="3" fill="#2563eb" />
      <text x="25" y="25" font-size="14">Progesterone</text>
    </g>
  </svg>
</div>
```

## Next Steps
1. Obtain or create the three visual assets
2. Upload them to the appropriate directory
3. Choose implementation method (database script recommended)
4. Test the updated slides in the course viewer
5. Verify mobile responsiveness of the new images