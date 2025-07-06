import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase-unified';

// Define the settings structure
interface SystemSettings {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  businessHours: Record<string, string>;
  socialMedia: Record<string, string>;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

const DEFAULT_SETTINGS: SystemSettings = {
  businessName: 'Bloom Psychology',
  email: 'jana@bloompsychologynorthaustin.com',
  phone: '(512) 898-9510',
  address: '13706 N Highway 183, Suite 114, Austin, TX 78750',
  website: 'https://bloompsychologynorthaustin.com',
  businessHours: {
    monday: '9:00 AM - 6:00 PM',
    tuesday: '9:00 AM - 6:00 PM',
    wednesday: '9:00 AM - 6:00 PM',
    thursday: '9:00 AM - 6:00 PM',
    friday: '9:00 AM - 6:00 PM',
    saturday: 'By appointment',
    sunday: 'Closed'
  },
  socialMedia: {
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: ''
  },
  seo: {
    metaTitle: 'Bloom Psychology - Therapy for Women & Moms in Texas',
    metaDescription: 'Specialized therapy for women, moms, and parents in Texas. Expert support for postpartum depression, anxiety, and life transitions.',
    keywords: ['therapy', 'counseling', 'postpartum', 'anxiety', 'women', 'mothers', 'Austin']
  }
};

export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    
    // Try to get settings from database
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('key', 'site_settings')
      .single();

    if (error) {
      // If table doesn't exist or no settings found, return defaults
      if (error.code === '42P01' || error.code === 'PGRST116') {
        return NextResponse.json({ settings: DEFAULT_SETTINGS });
      }
      throw error;
    }

    // Return stored settings or defaults
    const settings = data?.value || DEFAULT_SETTINGS;
    return NextResponse.json({ settings });

  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { settings } = await request.json();
    
    if (!settings) {
      return NextResponse.json(
        { error: 'Settings data is required' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    
    // Get user info from headers (set by middleware)
    const userEmail = request.headers.get('x-user-email');
    const userId = request.headers.get('x-user-id');
    
    // First, try to create the table if it doesn't exist
    // This is a one-time operation that will fail silently if table exists
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS system_settings (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          key VARCHAR(255) UNIQUE NOT NULL,
          value JSONB NOT NULL,
          updated_by VARCHAR(255),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }).catch(() => {
      // Ignore error if table already exists or RPC doesn't exist
    });

    // Try to upsert the settings
    const { data, error } = await supabase
      .from('system_settings')
      .upsert({
        key: 'site_settings',
        value: settings,
        updated_by: userEmail,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      })
      .select()
      .single();

    if (error) {
      // If upsert fails, try insert
      if (error.code === '42P01') {
        // Table doesn't exist, we can't create it via API
        return NextResponse.json({
          error: 'Settings table not initialized. Please contact support.',
          requiresSetup: true
        }, { status: 503 });
      }
      throw error;
    }

    // Log the settings update
    try {
      await supabase
        .from('admin_activity_log')
        .insert({
          action: 'settings_update',
          entity_type: 'system_settings',
          entity_id: 'site_settings',
          details: {
            admin_email: userEmail,
            admin_id: userId,
            updated_fields: Object.keys(settings)
          },
          created_at: new Date().toISOString()
        });
    } catch (logError) {
      console.error('Failed to log settings update:', logError);
    }

    return NextResponse.json({ 
      success: true,
      message: 'Settings saved successfully',
      settings: data.value
    });

  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings', details: error.message },
      { status: 500 }
    );
  }
}

// Reset settings to defaults
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    
    // Update settings to defaults
    const { error } = await supabase
      .from('system_settings')
      .update({
        value: DEFAULT_SETTINGS,
        updated_at: new Date().toISOString()
      })
      .eq('key', 'site_settings');

    if (error) throw error;

    return NextResponse.json({ 
      success: true,
      message: 'Settings reset to defaults',
      settings: DEFAULT_SETTINGS
    });

  } catch (error) {
    console.error('Error resetting settings:', error);
    return NextResponse.json(
      { error: 'Failed to reset settings', details: error.message },
      { status: 500 }
    );
  }
}