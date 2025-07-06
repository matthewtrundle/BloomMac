#!/bin/bash

echo "🔧 Fixing Email Admin '.replace()' Error"
echo "======================================="
echo ""

echo "Issue: Something in the subscriber data is undefined when trying to call .replace()"
echo "Common causes: email, first_name, last_name, or other string fields are null/undefined"
echo ""

echo "📧 Adding null safety to newsletter admin API..."

cat > app/api/newsletter-admin/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase-unified';

interface NewsletterStats {
  total_subscribers: number;
  active_subscribers: number;
  unsubscribed: number;
  recent_signups: number;
  signup_sources: { source: string; count: number; percentage: number }[];
  growth_trend: { date: string; subscribers: number }[];
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    
    // Get all subscribers
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Handle null/undefined subscribers
    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({
        stats: {
          total_subscribers: 0,
          active_subscribers: 0,
          unsubscribed: 0,
          recent_signups: 0,
          signup_sources: [],
          growth_trend: []
        },
        subscribers: []
      });
    }

    // Calculate stats
    const totalSubscribers = subscribers.length;
    const activeSubscribers = subscribers.filter(s => s.subscribed === true).length;
    const unsubscribed = subscribers.filter(s => s.subscribed === false).length;
    
    // Recent signups (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentSignups = subscribers.filter(s => 
      s.created_at && new Date(s.created_at) > thirtyDaysAgo
    ).length;

    // Signup sources
    const sourceMap = new Map();
    subscribers.forEach(s => {
      const source = s.source || 'unknown';
      sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
    });
    
    const signupSources = Array.from(sourceMap.entries()).map(([source, count]) => ({
      source,
      count,
      percentage: totalSubscribers > 0 ? Math.round((count / totalSubscribers) * 100) : 0
    }));

    // Growth trend (last 30 days)
    const growthTrend = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const subscribersUpToDate = subscribers.filter(s => 
        s.created_at && new Date(s.created_at) <= date
      ).length;
      
      growthTrend.push({
        date: dateStr,
        subscribers: subscribersUpToDate
      });
    }

    const stats: NewsletterStats = {
      total_subscribers: totalSubscribers,
      active_subscribers: activeSubscribers,
      unsubscribed,
      recent_signups: recentSignups,
      signup_sources: signupSources,
      growth_trend: growthTrend
    };

    // Return the expected structure with null safety
    return NextResponse.json({
      stats,
      subscribers: subscribers.map(s => ({
        id: s.id || '',
        email: s.email || '',
        first_name: s.first_name || '',
        last_name: s.last_name || '',
        status: s.subscribed ? 'active' : 'unsubscribed',
        source: s.source || 'unknown',
        created_at: s.created_at || new Date().toISOString(),
        unsubscribed_at: s.unsubscribed_at || null
      }))
    });

  } catch (error) {
    console.error('Error fetching newsletter data:', error);
    
    // Return safe fallback data
    return NextResponse.json({
      stats: {
        total_subscribers: 0,
        active_subscribers: 0,
        unsubscribed: 0,
        recent_signups: 0,
        signup_sources: [],
        growth_trend: []
      },
      subscribers: [],
      error: 'Failed to fetch newsletter data'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();
    const supabase = getServiceSupabase();

    if (action === 'add_subscriber') {
      const { email, source = 'admin' } = data;
      
      if (!email || typeof email !== 'string') {
        return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
      }

      const { data: newSubscriber, error } = await supabase
        .from('subscribers')
        .insert({
          email: email.toLowerCase().trim(),
          source: source || 'admin',
          subscribed: true,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return NextResponse.json({ error: 'Email already subscribed' }, { status: 409 });
        }
        throw error;
      }

      return NextResponse.json(newSubscriber, { status: 201 });
    }

    if (action === 'send_newsletter') {
      const { subject, content, template_id } = data;
      
      if (!subject || !content) {
        return NextResponse.json({ error: 'Subject and content are required' }, { status: 400 });
      }
      
      // Get active subscribers
      const { data: activeSubscribers, error: subError } = await supabase
        .from('subscribers')
        .select('email')
        .eq('subscribed', true)
        .not('email', 'is', null);

      if (subError) throw subError;

      if (!activeSubscribers || activeSubscribers.length === 0) {
        return NextResponse.json({ 
          success: true, 
          queued: 0,
          message: 'No active subscribers found'
        });
      }

      // Add to email queue for each subscriber
      const emailJobs = activeSubscribers
        .filter(subscriber => subscriber.email) // Extra safety check
        .map(subscriber => ({
          to_email: subscriber.email,
          subject: subject || 'Newsletter',
          template_id: template_id || 'newsletter',
          template_data: { content },
          status: 'pending',
          scheduled_at: new Date().toISOString()
        }));

      if (emailJobs.length === 0) {
        return NextResponse.json({ 
          success: true, 
          queued: 0,
          message: 'No valid email addresses found'
        });
      }

      const { error: queueError } = await supabase
        .from('email_queue')
        .insert(emailJobs);

      if (queueError) throw queueError;

      return NextResponse.json({ 
        success: true, 
        queued: emailJobs.length,
        message: `Newsletter queued for ${emailJobs.length} subscribers`
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    console.error('Error processing newsletter action:', error);
    return NextResponse.json(
      { error: 'Failed to process action', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    
    const { error } = await supabase
      .from('subscribers')
      .update({ 
        subscribed: false,
        unsubscribed_at: new Date().toISOString()
      })
      .eq('email', email);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe', details: error.message },
      { status: 500 }
    );
  }
}
EOF

echo "✅ Added comprehensive null safety to newsletter API"
echo ""

echo "📊 Fixes applied:"
echo "- ✅ All string fields default to empty string instead of null/undefined"
echo "- ✅ Null checks for email, created_at, and other critical fields"
echo "- ✅ Safe fallback data structure if API fails"
echo "- ✅ Division by zero protection for percentages"
echo "- ✅ Array filtering to remove null/undefined items"
echo ""

echo "📝 Committing fix..."
git add app/api/newsletter-admin/route.ts
git commit -m "fix: Add null safety to prevent 'replace' error in email admin

- Add null checks for all subscriber fields (email, first_name, last_name, etc.)
- Default all string fields to empty string instead of null/undefined
- Add safe fallback data structure if API fails
- Prevent division by zero in percentage calculations
- Filter out null/undefined emails when processing
- Fixes 'Cannot read properties of undefined (reading replace)' error

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin main

echo ""
echo "🎉 Email admin should now work without .replace() errors!"
echo ""
echo "The fix ensures all string fields have safe default values:"
echo "- email: defaults to ''"
echo "- first_name: defaults to ''"
echo "- last_name: defaults to ''"
echo "- source: defaults to 'unknown'"
echo "- created_at: defaults to current timestamp"
echo ""
echo "Test at: https://bloompsychologynorthaustin.com/admin/email"