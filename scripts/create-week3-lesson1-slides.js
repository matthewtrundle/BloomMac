const fs = require('fs');
const path = require('path');

// Week 3, Lesson 1: Partner Communication
// Integrating partner education and co-regulation science
const week3Lesson1Slides = [
  {
    slideNumber: 1,
    title: "The Communication Breakdown",
    html: `
      <div class="slide-container" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh; position: relative;">
        <div class="slide-number" style="position: absolute; top: 20px; right: 30px; color: rgba(255,255,255,0.3); font-size: 18px; font-weight: 300;">01</div>
        
        <div class="content-wrapper" style="max-width: 1200px; width: 100%; text-align: center;">
          <h1 style="font-size: 64px; font-weight: 300; margin-bottom: 50px; letter-spacing: -2px;">
            When Love <span style="font-weight: 600;">Isn't Enough</span>
          </h1>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-bottom: 60px;">
            <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 40px; border-radius: 30px;">
              <div style="font-size: 72px; font-weight: bold; margin-bottom: 20px;">67%</div>
              <div style="font-size: 20px;">Relationship satisfaction drops</div>
              <div style="font-size: 16px; opacity: 0.8; margin-top: 10px;">In first year postpartum</div>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 40px; border-radius: 30px;">
              <div style="font-size: 72px; font-weight: bold; margin-bottom: 20px;">8min</div>
              <div style="font-size: 20px;">Average daily couple talk</div>
              <div style="font-size: 16px; opacity: 0.8; margin-top: 10px;">Down from 2+ hours pre-baby</div>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 40px; border-radius: 30px;">
              <div style="font-size: 72px; font-weight: bold; margin-bottom: 20px;">93%</div>
              <div style="font-size: 20px;">Feel misunderstood</div>
              <div style="font-size: 16px; opacity: 0.8; margin-top: 10px;">By their partner daily</div>
            </div>
          </div>
          
          <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); padding: 40px; border-radius: 30px;">
            <div style="font-size: 28px; font-weight: 600; margin-bottom: 20px;">
              The Hidden Truth
            </div>
            <div style="font-size: 22px; line-height: 1.6; opacity: 0.9;">
              You're not falling out of love.<br/>
              You're speaking different languages.
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 2,
    title: "The Gottman Research",
    html: `
      <div class="slide-container" style="background: white; color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            What <span style="color: #3b82f6; font-weight: 600;">40 Years</span> of Research Shows
          </h2>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 50px; align-items: center;">
            <div>
              <div style="background: #eff6ff; border-radius: 30px; padding: 40px;">
                <div style="font-size: 32px; font-weight: 600; color: #3b82f6; margin-bottom: 30px;">The Magic Ratio</div>
                
                <div style="text-align: center; margin-bottom: 30px;">
                  <div style="font-size: 96px; font-weight: bold; color: #3b82f6;">5:1</div>
                  <div style="font-size: 24px; color: #666;">Positive to Negative Interactions</div>
                </div>
                
                <div style="background: white; padding: 25px; border-radius: 20px;">
                  <div style="font-size: 20px; line-height: 1.8; color: #666;">
                    Happy couples have 5 positive interactions for every negative one.<br/><br/>
                    New parents average: <span style="font-weight: bold; color: #dc2626;">1:5</span><br/>
                    <span style="font-size: 16px; color: #999;">One positive for every 5 negative</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div style="background: #dbeafe; border-radius: 30px; padding: 40px;">
                <div style="font-size: 28px; font-weight: 600; color: #2563eb; margin-bottom: 30px;">The Four Horsemen</div>
                
                <div style="space-y: 20px;">
                  <div style="background: white; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 20px; font-weight: 600; color: #dc2626;">1. Criticism</div>
                    <div style="font-size: 16px; color: #666;">"You never help" vs "I need more support"</div>
                  </div>
                  
                  <div style="background: white; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 20px; font-weight: 600; color: #dc2626;">2. Contempt</div>
                    <div style="font-size: 16px; color: #666;">Eye rolls, sarcasm, superiority</div>
                  </div>
                  
                  <div style="background: white; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 20px; font-weight: 600; color: #dc2626;">3. Defensiveness</div>
                    <div style="font-size: 16px; color: #666;">Playing victim, counter-attacking</div>
                  </div>
                  
                  <div style="background: white; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 20px; font-weight: 600; color: #dc2626;">4. Stonewalling</div>
                    <div style="font-size: 16px; color: #666;">Shutting down, withdrawing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; border-radius: 20px; margin-top: 40px; text-align: center;">
            <div style="font-size: 24px; font-weight: 600;">
              Couples who master communication have 94% chance of staying together
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 3,
    title: "The New Parent Dynamic",
    html: `
      <div class="slide-container" style="background: linear-gradient(180deg, #fee2e2 0%, #fecaca 100%); color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            Why Everything <span style="color: #dc2626; font-weight: 600;">Changed</span>
          </h2>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; margin-bottom: 40px;">
            <!-- Her Experience -->
            <div style="background: white; border-radius: 30px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.08);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 48px;">👩</div>
                <div style="font-size: 28px; font-weight: 600; color: #ec4899;">Her Reality</div>
              </div>
              
              <div style="space-y: 20px;">
                <div style="background: #fce7f3; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; color: #666;">
                    <strong>Touched out</strong> - Physical contact feels overwhelming
                  </div>
                </div>
                
                <div style="background: #fce7f3; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; color: #666;">
                    <strong>Invisible labor</strong> - Mental load feels crushing
                  </div>
                </div>
                
                <div style="background: #fce7f3; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; color: #666;">
                    <strong>Identity crisis</strong> - "I don't know who I am"
                  </div>
                </div>
                
                <div style="background: #fce7f3; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; color: #666;">
                    <strong>Hypervigilance</strong> - Can't turn off "mom brain"
                  </div>
                </div>
              </div>
              
              <div style="margin-top: 30px; text-align: center;">
                <div style="font-size: 32px; font-weight: bold; color: #ec4899;">78%</div>
                <div style="font-size: 16px; color: #666;">Feel partner "doesn't get it"</div>
              </div>
            </div>
            
            <!-- His Experience -->
            <div style="background: white; border-radius: 30px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.08);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 48px;">👨</div>
                <div style="font-size: 28px; font-weight: 600; color: #3b82f6;">His Reality</div>
              </div>
              
              <div style="space-y: 20px;">
                <div style="background: #dbeafe; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; color: #666;">
                    <strong>Rejected</strong> - Intimacy attempts rebuffed
                  </div>
                </div>
                
                <div style="background: #dbeafe; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; color: #666;">
                    <strong>Helpless</strong> - "I can't do anything right"
                  </div>
                </div>
                
                <div style="background: #dbeafe; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; color: #666;">
                    <strong>Provider pressure</strong> - Financial stress amplified
                  </div>
                </div>
                
                <div style="background: #dbeafe; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; color: #666;">
                    <strong>Lost connection</strong> - "I miss us"
                  </div>
                </div>
              </div>
              
              <div style="margin-top: 30px; text-align: center;">
                <div style="font-size: 32px; font-weight: bold; color: #3b82f6;">71%</div>
                <div style="font-size: 16px; color: #666;">Feel like "just a paycheck"</div>
              </div>
            </div>
          </div>
          
          <div style="background: #f3f4f6; padding: 40px; border-radius: 30px; text-align: center;">
            <div style="font-size: 28px; font-weight: 600; color: #374151; margin-bottom: 20px;">
              The Gap
            </div>
            <div style="font-size: 20px; color: #666; line-height: 1.6;">
              Both struggling. Both valid. Both need understanding.<br/>
              <strong>The enemy isn't each other - it's the transition.</strong>
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 4,
    title: "The Division of Labor",
    html: `
      <div class="slide-container" style="background: white; color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            The <span style="color: #f59e0b; font-weight: 600;">Invisible</span> vs <span style="color: #3b82f6; font-weight: 600;">Visible</span>
          </h2>
          
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); border-radius: 30px; padding: 50px; margin-bottom: 40px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="font-size: 32px; font-weight: 600; color: #92400e;">The 2 AM Test</div>
              <div style="font-size: 20px; color: #78350f; margin-top: 10px;">Who wakes up when baby cries?</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; text-align: center;">
              <div style="background: white; border-radius: 20px; padding: 30px;">
                <div style="font-size: 48px; font-weight: bold; color: #f59e0b;">87%</div>
                <div style="font-size: 18px; color: #666;">Mothers wake first</div>
                <div style="font-size: 16px; color: #999; margin-top: 10px;">Even when "taking turns"</div>
              </div>
              
              <div style="background: white; border-radius: 20px; padding: 30px;">
                <div style="font-size: 48px; font-weight: bold; color: #dc2626;">21hrs</div>
                <div style="font-size: 18px; color: #666;">Weekly invisible labor gap</div>
                <div style="font-size: 16px; color: #999; margin-top: 10px;">Planning, worrying, managing</div>
              </div>
              
              <div style="background: white; border-radius: 20px; padding: 30px;">
                <div style="font-size: 48px; font-weight: bold; color: #7c3aed;">73%</div>
                <div style="font-size: 18px; color: #666;">Of conflict about chores</div>
                <div style="font-size: 16px; color: #999; margin-top: 10px;">Is actually about recognition</div>
              </div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px;">
            <div style="background: #fee2e2; border-radius: 30px; padding: 40px;">
              <div style="font-size: 24px; font-weight: 600; color: #dc2626; margin-bottom: 25px;">Invisible Labor Includes:</div>
              <div style="font-size: 18px; line-height: 2; color: #666;">
                • Tracking feeding schedules<br/>
                • Noticing diaper supply<br/>
                • Researching milestones<br/>
                • Planning doctor visits<br/>
                • Managing sleep schedules<br/>
                • Emotional regulation for baby<br/>
                • Anticipating needs<br/>
                • Worrying at 3 AM
              </div>
            </div>
            
            <div style="background: #dbeafe; border-radius: 30px; padding: 40px;">
              <div style="font-size: 24px; font-weight: 600; color: #2563eb; margin-bottom: 25px;">Making It Visible:</div>
              <ol style="font-size: 18px; line-height: 2; color: #666;">
                <li>List EVERYTHING you do</li>
                <li>Include mental tasks</li>
                <li>Share without blame</li>
                <li>Divide by preference/skill</li>
                <li>Own full categories</li>
                <li>Regular check-ins</li>
                <li>Appreciate often</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 5,
    title: "Magic Phrases That Work",
    html: `
      <div class="slide-container" style="background: linear-gradient(180deg, #dcfce7 0%, #bbf7d0 100%); color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            Words That <span style="color: #16a34a; font-weight: 600;">Bridge</span> the Gap
          </h2>
          
          <div style="background: white; border-radius: 30px; padding: 50px; box-shadow: 0 20px 60px rgba(0,0,0,0.08);">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="font-size: 32px; font-weight: 600; color: #16a34a;">Instead of Fighting, Try These</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px;">
              <div>
                <div style="font-size: 24px; font-weight: 600; color: #16a34a; margin-bottom: 25px;">For Her to Say:</div>
                
                <div style="space-y: 20px;">
                  <div style="background: #f0fdf4; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 16px; color: #666;">
                      "I need you to know that when I pull away, it's not about you. My body is overwhelmed."
                    </div>
                  </div>
                  
                  <div style="background: #f0fdf4; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 16px; color: #666;">
                      "I miss us too. I'm just touched out. Can we connect without touching for now?"
                    </div>
                  </div>
                  
                  <div style="background: #f0fdf4; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 16px; color: #666;">
                      "When you [specific action], it helps me feel less alone. Thank you."
                    </div>
                  </div>
                  
                  <div style="background: #f0fdf4; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 16px; color: #666;">
                      "I need 10 minutes to myself, then I'll be more present with you."
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div style="font-size: 24px; font-weight: 600; color: #16a34a; margin-bottom: 25px;">For Him to Say:</div>
                
                <div style="space-y: 20px;">
                  <div style="background: #f0fdf4; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 16px; color: #666;">
                      "Tell me what you need. I want to help but I need direction."
                    </div>
                  </div>
                  
                  <div style="background: #f0fdf4; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 16px; color: #666;">
                      "I see how hard you're working. You're an amazing mother."
                    </div>
                  </div>
                  
                  <div style="background: #f0fdf4; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 16px; color: #666;">
                      "I'm taking the baby. Go do whatever you need for yourself."
                    </div>
                  </div>
                  
                  <div style="background: #f0fdf4; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 16px; color: #666;">
                      "I miss you, and I can wait until you're ready."
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); color: white; padding: 30px; border-radius: 20px; margin-top: 40px;">
              <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: 600;">The Power of "I" Statements</div>
                <div style="font-size: 18px; margin-top: 15px;">
                  "I feel..." instead of "You always..."<br/>
                  Reduces defensiveness by 76%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 6,
    title: "The Co-Regulation Effect",
    html: `
      <div class="slide-container" style="background: white; color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            How Partners <span style="color: #3b82f6; font-weight: 600;">Calm</span> Each Other
          </h2>
          
          <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 30px; padding: 50px; margin-bottom: 40px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="font-size: 80px;">🫂</div>
              <div style="font-size: 32px; font-weight: 600; color: #2563eb;">The Science of Soothing</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
              <div style="background: white; border-radius: 20px; padding: 30px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">💓</div>
                <div style="font-size: 20px; font-weight: 600; color: #3b82f6;">Heart Sync</div>
                <div style="font-size: 16px; color: #666; margin-top: 10px;">
                  Partners' heart rates synchronize<br/>
                  within 3 minutes of contact
                </div>
              </div>
              
              <div style="background: white; border-radius: 20px; padding: 30px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">🧠</div>
                <div style="font-size: 20px; font-weight: 600; color: #3b82f6;">Cortisol Drop</div>
                <div style="font-size: 16px; color: #666; margin-top: 10px;">
                  30% stress hormone reduction<br/>
                  when partner stays calm
                </div>
              </div>
              
              <div style="background: white; border-radius: 20px; padding: 30px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">⚡</div>
                <div style="font-size: 20px; font-weight: 600; color: #3b82f6;">Mirror Neurons</div>
                <div style="font-size: 16px; color: #666; margin-top: 10px;">
                  Your calm becomes<br/>
                  their calm automatically
                </div>
              </div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px;">
            <div style="background: #eff6ff; border-radius: 30px; padding: 40px;">
              <div style="font-size: 28px; font-weight: 600; color: #3b82f6; margin-bottom: 25px;">Calming Techniques</div>
              
              <div style="space-y: 20px;">
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; font-weight: 600; color: #3b82f6;">Synchronized Breathing</div>
                  <div style="font-size: 16px; color: #666; margin-top: 10px;">
                    Match their breath pattern<br/>
                    Gradually slow it down together
                  </div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; font-weight: 600; color: #3b82f6;">20-Second Hug</div>
                  <div style="font-size: 16px; color: #666; margin-top: 10px;">
                    Releases oxytocin<br/>
                    No talking, just holding
                  </div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; font-weight: 600; color: #3b82f6;">Lowered Voice</div>
                  <div style="font-size: 16px; color: #666; margin-top: 10px;">
                    Speak 50% slower and softer<br/>
                    Activates parasympathetic system
                  </div>
                </div>
              </div>
            </div>
            
            <div style="background: #e0e7ff; border-radius: 30px; padding: 40px;">
              <div style="font-size: 28px; font-weight: 600; color: #6366f1; margin-bottom: 25px;">When She's Overwhelmed</div>
              
              <ol style="font-size: 18px; line-height: 2; color: #666;">
                <li>Take baby without asking why</li>
                <li>Speak in calm, low tones</li>
                <li>No problem-solving yet</li>
                <li>Physical space if needed</li>
                <li>Validate: "This is so hard"</li>
                <li>Wait for her cue to talk</li>
                <li>Follow up later gently</li>
              </ol>
              
              <div style="margin-top: 25px; background: white; padding: 20px; border-radius: 15px; text-align: center;">
                <div style="font-size: 20px; font-weight: 600; color: #6366f1;">Success Rate: 84%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 7,
    title: "Conflict Resolution",
    html: `
      <div class="slide-container" style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            Fighting <span style="font-weight: 600;">Fair</span> When Exhausted
          </h2>
          
          <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 30px; padding: 50px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="font-size: 32px; font-weight: 600;">The 24-Hour Rule</div>
              <div style="font-size: 20px; opacity: 0.9; margin-top: 10px;">Most fights aren't about what you think they're about</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-bottom: 40px;">
              <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; text-align: center;">
                <div style="font-size: 64px; font-weight: bold;">69%</div>
                <div style="font-size: 18px;">Of conflicts are unsolvable</div>
                <div style="font-size: 16px; opacity: 0.8; margin-top: 10px;">Need management, not resolution</div>
              </div>
              
              <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; text-align: center;">
                <div style="font-size: 64px; font-weight: bold;">3AM</div>
                <div style="font-size: 18px;">Worst time for discussions</div>
                <div style="font-size: 16px; opacity: 0.8; margin-top: 10px;">Prefrontal cortex offline</div>
              </div>
              
              <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; text-align: center;">
                <div style="font-size: 64px; font-weight: bold;">20min</div>
                <div style="font-size: 18px;">Maximum productive conflict</div>
                <div style="font-size: 16px; opacity: 0.8; margin-top: 10px;">Then take a break</div>
              </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px;">
              <div style="background: rgba(255,255,255,0.15); padding: 30px; border-radius: 20px;">
                <div style="font-size: 24px; font-weight: 600; margin-bottom: 20px;">STOP Method</div>
                <div style="font-size: 18px; line-height: 2;">
                  <strong>S</strong>top - Pause the conversation<br/>
                  <strong>T</strong>ake a breath - Literally breathe<br/>
                  <strong>O</strong>bserve - What's really happening?<br/>
                  <strong>P</strong>roceed - With intention, not reaction
                </div>
              </div>
              
              <div style="background: rgba(255,255,255,0.15); padding: 30px; border-radius: 20px;">
                <div style="font-size: 24px; font-weight: 600; margin-bottom: 20px;">Fair Fighting Rules</div>
                <div style="font-size: 18px; line-height: 2;">
                  ✓ One issue at a time<br/>
                  ✓ No character attacks<br/>
                  ✓ Stay in present tense<br/>
                  ✓ Take turns talking<br/>
                  ✓ Breaks are okay
                </div>
              </div>
            </div>
            
            <div style="background: rgba(255,255,255,0.2); padding: 30px; border-radius: 20px; margin-top: 40px; text-align: center;">
              <div style="font-size: 24px; font-weight: 600;">
                "Do you want to be right or do you want to be married?"
              </div>
              <div style="font-size: 18px; margin-top: 10px; opacity: 0.9;">
                - Dr. Phil McGraw
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 8,
    title: "Building Micro-Connections",
    html: `
      <div class="slide-container" style="background: white; color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            <span style="color: #ec4899; font-weight: 600;">6 Seconds</span> to Save Your Marriage
          </h2>
          
          <div style="background: #fce7f3; border-radius: 30px; padding: 50px; margin-bottom: 40px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="font-size: 32px; font-weight: 600; color: #ec4899;">The Power of Small Moments</div>
              <div style="font-size: 20px; color: #666; margin-top: 10px;">Connection doesn't require date nights</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
              <div style="background: white; border-radius: 20px; padding: 30px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">☕</div>
                <div style="font-size: 20px; font-weight: 600; color: #ec4899;">6-Second Kiss</div>
                <div style="font-size: 16px; color: #666; margin-top: 10px;">
                  Morning and night<br/>
                  Releases bonding hormones
                </div>
                <div style="margin-top: 20px; font-size: 24px; font-weight: bold; color: #ec4899;">87%</div>
                <div style="font-size: 14px; color: #666;">Feel more connected</div>
              </div>
              
              <div style="background: white; border-radius: 20px; padding: 30px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">👀</div>
                <div style="font-size: 20px; font-weight: 600; color: #ec4899;">Eye Contact</div>
                <div style="font-size: 16px; color: #666; margin-top: 10px;">
                  4 seconds minimum<br/>
                  No phones, just presence
                </div>
                <div style="margin-top: 20px; font-size: 24px; font-weight: bold; color: #ec4899;">92%</div>
                <div style="font-size: 14px; color: #666;">Feel more seen</div>
              </div>
              
              <div style="background: white; border-radius: 20px; padding: 30px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">💬</div>
                <div style="font-size: 20px; font-weight: 600; color: #ec4899;">Check-In Ritual</div>
                <div style="font-size: 16px; color: #666; margin-top: 10px;">
                  "How are you really?"<br/>
                  2 minutes each, no fixing
                </div>
                <div style="margin-top: 20px; font-size: 24px; font-weight: bold; color: #ec4899;">78%</div>
                <div style="font-size: 14px; color: #666;">Less resentment</div>
              </div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px;">
            <div style="background: #f3e8ff; border-radius: 30px; padding: 40px;">
              <div style="font-size: 28px; font-weight: 600; color: #7c3aed; margin-bottom: 25px;">Daily Micro-Rituals</div>
              
              <div style="font-size: 18px; line-height: 2; color: #666;">
                • Coffee together (even 5 min)<br/>
                • Text during day: "Thinking of you"<br/>
                • Share one win/one struggle<br/>
                • Physical touch passing by<br/>
                • Gratitude before sleep<br/>
                • Inside jokes/nicknames<br/>
                • Celebrate tiny victories
              </div>
            </div>
            
            <div style="background: #e0e7ff; border-radius: 30px; padding: 40px;">
              <div style="font-size: 28px; font-weight: 600; color: #6366f1; margin-bottom: 25px;">The Bid System</div>
              
              <div style="background: white; padding: 25px; border-radius: 20px;">
                <div style="font-size: 20px; font-weight: 600; color: #6366f1; margin-bottom: 15px;">Recognize Bids for Connection:</div>
                <div style="font-size: 16px; color: #666; line-height: 1.8;">
                  "Look at this funny video" = I want to share joy<br/>
                  "The baby did something cute" = Include me<br/>
                  "I'm so tired" = Comfort me<br/><br/>
                  
                  <strong>Turn towards, not away</strong><br/>
                  Happy couples: 86% positive responses<br/>
                  Divorced couples: 33% positive responses
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 9,
    title: "Creating Your Team",
    html: `
      <div class="slide-container" style="background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%); color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            From Opponents to <span style="color: #3b82f6; font-weight: 600;">Teammates</span>
          </h2>
          
          <div style="background: white; border-radius: 30px; padding: 50px; box-shadow: 0 20px 60px rgba(0,0,0,0.08);">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="font-size: 32px; font-weight: 600; color: #3b82f6;">Us vs The Problem</div>
              <div style="font-size: 20px; color: #666; margin-top: 10px;">Not you vs me</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px;">
              <div style="background: #dbeafe; border-radius: 20px; padding: 35px;">
                <div style="font-size: 24px; font-weight: 600; color: #2563eb; margin-bottom: 20px;">Weekly Team Meeting</div>
                <div style="font-size: 18px; line-height: 1.8; color: #666;">
                  <strong>15 minutes, same time weekly</strong><br/><br/>
                  
                  Agenda:<br/>
                  1. Appreciate (2 min each)<br/>
                  2. Issues/concerns (5 min)<br/>
                  3. Logistics planning (5 min)<br/>
                  4. Connection goal (1 min)<br/><br/>
                  
                  <div style="background: white; padding: 15px; border-radius: 10px; text-align: center;">
                    Reduces conflict by 67%
                  </div>
                </div>
              </div>
              
              <div style="background: #c7d2fe; border-radius: 20px; padding: 35px;">
                <div style="font-size: 24px; font-weight: 600; color: #4c1d95; margin-bottom: 20px;">Dream Together</div>
                <div style="font-size: 18px; line-height: 1.8; color: #666;">
                  <strong>Remember your why</strong><br/><br/>
                  
                  Questions to explore:<br/>
                  • What kind of family are we creating?<br/>
                  • What do we want baby to see?<br/>
                  • How do we want to feel in 5 years?<br/>
                  • What's our relationship legacy?<br/><br/>
                  
                  <div style="background: white; padding: 15px; border-radius: 10px; text-align: center;">
                    Shared vision = 84% stronger bond
                  </div>
                </div>
              </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 40px; border-radius: 20px; margin-top: 40px;">
              <div style="text-align: center;">
                <div style="font-size: 28px; font-weight: 600; margin-bottom: 20px;">Your Team Motto</div>
                <div style="font-size: 20px; line-height: 1.6;">
                  "We're learning together"<br/>
                  "Progress, not perfection"<br/>
                  "Love first, logistics second"<br/>
                  "We can do hard things"
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 10,
    title: "Your Communication Plan",
    html: `
      <div class="slide-container" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 56px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            Your <span style="font-weight: 600;">Connection Blueprint</span>
          </h2>
          
          <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 30px; padding: 50px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="font-size: 32px; font-weight: 600;">This Week's Practice</div>
              <div style="font-size: 20px; opacity: 0.9; margin-top: 10px;">Small steps, big changes</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-bottom: 40px;">
              <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">💬</div>
                <div style="font-size: 24px; font-weight: 600; margin-bottom: 15px;">Day 1-2</div>
                <div style="font-size: 18px; line-height: 1.6;">
                  Share this lesson<br/>
                  Pick ONE tool<br/>
                  No pressure<br/>
                  <div style="margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                    Start conversations
                  </div>
                </div>
              </div>
              
              <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">👀</div>
                <div style="font-size: 24px; font-weight: 600; margin-bottom: 15px;">Day 3-4</div>
                <div style="font-size: 18px; line-height: 1.6;">
                  Try 6-second kiss<br/>
                  Notice bids<br/>
                  Respond positively<br/>
                  <div style="margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                    Build awareness
                  </div>
                </div>
              </div>
              
              <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">🤝</div>
                <div style="font-size: 24px; font-weight: 600; margin-bottom: 15px;">Day 5-7</div>
                <div style="font-size: 18px; line-height: 1.6;">
                  Schedule team meeting<br/>
                  15 minutes only<br/>
                  Follow agenda<br/>
                  <div style="margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                    Create habit
                  </div>
                </div>
              </div>
            </div>
            
            <div style="background: rgba(255,255,255,0.2); padding: 40px; border-radius: 20px;">
              <div style="font-size: 28px; font-weight: 600; text-align: center; margin-bottom: 30px;">
                Daily Minimums for Connection
              </div>
              
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; text-align: center;">
                <div>
                  <div style="font-size: 24px; font-weight: bold;">Morning</div>
                  <div style="font-size: 16px; opacity: 0.9;">6-second kiss</div>
                </div>
                <div>
                  <div style="font-size: 24px; font-weight: bold;">Midday</div>
                  <div style="font-size: 16px; opacity: 0.9;">Check-in text</div>
                </div>
                <div>
                  <div style="font-size: 24px; font-weight: bold;">Evening</div>
                  <div style="font-size: 16px; opacity: 0.9;">Share one thing</div>
                </div>
                <div>
                  <div style="font-size: 24px; font-weight: bold;">Bedtime</div>
                  <div style="font-size: 16px; opacity: 0.9;">Gratitude</div>
                </div>
              </div>
              
              <div style="margin-top: 30px; text-align: center; font-size: 20px;">
                Total time: 5 minutes • Impact: Relationship-saving
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 40px;">
              <div style="font-size: 24px; font-weight: 600; margin-bottom: 20px;">
                Remember: You fell in love for a reason
              </div>
              <div style="font-size: 20px; opacity: 0.9;">
                That person is still there, just buried under exhaustion and change.<br/>
                Every micro-moment of connection digs them out a little more.<br/>
                Be patient with each other. You're both doing your best.<br/><br/>
                <strong>Start today. Start with a 6-second kiss.</strong>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; font-size: 18px; opacity: 0.8;">
            Based on Gottman Institute research and 40 years of relationship studies
          </div>
        </div>
      </div>
    `
  }
];

// Create the HTML file with all slides
const createWeek3Lesson1Slides = () => {
  const slidesHtml = week3Lesson1Slides
    .map(slide => slide.html)
    .join('\n<!-- SLIDE -->\n');
    
  const outputPath = path.join(__dirname, '..', 'course-materials', 'week3-lesson1-slides.html');
  
  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, slidesHtml);
  console.log('Created Week 3, Lesson 1: Partner Communication slides!');
  console.log(`Output: ${outputPath}`);
  console.log(`Total slides: ${week3Lesson1Slides.length}`);
};

// Run the script
createWeek3Lesson1Slides();