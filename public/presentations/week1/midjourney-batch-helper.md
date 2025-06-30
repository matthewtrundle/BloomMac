# Midjourney Batch Processing Helper - Week 1

## Quick Copy Format for Discord

### Batch 1: Week 1 Lesson 1 - Hero Images (Run these first)
Copy and paste these one at a time:

```
/imagine A tender moment of a diverse mother holding her newborn baby, soft natural window light, warm coral and lavender tones, professional photography, emotional and authentic, slight exhaustion visible but also love, home environment, photorealistic --ar 16:9 --style raw --v 6

/imagine Supportive friend embracing new mother who looks overwhelmed, both women sitting on a couch, natural home setting, warm afternoon light, genuine emotion, one woman listening with compassion, tissue box visible, authentic postpartum moment, photorealistic portrait --ar 3:2 --style raw --v 6

/imagine Wide shot of exhausted mother in messy living room, baby items scattered, laundry basket, dishes, authentic postpartum home, woman sitting on floor looking overwhelmed but determined, natural lighting through window, photorealistic --ar 16:9 --style raw --v 6

/imagine Diverse group of mothers in park setting, all different ethnicities and ages, some with babies in carriers, others with strollers, community feeling, golden hour lighting, authentic and uplifting, photorealistic --ar 16:9 --style raw --v 6

/imagine Silhouette of mother holding baby against sunrise/sunset, hopeful atmosphere, new beginning feeling, warm golden light, artistic but emotional, photorealistic --ar 16:9 --style raw --v 6
```

### Batch 2: Grid Images - Set 1 (1:1 aspect ratio)
```
/imagine Professional female therapist in warm office setting, sitting in chair with notebook, diverse woman in her 40s, compassionate expression, soft lighting, counseling environment, photorealistic --ar 1:1 --style raw --v 6

/imagine Group of diverse mothers sitting in circle, community center setting, various ages and ethnicities, some holding babies, supportive atmosphere, natural lighting, authentic support group, photorealistic --ar 1:1 --style raw --v 6

/imagine Close-up of woman's hands holding both baby bottle and medicine bottle, symbolizing fed is best and treatment, soft focus background, no judgment atmosphere, photorealistic --ar 1:1 --style raw --v 6

/imagine Mother crying while holding sleeping baby, sitting in nursery chair at 3am, blue night lighting from window, authentic emotional moment, photorealistic --ar 1:1 --style raw --v 6

/imagine Woman looking at herself in bathroom mirror, not recognizing herself, postpartum body, gentle but honest portrayal, soft lighting, photorealistic --ar 1:1 --style raw --v 6
```

### Batch 3: Emotional Moments (Mixed ratios)
```
/imagine Woman showing genuine joy with baby, laughing moment, bright natural light, authentic happiness, photorealistic --ar 1:1 --style raw --v 6

/imagine Mother looking overwhelmed, sitting among baby items, anxious expression, too much stimulation, photorealistic --ar 1:1 --style raw --v 6

/imagine Woman staring blankly while holding baby, emotional numbness portrayed sensitively, disconnection feeling, photorealistic --ar 1:1 --style raw --v 6

/imagine Close-up of woman's face showing complex emotions, tears but also strength, natural lighting highlighting emotional depth, diverse woman, photorealistic portrait --ar 16:9 --style raw --v 6

/imagine Mother with hand on heart, self-compassion gesture, eyes closed, peaceful expression, soft bedroom lighting, morning or evening routine, photorealistic --ar 16:9 --style raw --v 6
```

## Efficiency Tips:

### 1. Multi-Account Strategy
If you have access to multiple Discord accounts or team members:
- Divide prompts among accounts
- Run 4-5 prompts per account simultaneously
- Each person handles one lesson

### 2. Variation Commands
After each image generates, quickly create variations:
```
V1 V2 V3 V4 (creates 4 variations)
U1 U2 U3 U4 (upscales the best ones)
```

### 3. Naming Convention
When saving, use this format:
```
W1L1_S01_hero_[variation].png
W1L1_S03_grid1_[variation].png
```
Where:
- W1L1 = Week 1 Lesson 1
- S01 = Slide 1
- Description of image type

### 4. Quick Selection Criteria
Look for:
- ✅ Authentic emotions
- ✅ Good lighting
- ✅ Diverse representation
- ✅ No AI artifacts on faces/hands
- ✅ Appropriate body language

### 5. Seed Tracking
When you find a great image, note its seed:
```
/show [image_url] --seed
```
Then reuse for consistency:
```
[your prompt] --seed 12345
```

## Spreadsheet Tracker Template

| Prompt # | Lesson | Slide | Type | Status | Best Version | Seed | Notes |
|----------|---------|-------|------|---------|--------------|------|-------|
| 001 | 1-1 | 1 | Hero | ✓ Done | V3 | 98765 | Perfect lighting |
| 002 | 1-1 | 2 | Split | In Progress | - | - | Need more emotion |
| 003 | 1-1 | 3 | Grid | Queued | - | - | - |

## Time Estimate
- 15 prompts × 4 variations = 60 images per lesson
- ~2 minutes per prompt with variations
- Total per lesson: ~30 minutes active time
- All Week 1: ~90 minutes

## Priority Order:
1. **Hero images** (slides 1, 13) - These matter most
2. **Statistics backgrounds** (slide 7) - Community feeling
3. **Grid images** (slides 3, 6) - Core content
4. **Journey images** (slides 9-10) - Story progression
5. **Other slides** - Fill in remaining

## Common Adjustments Needed:
If images need tweaking, add these modifiers:
- Too dark: Add "bright natural lighting"
- Too staged: Add "candid moment" 
- Wrong emotion: Be more specific "exhausted but hopeful"
- Bad hands: Add "hands in natural position"
- Wrong age: Specify "woman in early 30s"

## Bulk Download Tool:
Consider using a browser extension like "DownThemAll" to grab all upscaled images at once from Discord.