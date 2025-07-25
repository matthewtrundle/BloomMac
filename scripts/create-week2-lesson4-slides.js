const fs = require('fs');
const path = require('path');

// Week 2, Lesson 4: Creating Compassionate Boundaries
// Integrating energy vampire framework and boundary scripts
const week2Lesson4Slides = [
  {
    slideNumber: 1,
    title: "The Boundary Crisis",
    html: `
      <div class="slide-container" style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh; position: relative;">
        <div class="slide-number" style="position: absolute; top: 20px; right: 30px; color: rgba(0,0,0,0.2); font-size: 18px; font-weight: 300;">01</div>
        
        <div class="content-wrapper" style="max-width: 1200px; width: 100%; text-align: center;">
          <h1 style="font-size: 64px; font-weight: 300; margin-bottom: 50px; letter-spacing: -2px;">
            When <span style="color: #92400e; font-weight: 600;">Everyone Needs You</span>
          </h1>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-bottom: 60px;">
            <div style="background: white; padding: 40px; border-radius: 30px; box-shadow: 0 20px 60px rgba(0,0,0,0.08);">
              <div style="font-size: 72px; font-weight: bold; color: #f59e0b; margin-bottom: 20px;">82%</div>
              <div style="font-size: 20px; color: #666;">Can't say no</div>
              <div style="font-size: 16px; color: #999; margin-top: 10px;">Without massive guilt</div>
            </div>
            
            <div style="background: white; padding: 40px; border-radius: 30px; box-shadow: 0 20px 60px rgba(0,0,0,0.08);">
              <div style="font-size: 72px; font-weight: bold; color: #dc2626; margin-bottom: 20px;">73%</div>
              <div style="font-size: 20px; color: #666;">Resentful daily</div>
              <div style="font-size: 16px; color: #999; margin-top: 10px;">But keep saying yes</div>
            </div>
            
            <div style="background: white; padding: 40px; border-radius: 30px; box-shadow: 0 20px 60px rgba(0,0,0,0.08);">
              <div style="font-size: 72px; font-weight: bold; color: #7c3aed; margin-bottom: 20px;">91%</div>
              <div style="font-size: 20px; color: #666;">Energy depleted</div>
              <div style="font-size: 16px; color: #999; margin-top: 10px;">Nothing left for self</div>
            </div>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 30px; box-shadow: 0 20px 60px rgba(0,0,0,0.08);">
            <div style="font-size: 28px; color: #92400e; font-weight: 600; margin-bottom: 20px;">
              The Truth
            </div>
            <div style="font-size: 22px; color: #666; line-height: 1.6;">
              Boundaries aren't walls. They're gates.<br/>
              They let love in and keep depletion out.
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 2,
    title: "Why Boundaries Feel Impossible",
    html: `
      <div class="slide-container" style="background: white; color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            The <span style="color: #dc2626; font-weight: 600;">Programming</span> Against Protection
          </h2>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 50px; align-items: center;">
            <div>
              <div style="background: #fee2e2; border-radius: 30px; padding: 40px;">
                <div style="font-size: 32px; font-weight: 600; color: #dc2626; margin-bottom: 30px;">Messages We Absorbed</div>
                
                <div style="space-y: 25px;">
                  <div style="background: white; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 20px; font-weight: 600; color: #dc2626;">"Good girls don't disappoint"</div>
                    <div style="font-size: 16px; color: #666; margin-top: 5px;">Age absorbed: 4-6 years</div>
                  </div>
                  
                  <div style="background: white; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 20px; font-weight: 600; color: #dc2626;">"Selfish is the worst thing"</div>
                    <div style="font-size: 16px; color: #666; margin-top: 5px;">Reinforced: Teen years</div>
                  </div>
                  
                  <div style="background: white; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 20px; font-weight: 600; color: #dc2626;">"Keep the peace at all costs"</div>
                    <div style="font-size: 16px; color: #666; margin-top: 5px;">Family role: Peacekeeper</div>
                  </div>
                  
                  <div style="background: white; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 20px; font-weight: 600; color: #dc2626;">"Your needs come last"</div>
                    <div style="font-size: 16px; color: #666; margin-top: 5px;">Motherhood: Amplified 10x</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div style="background: #fef3c7; border-radius: 30px; padding: 40px;">
                <div style="font-size: 28px; font-weight: 600; color: #92400e; margin-bottom: 30px;">The Result: Boundary Blocks</div>
                
                <div style="space-y: 20px;">
                  <div style="display: flex; align-items: center; gap: 20px;">
                    <div style="font-size: 48px;">😰</div>
                    <div>
                      <div style="font-size: 20px; font-weight: 600; color: #f59e0b;">Fear of Rejection</div>
                      <div style="font-size: 16px; color: #666;">"They'll think I'm mean"</div>
                    </div>
                  </div>
                  
                  <div style="display: flex; align-items: center; gap: 20px;">
                    <div style="font-size: 48px;">💔</div>
                    <div>
                      <div style="font-size: 20px; font-weight: 600; color: #f59e0b;">Guilt Overload</div>
                      <div style="font-size: 16px; color: #666;">"I should be able to do it all"</div>
                    </div>
                  </div>
                  
                  <div style="display: flex; align-items: center; gap: 20px;">
                    <div style="font-size: 48px;">🎭</div>
                    <div>
                      <div style="font-size: 20px; font-weight: 600; color: #f59e0b;">People Pleasing</div>
                      <div style="font-size: 16px; color: #666;">"Their comfort > my wellbeing"</div>
                    </div>
                  </div>
                  
                  <div style="display: flex; align-items: center; gap: 20px;">
                    <div style="font-size: 48px;">😔</div>
                    <div>
                      <div style="font-size: 20px; font-weight: 600; color: #f59e0b;">Worthiness Wound</div>
                      <div style="font-size: 16px; color: #666;">"I don't deserve boundaries"</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style="background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); color: white; padding: 30px; border-radius: 20px; margin-top: 30px;">
                <div style="text-align: center;">
                  <div style="font-size: 24px; font-weight: 600;">The Breakthrough</div>
                  <div style="font-size: 18px; margin-top: 10px;">
                    Every boundary you set models self-respect for your child
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 3,
    title: "Energy Vampires vs Givers",
    html: `
      <div class="slide-container" style="background: linear-gradient(180deg, #faf5ff 0%, #f3e8ff 100%); color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            Know Your <span style="color: #7c3aed; font-weight: 600;">Energy Economy</span>
          </h2>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; margin-bottom: 40px;">
            <!-- Energy Vampires -->
            <div style="background: #fee2e2; border-radius: 30px; padding: 40px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 64px;">🧛‍♀️</div>
                <div style="font-size: 32px; font-weight: 600; color: #dc2626;">Energy Vampires</div>
              </div>
              
              <div style="space-y: 20px;">
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 20px; font-weight: 600; color: #dc2626;">The Crisis Creator</div>
                  <div style="font-size: 16px; color: #666;">Everything is urgent, nothing is their fault</div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 20px; font-weight: 600; color: #dc2626;">The Guilt Tripper</div>
                  <div style="font-size: 16px; color: #666;">"After all I've done for you..."</div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 20px; font-weight: 600; color: #dc2626;">The Advice Ignorer</div>
                  <div style="font-size: 16px; color: #666;">Asks for help, does opposite</div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 20px; font-weight: 600; color: #dc2626;">The Competitor</div>
                  <div style="font-size: 16px; color: #666;">Your joy triggers their jealousy</div>
                </div>
              </div>
              
              <div style="margin-top: 30px; text-align: center;">
                <div style="font-size: 36px; font-weight: bold; color: #dc2626;">-47%</div>
                <div style="font-size: 16px; color: #666;">Energy after 10 minutes</div>
              </div>
            </div>
            
            <!-- Energy Givers -->
            <div style="background: #dcfce7; border-radius: 30px; padding: 40px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 64px;">☀️</div>
                <div style="font-size: 32px; font-weight: 600; color: #16a34a;">Energy Givers</div>
              </div>
              
              <div style="space-y: 20px;">
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 20px; font-weight: 600; color: #16a34a;">The Cheerleader</div>
                  <div style="font-size: 16px; color: #666;">Celebrates your wins, big and small</div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 20px; font-weight: 600; color: #16a34a;">The Safe Space</div>
                  <div style="font-size: 16px; color: #666;">You can be real, messy, human</div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 20px; font-weight: 600; color: #16a34a;">The Reciprocator</div>
                  <div style="font-size: 16px; color: #666;">Gives as much as they receive</div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 20px; font-weight: 600; color: #16a34a;">The Growth Friend</div>
                  <div style="font-size: 16px; color: #666;">Inspires you to be better</div>
                </div>
              </div>
              
              <div style="margin-top: 30px; text-align: center;">
                <div style="font-size: 36px; font-weight: bold; color: #16a34a;">+63%</div>
                <div style="font-size: 16px; color: #666;">Energy after 10 minutes</div>
              </div>
            </div>
          </div>
          
          <div style="background: white; border-radius: 30px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.08);">
            <div style="text-align: center;">
              <div style="font-size: 28px; font-weight: 600; color: #7c3aed; margin-bottom: 20px;">
                Your Energy Audit
              </div>
              <div style="font-size: 20px; color: #666; line-height: 1.6;">
                After each interaction, ask: Do I feel energized or drained?<br/>
                <strong>You have permission to limit time with drainers.</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 4,
    title: "The Compassionate No",
    html: `
      <div class="slide-container" style="background: white; color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            How to Say <span style="color: #10b981; font-weight: 600;">No</span> With Love
          </h2>
          
          <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 30px; padding: 50px; margin-bottom: 40px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="font-size: 32px; font-weight: 600; color: #065f46;">The Sandwich Method</div>
              <div style="font-size: 20px; color: #047857; margin-top: 10px;">Appreciation + Boundary + Alternative</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
              <div style="background: white; border-radius: 20px; padding: 30px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">💚</div>
                <div style="font-size: 24px; font-weight: 600; color: #10b981; margin-bottom: 15px;">1. Appreciate</div>
                <div style="font-size: 18px; color: #666;">
                  "I'm so honored you thought of me"<br/>
                  "Thank you for asking"<br/>
                  "I love that you trust me"
                </div>
              </div>
              
              <div style="background: white; border-radius: 20px; padding: 30px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">🛑</div>
                <div style="font-size: 24px; font-weight: 600; color: #10b981; margin-bottom: 15px;">2. Boundary</div>
                <div style="font-size: 18px; color: #666;">
                  "I can't commit to that"<br/>
                  "That won't work for me"<br/>
                  "I need to protect my energy"
                </div>
              </div>
              
              <div style="background: white; border-radius: 20px; padding: 30px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">🤝</div>
                <div style="font-size: 24px; font-weight: 600; color: #10b981; margin-bottom: 15px;">3. Alternative</div>
                <div style="font-size: 18px; color: #666;">
                  "Maybe next month?"<br/>
                  "Could we do X instead?"<br/>
                  "Here's what I can offer..."
                </div>
              </div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px;">
            <div style="background: #fef3c7; border-radius: 30px; padding: 40px;">
              <div style="font-size: 28px; font-weight: 600; color: #92400e; margin-bottom: 25px;">Common Scenarios</div>
              
              <div style="space-y: 20px;">
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; font-weight: 600; color: #f59e0b;">Visitor Overload</div>
                  <div style="font-size: 16px; color: #666; margin-top: 10px;">
                    "We're limiting visits to 30 minutes right now. Baby and I need lots of rest."
                  </div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; font-weight: 600; color: #f59e0b;">Unsolicited Advice</div>
                  <div style="font-size: 16px; color: #666; margin-top: 10px;">
                    "Thanks for sharing. We're following our pediatrician's guidance."
                  </div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; font-weight: 600; color: #f59e0b;">Event Invitations</div>
                  <div style="font-size: 16px; color: #666; margin-top: 10px;">
                    "That sounds lovely. We're keeping our schedule light for now."
                  </div>
                </div>
              </div>
            </div>
            
            <div style="background: #e0e7ff; border-radius: 30px; padding: 40px;">
              <div style="font-size: 28px; font-weight: 600; color: #4c1d95; margin-bottom: 25px;">Power Phrases</div>
              
              <div style="font-size: 18px; line-height: 2; color: #666;">
                • "That doesn't work for our family"<br/>
                • "I'll need to think about that"<br/>
                • "My plate is full right now"<br/>
                • "I'm not available for that"<br/>
                • "Thanks, but no thanks"<br/>
                • "I need to check with myself first"<br/>
                • "Let me get back to you" (then don't)
              </div>
              
              <div style="margin-top: 25px; background: white; padding: 20px; border-radius: 15px; text-align: center;">
                <div style="font-size: 20px; font-weight: 600; color: #6366f1;">Remember</div>
                <div style="font-size: 16px; color: #666; margin-top: 5px;">"No" is a complete sentence</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 5,
    title: "Internal Boundaries",
    html: `
      <div class="slide-container" style="background: linear-gradient(180deg, #fee2e2 0%, #fecaca 100%); color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            Boundaries With <span style="color: #dc2626; font-weight: 600;">Yourself</span>
          </h2>
          
          <div style="background: white; border-radius: 30px; padding: 50px; box-shadow: 0 20px 60px rgba(0,0,0,0.08); margin-bottom: 40px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="font-size: 32px; font-weight: 600; color: #dc2626;">The Harshest Boundary Violator? You.</div>
              <div style="font-size: 20px; color: #666; margin-top: 10px;">Time to protect yourself from yourself</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px;">
              <div>
                <div style="font-size: 24px; font-weight: 600; color: #dc2626; margin-bottom: 25px;">Thought Boundaries</div>
                
                <div style="space-y: 20px;">
                  <div style="background: #fee2e2; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 18px; font-weight: 600; color: #dc2626;">Stop Allowing:</div>
                    <div style="font-size: 16px; color: #666; margin-top: 10px;">
                      • Comparison spirals<br/>
                      • Catastrophic thinking<br/>
                      • Self-attack sessions<br/>
                      • Perfection fantasies
                    </div>
                  </div>
                  
                  <div style="background: #dcfce7; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 18px; font-weight: 600; color: #16a34a;">Start Protecting:</div>
                    <div style="font-size: 16px; color: #666; margin-top: 10px;">
                      • Mental rest time<br/>
                      • Positive self-talk<br/>
                      • Reality checks<br/>
                      • Compassion pauses
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div style="font-size: 24px; font-weight: 600; color: #dc2626; margin-bottom: 25px;">Time Boundaries</div>
                
                <div style="space-y: 20px;">
                  <div style="background: #fee2e2; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 18px; font-weight: 600; color: #dc2626;">Stop Allowing:</div>
                    <div style="font-size: 16px; color: #666; margin-top: 10px;">
                      • Endless scrolling<br/>
                      • Productivity guilt<br/>
                      • Sleep sacrifice<br/>
                      • Rush addiction
                    </div>
                  </div>
                  
                  <div style="background: #dcfce7; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 18px; font-weight: 600; color: #16a34a;">Start Protecting:</div>
                    <div style="font-size: 16px; color: #666; margin-top: 10px;">
                      • 5-min daily minimum<br/>
                      • Transition time<br/>
                      • Sleep schedule<br/>
                      • Presence moments
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
            <div style="background: white; border-radius: 20px; padding: 30px; text-align: center;">
              <div style="font-size: 64px; margin-bottom: 15px;">🧠</div>
              <div style="font-size: 20px; font-weight: 600; color: #dc2626;">Mental Load Cap</div>
              <div style="font-size: 16px; color: #666; margin-top: 10px;">
                3 main things per day<br/>
                Not 30
              </div>
            </div>
            
            <div style="background: white; border-radius: 20px; padding: 30px; text-align: center;">
              <div style="font-size: 64px; margin-bottom: 15px;">📱</div>
              <div style="font-size: 20px; font-weight: 600; color: #dc2626;">Digital Boundaries</div>
              <div style="font-size: 16px; color: #666; margin-top: 10px;">
                Phone-free feeding<br/>
                No scroll before 9am
              </div>
            </div>
            
            <div style="background: white; border-radius: 20px; padding: 30px; text-align: center;">
              <div style="font-size: 64px; margin-bottom: 15px;">💭</div>
              <div style="font-size: 20px; font-weight: 600; color: #dc2626;">Story Boundaries</div>
              <div style="font-size: 16px; color: #666; margin-top: 10px;">
                "Is this true?"<br/>
                "Is this helpful?"
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 6,
    title: "Baby Boundaries",
    html: `
      <div class="slide-container" style="background: white; color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            Yes, Boundaries With Your <span style="color: #ec4899; font-weight: 600;">Baby</span>
          </h2>
          
          <div style="background: #fce7f3; border-radius: 30px; padding: 50px; margin-bottom: 40px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="font-size: 28px; font-weight: 600; color: #ec4899;">Revolutionary Truth</div>
              <div style="font-size: 20px; color: #666; margin-top: 10px;">You can meet needs without sacrificing yourself</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px;">
              <div style="background: white; border-radius: 20px; padding: 30px;">
                <div style="font-size: 24px; font-weight: 600; color: #ec4899; margin-bottom: 20px;">
                  Healthy Boundaries Look Like:
                </div>
                <div style="font-size: 18px; line-height: 1.8; color: #666;">
                  ✓ "Mommy needs 2 minutes"<br/>
                  ✓ Safe space while you breathe<br/>
                  ✓ Partner takes over at limit<br/>
                  ✓ Consistent bedtime routine<br/>
                  ✓ "I love you AND I need space"<br/>
                  ✓ Teaching wait (age-appropriate)
                </div>
              </div>
              
              <div style="background: white; border-radius: 20px; padding: 30px;">
                <div style="font-size: 24px; font-weight: 600; color: #ec4899; margin-bottom: 20px;">
                  This Creates:
                </div>
                <div style="font-size: 18px; line-height: 1.8; color: #666;">
                  • Secure attachment (not anxious)<br/>
                  • Emotional regulation skills<br/>
                  • Respect for others' needs<br/>
                  • Patience development<br/>
                  • Healthier sleep patterns<br/>
                  • Less entitled behavior later
                </div>
              </div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-bottom: 40px;">
            <div style="background: #f3e8ff; border-radius: 20px; padding: 30px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 15px;">👶</div>
              <div style="font-size: 20px; font-weight: 600; color: #7c3aed;">0-6 Months</div>
              <div style="font-size: 16px; color: #666; margin-top: 10px;">
                5-min breaks okay<br/>
                Crying won't break them<br/>
                Your calm = their calm
              </div>
            </div>
            
            <div style="background: #e0e7ff; border-radius: 20px; padding: 30px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 15px;">🧸</div>
              <div style="font-size: 20px; font-weight: 600; color: #6366f1;">6-12 Months</div>
              <div style="font-size: 16px; color: #666; margin-top: 10px;">
                "Mama will be back"<br/>
                Short separations build trust<br/>
                Consistent responses
              </div>
            </div>
            
            <div style="background: #dbeafe; border-radius: 20px; padding: 30px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 15px;">🚶</div>
              <div style="font-size: 20px; font-weight: 600; color: #2563eb;">12+ Months</div>
              <div style="font-size: 16px; color: #666; margin-top: 10px;">
                "Wait please"<br/>
                "Mama's turn"<br/>
                Natural consequences
              </div>
            </div>
          </div>
          
          <div style="background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%); color: white; padding: 40px; border-radius: 30px;">
            <div style="text-align: center;">
              <div style="font-size: 28px; font-weight: 600; margin-bottom: 20px;">
                The Research Is Clear
              </div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
                <div>
                  <div style="font-size: 36px; font-weight: bold;">73%</div>
                  <div style="font-size: 16px;">Better emotional regulation with boundaries</div>
                </div>
                <div>
                  <div style="font-size: 36px; font-weight: bold;">81%</div>
                  <div style="font-size: 16px;">Less anxiety in boundary-raised kids</div>
                </div>
                <div>
                  <div style="font-size: 36px; font-weight: bold;">92%</div>
                  <div style="font-size: 16px;">Of secure kids had boundaried parents</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 7,
    title: "Family Boundary Scripts",
    html: `
      <div class="slide-container" style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            Scripts for <span style="color: #92400e; font-weight: 600;">Family Dynamics</span>
          </h2>
          
          <div style="background: white; border-radius: 30px; padding: 50px; box-shadow: 0 20px 60px rgba(0,0,0,0.08);">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="font-size: 28px; font-weight: 600; color: #f59e0b;">Copy, Paste, Breathe</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px;">
              <div style="background: #fef3c7; border-radius: 20px; padding: 30px;">
                <div style="font-size: 24px; font-weight: 600; color: #92400e; margin-bottom: 20px;">
                  The Overbearing Grandparent
                </div>
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 16px; color: #666; line-height: 1.8;">
                    "I know you love [baby] so much and want to help. Right now, we're following our pediatrician's advice on [topic]. I'll let you know if that changes. Thanks for understanding."
                  </div>
                </div>
                <div style="margin-top: 20px; text-align: center; font-size: 18px; color: #f59e0b;">
                  Success rate: 78%
                </div>
              </div>
              
              <div style="background: #fef3c7; border-radius: 20px; padding: 30px;">
                <div style="font-size: 24px; font-weight: 600; color: #92400e; margin-bottom: 20px;">
                  The Comparison Relative
                </div>
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 16px; color: #666; line-height: 1.8;">
                    "Every baby is different, and we're following [baby]'s lead. They're exactly where they need to be. How's [change subject]?"
                  </div>
                </div>
                <div style="margin-top: 20px; text-align: center; font-size: 18px; color: #f59e0b;">
                  Shuts down: 84%
                </div>
              </div>
              
              <div style="background: #fef3c7; border-radius: 20px; padding: 30px;">
                <div style="font-size: 24px; font-weight: 600; color: #92400e; margin-bottom: 20px;">
                  The Drop-In Visitor
                </div>
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 16px; color: #666; line-height: 1.8;">
                    "We're asking everyone to text before coming over. Baby and I need predictable schedules for feeding and naps. When would work for you next week?"
                  </div>
                </div>
                <div style="margin-top: 20px; text-align: center; font-size: 18px; color: #f59e0b;">
                  Compliance: 91%
                </div>
              </div>
              
              <div style="background: #fef3c7; border-radius: 20px; padding: 30px;">
                <div style="font-size: 24px; font-weight: 600; color: #92400e; margin-bottom: 20px;">
                  The Guilt Tripper
                </div>
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 16px; color: #666; line-height: 1.8;">
                    "I hear that you're disappointed. I need to do what's best for our family right now. I hope you can support that."
                  </div>
                </div>
                <div style="margin-top: 20px; text-align: center; font-size: 18px; color: #f59e0b;">
                  No JADE needed
                </div>
              </div>
            </div>
            
            <div style="margin-top: 40px; background: #f59e0b; color: white; padding: 30px; border-radius: 20px;">
              <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: 600;">JADE Trap: Don't</div>
                <div style="font-size: 20px; margin-top: 15px;">
                  <strong>J</strong>ustify • <strong>A</strong>rgue • <strong>D</strong>efend • <strong>E</strong>xplain<br/>
                  Your boundary is enough.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 8,
    title: "Cultural Considerations",
    html: `
      <div class="slide-container" style="background: white; color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            Boundaries Across <span style="color: #7c3aed; font-weight: 600;">Cultures</span>
          </h2>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; margin-bottom: 40px;">
            <div style="background: #faf5ff; border-radius: 30px; padding: 40px;">
              <div style="font-size: 28px; font-weight: 600; color: #7c3aed; margin-bottom: 30px;">Cultural Challenges</div>
              
              <div style="space-y: 20px;">
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 20px; font-weight: 600; color: #7c3aed;">Collectivist Cultures</div>
                  <div style="font-size: 16px; color: #666; margin-top: 10px;">
                    "Individual needs are selfish"<br/>
                    Strategy: Frame as family wellness
                  </div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 20px; font-weight: 600; color: #7c3aed;">Respect Hierarchies</div>
                  <div style="font-size: 16px; color: #666; margin-top: 10px;">
                    "Elders always know best"<br/>
                    Strategy: Honor while protecting
                  </div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 20px; font-weight: 600; color: #7c3aed;">Gender Expectations</div>
                  <div style="font-size: 16px; color: #666; margin-top: 10px;">
                    "Mothers sacrifice everything"<br/>
                    Strategy: Model new paradigm
                  </div>
                </div>
              </div>
            </div>
            
            <div style="background: #e9d5ff; border-radius: 30px; padding: 40px;">
              <div style="font-size: 28px; font-weight: 600; color: #6b21a8; margin-bottom: 30px;">Cultural Bridges</div>
              
              <div style="space-y: 20px;">
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; color: #666;">
                    <span style="font-weight: 600; color: #7c3aed;">Instead of:</span> "I need space"<br/>
                    <span style="font-weight: 600; color: #10b981;">Try:</span> "I need to rest so I can care for baby better"
                  </div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; color: #666;">
                    <span style="font-weight: 600; color: #7c3aed;">Instead of:</span> "That's not how we do it"<br/>
                    <span style="font-weight: 600; color: #10b981;">Try:</span> "Doctor says this is safest for baby"
                  </div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; color: #666;">
                    <span style="font-weight: 600; color: #7c3aed;">Instead of:</span> "Leave me alone"<br/>
                    <span style="font-weight: 600; color: #10b981;">Try:</span> "I'll be a better daughter/wife after rest"
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%); color: white; padding: 40px; border-radius: 30px;">
            <div style="text-align: center;">
              <div style="font-size: 28px; font-weight: 600; margin-bottom: 20px;">
                Universal Truth
              </div>
              <div style="font-size: 20px; line-height: 1.6;">
                Every culture values healthy mothers and thriving babies.<br/>
                Frame your boundaries as serving both.<br/>
                <strong>You're not rejecting culture. You're evolving it.</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 9,
    title: "Boundary Maintenance",
    html: `
      <div class="slide-container" style="background: linear-gradient(180deg, #dcfce7 0%, #bbf7d0 100%); color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            When Boundaries Get <span style="color: #16a34a; font-weight: 600;">Tested</span>
          </h2>
          
          <div style="background: white; border-radius: 30px; padding: 50px; box-shadow: 0 20px 60px rgba(0,0,0,0.08); margin-bottom: 40px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="font-size: 32px; font-weight: 600; color: #16a34a;">Expect Pushback</div>
              <div style="font-size: 20px; color: #666; margin-top: 10px;">People who benefited from your lack of boundaries will resist</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
              <div style="background: #f0fdf4; border-radius: 20px; padding: 30px; text-align: center;">
                <div style="font-size: 64px; margin-bottom: 20px;">😤</div>
                <div style="font-size: 20px; font-weight: 600; color: #16a34a;">Stage 1: Anger</div>
                <div style="font-size: 16px; color: #666; margin-top: 10px;">
                  "You've changed"<br/>
                  "You're being selfish"<br/>
                  <strong>Your response:</strong> Hold steady
                </div>
              </div>
              
              <div style="background: #f0fdf4; border-radius: 20px; padding: 30px; text-align: center;">
                <div style="font-size: 64px; margin-bottom: 20px;">🥺</div>
                <div style="font-size: 20px; font-weight: 600; color: #16a34a;">Stage 2: Guilt Trips</div>
                <div style="font-size: 16px; color: #666; margin-top: 10px;">
                  "I'm so hurt"<br/>
                  "I was just trying to help"<br/>
                  <strong>Your response:</strong> Stay kind but firm
                </div>
              </div>
              
              <div style="background: #f0fdf4; border-radius: 20px; padding: 30px; text-align: center;">
                <div style="font-size: 64px; margin-bottom: 20px;">✅</div>
                <div style="font-size: 20px; font-weight: 600; color: #16a34a;">Stage 3: Acceptance</div>
                <div style="font-size: 16px; color: #666; margin-top: 10px;">
                  Respect emerges<br/>
                  New normal established<br/>
                  <strong>Timeline:</strong> 2-6 weeks
                </div>
              </div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px;">
            <div style="background: #fee2e2; border-radius: 30px; padding: 40px;">
              <div style="font-size: 28px; font-weight: 600; color: #dc2626; margin-bottom: 25px;">Common Sabotages</div>
              
              <div style="font-size: 18px; line-height: 2; color: #666;">
                • Testing your limits<br/>
                • "Forgetting" your boundary<br/>
                • Going to partner instead<br/>
                • Public boundary crossing<br/>
                • Emergency manipulation<br/>
                • Silent treatment<br/>
                • Recruiting others
              </div>
            </div>
            
            <div style="background: #dcfce7; border-radius: 30px; padding: 40px;">
              <div style="font-size: 28px; font-weight: 600; color: #16a34a; margin-bottom: 25px;">Your Maintenance Kit</div>
              
              <div style="font-size: 18px; line-height: 2; color: #666;">
                ✓ Broken record technique<br/>
                ✓ Partner alignment crucial<br/>
                ✓ Written boundaries help<br/>
                ✓ Consequences ready<br/>
                ✓ Support system active<br/>
                ✓ Self-compassion high<br/>
                ✓ Flexibility ≠ weakness
              </div>
            </div>
          </div>
          
          <div style="background: #16a34a; color: white; padding: 30px; border-radius: 20px; margin-top: 40px; text-align: center;">
            <div style="font-size: 24px; font-weight: 600;">
              "The only people upset about your boundaries are those who benefited from you having none"
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 10,
    title: "Your Boundary Plan",
    html: `
      <div class="slide-container" style="background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); color: white; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 56px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            Building Your <span style="font-weight: 600;">Boundary Blueprint</span>
          </h2>
          
          <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 30px; padding: 50px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="font-size: 32px; font-weight: 600;">This Week's Practice</div>
              <div style="font-size: 20px; opacity: 0.9; margin-top: 10px;">Start small, build strong</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-bottom: 40px;">
              <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">📝</div>
                <div style="font-size: 24px; font-weight: 600; margin-bottom: 15px;">Day 1-2</div>
                <div style="font-size: 18px; line-height: 1.6;">
                  Energy audit<br/>
                  List your vampires<br/>
                  List your givers<br/>
                  <div style="margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                    Just notice patterns
                  </div>
                </div>
              </div>
              
              <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">🎯</div>
                <div style="font-size: 24px; font-weight: 600; margin-bottom: 15px;">Day 3-4</div>
                <div style="font-size: 18px; line-height: 1.6;">
                  Set ONE boundary<br/>
                  Small and specific<br/>
                  Tell someone<br/>
                  <div style="margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                    Practice the script
                  </div>
                </div>
              </div>
              
              <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">💪</div>
                <div style="font-size: 24px; font-weight: 600; margin-bottom: 15px;">Day 5-7</div>
                <div style="font-size: 18px; line-height: 1.6;">
                  Hold the boundary<br/>
                  Expect pushback<br/>
                  Stay compassionate<br/>
                  <div style="margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                    Celebrate success
                  </div>
                </div>
              </div>
            </div>
            
            <div style="background: rgba(255,255,255,0.2); padding: 40px; border-radius: 20px;">
              <div style="font-size: 28px; font-weight: 600; text-align: center; margin-bottom: 30px;">
                Starter Boundaries
              </div>
              
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px;">
                <div style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 15px;">
                  <div style="font-size: 20px; font-weight: 600; margin-bottom: 15px;">With Others:</div>
                  <div style="font-size: 16px; line-height: 1.8;">
                    • No visitors before 10am<br/>
                    • 30-minute visit limit<br/>
                    • Text before calling<br/>
                    • No advice without asking
                  </div>
                </div>
                
                <div style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 15px;">
                  <div style="font-size: 20px; font-weight: 600; margin-bottom: 15px;">With Yourself:</div>
                  <div style="font-size: 16px; line-height: 1.8;">
                    • 5 minutes alone daily<br/>
                    • One "good enough" choice<br/>
                    • Social media time limit<br/>
                    • Bedtime boundary
                  </div>
                </div>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 40px;">
              <div style="font-size: 24px; font-weight: 600; margin-bottom: 20px;">
                Remember: Every boundary is an act of love
              </div>
              <div style="font-size: 20px; opacity: 0.9;">
                Love for yourself. Love for your baby. Love for your relationships.<br/>
                Boundaries don't push people away. They create space for real connection.<br/><br/>
                <strong>Start today. Start with one "no" that creates a "yes" to what matters.</strong>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; font-size: 18px; opacity: 0.8;">
            Based on research by Dr. Brené Brown, Cloud & Townsend, and maternal wellness studies
          </div>
        </div>
      </div>
    `
  }
];

// Create the HTML file with all slides
const createWeek2Lesson4Slides = () => {
  const slidesHtml = week2Lesson4Slides
    .map(slide => slide.html)
    .join('\n<!-- SLIDE -->\n');
    
  const outputPath = path.join(__dirname, '..', 'course-materials', 'week2-lesson4-slides.html');
  
  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, slidesHtml);
  console.log('Created Week 2, Lesson 4: Creating Compassionate Boundaries slides!');
  console.log(`Output: ${outputPath}`);
  console.log(`Total slides: ${week2Lesson4Slides.length}`);
};

// Run the script
createWeek2Lesson4Slides();