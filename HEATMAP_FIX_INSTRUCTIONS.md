# Heatmap Fix Instructions

## Current Status
- ✅ The `click_heatmap` table exists
- ✅ Test data has been added (51 clicks across multiple pages)
- ❌ The `get_heatmap_data` function has an error and needs to be fixed
- ⚠️  Real click tracking may not be working (0 real clicks recorded)

## To Fix the Heatmap:

### 1. Fix the Database Function (REQUIRED)
Go to your Supabase Dashboard → SQL Editor and run this SQL:

```sql
-- Drop the existing function first
DROP FUNCTION IF EXISTS get_heatmap_data(VARCHAR, INTEGER);

-- Create fixed function with proper column references
CREATE OR REPLACE FUNCTION get_heatmap_data(
  p_page VARCHAR,
  p_days INTEGER DEFAULT 7
)
RETURNS TABLE (
  x_percent DECIMAL,
  y_percent DECIMAL,
  click_count BIGINT,
  intensity DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH click_data AS (
    SELECT 
      ROUND(ch.x_percent::numeric, 0) as x_grid,
      ROUND(ch.y_percent::numeric, 0) as y_grid,
      COUNT(*) as clicks
    FROM click_heatmap ch
    WHERE ch.page = p_page
    AND ch.created_at >= NOW() - INTERVAL '1 day' * p_days
    GROUP BY ROUND(ch.x_percent::numeric, 0), ROUND(ch.y_percent::numeric, 0)
  ),
  max_clicks AS (
    SELECT MAX(clicks) as max_count
    FROM click_data
  )
  SELECT 
    cd.x_grid::DECIMAL as x_percent,
    cd.y_grid::DECIMAL as y_percent,
    cd.clicks as click_count,
    CASE 
      WHEN mc.max_count > 0 
      THEN (cd.clicks::DECIMAL / mc.max_count * 100)
      ELSE 0
    END as intensity
  FROM click_data cd
  CROSS JOIN max_clicks mc
  ORDER BY cd.clicks DESC;
END;
$$ LANGUAGE plpgsql;
```

### 2. After Fixing the Function
The heatmap at `/admin/heatmap` should now show:
- Test data visualized as colored dots
- Click counts in the stats cards
- Top clicked elements in the sidebar

### 3. Why Real Clicks Aren't Being Tracked
I've added debug logging to the heatmap tracker. To diagnose:

1. Open your website in a browser
2. Open the browser console (F12)
3. Click anywhere on the page
4. Look for console messages starting with `[HeatmapTracker]`

You should see:
- `[HeatmapTracker] Initializing...`
- `[HeatmapTracker] Click listener attached`
- `[HeatmapTracker] Click detected: [element]`
- `[HeatmapTracker] Flushing X clicks`

If you don't see these messages, the tracker may not be initializing properly.

### 4. Test Data Added
I've added 51 test clicks with realistic patterns:
- Homepage (/): 17 clicks
- Contact (/contact): 7 clicks  
- Services (/services/therapy-for-moms): 14 clicks
- About (/about): 13 clicks

These are clustered around common UI areas like headers, CTAs, and footers.

## Quick Verification
After applying the SQL fix, visit `/admin/heatmap` and you should see:
- Colored dots on the page preview
- Stats showing total clicks and sessions
- The ability to switch between pages and time ranges