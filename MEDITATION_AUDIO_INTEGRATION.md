# Meditation Audio Integration Documentation

## Overview
The Bloom Psychology platform includes integrated meditation audio players within each week's course content. This system allows students to stream or download guided meditations directly from the course pages.

## Technical Architecture

### Storage Setup
- **Provider**: Supabase Storage
- **Bucket**: `meditations` (public access enabled)
- **File Format**: MP3 (audio/mpeg)
- **Size Limit**: 50MB per file
- **Naming Convention**: `week[1-6]-meditation.mp3`

### Audio URLs
```
Base URL: https://utetcmirepwdxbtrcczv.supabase.co/storage/v1/object/public/meditations/
Example: https://utetcmirepwdxbtrcczv.supabase.co/storage/v1/object/public/meditations/week1-meditation.mp3
```

### Component Structure

#### MeditationPlayer Component
Location: `/components/course/MeditationPlayer.tsx`

Features:
- Custom audio controls with play/pause
- Visual waveform animation
- Progress bar with click-to-seek
- Current time display
- Download button for offline access
- Practice tips section
- Responsive design

#### Integration in Course Pages
Location: `/components/course/WeekContent.tsx`

The meditation player automatically appears in the "Week Resources" section when:
1. A resource with title "Guided Meditation" is detected
2. The component renders the MeditationPlayer instead of a standard link

## Meditation Content

### Scripts Location
All meditation scripts are in `/resources/`:
- `week1-meditation-script-elevenlabs.md` - Grounding Practice (8:47)
- `week2-meditation-script-elevenlabs.md` - Self-Compassion Break (10:00)
- `week3-meditation-script-elevenlabs.md` - Loving-Kindness (12:00)
- `week4-meditation-script-elevenlabs.md` - Anxiety Relief (10:00)
- `week5-meditation-script-elevenlabs.md` - Identity Integration (11:00)
- `week6-meditation-script-elevenlabs.md` - Gratitude & Growth (10:00)

### Voice Synthesis
- **Platform**: ElevenLabs
- **Voice**: Rachel or Bella (warm, nurturing)
- **Settings**: Speed 0.85, Stability 65-75
- **Script Features**: Emotional tags, timed pauses, Dr. Jana's authentic language

## Implementation Steps

### 1. Generate Audio Files
```bash
# Use ElevenLabs to generate each meditation
# Upload scripts with voice engineering markup
# Download as MP3 files
```

### 2. Upload to Supabase
```bash
# Via Dashboard:
1. Navigate to Storage → meditations bucket
2. Upload each MP3 file
3. Ensure public access is enabled

# Via Script (if needed):
node scripts/upload-meditation.js week1-meditation.mp3
```

### 3. Verify Integration
```bash
# Visit course pages to test:
https://www.bloompsychologynorthaustin.com/course/week1
https://www.bloompsychologynorthaustin.com/course/week2
# etc...
```

## Storage Costs

### Supabase Free Tier
- **Storage**: 1GB (enough for ~100 meditations)
- **Bandwidth**: 2GB/month (~300 full listens)
- **Cost**: $0

### Supabase Pro Plan ($25/month)
- **Storage**: 100GB
- **Bandwidth**: 200GB/month (~30,000 full listens)
- **Overages**: $0.02/GB bandwidth

### File Size Estimates
- 10-minute meditation @ 128kbps = ~10MB
- All 6 meditations = ~60MB total
- 1000 streams/month = ~60GB bandwidth

## Fallback Options

If bandwidth becomes an issue:
1. **Cloudflare R2**: Zero bandwidth fees, $0.015/GB storage
2. **Private Podcast**: Use Transistor.fm for distribution
3. **Download-Only**: Encourage offline downloads to reduce streaming

## Marketing Integration

### Free Content Strategy
- Week 1 meditation available free on website
- Used as lead magnet for email signups
- Can be uploaded to YouTube with visuals

### Course Content
- Weeks 2-6 exclusive to course purchasers
- Downloadable for lifetime access
- Progress tracking in wellness hub

## Maintenance

### Adding New Meditations
1. Create script in `/resources/`
2. Generate audio with ElevenLabs
3. Upload to Supabase bucket
4. Update `getMeditationDetails()` in WeekContent.tsx

### Monitoring Usage
```javascript
// Check bandwidth usage
const { data, error } = await supabase
  .storage
  .from('meditations')
  .list();
```

## Troubleshooting

### Audio Not Playing
- Check file exists in Supabase bucket
- Verify public access is enabled
- Check browser console for CORS errors
- Ensure MP3 format is correct

### Download Issues
- Verify Content-Disposition headers
- Check file permissions in bucket
- Test in different browsers

## Future Enhancements
1. Add playback speed controls
2. Remember playback position
3. Create meditation playlists
4. Add background music options
5. Integrate progress tracking
6. Mobile app with offline support