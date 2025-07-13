# Free Meditation Background Resources

## Option 1: CSS-Only Animated Background (No Video Needed)
Create a pure CSS meditation background for web:

```html
<div class="meditation-background">
  <div class="gradient-orb orb1"></div>
  <div class="gradient-orb orb2"></div>
  <div class="gradient-orb orb3"></div>
</div>

<style>
.meditation-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #E8F5E9 0%, #E1F5FE 50%, #F3E5F5 100%);
  overflow: hidden;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.4;
  animation: float 20s infinite ease-in-out;
}

.orb1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(129, 199, 132, 0.8) 0%, transparent 70%);
  top: -200px;
  left: -200px;
  animation-duration: 25s;
}

.orb2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(149, 117, 205, 0.8) 0%, transparent 70%);
  bottom: -150px;
  right: -150px;
  animation-duration: 30s;
  animation-delay: -10s;
}

.orb3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(100, 181, 246, 0.8) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-duration: 35s;
  animation-delay: -5s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(50px, -50px) scale(1.1); }
  50% { transform: translate(-30px, 30px) scale(0.9); }
  75% { transform: translate(-50px, -30px) scale(1.05); }
}
</style>
```

## Option 2: Free Stock Videos (Ready to Use)

### Pexels (Free, no attribution required):
1. **Water/Ocean**: https://www.pexels.com/search/videos/calm%20water/
2. **Clouds**: https://www.pexels.com/search/videos/clouds%20timelapse/
3. **Abstract**: https://www.pexels.com/search/videos/abstract%20background/
4. **Nature**: https://www.pexels.com/search/videos/nature%20meditation/

### Pixabay (Free, no attribution):
1. **Particles**: https://pixabay.com/videos/search/particles/
2. **Bokeh**: https://pixabay.com/videos/search/bokeh/
3. **Waves**: https://pixabay.com/videos/search/ocean%20waves/

## Option 3: Canva Pro (If you have access)
1. Open Canva
2. Create Video (1920x1080)
3. Search backgrounds: "meditation", "calm", "gradient"
4. Use their animated backgrounds
5. Export as MP4

## Quick Premiere Pro Meditation Background (10 minutes):

1. **Create Sequence**: 1920x1080, 30fps, 10 minutes long

2. **Add Solid Color**: 
   - Effect Controls → Fill → Color: #E8F5E9 (soft mint)

3. **Add Circle Shape**:
   - Ellipse tool → Draw centered circle
   - Fill: Gradient (radial)
   - Feather: 200px
   - Opacity: 40%

4. **Animate the Circle**:
   - Position: Add gentle drift keyframes
   - Scale: 100% → 110% → 100% (breathing effect)
   - Rotation: 0° → 360° over 10 minutes

5. **Duplicate & Modify**:
   - Make 2-3 circles
   - Different colors (soft blue, lavender)
   - Different animation speeds
   - Blend mode: Screen or Add

6. **Final Touches**:
   - Add Gaussian Blur (10-20)
   - Add subtle vignette
   - Export H.264 for Vimeo

## Recommended Workflow:

1. **Test with CSS animation first** (instant, free, lightweight)
2. **If you want video**: Use Pexels + Premiere color grading
3. **For unique content**: RunwayML for 2-3 short clips, extend in Premiere

The CSS-only option is actually fantastic for web - no video hosting needed, perfectly smooth, and loads instantly!