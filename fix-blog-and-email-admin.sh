#!/bin/bash

echo "🔧 Fixing Blog Admin and Email Admin Issues"
echo "==========================================="
echo ""

echo "📝 Issue 1: Blog posts not showing due to function name mismatch"
echo "📧 Issue 2: Unsubscribe function not working due to missing App Router API"
echo ""

# First, let's check what functions are actually exported
echo "🔍 Checking blog storage functions..."
grep -n "export" lib/blog-storage-supabase.ts | head -10

echo ""
echo "✏️  Creating fixed blog API route..."

# Create the corrected blog API route
cat > app/api/blog-admin-supabase/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { loadBlogPosts, getBlogPost, createBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/blog-storage-supabase';

export async function GET(request: NextRequest) {
  try {
    // Check if fetching single post
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const post = await getBlogPost(slug);
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      return NextResponse.json(post);
    }

    // Fetch all posts
    const posts = await loadBlogPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const post = await request.json();
    const newPost = await createBlogPost(post);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create post', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const updates = await request.json();
    const updatedPost = await updateBlogPost(slug, updates);
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update post', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    await deleteBlogPost(slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post', details: error.message },
      { status: 500 }
    );
  }
}
EOF

echo "✅ Fixed blog API route with correct function names"
echo ""

echo "📧 Creating newsletter admin API route..."

# Create newsletter admin API route
mkdir -p app/api/newsletter-admin
cat > app/api/newsletter-admin/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase-unified';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(subscribers);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, source = 'admin' } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    
    const { data, error } = await supabase
      .from('subscribers')
      .insert({
        email: email.toLowerCase().trim(),
        source,
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

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to add subscriber', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
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

echo "✅ Created newsletter admin API route"
echo ""

echo "📧 Creating public unsubscribe API route..."

# Create public unsubscribe API route
mkdir -p app/api/unsubscribe
cat > app/api/unsubscribe/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase-unified';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    
    // Unsubscribe the user
    const { error } = await supabase
      .from('subscribers')
      .update({ 
        subscribed: false,
        unsubscribed_at: new Date().toISOString()
      })
      .eq('email', email);

    if (error) throw error;

    // Return a success page
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Unsubscribed - Bloom Psychology</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
          .success { color: #28a745; }
        </style>
      </head>
      <body>
        <h1 class="success">Successfully Unsubscribed</h1>
        <p>You have been unsubscribed from our mailing list.</p>
        <p>Email: <strong>${email}</strong></p>
        <p><a href="/">Return to Bloom Psychology</a></p>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error) {
    console.error('Error unsubscribing:', error);
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error - Bloom Psychology</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
          .error { color: #dc3545; }
        </style>
      </head>
      <body>
        <h1 class="error">Error</h1>
        <p>There was an error processing your unsubscribe request.</p>
        <p><a href="/">Return to Bloom Psychology</a></p>
      </body>
      </html>
    `, {
      status: 500,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

export async function POST(request: NextRequest) {
  // Handle POST requests the same way as GET for form submissions
  return GET(request);
}
EOF

echo "✅ Created public unsubscribe API route"
echo ""

echo "📝 Committing changes..."
git add app/api/blog-admin-supabase/route.ts
git add app/api/newsletter-admin/
git add app/api/unsubscribe/

git commit -m "fix: Resolve blog admin and email admin issues

- Fix blog admin function import mismatch (getAllPosts -> loadBlogPosts)
- Create newsletter admin App Router API route
- Create public unsubscribe API route
- Blog posts should now display in admin panel
- Email unsubscribe functionality should now work

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin main

echo ""
echo "🎉 Fixes Applied!"
echo ""
echo "What should now work:"
echo "✅ Blog posts should appear in admin panel"
echo "✅ Newsletter unsubscribe should work in email admin"
echo "✅ Email unsubscribe links should work"
echo ""
echo "Wait for deployment, then test:"
echo "1. https://bloompsychologynorthaustin.com/admin/blog"
echo "2. https://bloompsychologynorthaustin.com/admin/email"
EOF

chmod +x fix-blog-and-email-admin.sh

echo "🚀 Run this script to fix both issues:"
echo "./fix-blog-and-email-admin.sh"