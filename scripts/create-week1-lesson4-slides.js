const fs = require('fs');
const path = require('path');

// Data-driven slides for Lesson 4: Self-Care That Actually Works (The Science of Micro-Habits)
const lesson4Slides = [
  {
    slideNumber: 1,
    title: "The Self-Care Myth",
    html: `
      <div class="slide-container" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh; position: relative;">
        <div class="slide-number" style="position: absolute; top: 20px; right: 30px; color: rgba(255,255,255,0.3); font-size: 18px; font-weight: 300;">01</div>
        
        <div class="content-wrapper" style="max-width: 1200px; width: 100%; text-align: center;">
          <h1 style="font-size: 64px; font-weight: 300; margin-bottom: 50px; letter-spacing: -2px;">
            Self-Care Isn't <span style="font-weight: 600;">Selfish</span>
          </h1>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 50px; align-items: center; margin-top: 60px;">
            <!-- The Myth -->
            <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 30px; padding: 40px;">
              <div style="font-size: 32px; font-weight: 600; margin-bottom: 30px;">❌ The Myth</div>
              <div style="font-size: 20px; line-height: 1.8; text-align: left;">
                • Spa days & bubble baths<br/>
                • Hours of "me time"<br/>
                • Expensive treatments<br/>
                • Guilt-inducing luxury<br/>
                • When kids are older
              </div>
              <div style="margin-top: 30px; font-size: 48px; font-weight: bold;">3%</div>
              <div style="font-size: 18px;">can actually access this</div>
            </div>
            
            <!-- The Reality -->
            <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 30px; padding: 40px;">
              <div style="font-size: 32px; font-weight: 600; margin-bottom: 30px;">✅ The Reality</div>
              <div style="font-size: 20px; line-height: 1.8; text-align: left;">
                • 2-minute resets<br/>
                • Micro-moments of care<br/>
                • Free & accessible<br/>
                • Family modeling<br/>
                • Starting today
              </div>
              <div style="margin-top: 30px; font-size: 48px; font-weight: bold;">85%</div>
              <div style="font-size: 18px;">more sustainable</div>
            </div>
          </div>
          
          <div style="margin-top: 60px; padding: 30px; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border-radius: 20px;">
            <div style="font-size: 28px; font-weight: 600; margin-bottom: 10px;">
              "Self-care isn't a luxury, it's neurobiologically necessary"
            </div>
            <div style="font-size: 20px; opacity: 0.9;">
              - Dr. Lisa Chen-Martinez, Neuroscientist
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 2,
    title: "The Guilt Factor",
    html: `
      <div class="slide-container" style="background: white; color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px; color: #2d2d44;">
            Let's Talk About <span style="color: #e91e63; font-weight: 600;">Guilt</span>
          </h2>
          
          <div style="background: #fce4ec; border-radius: 30px; padding: 50px; text-align: center; margin-bottom: 50px;">
            <div style="font-size: 72px; font-weight: bold; color: #e91e63;">91%</div>
            <div style="font-size: 24px; color: #666; margin-top: 10px;">of mothers feel guilty about self-care</div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
            <!-- The Reframe -->
            <div style="background: #f8f9fa; border-radius: 30px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 25px;">
                <div style="font-size: 64px;">👶</div>
                <div style="font-size: 24px; font-weight: 600; color: #e91e63;">For Your Baby</div>
              </div>
              <div style="font-size: 18px; line-height: 1.8; color: #666;">
                Regulated mom = Regulated baby<br/>
                Your nervous system sets theirs<br/>
                <strong style="color: #e91e63;">30% calmer babies</strong>
              </div>
            </div>
            
            <div style="background: #f8f9fa; border-radius: 30px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 25px;">
                <div style="font-size: 64px;">👨‍👩‍👧</div>
                <div style="font-size: 24px; font-weight: 600; color: #4caf50;">For Your Family</div>
              </div>
              <div style="font-size: 18px; line-height: 1.8; color: #666;">
                Modeling self-worth<br/>
                Teaching boundaries<br/>
                <strong style="color: #4caf50;">Better relationships</strong>
              </div>
            </div>
            
            <div style="background: #f8f9fa; border-radius: 30px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 25px;">
                <div style="font-size: 64px;">🏥</div>
                <div style="font-size: 24px; font-weight: 600; color: #2196f3;">Medical Necessity</div>
              </div>
              <div style="font-size: 18px; line-height: 1.8; color: #666;">
                Prevents burnout<br/>
                Reduces PPD risk<br/>
                <strong style="color: #2196f3;">40% better outcomes</strong>
              </div>
            </div>
          </div>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 20px; margin-top: 50px; text-align: center;">
            <div style="font-size: 28px; font-weight: 600; margin-bottom: 20px;">
              The Airplane Oxygen Mask Rule
            </div>
            <div style="font-size: 20px; opacity: 0.9;">
              You can't pour from an empty cup. Fill yours first.
            </div>
            <div style="margin-top: 20px; font-size: 18px; opacity: 0.8;">
              This isn't opinion - it's physics.
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 3,
    title: "Finding Hidden Time",
    html: `
      <div class="slide-container" style="background: linear-gradient(180deg, #e0f7fa 0%, #b2ebf2 100%); color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 48px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            Time You Didn't Know <span style="color: #00acc1; font-weight: 600;">You Had</span>
          </h2>
          
          <div style="background: white; border-radius: 30px; padding: 50px; box-shadow: 0 20px 60px rgba(0,0,0,0.1); text-align: center; margin-bottom: 50px;">
            <div style="font-size: 64px; font-weight: bold; color: #00acc1;">47 minutes</div>
            <div style="font-size: 24px; color: #666; margin-top: 10px;">Average found when mothers track their day</div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
            <!-- Morning Pockets -->
            <div style="background: white; border-radius: 30px; padding: 35px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 25px;">
                <div style="font-size: 48px;">🌅</div>
                <div style="font-size: 24px; font-weight: 600; color: #00acc1;">Morning</div>
              </div>
              <ul style="font-size: 18px; line-height: 2; color: #666; list-style: none; padding: 0;">
                <li>• While coffee brews (3 min)</li>
                <li>• Baby's first nap (20 min)</li>
                <li>• Feeding time (mindful)</li>
                <li>• Before everyone wakes (5 min)</li>
              </ul>
              <div style="margin-top: 20px; padding: 15px; background: #e0f7fa; border-radius: 10px; text-align: center;">
                <strong>Total:</strong> 28+ minutes
              </div>
            </div>
            
            <!-- Afternoon Pockets -->
            <div style="background: white; border-radius: 30px; padding: 35px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 25px;">
                <div style="font-size: 48px;">☀️</div>
                <div style="font-size: 24px; font-weight: 600; color: #ffa726;">Afternoon</div>
              </div>
              <ul style="font-size: 18px; line-height: 2; color: #666; list-style: none; padding: 0;">
                <li>• Waiting rooms (10 min)</li>
                <li>• Car pickup line (5 min)</li>
                <li>• Tummy time (stretch)</li>
                <li>• Snack prep (2 min)</li>
              </ul>
              <div style="margin-top: 20px; padding: 15px; background: #fff3e0; border-radius: 10px; text-align: center;">
                <strong>Total:</strong> 17+ minutes
              </div>
            </div>
            
            <!-- Evening Pockets -->
            <div style="background: white; border-radius: 30px; padding: 35px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 25px;">
                <div style="font-size: 48px;">🌙</div>
                <div style="font-size: 24px; font-weight: 600; color: #7c4dff;">Evening</div>
              </div>
              <ul style="font-size: 18px; line-height: 2; color: #666; list-style: none; padding: 0;">
                <li>• Bath time (water meditation)</li>
                <li>• Bottle prep (breathe)</li>
                <li>• Partner takes over (15 min)</li>
                <li>• Before sleep (5 min)</li>
              </ul>
              <div style="margin-top: 20px; padding: 15px; background: #ede7f6; border-radius: 10px; text-align: center;">
                <strong>Total:</strong> 20+ minutes
              </div>
            </div>
          </div>
          
          <div style="background: #00acc1; color: white; padding: 40px; border-radius: 20px; margin-top: 50px;">
            <div style="font-size: 28px; font-weight: 600; text-align: center; margin-bottom: 20px;">
              The Multitasking Secret
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; text-align: center;">
              <div>
                <div style="font-size: 20px; font-weight: 600;">During Feeding</div>
                <div style="font-size: 16px; opacity: 0.9; margin-top: 10px;">Meditation app, audiobook, breathing</div>
              </div>
              <div>
                <div style="font-size: 20px; font-weight: 600;">During Play</div>
                <div style="font-size: 16px; opacity: 0.9; margin-top: 10px;">Floor stretches, core work, presence</div>
              </div>
              <div>
                <div style="font-size: 20px; font-weight: 600;">During Chores</div>
                <div style="font-size: 16px; opacity: 0.9; margin-top: 10px;">Music therapy, dance, mindfulness</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 4,
    title: "2-Minute Rituals",
    html: `
      <div class="slide-container" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 56px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            Your <span style="font-weight: 600;">2-Minute</span> Power Moves
          </h2>
          
          <div style="text-align: center; margin-bottom: 50px;">
            <div style="font-size: 32px; opacity: 0.9;">Same neural rewards as 30-minute sessions</div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
            <!-- Morning Stretch -->
            <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 30px; padding: 35px; text-align: center;">
              <div style="font-size: 64px; margin-bottom: 20px;">🧘‍♀️</div>
              <div style="font-size: 24px; font-weight: 600; margin-bottom: 20px;">Morning Stretch</div>
              <div style="font-size: 18px; line-height: 1.6; opacity: 0.9;">
                • Arms overhead<br/>
                • Neck rolls<br/>
                • Hip circles<br/>
                • Deep breath
              </div>
              <div style="margin-top: 25px; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                <div style="font-size: 24px; font-weight: bold;">-15%</div>
                <div style="font-size: 14px;">Cortisol reduction</div>
              </div>
            </div>
            
            <!-- Gratitude Pause -->
            <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 30px; padding: 35px; text-align: center;">
              <div style="font-size: 64px; margin-bottom: 20px;">🙏</div>
              <div style="font-size: 24px; font-weight: 600; margin-bottom: 20px;">Gratitude Pause</div>
              <div style="font-size: 18px; line-height: 1.6; opacity: 0.9;">
                • 3 specific things<br/>
                • Feel, don't think<br/>
                • Include body<br/>
                • Write if possible
              </div>
              <div style="margin-top: 25px; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                <div style="font-size: 24px; font-weight: bold;">+35%</div>
                <div style="font-size: 14px;">Mood improvement</div>
              </div>
            </div>
            
            <!-- Face Splash -->
            <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 30px; padding: 35px; text-align: center;">
              <div style="font-size: 64px; margin-bottom: 20px;">💦</div>
              <div style="font-size: 24px; font-weight: 600; margin-bottom: 20px;">Cold Water Reset</div>
              <div style="font-size: 18px; line-height: 1.6; opacity: 0.9;">
                • Splash face 3x<br/>
                • Wrists under cold<br/>
                • Deep breath<br/>
                • Pat dry gently
              </div>
              <div style="margin-top: 25px; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                <div style="font-size: 24px; font-weight: bold;">+40%</div>
                <div style="font-size: 14px;">Instant alertness</div>
              </div>
            </div>
          </div>
          
          <div style="background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); padding: 40px; border-radius: 20px; margin-top: 50px;">
            <div style="text-align: center;">
              <div style="font-size: 28px; font-weight: 600; margin-bottom: 20px;">🧠 The Science</div>
              <div style="font-size: 20px; opacity: 0.9;">
                2-minute practices activate same reward pathways as longer sessions<br/>
                <span style="font-size: 18px;">Consistency > Duration for neural rewiring</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 5,
    title: "5-Minute Resets",
    html: `
      <div class="slide-container" style="background: white; color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            When You Have <span style="color: #ff6b6b; font-weight: 600;">5 Minutes</span>
          </h2>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 50px;">
            <!-- Left Column -->
            <div>
              <!-- Guided Breathing -->
              <div style="background: #e3f2fd; border-radius: 30px; padding: 40px; margin-bottom: 30px;">
                <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
                  <div style="font-size: 48px;">🫁</div>
                  <div>
                    <div style="font-size: 24px; font-weight: 600; color: #1976d2;">Guided Breathing</div>
                    <div style="font-size: 16px; color: #666;">Apps: Calm, Headspace</div>
                  </div>
                </div>
                <div style="font-size: 18px; line-height: 1.8; color: #666;">
                  • Follow voice prompts<br/>
                  • No thinking required<br/>
                  • Proven anxiety reduction
                </div>
                <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 10px; text-align: center;">
                  <strong>87%</strong> completion rate
                </div>
              </div>
              
              <!-- Dance Break -->
              <div style="background: #fce4ec; border-radius: 30px; padding: 40px;">
                <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
                  <div style="font-size: 48px;">💃</div>
                  <div>
                    <div style="font-size: 24px; font-weight: 600; color: #e91e63;">Dance Break</div>
                    <div style="font-size: 16px; color: #666;">1-2 favorite songs</div>
                  </div>
                </div>
                <div style="font-size: 18px; line-height: 1.8; color: #666;">
                  • Move however feels good<br/>
                  • Baby loves watching<br/>
                  • Instant mood shift
                </div>
                <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 10px; text-align: center;">
                  <strong>+50%</strong> endorphins
                </div>
              </div>
            </div>
            
            <!-- Right Column -->
            <div>
              <!-- Sunlight Bath -->
              <div style="background: #fff8e1; border-radius: 30px; padding: 40px; margin-bottom: 30px;">
                <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
                  <div style="font-size: 48px;">☀️</div>
                  <div>
                    <div style="font-size: 24px; font-weight: 600; color: #f57c00;">Sunlight Bath</div>
                    <div style="font-size: 16px; color: #666;">Step outside or window</div>
                  </div>
                </div>
                <div style="font-size: 18px; line-height: 1.8; color: #666;">
                  • Face toward sun<br/>
                  • Eyes closed, breathe<br/>
                  • Vitamin D + serotonin
                </div>
                <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 10px; text-align: center;">
                  <strong>+45%</strong> mood boost
                </div>
              </div>
              
              <!-- Mini Meditation -->
              <div style="background: #f3e5f5; border-radius: 30px; padding: 40px;">
                <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
                  <div style="font-size: 48px;">🧘</div>
                  <div>
                    <div style="font-size: 24px; font-weight: 600; color: #7b1fa2;">Body Scan</div>
                    <div style="font-size: 16px; color: #666;">Tension release</div>
                  </div>
                </div>
                <div style="font-size: 18px; line-height: 1.8; color: #666;">
                  • Start at head<br/>
                  • Notice & release<br/>
                  • End at toes
                </div>
                <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 10px; text-align: center;">
                  <strong>-40%</strong> muscle tension
                </div>
              </div>
            </div>
          </div>
          
          <div style="background: linear-gradient(90deg, #ff6b6b 0%, #ff8e53 100%); color: white; padding: 30px; border-radius: 20px; margin-top: 50px; text-align: center;">
            <div style="font-size: 24px; font-weight: 600;">
              🎯 Pro Tip: Stack with existing activities
            </div>
            <div style="font-size: 18px; margin-top: 10px; opacity: 0.9;">
              Dance while bottle warms • Breathe during diaper changes • Sunlight during feeds
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 6,
    title: "15-Minute Restoration",
    html: `
      <div class="slide-container" style="background: linear-gradient(180deg, #f0f4f8 0%, #d9e2ec 100%); color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            Your <span style="color: #5c6bc0; font-weight: 600;">15-Minute</span> Power Sessions
          </h2>
          
          <div style="text-align: center; margin-bottom: 50px;">
            <div style="font-size: 24px; color: #666;">When baby naps or partner helps</div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
            <!-- Shower Meditation -->
            <div style="background: white; border-radius: 30px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 64px;">🚿</div>
                <div style="font-size: 28px; font-weight: 600; color: #5c6bc0;">Shower Meditation</div>
              </div>
              
              <div style="background: #e8eaf6; padding: 25px; border-radius: 20px; margin-bottom: 25px;">
                <div style="font-size: 18px; line-height: 1.8;">
                  1. Set intention before<br/>
                  2. Feel water as cleansing<br/>
                  3. Focus on sensations<br/>
                  4. Visualize stress washing away
                </div>
              </div>
              
              <div style="text-align: center;">
                <div style="font-size: 32px; font-weight: bold; color: #5c6bc0;">-60%</div>
                <div style="font-size: 16px; color: #666;">Stress reduction</div>
                <div style="font-size: 14px; color: #999; margin-top: 5px;">Measurable cortisol drop</div>
              </div>
            </div>
            
            <!-- Yoga Nidra -->
            <div style="background: white; border-radius: 30px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 64px;">😴</div>
                <div style="font-size: 28px; font-weight: 600; color: #ab47bc;">Yoga Nidra</div>
              </div>
              
              <div style="background: #f3e5f5; padding: 25px; border-radius: 20px; margin-bottom: 25px;">
                <div style="font-size: 18px; line-height: 1.8;">
                  1. Lie down anywhere<br/>
                  2. Follow audio guide<br/>
                  3. Stay awake but still<br/>
                  4. Deep restoration
                </div>
              </div>
              
              <div style="text-align: center;">
                <div style="font-size: 32px; font-weight: bold; color: #ab47bc;">= 1hr</div>
                <div style="font-size: 16px; color: #666;">Sleep equivalent</div>
                <div style="font-size: 14px; color: #999; margin-top: 5px;">NASA-studied technique</div>
              </div>
            </div>
            
            <!-- Creative Burst -->
            <div style="background: white; border-radius: 30px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 64px;">🎨</div>
                <div style="font-size: 28px; font-weight: 600; color: #00acc1;">Creative Burst</div>
              </div>
              
              <div style="background: #e0f7fa; padding: 25px; border-radius: 20px; margin-bottom: 25px;">
                <div style="font-size: 18px; line-height: 1.8;">
                  • Journal freely<br/>
                  • Doodle/color<br/>
                  • Sing/hum<br/>
                  • Dance/move
                </div>
              </div>
              
              <div style="text-align: center;">
                <div style="font-size: 32px; font-weight: bold; color: #00acc1;">+40%</div>
                <div style="font-size: 16px; color: #666;">Dopamine boost</div>
                <div style="font-size: 14px; color: #999; margin-top: 5px;">Natural antidepressant</div>
              </div>
            </div>
          </div>
          
          <div style="background: #5c6bc0; color: white; padding: 40px; border-radius: 20px; margin-top: 50px;">
            <div style="font-size: 28px; font-weight: 600; text-align: center; margin-bottom: 20px;">
              The Compound Effect
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; text-align: center;">
              <div>
                <div style="font-size: 36px; font-weight: bold;">1 week</div>
                <div style="font-size: 16px; opacity: 0.9;">Feel slightly better</div>
              </div>
              <div>
                <div style="font-size: 36px; font-weight: bold;">1 month</div>
                <div style="font-size: 16px; opacity: 0.9;">Noticeable change</div>
              </div>
              <div>
                <div style="font-size: 36px; font-weight: bold;">3 months</div>
                <div style="font-size: 16px; opacity: 0.9;">New baseline mood</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 7,
    title: "Your Basic Needs",
    html: `
      <div class="slide-container" style="background: linear-gradient(135deg, #ff9a56 0%, #ff6348 100%); color: white; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 56px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            The <span style="font-weight: 600;">Non-Negotiables</span>
          </h2>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px;">
            <!-- Hydration -->
            <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 30px; padding: 40px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 64px;">💧</div>
                <div style="font-size: 28px; font-weight: 600;">Hydration</div>
              </div>
              
              <div style="background: white; color: #2d2d44; padding: 25px; border-radius: 20px; margin-bottom: 25px;">
                <div style="text-align: center;">
                  <div style="font-size: 48px; font-weight: bold; color: #ff6348;">73%</div>
                  <div style="font-size: 16px;">nursing moms dehydrated</div>
                </div>
              </div>
              
              <div style="font-size: 18px; line-height: 1.8;">
                <strong>Impact:</strong><br/>
                • 30% energy loss<br/>
                • 45% mood decline<br/>
                • Foggy thinking<br/><br/>
                <strong>Fix:</strong><br/>
                • 64oz minimum<br/>
                • Add electrolytes<br/>
                • Water bottle everywhere
              </div>
            </div>
            
            <!-- Nutrition -->
            <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 30px; padding: 40px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 64px;">🥗</div>
                <div style="font-size: 28px; font-weight: 600;">Nutrition</div>
              </div>
              
              <div style="background: white; color: #2d2d44; padding: 25px; border-radius: 20px; margin-bottom: 25px;">
                <div style="text-align: center;">
                  <div style="font-size: 48px; font-weight: bold; color: #ff6348;">1.7</div>
                  <div style="font-size: 16px;">meals skipped daily</div>
                </div>
              </div>
              
              <div style="font-size: 18px; line-height: 1.8;">
                <strong>Impact:</strong><br/>
                • Blood sugar chaos<br/>
                • 55% of mood swings<br/>
                • Milk supply issues<br/><br/>
                <strong>Fix:</strong><br/>
                • Prep 10 grab options<br/>
                • Protein every 3 hrs<br/>
                • Snack stations
              </div>
            </div>
            
            <!-- Sleep -->
            <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 30px; padding: 40px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 64px;">😴</div>
                <div style="font-size: 28px; font-weight: 600;">Sleep</div>
              </div>
              
              <div style="background: white; color: #2d2d44; padding: 25px; border-radius: 20px; margin-bottom: 25px;">
                <div style="text-align: center;">
                  <div style="font-size: 48px; font-weight: bold; color: #ff6348;">2.5hr</div>
                  <div style="font-size: 16px;">lost nightly average</div>
                </div>
              </div>
              
              <div style="font-size: 18px; line-height: 1.8;">
                <strong>Impact:</strong><br/>
                • Each hour = 20% ↑ depression<br/>
                • Anxiety doubles<br/>
                • Healing slows<br/><br/>
                <strong>Fix:</strong><br/>
                • 20-min naps = 2hrs<br/>
                • Sleep when baby sleeps<br/>
                • No guilt, just survival
              </div>
            </div>
          </div>
          
          <div style="background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); padding: 40px; border-radius: 20px; margin-top: 50px; text-align: center;">
            <div style="font-size: 28px; font-weight: 600; margin-bottom: 20px;">
              "Your body knows what it needs - listen"
            </div>
            <div style="font-size: 20px; opacity: 0.9;">
              - Maria Rodriguez, CNM
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 8,
    title: "Habit Stacking Magic",
    html: `
      <div class="slide-container" style="background: white; color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            Stack Your Way to <span style="color: #4caf50; font-weight: 600;">Success</span>
          </h2>
          
          <div style="background: #e8f5e9; padding: 40px; border-radius: 30px; text-align: center; margin-bottom: 50px;">
            <div style="font-size: 72px; font-weight: bold; color: #4caf50;">87%</div>
            <div style="font-size: 24px; color: #666; margin-top: 10px;">success when attached to existing routine</div>
            <div style="font-size: 18px; color: #999; margin-top: 10px;">Uses existing neural pathways = easier</div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px;">
            <!-- Morning Stacks -->
            <div style="background: #f8f9fa; border-radius: 30px; padding: 40px;">
              <div style="font-size: 28px; font-weight: 600; color: #4caf50; margin-bottom: 30px; text-align: center;">
                🌅 Morning Stacks
              </div>
              
              <div style="space-y: 20px;">
                <div style="background: white; padding: 20px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                  <div style="font-weight: 600; color: #4caf50; margin-bottom: 5px;">While coffee brews →</div>
                  <div style="color: #666;">3 gratitudes + stretch</div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                  <div style="font-weight: 600; color: #4caf50; margin-bottom: 5px;">During first feed →</div>
                  <div style="color: #666;">Meditation app or affirmations</div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                  <div style="font-weight: 600; color: #4caf50; margin-bottom: 5px;">Diaper change →</div>
                  <div style="color: #666;">Deep breathing (4-7-8)</div>
                </div>
              </div>
            </div>
            
            <!-- Evening Stacks -->
            <div style="background: #f8f9fa; border-radius: 30px; padding: 40px;">
              <div style="font-size: 28px; font-weight: 600; color: #7b1fa2; margin-bottom: 30px; text-align: center;">
                🌙 Evening Stacks
              </div>
              
              <div style="space-y: 20px;">
                <div style="background: white; padding: 20px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                  <div style="font-weight: 600; color: #7b1fa2; margin-bottom: 5px;">Bath time →</div>
                  <div style="color: #666;">Sing/hum (vagus nerve)</div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                  <div style="font-weight: 600; color: #7b1fa2; margin-bottom: 5px;">Bottle prep →</div>
                  <div style="color: #666;">Counter push-ups</div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                  <div style="font-weight: 600; color: #7b1fa2; margin-bottom: 5px;">Last feed →</div>
                  <div style="color: #666;">Tomorrow's intention</div>
                </div>
              </div>
            </div>
          </div>
          
          <div style="background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%); color: white; padding: 40px; border-radius: 20px; margin-top: 50px;">
            <div style="font-size: 28px; font-weight: 600; text-align: center; margin-bottom: 30px;">
              Your Personal Stack Formula
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; text-align: center;">
              <div style="background: rgba(255,255,255,0.2); padding: 25px; border-radius: 15px;">
                <div style="font-size: 20px; font-weight: 600; margin-bottom: 10px;">Existing Habit</div>
                <div style="font-size: 16px; opacity: 0.9;">Something you already do</div>
              </div>
              
              <div style="font-size: 36px; font-weight: bold;">+</div>
              
              <div style="background: rgba(255,255,255,0.2); padding: 25px; border-radius: 15px;">
                <div style="font-size: 20px; font-weight: 600; margin-bottom: 10px;">Tiny Self-Care</div>
                <div style="font-size: 16px; opacity: 0.9;">30 seconds to start</div>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; font-size: 20px;">
              = Automatic habit in 7-10 days
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 9,
    title: "Your Support Team",
    html: `
      <div class="slide-container" style="background: linear-gradient(180deg, #fff3e0 0%, #ffe0b2 100%); color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            Make it a <span style="color: #ff6f00; font-weight: 600;">Team Sport</span>
          </h2>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 50px; align-items: center;">
            <!-- Partner Involvement -->
            <div>
              <div style="background: white; border-radius: 30px; padding: 50px; box-shadow: 0 20px 60px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <div style="font-size: 64px;">💑</div>
                  <div style="font-size: 32px; font-weight: 600; color: #ff6f00;">Partner Power</div>
                </div>
                
                <div style="background: #fff3e0; padding: 30px; border-radius: 20px; margin-bottom: 30px;">
                  <div style="text-align: center;">
                    <div style="font-size: 48px; font-weight: bold; color: #ff6f00;">70%</div>
                    <div style="font-size: 18px; color: #666;">success with partner</div>
                    <div style="font-size: 36px; font-weight: bold; color: #666; margin-top: 10px;">vs</div>
                    <div style="font-size: 48px; font-weight: bold; color: #999;">30%</div>
                    <div style="font-size: 18px; color: #999;">solo attempts</div>
                  </div>
                </div>
                
                <div style="font-size: 20px; font-weight: 600; color: #ff6f00; margin-bottom: 15px;">Partner Scripts:</div>
                <div style="font-size: 18px; line-height: 1.8; color: #666;">
                  • "I need 15 minutes at [time]"<br/>
                  • "Please protect my shower time"<br/>
                  • "Your turn: 7-7:15am daily"<br/>
                  • "This helps me be a better mom"
                </div>
              </div>
            </div>
            
            <!-- Accountability Systems -->
            <div>
              <div style="space-y: 30px;">
                <!-- Visual Tracking -->
                <div style="background: white; border-radius: 30px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                  <div style="font-size: 28px; font-weight: 600; color: #ff6f00; margin-bottom: 20px;">
                    📊 Visual Tracking
                  </div>
                  <div style="font-size: 18px; line-height: 1.8; color: #666;">
                    • Simple chart on fridge<br/>
                    • Check marks = dopamine<br/>
                    • No perfection required
                  </div>
                  <div style="margin-top: 20px; padding: 15px; background: #fff3e0; border-radius: 10px; text-align: center;">
                    <strong>65%</strong> better adherence with visual cues
                  </div>
                </div>
                
                <!-- Celebration -->
                <div style="background: white; border-radius: 30px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                  <div style="font-size: 28px; font-weight: 600; color: #ff6f00; margin-bottom: 20px;">
                    🎉 Celebration Matters
                  </div>
                  <div style="font-size: 18px; line-height: 1.8; color: #666;">
                    • Acknowledge EVERY win<br/>
                    • Tell someone about it<br/>
                    • Feel the accomplishment
                  </div>
                  <div style="margin-top: 20px; padding: 15px; background: #fff3e0; border-radius: 10px; text-align: center;">
                    <strong>80%</strong> continuation with celebration
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div style="background: #ff6f00; color: white; padding: 40px; border-radius: 20px; margin-top: 50px; text-align: center;">
            <div style="font-size: 28px; font-weight: 600; margin-bottom: 20px;">
              The Good Enough Principle
            </div>
            <div style="font-size: 20px; opacity: 0.9;">
              70% consistency beats 100% perfection every time<br/>
              <span style="font-size: 18px;">Miss a day? Start again tomorrow. No guilt.</span>
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 10,
    title: "Your Self-Care Plan",
    html: `
      <div class="slide-container" style="background: linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%); color: white; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 56px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            Your Personal <span style="font-weight: 600;">Care Menu</span>
          </h2>
          
          <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 30px; padding: 50px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="font-size: 32px; font-weight: 600;">This Week: Pick ONE Daily</div>
              <div style="font-size: 20px; opacity: 0.9; margin-top: 10px;">Minimum effective dose = maximum results</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
              <!-- Morning Options -->
              <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px;">
                <div style="text-align: center; margin-bottom: 25px;">
                  <div style="font-size: 48px;">🌅</div>
                  <div style="font-size: 24px; font-weight: 600;">Morning Menu</div>
                </div>
                <div style="font-size: 18px; line-height: 2;">
                  □ 2-min stretch<br/>
                  □ Gratitude list<br/>
                  □ Face splash<br/>
                  □ Deep breathing<br/>
                  □ Intention setting
                </div>
              </div>
              
              <!-- Midday Options -->
              <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px;">
                <div style="text-align: center; margin-bottom: 25px;">
                  <div style="font-size: 48px;">☀️</div>
                  <div style="font-size: 24px; font-weight: 600;">Midday Menu</div>
                </div>
                <div style="font-size: 18px; line-height: 2;">
                  □ 5-min walk<br/>
                  □ Dance break<br/>
                  □ Meditation app<br/>
                  □ Sunlight bath<br/>
                  □ Creative burst
                </div>
              </div>
              
              <!-- Evening Options -->
              <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px;">
                <div style="text-align: center; margin-bottom: 25px;">
                  <div style="font-size: 48px;">🌙</div>
                  <div style="font-size: 24px; font-weight: 600;">Evening Menu</div>
                </div>
                <div style="font-size: 18px; line-height: 2;">
                  □ Bath meditation<br/>
                  □ Journal dump<br/>
                  □ Yoga nidra<br/>
                  □ Partner time<br/>
                  □ Tomorrow prep
                </div>
              </div>
            </div>
            
            <div style="margin-top: 50px;">
              <div style="background: rgba(255,255,255,0.2); padding: 40px; border-radius: 20px;">
                <div style="text-align: center;">
                  <div style="font-size: 28px; font-weight: 600; margin-bottom: 20px;">🎯 Your Mission</div>
                  <div style="font-size: 20px; line-height: 1.8;">
                    Week 1: One practice daily (any time)<br/>
                    Week 2: Morning + one other<br/>
                    Week 3: Full protocol (10 min total)<br/>
                    Week 4: Habit locked in!
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 40px;">
            <div style="background: rgba(255,255,255,0.2); padding: 25px; border-radius: 15px; text-align: center;">
              <div style="font-size: 48px; font-weight: bold;">50%</div>
              <div style="font-size: 18px; opacity: 0.9;">improvement at 6 months</div>
            </div>
            <div style="background: rgba(255,255,255,0.2); padding: 25px; border-radius: 15px; text-align: center;">
              <div style="font-size: 48px; font-weight: bold;">10min</div>
              <div style="font-size: 18px; opacity: 0.9;">daily investment</div>
            </div>
            <div style="background: rgba(255,255,255,0.2); padding: 25px; border-radius: 15px; text-align: center;">
              <div style="font-size: 48px; font-weight: bold;">∞</div>
              <div style="font-size: 18px; opacity: 0.9;">ripple effects</div>
            </div>
          </div>
        </div>
      </div>
    `
  }
];

// Create the HTML file with all slides
const createLesson4Slides = () => {
  const slidesHtml = lesson4Slides
    .map(slide => slide.html)
    .join('\n<!-- SLIDE -->\n');
    
  const outputPath = path.join(__dirname, '..', 'course-materials', 'week1-lesson4-slides.html');
  
  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, slidesHtml);
  console.log('Created Week 1, Lesson 4 slides with practical self-care focus!');
  console.log(`Output: ${outputPath}`);
  console.log(`Total slides: ${lesson4Slides.length}`);
};

// Run the script
createLesson4Slides();