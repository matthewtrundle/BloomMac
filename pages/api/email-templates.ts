import { NextApiRequest, NextApiResponse } from 'next';
import { enhancedEmailTemplates } from '@/lib/email-templates/enhanced-emails';
import { supabaseAdmin } from '@/lib/supabase';

// Helper to flatten the nested template structure
function flattenTemplates() {
  const flattened: any[] = [];
  
  Object.entries(enhancedEmailTemplates).forEach(([sequence, templates]) => {
    Object.entries(templates).forEach(([step, template]: [string, any]) => {
      flattened.push({
        id: `${sequence}-${step}`,
        sequence,
        step,
        name: getTemplateName(sequence, step),
        subject: template.subject,
        content: typeof template.content === 'function' 
          ? template.content('{{firstName}}') 
          : template.content,
        variables: extractVariables(template),
        delay: template.delay
      });
    });
  });
  
  return flattened;
}

// Get human-readable template names
function getTemplateName(sequence: string, step: string): string {
  const names: any = {
    newsletter: {
      welcome: '🌸 Newsletter Welcome',
      day3: '🌟 3-Day Quick Wins',
      day7: '🤗 Week 1 Check-In', 
      day14: '💅 Self-Care Reminder',
      day30: '💭 Month Check-In'
    },
    contactFollowup: {
      immediate: '📧 Contact Confirmation',
      followup72: '🤗 Gentle Follow-Up',
      resources7: '🎁 Free Resources'
    },
    bookingConfirmation: {
      confirmation: '🎉 Booking Confirmed',
      reminder24: '⏰ Tomorrow Reminder',
      followup48: '💜 Post-Session Follow-Up'
    },
    leadNurture: {
      thankYou: '📬 Resource Download',
      helpful72: '🤔 Resource Check-In',
      successStory7: '🌟 Success Story',
      readyWhen14: '⏰ No Rush Message'
    }
  };
  
  return names[sequence]?.[step] || `${sequence} - ${step}`;
}

// Extract variables used in templates
function extractVariables(template: any): string[] {
  const content = typeof template.content === 'function' 
    ? template.content('{{firstName}}') 
    : template.content;
    
  const matches = content.match(/\{\{[^}]+\}\}/g) || [];
  return [...new Set(matches)];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Get base templates
      const baseTemplates = flattenTemplates();
      let customTemplates: any = null;
      
      // First try to get custom templates from database
      try {
        const { data } = await supabaseAdmin
          .from('email_templates_custom')
          .select('*')
          .order('sequence', { ascending: true });
        customTemplates = data;
      } catch (dbError) {
        // Database table might not exist, try JSON file fallback
        const fs = require('fs').promises;
        const path = require('path');
        const customTemplatesPath = path.join(process.cwd(), 'data', 'custom-email-templates.json');
        
        try {
          const fileData = await fs.readFile(customTemplatesPath, 'utf-8');
          const jsonTemplates = JSON.parse(fileData);
          
          // Convert JSON format to array format
          customTemplates = [];
          Object.entries(jsonTemplates).forEach(([sequence, steps]: [string, any]) => {
            Object.entries(steps).forEach(([step, template]: [string, any]) => {
              customTemplates.push({
                sequence,
                step,
                subject: template.subject,
                content: template.content,
                updated_at: template.updatedAt,
                modified_by: template.modifiedBy
              });
            });
          });
        } catch (fileError) {
          // No custom templates found
          console.log('No custom templates found in database or file');
        }
      }
      
      // Merge custom templates with base templates
      const templates = baseTemplates.map(baseTemplate => {
        const custom = customTemplates?.find(
          (ct: any) => ct.sequence === baseTemplate.sequence && ct.step === baseTemplate.step
        );
        
        if (custom) {
          return {
            ...baseTemplate,
            subject: custom.subject,
            content: custom.content,
            lastModified: custom.updated_at || custom.updatedAt,
            modifiedBy: custom.modified_by || custom.modifiedBy
          };
        }
        
        return baseTemplate;
      });
      
      return res.status(200).json({ templates });
      
    } catch (error) {
      console.error('Error loading templates:', error);
      // If all fails, just return base templates
      const templates = flattenTemplates();
      return res.status(200).json({ templates });
    }
    
  } else if (req.method === 'PUT') {
    // Save edited template
    const { sequence, step, subject, content } = req.body;
    
    if (!sequence || !step || !subject || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
      // First try to create the table if it doesn't exist
      await supabaseAdmin.rpc('create_email_templates_table_if_not_exists').catch(() => {
        // Ignore error - table might already exist
      });

      // Create or update custom template in database
      const { error } = await supabaseAdmin
        .from('email_templates_custom')
        .upsert({
          sequence,
          step,
          subject,
          content,
          modified_by: 'admin',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'sequence,step'
        });
      
      if (error) {
        console.error('Supabase upsert error:', error);
        
        // If it's a unique constraint violation, try update instead
        if (error.code === '23505') {
          const { error: updateError } = await supabaseAdmin
            .from('email_templates_custom')
            .update({
              subject,
              content,
              modified_by: 'admin',
              updated_at: new Date().toISOString()
            })
            .eq('sequence', sequence)
            .eq('step', step);
          
          if (updateError) {
            console.error('Update also failed:', updateError);
            throw updateError;
          }
        } else {
          // For other errors, try the file fallback
          const fs = require('fs').promises;
          const path = require('path');
          const customTemplatesPath = path.join(process.cwd(), 'data', 'custom-email-templates.json');
          
          try {
            // Read existing custom templates
            let customTemplates = {};
            try {
              const data = await fs.readFile(customTemplatesPath, 'utf-8');
              customTemplates = JSON.parse(data);
            } catch (e) {
              // File doesn't exist yet
            }
            
            // Update the template
            if (!customTemplates[sequence]) {
              customTemplates[sequence] = {};
            }
            customTemplates[sequence][step] = {
              subject,
              content,
              modifiedBy: 'admin',
              updatedAt: new Date().toISOString()
            };
            
            // Ensure directory exists
            await fs.mkdir(path.dirname(customTemplatesPath), { recursive: true });
            
            // Save to file
            await fs.writeFile(customTemplatesPath, JSON.stringify(customTemplates, null, 2));
            
            console.log('Saved template to local file as fallback');
          } catch (fileError) {
            console.error('Failed to save to file:', fileError);
            throw error;
          }
        }
      }
      
      // Log the change (ignore errors)
      await supabaseAdmin
        .from('admin_activity_log')
        .insert({
          action: 'email_template_edit',
          entity_type: 'email_template',
          entity_id: `${sequence}-${step}`,
          details: {
            sequence,
            step,
            changedFields: ['subject', 'content']
          }
        })
        .catch(() => {
          // Ignore logging errors
        });
      
      return res.status(200).json({ 
        success: true, 
        message: 'Template saved successfully' 
      });
      
    } catch (error) {
      console.error('Error saving template:', error);
      return res.status(500).json({ error: 'Failed to save template' });
    }
    
  } else if (req.method === 'POST' && req.body.action === 'reset') {
    // Reset template to original
    const { sequence, step } = req.body;
    
    try {
      await supabaseAdmin
        .from('email_templates_custom')
        .delete()
        .match({ sequence, step });
      
      return res.status(200).json({ 
        success: true, 
        message: 'Template reset to original' 
      });
      
    } catch (error) {
      return res.status(500).json({ error: 'Failed to reset template' });
    }
    
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
}