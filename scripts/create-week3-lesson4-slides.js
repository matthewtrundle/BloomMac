const fs = require('fs');
const path = require('path');

// Week 3, Lesson 4: Intimacy and Connection
// Integrating physical and emotional intimacy recovery after childbirth
const week3Lesson4Slides = [
  {
    slideNumber: 1,
    title: "The Intimacy Desert",
    html: `
      <div class="slide-container" style="background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); color: white; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh; position: relative;">
        <div class="slide-number" style="position: absolute; top: 20px; right: 30px; color: rgba(255,255,255,0.3); font-size: 18px; font-weight: 300;">01</div>
        
        <div class="content-wrapper" style="max-width: 1200px; width: 100%; text-align: center;">
          <h1 style="font-size: 64px; font-weight: 300; margin-bottom: 50px; letter-spacing: -2px;">
            When <span style="font-weight: 600;">Touch</span> Feels Wrong
          </h1>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-bottom: 60px;">
            <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 40px; border-radius: 30px;">
              <div style="font-size: 72px; font-weight: bold; margin-bottom: 20px;">82%</div>
              <div style="font-size: 20px;">Feel "touched out" daily</div>
              <div style="font-size: 16px; opacity: 0.8; margin-top: 10px;">Physical overwhelm is normal</div>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 40px; border-radius: 30px;">
              <div style="font-size: 72px; font-weight: bold; margin-bottom: 20px;">6mo</div>
              <div style="font-size: 20px;">Average intimacy return</div>
              <div style="font-size: 16px; opacity: 0.8; margin-top: 10px;">Often longer for breastfeeding</div>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 40px; border-radius: 30px;">
              <div style="font-size: 72px; font-weight: bold; margin-bottom: 20px;">94%</div>
              <div style="font-size: 20px;">Partners feel rejected</div>
              <div style="font-size: 16px; opacity: 0.8; margin-top: 10px;">Without understanding why</div>
            </div>
          </div>
          
          <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); padding: 40px; border-radius: 30px;">
            <div style="font-size: 28px; font-weight: 600; margin-bottom: 20px;">
              The Truth About Postpartum Intimacy
            </div>
            <div style="font-size: 22px; line-height: 1.6; opacity: 0.9;">
              Your body is doing exactly what it's supposed to do.<br/>
              This isn't broken - it's biology protecting recovery.
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 2,
    title: "The Science of Touch Aversion",
    html: `
      <div class="slide-container" style="background: white; color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            Why Your Body Says <span style="color: #dc2626; font-weight: 600;">"No"</span>
          </h2>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 50px; align-items: center;">
            <div>
              <div style="background: #fce7f3; border-radius: 30px; padding: 40px;">
                <div style="font-size: 32px; font-weight: 600; color: #ec4899; margin-bottom: 30px;">Hormonal Reality</div>
                
                <div style="space-y: 25px;">
                  <div style="background: white; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 20px; font-weight: 600; color: #ec4899;">Prolactin Surge</div>
                    <div style="font-size: 16px; color: #666; margin-top: 5px;">
                      10x higher during breastfeeding<br/>
                      Actively suppresses libido
                    </div>
                  </div>
                  
                  <div style="background: white; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 20px; font-weight: 600; color: #ec4899;">Estrogen Crash</div>
                    <div style="font-size: 16px; color: #666; margin-top: 5px;">
                      Lower than menopause levels<br/>
                      Reduces natural lubrication
                    </div>
                  </div>
                  
                  <div style="background: white; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 20px; font-weight: 600; color: #ec4899;">Oxytocin Depletion</div>
                    <div style="font-size: 16px; color: #666; margin-top: 5px;">
                      Bonding hormone spent on baby<br/>
                      Less available for partner bonding
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div style="background: #f0fdf4; border-radius: 30px; padding: 40px;">
                <div style="font-size: 28px; font-weight: 600; color: #16a34a; margin-bottom: 30px;">Nervous System Changes</div>
                
                <div style="text-align: center; margin-bottom: 30px;">
                  <div style="font-size: 96px; color: #16a34a;">⚡</div>
                  <div style="font-size: 24px; color: #666;">Hypervigilance Mode</div>
                </div>
                
                <div style="background: white; padding: 25px; border-radius: 20px;">
                  <div style="font-size: 20px; line-height: 1.8; color: #666;">
                    Your nervous system is wired for <strong>baby protection</strong>, not pleasure.<br/><br/>
                    
                    This creates:<br/>
                    • Heightened startle response<br/>
                    • Difficulty relaxing<br/>
                    • Touch sensitivity overload<br/>
                    • Cognitive overwhelm<br/><br/>
                    
                    <span style="color: #16a34a; font-weight: bold;">This is adaptive, not pathological</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div style="background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); color: white; padding: 30px; border-radius: 20px; margin-top: 40px; text-align: center;">
            <div style="font-size: 24px; font-weight: 600;">
              Your body is prioritizing survival and recovery over reproduction - exactly as designed
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 3,
    title: "The Touched Out Phenomenon",
    html: `
      <div class="slide-container" style="background: linear-gradient(180deg, #fef3c7 0%, #fde68a 100%); color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            When <span style="color: #f59e0b; font-weight: 600;">Baby Touch</span> Uses All Your Bandwidth
          </h2>
          
          <div style="background: white; border-radius: 30px; padding: 50px; box-shadow: 0 20px 60px rgba(0,0,0,0.08); margin-bottom: 40px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="font-size: 32px; font-weight: 600; color: #f59e0b;">The Touch Quota Theory</div>
              <div style="font-size: 20px; color: #666; margin-top: 10px;">Every person has a daily touch threshold</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; text-align: center;">
              <div style="background: #fef3c7; border-radius: 20px; padding: 30px;">
                <div style="font-size: 48px; margin-bottom: 20px;">👶</div>
                <div style="font-size: 20px; font-weight: 600; color: #f59e0b;">Baby Touch</div>
                <div style="font-size: 16px; color: #666; margin-top: 10px;">
                  18+ hours daily<br/>
                  Constant skin contact<br/>
                  Necessary for development
                </div>
              </div>
              
              <div style="background: #fee2e2; border-radius: 20px; padding: 30px;">
                <div style="font-size: 48px; margin-bottom: 20px;">⛔</div>
                <div style="font-size: 20px; font-weight: 600; color: #dc2626;">Touch Overload</div>
                <div style="font-size: 16px; color: #666; margin-top: 10px;">
                  Sensory system maxed out<br/>
                  No capacity remaining<br/>
                  Needs protection, not more
                </div>
              </div>
              
              <div style="background: #dbeafe; border-radius: 20px; padding: 30px;">
                <div style="font-size: 48px; margin-bottom: 20px;">💔</div>
                <div style="font-size: 20px; font-weight: 600; color: #3b82f6;">Partner Impact</div>
                <div style="font-size: 16px; color: #666; margin-top: 10px;">
                  Feels rejected<br/>
                  Takes it personally<br/>
                  Doesn't understand why
                </div>
              </div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px;">
            <div style="background: #f0fdf4; border-radius: 30px; padding: 40px;">
              <div style="font-size: 28px; font-weight: 600; color: #16a34a; margin-bottom: 25px;">What "Touched Out" Feels Like</div>
              <div style="font-size: 18px; line-height: 2; color: #666;">
                • Skin crawling sensation<br/>
                • Desire to peel hands off you<br/>
                • Physical recoil from touch<br/>
                • Feeling claustrophobic in hugs<br/>
                • Need for personal space bubble<br/>
                • Irritation at gentle touches<br/>
                • Body saying "no more input"
              </div>
            </div>
            
            <div style="background: #eff6ff; border-radius: 30px; padding: 40px;">
              <div style="font-size: 28px; font-weight: 600; color: #3b82f6; margin-bottom: 25px;">The Recovery Process</div>
              <div style="font-size: 18px; line-height: 2; color: #666;">
                • Touch aversion peaks at 3-4 months<br/>
                • Gradual improvement after 6 months<br/>
                • Breastfeeding extends the timeline<br/>
                • Sleep deprivation amplifies it<br/>
                • Stress makes it worse<br/>
                • Self-care helps recovery<br/>
                • It WILL get better
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 4,
    title: "Redefining Intimacy",
    html: `
      <div class="slide-container" style="background: white; color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            <span style="color: #7c3aed; font-weight: 600;">Intimacy</span> ≠ Just Sex
          </h2>
          
          <div style="background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%); border-radius: 30px; padding: 50px; margin-bottom: 40px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="font-size: 32px; font-weight: 600; color: #7c3aed;">The 5 Types of Intimacy</div>
              <div style="font-size: 20px; color: #6b21a8; margin-top: 10px;">All equally valid and valuable</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 25px;">
              <div style="background: white; border-radius: 20px; padding: 25px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 15px;">🧠</div>
                <div style="font-size: 18px; font-weight: 600; color: #7c3aed;">Intellectual</div>
                <div style="font-size: 14px; color: #666; margin-top: 10px;">
                  Deep conversations<br/>
                  Sharing ideas<br/>
                  Mental connection
                </div>
              </div>
              
              <div style="background: white; border-radius: 20px; padding: 25px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 15px;">💗</div>
                <div style="font-size: 18px; font-weight: 600; color: #7c3aed;">Emotional</div>
                <div style="font-size: 14px; color: #666; margin-top: 10px;">
                  Vulnerability<br/>
                  Feeling understood<br/>
                  Emotional safety
                </div>
              </div>
              
              <div style="background: white; border-radius: 20px; padding: 25px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 15px;">🤗</div>
                <div style="font-size: 18px; font-weight: 600; color: #7c3aed;">Physical</div>
                <div style="font-size: 14px; color: #666; margin-top: 10px;">
                  Hugs, kisses<br/>
                  Cuddling<br/>
                  Non-sexual touch
                </div>
              </div>
              
              <div style="background: white; border-radius: 20px; padding: 25px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 15px;">🌟</div>
                <div style="font-size: 18px; font-weight: 600; color: #7c3aed;">Spiritual</div>
                <div style="font-size: 14px; color: #666; margin-top: 10px;">
                  Shared values<br/>
                  Life purpose<br/>
                  Deeper meaning
                </div>
              </div>
              
              <div style="background: white; border-radius: 20px; padding: 25px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 15px;">🔥</div>
                <div style="font-size: 18px; font-weight: 600; color: #7c3aed;">Sexual</div>
                <div style="font-size: 14px; color: #666; margin-top: 10px;">
                  Physical desire<br/>
                  Sexual connection<br/>
                  Erotic energy
                </div>
              </div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px;">
            <div style="background: #e0e7ff; border-radius: 30px; padding: 40px;">
              <div style="font-size: 28px; font-weight: 600; color: #6366f1; margin-bottom: 25px;">Right Now, Focus On</div>
              
              <div style="space-y: 20px;">
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; font-weight: 600; color: #6366f1;">Emotional Intimacy</div>
                  <div style="font-size: 16px; color: #666; margin-top: 10px;">
                    Sharing your real feelings about motherhood
                  </div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; font-weight: 600; color: #6366f1;">Intellectual Intimacy</div>
                  <div style="font-size: 16px; color: #666; margin-top: 10px;">
                    Conversations beyond baby logistics
                  </div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; font-weight: 600; color: #6366f1;">Spiritual Intimacy</div>
                  <div style="font-size: 16px; color: #666; margin-top: 10px;">
                    Discussing your hopes for your family
                  </div>
                </div>
              </div>
            </div>
            
            <div style="background: #dcfce7; border-radius: 30px; padding: 40px;">
              <div style="font-size: 28px; font-weight: 600; color: #16a34a; margin-bottom: 25px;">When You're Ready</div>
              
              <div style="background: white; padding: 30px; border-radius: 20px;">
                <div style="font-size: 20px; font-weight: 600; color: #16a34a; margin-bottom: 20px;">Physical & Sexual Intimacy</div>
                <div style="font-size: 18px; line-height: 1.8; color: #666;">
                  Will return gradually<br/>
                  May feel different than before<br/>
                  Requires patience and communication<br/>
                  Starts with non-sexual touch<br/>
                  Builds slowly over time<br/><br/>
                  
                  <strong style="color: #16a34a;">Average timeline: 6-12 months</strong><br/>
                  <span style="font-size: 16px;">And that's completely normal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 5,
    title: "Communication Scripts",
    html: `
      <div class="slide-container" style="background: linear-gradient(180deg, #dcfce7 0%, #bbf7d0 100%); color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            <span style="color: #16a34a; font-weight: 600;">Honest</span> Conversations About Intimacy
          </h2>
          
          <div style="background: white; border-radius: 30px; padding: 50px; box-shadow: 0 20px 60px rgba(0,0,0,0.08);">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="font-size: 32px; font-weight: 600; color: #16a34a;">Scripts That Actually Work</div>
              <div style="font-size: 20px; color: #666; margin-top: 10px;">Research-backed phrases for difficult conversations</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px;">
              <div style="background: #f0fdf4; border-radius: 20px; padding: 30px;">
                <div style="font-size: 24px; font-weight: 600; color: #16a34a; margin-bottom: 20px;">
                  🌱 Explaining Touch Aversion
                </div>
                
                <div style="space-y: 20px;">
                  <div style="background: white; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 16px; color: #666; line-height: 1.8;">
                      "My body is touched out from baby care. It's not about you - it's about my nervous system being overwhelmed."
                    </div>
                  </div>
                  
                  <div style="background: white; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 16px; color: #666; line-height: 1.8;">
                      "I need some touch-free time to reset. Can we connect in other ways right now?"
                    </div>
                  </div>
                  
                  <div style="background: white; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 16px; color: #666; line-height: 1.8;">
                      "My hormones are literally designed to suppress my sex drive while breastfeeding. This is temporary."
                    </div>
                  </div>
                </div>
              </div>
              
              <div style="background: #f0fdf4; border-radius: 20px; padding: 30px;">
                <div style="font-size: 24px; font-weight: 600; color: #16a34a; margin-bottom: 20px;">
                  💚 Reassuring Your Partner
                </div>
                
                <div style="space-y: 20px;">
                  <div style="background: white; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 16px; color: #666; line-height: 1.8;">
                      "I still love you and find you attractive. My body just needs time to recover."
                    </div>
                  </div>
                  
                  <div style="background: white; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 16px; color: #666; line-height: 1.8;">
                      "This isn't permanent. I want to reconnect physically when I'm ready."
                    </div>
                  </div>
                  
                  <div style="background: white; padding: 20px; border-radius: 15px;">
                    <div style="font-size: 16px; color: #666; line-height: 1.8;">
                      "Can we focus on emotional and intellectual intimacy while my body heals?"
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div style="background: #e0e7ff; border-radius: 20px; padding: 30px; margin-top: 40px;">
              <div style="font-size: 24px; font-weight: 600; color: #6366f1; margin-bottom: 20px;">
                🗣️ For Partners to Say
              </div>
              
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 16px; color: #666; line-height: 1.8;">
                    "I understand your body needs time. I'm not going anywhere."
                  </div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 16px; color: #666; line-height: 1.8;">
                    "What kind of connection do you need from me right now?"
                  </div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 16px; color: #666; line-height: 1.8;">
                    "Your comfort and healing come first. No pressure, ever."
                  </div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 16px; color: #666; line-height: 1.8;">
                    "How can I support you without expecting anything physical?"
                  </div>
                </div>
              </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); color: white; padding: 30px; border-radius: 20px; margin-top: 40px;">
              <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: 600;">The Most Important Script</div>
                <div style="font-size: 18px; margin-top: 15px;">
                  "We're a team figuring this out together. Your needs matter just as much as mine."
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
    title: "Non-Sexual Intimacy Ideas",
    html: `
      <div class="slide-container" style="background: white; color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            <span style="color: #f59e0b; font-weight: 600;">Connection</span> Without Physical Touch
          </h2>
          
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); border-radius: 30px; padding: 50px; margin-bottom: 40px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="font-size: 32px; font-weight: 600; color: #92400e;">Intimacy Alternatives That Work</div>
              <div style="font-size: 20px; color: #78350f; margin-top: 10px;">Building connection when touch feels overwhelming</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
              <div style="background: white; border-radius: 20px; padding: 30px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">👀</div>
                <div style="font-size: 20px; font-weight: 600; color: #f59e0b;">Eye Contact Moments</div>
                <div style="font-size: 16px; color: #666; margin-top: 10px;">
                  Morning coffee together<br/>
                  Bedtime check-ins<br/>
                  No phones, just presence
                </div>
              </div>
              
              <div style="background: white; border-radius: 20px; padding: 30px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">💌</div>
                <div style="font-size: 20px; font-weight: 600; color: #f59e0b;">Love Languages</div>
                <div style="font-size: 16px; color: #666; margin-top: 10px;">
                  Words of affirmation<br/>
                  Acts of service<br/>
                  Quality time together
                </div>
              </div>
              
              <div style="background: white; border-radius: 20px; padding: 30px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">🎯</div>
                <div style="font-size: 20px; font-weight: 600; color: #f59e0b;">Shared Activities</div>
                <div style="font-size: 16px; color: #666; margin-top: 10px;">
                  Cooking together<br/>
                  Watching shows<br/>
                  Planning future dreams
                </div>
              </div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px;">
            <div style="background: #eff6ff; border-radius: 30px; padding: 40px;">
              <div style="font-size: 28px; font-weight: 600; color: #3b82f6; margin-bottom: 25px;">Daily Connection Rituals</div>
              
              <div style="font-size: 18px; line-height: 2; color: #666;">
                <strong>Morning:</strong> 5-minute coffee chat<br/>
                <strong>Midday:</strong> Appreciative text message<br/>
                <strong>Evening:</strong> Share daily highlights<br/>
                <strong>Bedtime:</strong> Gratitude practice<br/><br/>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="color: #3b82f6; font-weight: 600;">The 2-Minute Rule:</div>
                  <div style="margin-top: 10px;">Two minutes of uninterrupted attention creates more connection than hours of distracted time together</div>
                </div>
              </div>
            </div>
            
            <div style="background: #fce7f3; border-radius: 30px; padding: 40px;">
              <div style="font-size: 28px; font-weight: 600; color: #ec4899; margin-bottom: 25px;">When You Miss Physical Touch</div>
              
              <div style="space-y: 20px;">
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; font-weight: 600; color: #ec4899;">Start Small</div>
                  <div style="font-size: 16px; color: #666; margin-top: 10px;">
                    Hand holding during TV<br/>
                    Brief shoulder touches<br/>
                    Forehead kisses
                  </div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; font-weight: 600; color: #ec4899;">Self-Initiated</div>
                  <div style="font-size: 16px; color: #666; margin-top: 10px;">
                    You control timing<br/>
                    You set the boundaries<br/>
                    No pressure to escalate
                  </div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; font-weight: 600; color: #ec4899;">Communicate Intent</div>
                  <div style="font-size: 16px; color: #666; margin-top: 10px;">
                    "This is just cuddling"<br/>
                    "No expectations attached"<br/>
                    Clear boundaries help both
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
    slideNumber: 7,
    title: "The Gradual Return",
    html: `
      <div class="slide-container" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            When <span style="font-weight: 600;">Desire</span> Starts to Return
          </h2>
          
          <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 30px; padding: 50px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="font-size: 32px; font-weight: 600;">The Recovery Timeline</div>
              <div style="font-size: 20px; opacity: 0.9; margin-top: 10px;">Every body is different - this is a guideline, not a rule</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; margin-bottom: 40px;">
              <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; text-align: center;">
                <div style="font-size: 36px; font-weight: bold; margin-bottom: 15px;">0-6wks</div>
                <div style="font-size: 18px; margin-bottom: 10px;">Physical Healing</div>
                <div style="font-size: 16px; opacity: 0.8;">
                  Focus on recovery<br/>
                  No penetration<br/>
                  Doctor clearance needed
                </div>
              </div>
              
              <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; text-align: center;">
                <div style="font-size: 36px; font-weight: bold; margin-bottom: 15px;">6wks-6mo</div>
                <div style="font-size: 18px; margin-bottom: 10px;">Adjustment Period</div>
                <div style="font-size: 16px; opacity: 0.8;">
                  Hormones still shifting<br/>
                  Touch aversion common<br/>
                  Focus on other intimacy
                </div>
              </div>
              
              <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; text-align: center;">
                <div style="font-size: 36px; font-weight: bold; margin-bottom: 15px;">6-12mo</div>
                <div style="font-size: 18px; margin-bottom: 10px;">Gradual Return</div>
                <div style="font-size: 16px; opacity: 0.8;">
                  Desire may fluctuate<br/>
                  Start with non-sexual touch<br/>
                  Communication is key
                </div>
              </div>
              
              <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; text-align: center;">
                <div style="font-size: 36px; font-weight: bold; margin-bottom: 15px;">12mo+</div>
                <div style="font-size: 18px; margin-bottom: 10px;">New Normal</div>
                <div style="font-size: 16px; opacity: 0.8;">
                  Different than before<br/>
                  May be even better<br/>
                  Requires patience
                </div>
              </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px;">
              <div style="background: rgba(255,255,255,0.15); padding: 30px; border-radius: 20px;">
                <div style="font-size: 24px; font-weight: 600; margin-bottom: 20px;">Signs You Might Be Ready</div>
                <div style="font-size: 18px; line-height: 2;">
                  • Thinking about intimacy positively<br/>
                  • Initiating non-sexual touch<br/>
                  • Feeling less "touched out"<br/>
                  • Interest in kissing/cuddling<br/>
                  • Better sleep patterns<br/>
                  • Emotional readiness<br/>
                  • Physical comfort returns
                </div>
              </div>
              
              <div style="background: rgba(255,255,255,0.15); padding: 30px; border-radius: 20px;">
                <div style="font-size: 24px; font-weight: 600; margin-bottom: 20px;">Taking It Slow</div>
                <div style="font-size: 18px; line-height: 2;">
                  • Start with making out<br/>
                  • Use lots of lubrication<br/>
                  • Go at your pace<br/>
                  • Stop if it doesn't feel good<br/>
                  • Communicate throughout<br/>
                  • No pressure to orgasm<br/>
                  • Focus on connection, not performance
                </div>
              </div>
            </div>
            
            <div style="background: rgba(255,255,255,0.2); padding: 30px; border-radius: 20px; margin-top: 40px; text-align: center;">
              <div style="font-size: 24px; font-weight: 600;">
                Remember: There's no rush and no timeline you "should" follow
              </div>
              <div style="font-size: 18px; margin-top: 15px; opacity: 0.9;">
                Your body, your pace, your choice. Always.
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    slideNumber: 8,
    title: "Practical Tips for Physical Intimacy",
    html: `
      <div class="slide-container" style="background: white; color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            Making <span style="color: #dc2626; font-weight: 600;">Physical Intimacy</span> Work Again
          </h2>
          
          <div style="background: #fee2e2; border-radius: 30px; padding: 50px; margin-bottom: 40px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="font-size: 32px; font-weight: 600; color: #dc2626;">The Practical Reality</div>
              <div style="font-size: 20px; color: #666; margin-top: 10px;">What actually helps when you're ready to reconnect</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
              <div style="background: white; border-radius: 20px; padding: 30px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">💧</div>
                <div style="font-size: 20px; font-weight: 600; color: #dc2626;">Lubrication</div>
                <div style="font-size: 16px; color: #666; margin-top: 10px;">
                  Essential, not optional<br/>
                  Low estrogen = dryness<br/>
                  Use generously, reapply often
                </div>
              </div>
              
              <div style="background: white; border-radius: 20px; padding: 30px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">⏰</div>
                <div style="font-size: 20px; font-weight: 600; color: #dc2626;">Timing Matters</div>
                <div style="font-size: 16px; color: #666; margin-top: 10px;">
                  When baby is settled<br/>
                  You're not exhausted<br/>
                  No time pressure
                </div>
              </div>
              
              <div style="background: white; border-radius: 20px; padding: 30px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">🗣️</div>
                <div style="font-size: 20px; font-weight: 600; color: #dc2626;">Communication</div>
                <div style="font-size: 16px; color: #666; margin-top: 10px;">
                  Say what feels good<br/>
                  Say what doesn't<br/>
                  Check in frequently
                </div>
              </div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px;">
            <div style="background: #dcfce7; border-radius: 30px; padding: 40px;">
              <div style="font-size: 28px; font-weight: 600; color: #16a34a; margin-bottom: 25px;">What Might Feel Different</div>
              
              <div style="space-y: 20px;">
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; font-weight: 600; color: #16a34a;">Physical Changes</div>
                  <div style="font-size: 16px; color: #666; margin-top: 10px;">
                    • Different sensitivity levels<br/>
                    • Need more warm-up time<br/>
                    • Different positions feel better<br/>
                    • May need to go slower
                  </div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; font-weight: 600; color: #16a34a;">Mental Changes</div>
                  <div style="font-size: 16px; color: #666; margin-top: 10px;">
                    • Harder to focus/be present<br/>
                    • May think about baby<br/>
                    • Different arousal patterns<br/>
                    • Need more mental preparation
                  </div>
                </div>
              </div>
            </div>
            
            <div style="background: #e0e7ff; border-radius: 30px; padding: 40px;">
              <div style="font-size: 28px; font-weight: 600; color: #6366f1; margin-bottom: 25px;">Making It Easier</div>
              
              <div style="space-y: 20px;">
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; font-weight: 600; color: #6366f1;">Environment</div>
                  <div style="font-size: 16px; color: #666; margin-top: 10px;">
                    • Comfortable temperature<br/>
                    • Soft lighting or darkness<br/>
                    • Baby monitor on low<br/>
                    • Door locked for privacy
                  </div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; font-weight: 600; color: #6366f1;">Mindset</div>
                  <div style="font-size: 16px; color: #666; margin-top: 10px;">
                    • No pressure to climax<br/>
                    • Focus on connection<br/>
                    • It's okay to stop<br/>
                    • Practice makes better
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
    slideNumber: 9,
    title: "Building Your New Intimacy",
    html: `
      <div class="slide-container" style="background: linear-gradient(180deg, #faf5ff 0%, #f3e8ff 100%); color: #2d2d44; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 52px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            Creating Your <span style="color: #7c3aed; font-weight: 600;">New Normal</span>
          </h2>
          
          <div style="background: white; border-radius: 30px; padding: 50px; box-shadow: 0 20px 60px rgba(0,0,0,0.08); margin-bottom: 40px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="font-size: 32px; font-weight: 600; color: #7c3aed;">Your Intimacy Evolution</div>
              <div style="font-size: 20px; color: #666; margin-top: 10px;">It won't be the same - it can be even better</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
              <div style="background: #faf5ff; border-radius: 20px; padding: 30px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">📊</div>
                <div style="font-size: 20px; font-weight: 600; color: #7c3aed;">Before Baby</div>
                <div style="font-size: 16px; color: #666; margin-top: 10px;">
                  Spontaneous<br/>
                  Physically focused<br/>
                  Frequency mattered<br/>
                  Performance oriented
                </div>
              </div>
              
              <div style="background: #f3e8ff; border-radius: 20px; padding: 30px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">🔄</div>
                <div style="font-size: 20px; font-weight: 600; color: #7c3aed;">Transition Period</div>
                <div style="font-size: 16px; color: #666; margin-top: 10px;">
                  Figuring it out<br/>
                  Lots of communication<br/>
                  Trial and error<br/>
                  Patience required
                </div>
              </div>
              
              <div style="background: #e9d5ff; border-radius: 20px; padding: 30px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">✨</div>
                <div style="font-size: 20px; font-weight: 600; color: #7c3aed;">After Integration</div>
                <div style="font-size: 16px; color: #666; margin-top: 10px;">
                  More intentional<br/>
                  Deeper connection<br/>
                  Quality over quantity<br/>
                  Emotionally richer
                </div>
              </div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px;">
            <div style="background: #dcfce7; border-radius: 30px; padding: 40px;">
              <div style="font-size: 28px; font-weight: 600; color: #16a34a; margin-bottom: 25px;">What Many Couples Discover</div>
              
              <div style="font-size: 18px; line-height: 2; color: #666;">
                • Deeper emotional intimacy<br/>
                • More intentional connection<br/>
                • Better communication skills<br/>
                • Increased appreciation<br/>
                • Quality trumps quantity<br/>
                • New forms of pleasure<br/>
                • Stronger partnership bond<br/>
                • More meaningful encounters
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 15px; margin-top: 25px;">
                <div style="color: #16a34a; font-weight: 600; text-align: center;">
                  "It's different, but in many ways better"<br/>
                  <span style="font-size: 16px; color: #666;">- 68% of couples at 2+ years postpartum</span>
                </div>
              </div>
            </div>
            
            <div style="background: #e0e7ff; border-radius: 30px; padding: 40px;">
              <div style="font-size: 28px; font-weight: 600; color: #6366f1; margin-bottom: 25px;">Building Your Blueprint</div>
              
              <div style="space-y: 20px;">
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; font-weight: 600; color: #6366f1;">Identify What Matters</div>
                  <div style="font-size: 16px; color: #666; margin-top: 10px;">
                    What types of intimacy do you both value most?
                  </div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; font-weight: 600; color: #6366f1;">Set Realistic Expectations</div>
                  <div style="font-size: 16px; color: #666; margin-top: 10px;">
                    Quality connection over frequency
                  </div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; font-weight: 600; color: #6366f1;">Create New Rituals</div>
                  <div style="font-size: 16px; color: #666; margin-top: 10px;">
                    Daily moments of intentional connection
                  </div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                  <div style="font-size: 18px; font-weight: 600; color: #6366f1;">Stay Flexible</div>
                  <div style="font-size: 16px; color: #666; margin-top: 10px;">
                    Adapt as you both continue to evolve
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
    slideNumber: 10,
    title: "Your Intimacy Recovery Plan",
    html: `
      <div class="slide-container" style="background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); color: white; padding: 60px; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div class="content-wrapper" style="max-width: 1200px; width: 100%;">
          <h2 style="font-size: 56px; font-weight: 300; text-align: center; margin-bottom: 50px;">
            Your <span style="font-weight: 600;">Intimacy Recovery</span> Plan
          </h2>
          
          <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 30px; padding: 50px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="font-size: 32px; font-weight: 600;">This Week's Practice</div>
              <div style="font-size: 20px; opacity: 0.9; margin-top: 10px;">Rebuilding connection at your pace</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-bottom: 40px;">
              <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">💬</div>
                <div style="font-size: 24px; font-weight: 600; margin-bottom: 15px;">Day 1-2</div>
                <div style="font-size: 18px; line-height: 1.6;">
                  Have the conversation<br/>
                  Share this lesson<br/>
                  No expectations<br/>
                  <div style="margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                    Open honest dialogue
                  </div>
                </div>
              </div>
              
              <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">🤗</div>
                <div style="font-size: 24px; font-weight: 600; margin-bottom: 15px;">Day 3-4</div>
                <div style="font-size: 18px; line-height: 1.6;">
                  Practice non-sexual intimacy<br/>
                  Eye contact moments<br/>
                  Emotional connection<br/>
                  <div style="margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                    Build foundation
                  </div>
                </div>
              </div>
              
              <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">👐</div>
                <div style="font-size: 24px; font-weight: 600; margin-bottom: 15px;">Day 5-7</div>
                <div style="font-size: 18px; line-height: 1.6;">
                  Try gentle touch<br/>
                  Only if you want to<br/>
                  Your initiation only<br/>
                  <div style="margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                    Test the waters
                  </div>
                </div>
              </div>
            </div>
            
            <div style="background: rgba(255,255,255,0.2); padding: 40px; border-radius: 20px;">
              <div style="font-size: 28px; font-weight: 600; text-align: center; margin-bottom: 30px;">
                Your Intimacy Priorities Right Now
              </div>
              
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; text-align: center;">
                <div>
                  <div style="font-size: 20px; font-weight: bold;">Emotional</div>
                  <div style="font-size: 16px; opacity: 0.9;">Deep conversations</div>
                </div>
                <div>
                  <div style="font-size: 20px; font-weight: bold;">Intellectual</div>
                  <div style="font-size: 16px; opacity: 0.9;">Shared interests</div>
                </div>
                <div>
                  <div style="font-size: 20px; font-weight: bold;">Spiritual</div>
                  <div style="font-size: 16px; opacity: 0.9;">Common values</div>
                </div>
                <div>
                  <div style="font-size: 20px; font-weight: bold;">Physical</div>
                  <div style="font-size: 16px; opacity: 0.9;">When ready</div>
                </div>
              </div>
              
              <div style="margin-top: 30px; text-align: center; font-size: 20px;">
                All types of intimacy are valid • Go at your own pace
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 40px;">
              <div style="font-size: 24px; font-weight: 600; margin-bottom: 20px;">
                Remember: Your timeline is the right timeline
              </div>
              <div style="font-size: 20px; opacity: 0.9;">
                Intimacy isn't just about sex - it's about feeling seen, known, and valued.<br/>
                Start where you are. Build slowly. Communicate openly.<br/>
                Your relationship can become deeper and more connected than ever.<br/><br/>
                <strong>Trust your body. Trust your heart. Trust your timeline.</strong>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; font-size: 18px; opacity: 0.8;">
            Based on postpartum sexuality research and couples therapy best practices
          </div>
        </div>
      </div>
    `
  }
];

// Create the HTML file with all slides
const createWeek3Lesson4Slides = () => {
  const slidesHtml = week3Lesson4Slides
    .map(slide => slide.html)
    .join('\n<!-- SLIDE -->\n');
    
  const outputPath = path.join(__dirname, '..', 'course-materials', 'week3-lesson4-slides.html');
  
  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, slidesHtml);
  console.log('Created Week 3, Lesson 4: Intimacy and Connection slides!');
  console.log(`Output: ${outputPath}`);
  console.log(`Total slides: ${week3Lesson4Slides.length}`);
};

// Run the script
createWeek3Lesson4Slides();