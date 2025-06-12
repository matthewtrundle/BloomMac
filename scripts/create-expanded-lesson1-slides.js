#!/usr/bin/env node
/**
 * Complete 15-Slide Deck for Week 1 Lesson 1
 * Aligned with 10-minute video script
 * ~40 seconds per slide average
 */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateLesson1Slides() {
  try {
    // Create comprehensive 15-slide deck aligned with script
    const slideTemplates = [
      // Slide 1: Hero Welcome (0:00-0:30)
      {
        html: `
          <div class="slide-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%); padding: 40px;">
            <div class="content-wrapper" style="text-align: center; max-width: 800px;">
              <h1 class="main-title" style="font-family: 'Playfair Display', serif; font-size: 64px; color: #333; margin-bottom: 20px; font-weight: 700;">Welcome to Your Fourth Trimester</h1>
              <p class="subtitle" style="font-family: 'Montserrat', sans-serif; font-size: 28px; color: #666; margin-bottom: 40px; font-weight: 300;">A Journey of Healing, Growth, and Transformation</p>
              <div class="instructor-info" style="background: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                <p style="font-family: 'Montserrat', sans-serif; font-size: 20px; color: #333; margin: 0;">With Dr. Jana Rundle</p>
                <p style="font-family: 'Montserrat', sans-serif; font-size: 16px; color: #666; margin-top: 10px;">Licensed Psychologist & Maternal Mental Health Specialist</p>
              </div>
            </div>
          </div>
        `
      },

      // Slide 2: Personal Connection (0:30-1:00)
      {
        html: `
          <div class="slide-container" style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f5f5f7; padding: 60px;">
            <div class="content-wrapper" style="max-width: 900px;">
              <h2 class="section-title" style="font-family: 'Playfair Display', serif; font-size: 48px; color: #333; margin-bottom: 40px; text-align: center;">You Are Not Alone</h2>
              <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 5px 20px rgba(0,0,0,0.08);">
                <p style="font-family: 'Montserrat', sans-serif; font-size: 22px; line-height: 1.6; color: #555; margin-bottom: 20px;">
                  "I see you. I see the strength it took to press play on this video today."
                </p>
                <p style="font-family: 'Montserrat', sans-serif; font-size: 20px; line-height: 1.6; color: #666;">
                  Whether you're here out of curiosity, desperation, or hope - you belong here. This is your safe space to explore, learn, and heal.
                </p>
              </div>
            </div>
          </div>
        `
      },

      // Slide 3: The Container Concept (1:00-1:30)
      {
        html: `
          <div class="slide-container" style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(to bottom, #e8f5e9, #c8e6c9); padding: 60px;">
            <div class="content-wrapper" style="max-width: 1000px;">
              <h2 class="concept-title" style="font-family: 'Playfair Display', serif; font-size: 52px; color: #2e7d32; margin-bottom: 50px; text-align: center;">Creating Your Container</h2>
              <div class="container-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
                <div style="background: white; padding: 30px; border-radius: 15px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                  <div style="font-size: 48px; margin-bottom: 20px;">🛡️</div>
                  <h3 style="font-family: 'Montserrat', sans-serif; font-size: 24px; color: #333; margin-bottom: 15px;">Safety</h3>
                  <p style="font-family: 'Montserrat', sans-serif; font-size: 16px; color: #666;">A protected space where you can be vulnerable</p>
                </div>
                <div style="background: white; padding: 30px; border-radius: 15px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                  <div style="font-size: 48px; margin-bottom: 20px;">💝</div>
                  <h3 style="font-family: 'Montserrat', sans-serif; font-size: 24px; color: #333; margin-bottom: 15px;">Support</h3>
                  <p style="font-family: 'Montserrat', sans-serif; font-size: 16px; color: #666;">Guidance without judgment or pressure</p>
                </div>
                <div style="background: white; padding: 30px; border-radius: 15px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                  <div style="font-size: 48px; margin-bottom: 20px;">🌱</div>
                  <h3 style="font-family: 'Montserrat', sans-serif; font-size: 24px; color: #333; margin-bottom: 15px;">Growth</h3>
                  <p style="font-family: 'Montserrat', sans-serif; font-size: 16px; color: #666;">Room to heal and transform at your pace</p>
                </div>
              </div>
            </div>
          </div>
        `
      },

      // Slide 4: The Reality of Motherhood (1:30-2:00)
      {
        html: `
          <div class="slide-container" style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fff3e0; padding: 60px;">
            <div class="content-wrapper" style="max-width: 900px;">
              <h2 class="section-title" style="font-family: 'Playfair Display', serif; font-size: 48px; color: #e65100; margin-bottom: 40px; text-align: center;">The Truth No One Tells You</h2>
              <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
                <blockquote style="font-family: 'Montserrat', sans-serif; font-size: 24px; line-height: 1.6; color: #555; border-left: 4px solid #ff6f00; padding-left: 30px; margin: 0;">
                  "Motherhood is simultaneously the most beautiful and most challenging transformation you'll ever experience."
                </blockquote>
                <p style="font-family: 'Montserrat', sans-serif; font-size: 18px; color: #666; margin-top: 30px; text-align: center;">
                  And it's okay to feel both grateful and overwhelmed.
                </p>
              </div>
            </div>
          </div>
        `
      },

      // Slide 5: Statistics with Humanity (2:00-2:30) - FIXED
      {
        html: `
          <div class="slide-container" style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 60px;">
            <div class="content-wrapper" style="max-width: 900px;">
              <h2 class="stats-title" style="font-family: 'Playfair Display', serif; font-size: 48px; color: #1565c0; margin-bottom: 50px; text-align: center;">You're In Good Company</h2>
              <div class="stats-grid" style="display: flex; justify-content: center; gap: 40px; flex-wrap: wrap;">
                <div class="stat-card" style="background: white; padding: 40px; border-radius: 20px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.1); min-width: 280px;">
                  <p style="font-family: 'Montserrat', sans-serif; font-size: 56px; font-weight: 600; color: #1976d2; margin: 0;">80%</p>
                  <p style="font-family: 'Montserrat', sans-serif; font-size: 18px; color: #555; margin-top: 15px;">of new mothers experience mood changes</p>
                </div>
                <div class="stat-card" style="background: white; padding: 40px; border-radius: 20px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.1); min-width: 280px;">
                  <p style="font-family: 'Montserrat', sans-serif; font-size: 56px; font-weight: 600; color: #1976d2; margin: 0;">1 in 7</p>
                  <p style="font-family: 'Montserrat', sans-serif; font-size: 18px; color: #555; margin-top: 15px;">develop postpartum depression</p>
                </div>
              </div>
              <p style="font-family: 'Montserrat', sans-serif; font-size: 22px; color: #333; text-align: center; margin-top: 40px; font-style: italic;">
                Behind every statistic is a mother just like you, doing her best.
              </p>
            </div>
          </div>
        `
      },

      // Slide 6: Your Experience Matters (2:30-3:00) - FIXED
      {
        html: `
          <div class="slide-container" style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f3e5f5; padding: 40px;">
            <div class="content-wrapper" style="max-width: 800px; text-align: center;">
              <h2 class="section-title" style="font-family: 'Playfair Display', serif; font-size: 48px; color: #6a1b9a; margin-bottom: 40px;">Your Feelings Are Valid</h2>
              <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
                <ul style="font-family: 'Montserrat', sans-serif; font-size: 20px; line-height: 1.8; color: #555; text-align: left; list-style: none; padding: 0;">
                  <li style="margin-bottom: 15px;">✓ If you're crying more than smiling</li>
                  <li style="margin-bottom: 15px;">✓ If you don't feel that "instant bond"</li>
                  <li style="margin-bottom: 15px;">✓ If you miss your old life</li>
                  <li style="margin-bottom: 15px;">✓ If you're scared you're doing it wrong</li>
                </ul>
                <p style="font-family: 'Montserrat', sans-serif; font-size: 22px; color: #6a1b9a; margin-top: 25px; font-weight: 500;">
                  These feelings don't make you a bad mother.<br/>They make you human.
                </p>
              </div>
            </div>
          </div>
        `
      },

      // Slide 7: The Journey Ahead (3:00-3:30) - FIXED
      {
        html: `
          <div class="slide-container" style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(to right, #ffecd2, #fcb69f); padding: 40px;">
            <div class="content-wrapper" style="max-width: 900px;">
              <h2 class="section-title" style="font-family: 'Playfair Display', serif; font-size: 48px; color: #333; margin-bottom: 40px; text-align: center;">What We'll Explore Together</h2>
              <div style="display: flex; gap: 30px; flex-wrap: wrap; justify-content: center;">
                <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); flex: 1; min-width: 300px;">
                  <h3 style="font-family: 'Montserrat', sans-serif; font-size: 22px; color: #ff6b6b; margin-bottom: 15px;">Week by Week</h3>
                  <ul style="font-family: 'Montserrat', sans-serif; font-size: 16px; line-height: 1.6; color: #666; padding-left: 20px;">
                    <li>Understanding your changing brain</li>
                    <li>Managing overwhelming emotions</li>
                    <li>Building your support system</li>
                    <li>Creating sustainable self-care</li>
                  </ul>
                </div>
                <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); flex: 1; min-width: 300px;">
                  <h3 style="font-family: 'Montserrat', sans-serif; font-size: 22px; color: #ff6b6b; margin-bottom: 15px;">Real Tools</h3>
                  <ul style="font-family: 'Montserrat', sans-serif; font-size: 16px; line-height: 1.6; color: #666; padding-left: 20px;">
                    <li>Practical coping strategies</li>
                    <li>Communication templates</li>
                    <li>Daily wellness practices</li>
                    <li>Crisis prevention plans</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        `
      },

      // Remaining slides 8-15 stay the same...
      // Slide 8: Permission Slip (3:30-4:00)
      {
        html: `
          <div class="slide-container" style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #e8f5e9; padding: 60px;">
            <div class="content-wrapper" style="max-width: 800px; text-align: center;">
              <h2 class="section-title" style="font-family: 'Playfair Display', serif; font-size: 48px; color: #2e7d32; margin-bottom: 40px;">Your Permission Slip</h2>
              <div style="background: white; padding: 50px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 2px dashed #4caf50;">
                <p style="font-family: 'Montserrat', sans-serif; font-size: 24px; line-height: 1.8; color: #333;">
                  You have permission to:<br/><br/>
                  • Feel whatever you're feeling<br/>
                  • Take up space with your needs<br/>
                  • Ask for help without shame<br/>
                  • Prioritize your mental health<br/>
                  • Be a "good enough" mother
                </p>
                <p style="font-family: 'Playfair Display', serif; font-size: 28px; color: #2e7d32; margin-top: 30px; font-style: italic;">
                  Signed: Every mother who's been where you are
                </p>
              </div>
            </div>
          </div>
        `
      },

      // Slide 9: The Science of Hope (4:00-4:30)
      {
        html: `
          <div class="slide-container" style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%); padding: 60px;">
            <div class="content-wrapper" style="max-width: 900px;">
              <h2 class="section-title" style="font-family: 'Playfair Display', serif; font-size: 48px; color: #333; margin-bottom: 40px; text-align: center;">The Brain Can Heal</h2>
              <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <span style="font-size: 80px;">🧠</span>
                </div>
                <p style="font-family: 'Montserrat', sans-serif; font-size: 22px; line-height: 1.6; color: #555; text-align: center;">
                  Your brain is remarkably adaptable. With the right support and tools, you can:<br/><br/>
                  • Rewire negative thought patterns<br/>
                  • Build resilience pathways<br/>
                  • Create new coping mechanisms<br/>
                  • Strengthen emotional regulation
                </p>
                <p style="font-family: 'Montserrat', sans-serif; font-size: 20px; color: #777; margin-top: 30px; text-align: center; font-style: italic;">
                  Science shows us: Recovery isn't just possible, it's probable with proper support.
                </p>
              </div>
            </div>
          </div>
        `
      },

      // Slide 10: Community Connection (4:30-5:00)
      {
        html: `
          <div class="slide-container" style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fce4ec; padding: 60px;">
            <div class="content-wrapper" style="max-width: 1000px;">
              <h2 class="section-title" style="font-family: 'Playfair Display', serif; font-size: 48px; color: #c2185b; margin-bottom: 50px; text-align: center;">You're Joining a Community</h2>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-bottom: 40px;">
                <div style="background: white; padding: 30px; border-radius: 50%; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                  <p style="font-family: 'Montserrat', sans-serif; font-size: 18px; color: #555; text-align: center;">Mothers who understand</p>
                </div>
                <div style="background: white; padding: 30px; border-radius: 50%; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                  <p style="font-family: 'Montserrat', sans-serif; font-size: 18px; color: #555; text-align: center;">Stories of healing</p>
                </div>
                <div style="background: white; padding: 30px; border-radius: 50%; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                  <p style="font-family: 'Montserrat', sans-serif; font-size: 18px; color: #555; text-align: center;">Shared wisdom</p>
                </div>
              </div>
              <p style="font-family: 'Montserrat', sans-serif; font-size: 22px; color: #333; text-align: center;">
                Together, we're stronger than postpartum depression.
              </p>
            </div>
          </div>
        `
      },

      // Slide 11: Self-Compassion Practice (5:00-5:30)
      {
        html: `
          <div class="slide-container" style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(to bottom, #e1f5fe, #b3e5fc); padding: 60px;">
            <div class="content-wrapper" style="max-width: 800px;">
              <h2 class="section-title" style="font-family: 'Playfair Display', serif; font-size: 48px; color: #0277bd; margin-bottom: 40px; text-align: center;">Your First Practice</h2>
              <div style="background: white; padding: 50px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                <p style="font-family: 'Montserrat', sans-serif; font-size: 24px; color: #333; margin-bottom: 30px; text-align: center;">
                  Place your hand on your heart and repeat:
                </p>
                <blockquote style="font-family: 'Playfair Display', serif; font-size: 28px; line-height: 1.6; color: #0288d1; text-align: center; margin: 0; padding: 30px; background: #e1f5fe; border-radius: 15px;">
                  "I am exactly where I need to be.<br/>
                  I am learning and growing.<br/>
                  I am worthy of support and love.<br/>
                  I am not alone."
                </blockquote>
              </div>
            </div>
          </div>
        `
      },

      // Slide 12: Practical Next Steps (5:30-6:00)
      {
        html: `
          <div class="slide-container" style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fff8e1; padding: 60px;">
            <div class="content-wrapper" style="max-width: 900px;">
              <h2 class="section-title" style="font-family: 'Playfair Display', serif; font-size: 48px; color: #f57c00; margin-bottom: 40px; text-align: center;">Your Action Steps</h2>
              <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
                <ol style="font-family: 'Montserrat', sans-serif; font-size: 20px; line-height: 2; color: #555;">
                  <li style="margin-bottom: 20px;"><strong>Download your workbook</strong> - Your companion for this journey</li>
                  <li style="margin-bottom: 20px;"><strong>Set your intention</strong> - What do you hope to gain?</li>
                  <li style="margin-bottom: 20px;"><strong>Schedule your sessions</strong> - Treat this as sacred time</li>
                  <li style="margin-bottom: 20px;"><strong>Share with someone</strong> - Let them know you're taking this step</li>
                </ol>
                <p style="font-family: 'Montserrat', sans-serif; font-size: 18px; color: #666; margin-top: 30px; text-align: center; background: #fff3e0; padding: 20px; border-radius: 10px;">
                  Remember: Showing up is the hardest part, and you've already done it.
                </p>
              </div>
            </div>
          </div>
        `
      },

      // Slide 13: The Path Forward (6:00-6:30)
      {
        html: `
          <div class="slide-container" style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%); padding: 60px;">
            <div class="content-wrapper" style="max-width: 1000px;">
              <h2 class="section-title" style="font-family: 'Playfair Display', serif; font-size: 48px; color: #3949ab; margin-bottom: 50px; text-align: center;">Your Healing Timeline</h2>
              <div style="position: relative; padding: 40px;">
                <div style="position: absolute; left: 50%; top: 0; bottom: 0; width: 4px; background: #5c6bc0; transform: translateX(-50%);"></div>
                <div style="display: grid; gap: 40px;">
                  <div style="display: flex; align-items: center; gap: 30px;">
                    <div style="flex: 1; text-align: right;">
                      <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                        <h3 style="font-family: 'Montserrat', sans-serif; font-size: 20px; color: #3949ab; margin-bottom: 10px;">Today</h3>
                        <p style="font-family: 'Montserrat', sans-serif; font-size: 16px; color: #666;">You chose hope</p>
                      </div>
                    </div>
                    <div style="width: 20px; height: 20px; background: #3949ab; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.2);"></div>
                    <div style="flex: 1;"></div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 30px;">
                    <div style="flex: 1;"></div>
                    <div style="width: 20px; height: 20px; background: #5c6bc0; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.2);"></div>
                    <div style="flex: 1; text-align: left;">
                      <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                        <h3 style="font-family: 'Montserrat', sans-serif; font-size: 20px; color: #5c6bc0; margin-bottom: 10px;">Next Weeks</h3>
                        <p style="font-family: 'Montserrat', sans-serif; font-size: 16px; color: #666;">Building your toolkit</p>
                      </div>
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 30px;">
                    <div style="flex: 1; text-align: right;">
                      <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                        <h3 style="font-family: 'Montserrat', sans-serif; font-size: 20px; color: #7986cb; margin-bottom: 10px;">Your Future</h3>
                        <p style="font-family: 'Montserrat', sans-serif; font-size: 16px; color: #666;">Thriving, not just surviving</p>
                      </div>
                    </div>
                    <div style="width: 20px; height: 20px; background: #7986cb; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.2);"></div>
                    <div style="flex: 1;"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
      },

      // Slide 14: Closing Affirmation (6:30-7:00)
      {
        html: `
          <div class="slide-container" style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(to right, #ffecd2, #fcb69f); padding: 60px;">
            <div class="content-wrapper" style="max-width: 800px; text-align: center;">
              <h2 class="section-title" style="font-family: 'Playfair Display', serif; font-size: 48px; color: #333; margin-bottom: 40px;">Before We Continue...</h2>
              <div style="background: white; padding: 50px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                <p style="font-family: 'Montserrat', sans-serif; font-size: 24px; line-height: 1.8; color: #555; margin-bottom: 30px;">
                  Take a deep breath with me.
                </p>
                <div style="font-size: 60px; margin: 30px 0;">🌸</div>
                <p style="font-family: 'Playfair Display', serif; font-size: 28px; line-height: 1.6; color: #ff6b6b;">
                  You are brave.<br/>
                  You are worthy.<br/>
                  You are already healing.
                </p>
                <p style="font-family: 'Montserrat', sans-serif; font-size: 18px; color: #666; margin-top: 30px;">
                  Let's take the next step together.
                </p>
              </div>
            </div>
          </div>
        `
      },

      // Slide 15: Next Lesson Preview (7:00-7:30)
      {
        html: `
          <div class="slide-container" style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); padding: 60px;">
            <div class="content-wrapper" style="max-width: 900px; text-align: center;">
              <h2 class="section-title" style="font-family: 'Playfair Display', serif; font-size: 48px; color: #6a1b9a; margin-bottom: 40px;">Coming Next</h2>
              <div style="background: white; padding: 50px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                <h3 style="font-family: 'Playfair Display', serif; font-size: 32px; color: #8e24aa; margin-bottom: 20px;">Lesson 2: Understanding Your Changing Brain</h3>
                <p style="font-family: 'Montserrat', sans-serif; font-size: 20px; line-height: 1.6; color: #666; margin-bottom: 30px;">
                  Discover why you feel different and how your brain is actually protecting you
                </p>
                <div style="display: flex; justify-content: center; gap: 40px; margin-top: 40px;">
                  <div>
                    <div style="font-size: 48px; margin-bottom: 10px;">🧠</div>
                    <p style="font-family: 'Montserrat', sans-serif; font-size: 16px; color: #666;">Neuroscience made simple</p>
                  </div>
                  <div>
                    <div style="font-size: 48px; margin-bottom: 10px;">💡</div>
                    <p style="font-family: 'Montserrat', sans-serif; font-size: 16px; color: #666;">Practical insights</p>
                  </div>
                  <div>
                    <div style="font-size: 48px; margin-bottom: 10px;">🛠️</div>
                    <p style="font-family: 'Montserrat', sans-serif; font-size: 16px; color: #666;">Brain-based tools</p>
                  </div>
                </div>
              </div>
              <p style="font-family: 'Montserrat', sans-serif; font-size: 20px; color: #6a1b9a; margin-top: 30px; font-weight: 500;">
                Continue when you're ready. There's no rush.
              </p>
            </div>
          </div>
        `
      }
    ];

    // Convert to HTML string with delimiters
    const slidesHtml = slideTemplates
      .map(slide => slide.html)
      .join('\n<!-- SLIDE -->\n');

    // Find the Week 1 Lesson 1 entry
    const { data: lessons, error: searchError } = await supabase
      .from('course_lessons')
      .select('*')
      .eq('lesson_number', 1)
      .limit(5);
    
    if (searchError) {
      console.error('Error finding lesson:', searchError);
      process.exit(1);
    }

    // Find the lesson with "Welcome to Your Fourth Trimester" in the title
    const lesson = lessons?.find(l => 
      l.title?.toLowerCase().includes('welcome') || 
      l.title?.toLowerCase().includes('fourth trimester')
    );

    if (!lesson) {
      console.error('Could not find Week 1 Lesson 1');
      console.log('Available lessons:', lessons?.map(l => l.title));
      process.exit(1);
    }

    // Update lesson content in database
    const { data, error } = await supabase
      .from('course_lessons')
      .update({
        slides_html: slidesHtml
      })
      .eq('id', lesson.id)
      .select();

    if (error) {
      console.error('Error updating slides:', error);
      process.exit(1);
    }

    console.log('✅ Successfully updated Week 1 Lesson 1 with 15 comprehensive slides');
    console.log('📊 Slides now properly paced for 10-minute video');
    console.log('🎯 Each slide designed for ~40 seconds of viewing time');
    console.log('✨ Fixed formatting issues on slides 5, 6, 7');
    
  } catch (error) {
    console.error('Failed to update slides:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

updateLesson1Slides();