'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Menu, X, Shield, Heart, Home, Crown, Compass, Balance, Users, MessageSquare, Gift, Clock, AlertTriangle, CheckCircle, Star, Layers } from 'lucide-react';

// Beautiful slide data for Week 4 Lesson 3
const slides = [
  {
    id: 1,
    type: 'hero',
    content: {
      title: 'Navigating Family Dynamics and Expectations',
      subtitle: 'Setting Loving Boundaries',
      description: 'Family relationships can be the most supportive and the most challenging. Today we learn to honor family connections while protecting your growing family\'s needs and values.',
      background: 'gradient-family',
      backgroundImage: '/images/biff01_imagine_mixed-race_parents_with_newborn_tender_family__1caa7f06-30ca-47c7-a1cd-038dc0cea487_3.png',
      overlay: true
    }
  },
  {
    id: 2,
    type: 'family-complexity',
    content: {
      title: 'The Beautiful Complexity of Family',
      subtitle: 'Why family relationships are uniquely challenging',
      whyDifficult: [
        {
          factor: 'DEEP HISTORY',
          description: 'Years of established patterns and roles',
          impact: 'People may see you as who you were, not who you\'re becoming',
          example: 'Still treating you like "the baby" of the family'
        },
        {
          factor: 'HIGH EMOTIONAL STAKES',
          description: 'These relationships matter deeply to you',
          impact: 'Harder to set boundaries when you fear losing connection',
          example: 'Wanting your mother\'s approval while protecting your choices'
        },
        {
          factor: 'AUTOMATIC LOVE',
          description: 'Love exists regardless of healthy dynamics',
          impact: 'Can enable unhealthy patterns in the name of family',
          example: 'Accepting criticism because "they mean well"'
        },
        {
          factor: 'GENERATIONAL DIFFERENCES',
          description: 'Different eras of parenting wisdom and values',
          impact: 'Conflicts over "the right way" to parent',
          example: 'Disagreements about sleep training, feeding, screen time'
        },
        {
          factor: 'ROLE SHIFTS',
          description: 'Becoming a parent changes your family position',
          impact: 'Others may struggle to see you as an adult with authority',
          example: 'In-laws undermining your parenting decisions'
        }
      ],
      newParentChallenges: [
        'Feeling caught between pleasing family and protecting your baby',
        'Managing advice, criticism, and unwanted opinions',
        'Establishing your authority as your child\'s parent',
        'Balancing time and energy between family obligations and your nuclear family',
        'Creating new traditions while honoring old ones'
      ],
      truthToRemember: 'Your first loyalty is to your nuclear family - your partner and children. This isn\'t selfish; it\'s how healthy families work.',
      background: 'gradient-complexity',
      backgroundImage: '/images/biff01_imagine_exhausted_but_loving_mother_with_twins_double__b2ac5580-9b28-4752-a4b3-c61a524b828d_2.png'
    }
  },
  {
    id: 3,
    type: 'boundary-types',
    content: {
      title: 'Types of Family Boundaries',
      subtitle: 'Different boundaries for different relationships and situations',
      boundaryCategories: [
        {
          type: 'TIME BOUNDARIES',
          icon: '⏰',
          color: 'blue',
          description: 'Protecting your time and availability',
          examples: [
            '"We need advance notice for visits"',
            '"Sunday afternoons are family rest time"',
            '"We can visit for 2 hours, not the whole day"',
            '"Please call before coming over"'
          ],
          scripts: [
            '"We love seeing you and need to plan visits in advance to work with baby\'s schedule."',
            '"We\'re not available for last-minute plans right now, but we\'d love to schedule something for next week."'
          ]
        },
        {
          type: 'ADVICE BOUNDARIES',
          icon: '💬',
          color: 'purple',
          description: 'Managing unsolicited opinions and suggestions',
          examples: [
            '"We\'ve decided on our approach to feeding/sleep"',
            '"We\'re not taking advice about this topic"',
            '"If we want suggestions, we\'ll ask"',
            '"Our pediatrician supports our choice"'
          ],
          scripts: [
            '"I appreciate your concern. We\'ve researched this and feel confident in our decision."',
            '"Thanks for caring. Right now I need support for our choices, not suggestions for different ones."'
          ]
        },
        {
          type: 'PHYSICAL BOUNDARIES',
          icon: '🤱',
          color: 'green',
          description: 'Protecting your and baby\'s physical space',
          examples: [
            '"Please ask before holding the baby"',
            '"We need people to wash hands first"',
            '"Baby needs to stay with mom for feeding time"',
            '"We\'re not comfortable with that yet"'
          ],
          scripts: [
            '"We\'re being careful about germs right now. Please wash your hands before holding baby."',
            '"Baby is getting overstimulated. I need to take them somewhere quiet."'
          ]
        },
        {
          type: 'EMOTIONAL BOUNDARIES',
          icon: '💝',
          color: 'pink',
          description: 'Protecting your emotional energy and wellbeing',
          examples: [
            '"I\'m not discussing our parenting choices"',
            '"That topic is off-limits for me right now"',
            '"I need support, not judgment"',
            '"I won\'t defend our decisions"'
          ],
          scripts: [
            '"I\'m feeling overwhelmed and need conversations to be supportive right now."',
            '"I won\'t be discussing that topic today. Let\'s talk about something else."'
          ]
        }
      ],
      boundaryReminders: [
        'Boundaries are about your behavior, not controlling others',
        'You can set boundaries with love and respect',
        'Boundaries protect relationships by preventing resentment',
        'You don\'t need to justify your boundaries',
        'Boundaries can be adjusted as situations change'
      ],
      background: 'gradient-boundaries',
      backgroundImage: '/images/biff01_imagine_cozy_therapy_office_comfortable_armchair_warm__da0354fc-70ec-4bb0-90f7-96e8eb17f2e7_1.png'
    }
  },
  {
    id: 4,
    type: 'handling-advice',
    content: {
      title: 'Handling Unsolicited Advice and Criticism',
      subtitle: 'Responding to well-meaning but unwanted input',
      commonAdviceScenarios: [
        {
          scenario: 'FEEDING CHOICES',
          commonCriticism: '"You should breastfeed longer/stop breastfeeding/try formula/try solids earlier"',
          responseOptions: [
            'Redirect: "Our pediatrician is happy with baby\'s growth."',
            'Information diet: "We\'ve got feeding figured out, thanks."',
            'Firm boundary: "We\'re not taking feeding advice right now."'
          ]
        },
        {
          scenario: 'SLEEP METHODS',
          commonCriticism: '"You\'re spoiling the baby/should let them cry/should co-sleep/shouldn\'t co-sleep"',
          responseOptions: [
            'Confidence: "We\'re doing what works for our family."',
            'Deflect: "Every baby is different. This is working for us."',
            'End discussion: "We\'re happy with our sleep approach."'
          ]
        },
        {
          scenario: 'WORK/CARE DECISIONS',
          commonCriticism: '"You should stay home/go back to work/use different childcare"',
          responseOptions: [
            'Values-based: "We\'ve made the choice that aligns with our values."',
            'Practical: "We\'ve considered our options and this works best."',
            'Boundary: "Our work-life decisions are private."'
          ]
        },
        {
          scenario: 'BABY\'S BEHAVIOR',
          commonCriticism: '"The baby cries too much/is too attached/needs more independence"',
          responseOptions: [
            'Normalize: "This is normal behavior for baby\'s age."',
            'Professional backing: "Our pediatrician says baby is developing perfectly."',
            'Protective: "Baby is exactly where they need to be developmentally."'
          ]
        }
      ],
      responseStrategies: [
        {
          strategy: 'THE INFORMATION DIET',
          description: 'Share less information about your choices',
          example: 'Instead of explaining your sleep method, just say "Sleep is going well, thanks."'
        },
        {
          strategy: 'THE BROKEN RECORD',
          description: 'Repeat the same response consistently',
          example: 'Keep saying "We\'ve got it handled" no matter what they suggest'
        },
        {
          strategy: 'THE REDIRECT',
          description: 'Change the subject to something positive',
          example: '"Speaking of baby, did you see how they smiled yesterday?"'
        },
        {
          strategy: 'THE APPRECIATION SANDWICH',
          description: 'Acknowledge caring while maintaining your boundary',
          example: '"I know you care about us. We\'ve got this covered. How are things with you?"'
        }
      ],
      selfTalk: [
        '"Their opinion doesn\'t change what\'s right for my family"',
        '"I don\'t need their approval to be a good parent"',
        '"They\'re speaking from their experience, not my reality"',
        '"I can love them and disagree with them"',
        '"My confidence in my choices matters more than their comfort with them"'
      ],
      whenToEscalate: 'If someone repeatedly disrespects your boundaries or undermines your parenting in front of your children, it\'s time for a more serious conversation or consequences.',
      background: 'gradient-advice',
      backgroundImage: '/images/biff01_imagine_warm_modern_therapy_office_two_women_in_conver_1b19f253-c5eb-4b43-b05c-cabfbbf7c66b_3.png'
    }
  },
  {
    id: 5,
    type: 'partner-dynamics',
    content: {
      title: 'Navigating Partner and In-Law Dynamics',
      subtitle: 'When family relationships affect your partnership',
      commonChallenges: [
        {
          challenge: 'PARTNER WON\'T SET BOUNDARIES WITH THEIR FAMILY',
          impact: 'You feel unsupported and exposed to criticism or intrusion',
          approach: [
            'Explain the specific impact on you and your wellbeing',
            'Ask for specific support rather than general "be on my side"',
            'Agree on boundaries together before family interactions',
            'Have partner communicate boundaries to their family'
          ],
          script: '"When your mom criticizes my parenting and you don\'t respond, I feel alone and unsupported. I need you to speak up when this happens or address it privately with her."'
        },
        {
          challenge: 'IN-LAWS UNDERMINE YOUR AUTHORITY',
          impact: 'Feel disrespected and worried about your child learning to disregard you',
          approach: [
            'Address directly with specific examples',
            'State your expectations clearly',
            'Involve your partner in setting expectations',
            'Be willing to limit contact if behavior continues'
          ],
          script: '"I need you to support our parenting decisions when we\'re with your family. When they give baby different food/ignore our rules, it undermines our authority as parents."'
        },
        {
          challenge: 'FEELING TORN BETWEEN FAMILIES',
          impact: 'Exhaustion from trying to please everyone',
          approach: [
            'Prioritize your nuclear family\'s needs first',
            'Alternate family visits instead of trying to see everyone',
            'Set realistic expectations about holiday/event participation',
            'Give yourself permission to disappoint people sometimes'
          ],
          script: '"We want to see both families, and we can\'t do everything. Let\'s plan which events are most important to each family."'
        },
        {
          challenge: 'PARTNER GUILT-TRIPPED BY FAMILY',
          impact: 'Partner becomes stressed, which affects your relationship',
          approach: [
            'Support partner in recognizing guilt-trip patterns',
            'Help them practice responses to guilt trips',
            'Remind them that your family\'s wellbeing comes first',
            'Consider couples counseling for support'
          ],
          script: '"I notice you get really stressed after talking to your mom. What would help you feel more confident in our choices when she expresses disappointment?"'
        }
      ],
      unifiedFrontStrategies: [
        'Discuss boundaries privately before family visits',
        'Agree on who will address what issues',
        'Support each other\'s decisions in the moment',
        'Debrief after family interactions',
        'Present decisions as joint choices ("We\'ve decided...")'
      ],
      difficultConversations: {
        title: 'Scripts for Difficult Partner Conversations',
        examples: [
          '"I need us to be a team when it comes to family boundaries. How can we support each other better?"',
          '"When your family criticizes our choices and you don\'t respond, I feel like you agree with them. What\'s actually going on for you?"',
          '"I\'m feeling overwhelmed by family expectations. Can we talk about what\'s realistic for us right now?"',
          '"I love your family and I need our choices as parents to be respected. How can we make that happen?"'
        ]
      },
      background: 'gradient-partner',
      backgroundImage: '/images/biff01_imagine_mixed-race_parents_with_newborn_tender_family__1caa7f06-30ca-47c7-a1cd-038dc0cea487_1.png'
    }
  },
  {
    id: 6,
    type: 'holiday-traditions',
    content: {
      title: 'Creating New Traditions While Honoring Old Ones',
      subtitle: 'Balancing family expectations with your family\'s needs',
      traditionTensions: [
        {
          tension: 'HOLIDAY OBLIGATIONS',
          oldPattern: 'Attending every family gathering regardless of your needs',
          newApproach: 'Choosing which events work for your family and politely declining others',
          example: '"We\'ll be at Christmas dinner but won\'t make it to the cookie exchange this year."'
        },
        {
          tension: 'GIFT-GIVING EXPECTATIONS',
          oldPattern: 'Buying expensive gifts you can\'t afford or don\'t want to give',
          newApproach: 'Setting a budget and communicating your approach',
          example: '"We\'re doing homemade gifts this year" or "We\'re focusing on experiences over things."'
        },
        {
          tension: 'HOSTING PRESSURE',
          oldPattern: 'Always hosting because "that\'s how it\'s always been"',
          newApproach: 'Rotating hosting or choosing alternative celebration styles',
          example: '"We\'d love to have everyone over in the spring when things are less hectic."'
        },
        {
          tension: 'RELIGIOUS/CULTURAL DIFFERENCES',
          oldPattern: 'Going along with practices that don\'t align with your values',
          newApproach: 'Respectfully participating in what feels authentic while setting boundaries',
          example: '"We\'ll join for dinner but won\'t participate in the religious service."'
        }
      ],
      creatingNewTraditions: [
        {
          area: 'NUCLEAR FAMILY TRADITIONS',
          ideas: [
            'Special breakfast on baby\'s "monthiversary"',
            'Weekly family walk or special dinner',
            'Annual family photo in the same spot',
            'Creating your own holiday celebration style'
          ]
        },
        {
          area: 'MODIFIED EXTENDED FAMILY TRADITIONS',
          ideas: [
            'Shorter celebration windows that work with baby\'s schedule',
            'Potluck style instead of one person cooking everything',
            'Video calls for family members who can\'t attend',
            'Celebrating holidays on different days when it works better'
          ]
        },
        {
          area: 'COMPLETELY NEW APPROACHES',
          ideas: [
            'Travel during traditionally busy times',
            'Volunteer as a family instead of traditional celebrations',
            'Create friend-based chosen family traditions',
            'Focus on smaller, quieter celebrations'
          ]
        }
      ],
      communicationStrategies: [
        'Announce changes early, not right before events',
        'Explain the "why" when appropriate ("Baby\'s sleep schedule makes evening events hard")',
        'Offer alternatives when possible ("We can\'t do Christmas Day but could do Christmas Eve")',
        'Be consistent year after year so people know what to expect',
        'Focus on what you can do rather than what you can\'t'
      ],
      manageExpectations: [
        '"Our celebration style has changed since becoming parents"',
        '"We\'re creating traditions that work for our family size and stage"',
        '"We want to participate in ways that feel sustainable for us"',
        '"We love family traditions and need to adapt them to fit our current reality"'
      ],
      background: 'gradient-traditions',
      backgroundImage: '/images/biff01_imagine_parent_and_child_connection_playful_interactio_052891a2-ca43-43be-b8ef-bc2b96e01f05_1.png'
    }
  },
  {
    id: 7,
    type: 'geographical-boundaries',
    content: {
      title: 'Geographical and Visiting Boundaries',
      subtitle: 'Managing expectations around visits and relocations',
      visitingChallenges: [
        {
          challenge: 'PRESSURE TO VISIT MORE OFTEN',
          familyExpectation: '"You never visit anymore" or "We barely see the baby"',
          reality: 'Traveling with a baby is exhausting and expensive',
          boundaries: [
            'Set realistic visiting frequency that works for your family',
            'Suggest alternatives like video calls or them visiting you',
            'Explain the realities of traveling with children',
            'Stick to your limits even when guilt is applied'
          ],
          scripts: [
            '"We can visit every [frequency] and would love to have you visit us too."',
            '"Traveling with baby is really hard right now. Could you come to us instead?"'
          ]
        },
        {
          challenge: 'EXPECTATIONS FOR LONG VISITS',
          familyExpectation: 'When you do visit, you should stay for weeks',
          reality: 'Long visits can be stressful and disrupt routines',
          boundaries: [
            'Communicate visit length in advance',
            'Stay in hotels if visits are longer than comfortable',
            'Maintain baby\'s routines even during visits',
            'Plan downtime and space during extended stays'
          ],
          scripts: [
            '"We can stay for [timeframe]. That gives us good family time while keeping baby\'s routine."',
            '"We\'ll get a hotel so everyone has space and baby can nap in quiet."'
          ]
        },
        {
          challenge: 'PRESSURE TO MOVE CLOSER',
          familyExpectation: '"You should move back home to raise the kids near family"',
          reality: 'Your life, career, and community may be elsewhere',
          boundaries: [
            'Acknowledge their desire to be close while maintaining your autonomy',
            'Explain the benefits of your current location',
            'Discuss ways to maintain connection despite distance',
            'Don\'t feel obligated to justify your life choices'
          ],
          scripts: [
            '"We love that you want to be close to us. Our life is established here and this is what works for our family."',
            '"We\'re not planning to relocate, and we want to find ways to stay connected from here."'
          ]
        }
      ],
      hostingBoundaries: [
        {
          boundary: 'ADVANCE NOTICE',
          implementation: 'Require at least [timeframe] notice for visits',
          script: '"We need advance notice to plan around baby\'s schedule and our commitments."'
        },
        {
          boundary: 'VISIT LENGTH',
          implementation: 'Set maximum visit lengths that work for your family',
          script: '"We love having you and find [timeframe] visits work best with our routine."'
        },
        {
          boundary: 'HOUSE RULES',
          implementation: 'Communicate expectations about routines, childcare, and household behavior',
          script: '"While you\'re here, we\'ll stick to baby\'s usual bedtime routine."'
        },
        {
          boundary: 'HELP EXPECTATIONS',
          implementation: 'Clarify whether you want help or just company',
          script: '"We\'re excited to spend time together. We\'re not expecting you to help with household stuff."'
        }
      ],
      longDistanceConnection: [
        'Regular video calls on a schedule that works for everyone',
        'Sharing photos and videos of daily life',
        'Reading books or singing songs over video call',
        'Planning special trips that work for your family\'s capacity',
        'Creating shared digital photo albums'
      ],
      guiltyFeelings: 'It\'s normal to feel guilty about geographical distance. Remember: you can love your family deeply while choosing to live your life elsewhere.',
      background: 'gradient-geography',
      backgroundImage: '/images/biff01_imagine_woman_walking_in_nature_path_trees_and_flowers_dc53f2ba-0c3a-4b5a-a758-62679e547b70_1.png'
    }
  },
  {
    id: 8,
    type: 'difficult-conversations',
    content: {
      title: 'Having the Difficult Conversations',
      subtitle: 'Scripts and strategies for addressing ongoing issues',
      conversationPrep: [
        {
          step: 'CHOOSE THE RIGHT TIME AND PLACE',
          details: [
            'Private setting without distractions',
            'When emotions aren\'t running high',
            'Allow enough time for full discussion',
            'Consider whether to do it in person, over phone, or in writing'
          ]
        },
        {
          step: 'CLARIFY YOUR GOALS',
          details: [
            'What specific behavior change do you want?',
            'What outcome would feel successful?',
            'Are you informing them or asking for cooperation?',
            'What will you do if they don\'t respond well?'
          ]
        },
        {
          step: 'PREPARE YOUR MAIN POINTS',
          details: [
            'Start with love and positive intention',
            'Be specific about problematic behaviors',
            'Explain the impact on you and your family',
            'State what you need going forward'
          ]
        },
        {
          step: 'ANTICIPATE RESPONSES',
          details: [
            'How will you respond to defensiveness?',
            'What if they try to guilt trip you?',
            'How will you handle anger or tears?',
            'What if they refuse to change?'
          ]
        }
      ],
      scriptTemplates: [
        {
          situation: 'SETTING GENERAL BOUNDARIES',
          script: '"I love you and want us to have a good relationship. I need to talk about some things that will help that happen. When [specific behavior], it makes me feel [impact]. Going forward, I need [specific request]. Can we work together on this?"',
          example: '"I love you and want us to have a good relationship. When you give parenting advice without being asked, it makes me feel criticized and doubt myself. Going forward, I need you to ask if I want suggestions before offering them. Can we work together on this?"'
        },
        {
          situation: 'ADDRESSING REPEATED VIOLATIONS',
          script: '"We\'ve talked about [boundary] before, and it\'s still happening. This is really important to me because [why it matters]. I need you to [specific change], or I\'ll need to [consequence]. I hope we can figure this out together."',
          example: '"We\'ve talked about asking before holding the baby, and it\'s still happening. This is important because I\'m learning baby\'s cues and need to be in control of their routine. I need you to ask first, or I\'ll need to hold baby during visits until this gets easier."'
        },
        {
          situation: 'EXPLAINING CHANGES IN RELATIONSHIP',
          script: '"I want you to understand some changes in how we\'re doing things. It\'s not about loving you less - it\'s about what works for our family right now. [Explain changes and reasoning]. I hope you can support us in this."',
          example: '"I want you to understand why we\'re not doing Sunday dinners every week anymore. It\'s not about loving you less - baby\'s schedule makes it really hard and we need more downtime as a family. We\'d love to do it twice a month instead. I hope you can support us in this."'
        }
      ],
      managingReactions: [
        {
          reaction: 'DEFENSIVENESS',
          response: 'Stay calm and redirect to the issue',
          script: '"I\'m not attacking you as a person. I\'m asking for help with a specific situation that\'s affecting our relationship."'
        },
        {
          reaction: 'GUILT TRIPS',
          response: 'Acknowledge their feelings without changing your boundary',
          script: '"I understand you\'re disappointed. This is what works for our family right now."'
        },
        {
          reaction: 'ANGER',
          response: 'Don\'t escalate, but don\'t back down either',
          script: '"I can see you\'re upset. Let\'s take a break and talk about this when we\'re both calmer."'
        },
        {
          reaction: 'REFUSAL TO DISCUSS',
          response: 'Respect their choice while maintaining your boundary',
          script: '"I understand you don\'t want to talk about this. I still need these boundaries for our relationship to work."'
        }
      ],
      afterTheConversation: [
        'Give them time to process what you\'ve shared',
        'Don\'t expect immediate behavior change',
        'Be consistent in enforcing the boundaries you\'ve set',
        'Follow up if needed, but don\'t over-explain',
        'Take care of yourself emotionally after difficult conversations'
      ],
      background: 'gradient-conversations',
      backgroundImage: '/images/biff01_imagine_warm_modern_therapy_office_two_women_in_conver_1b19f253-c5eb-4b43-b05c-cabfbbf7c66b_3.png'
    }
  },
  {
    id: 9,
    type: 'consequences-enforcement',
    content: {
      title: 'Consequences and Boundary Enforcement',
      subtitle: 'What to do when boundaries are repeatedly violated',
      consequenceSpectrum: [
        {
          level: 'NATURAL CONSEQUENCES',
          description: 'Let natural results of behavior occur',
          examples: [
            'Don\'t invite them to events if they consistently disrupt them',
            'End phone calls when conversations become critical',
            'Leave visits early when boundaries are violated',
            'Don\'t share personal information if it gets used against you'
          ],
          whenToUse: 'For minor violations or testing behavior'
        },
        {
          level: 'LOGICAL CONSEQUENCES',
          description: 'Implement consequences directly related to the violation',
          examples: [
            'Supervised visits only if they can\'t respect your parenting',
            'Shorter visits if they can\'t respect your time boundaries',
            'No overnight stays if they undermine routines',
            'Public places only if they can\'t behave appropriately in your home'
          ],
          whenToUse: 'For repeated violations that affect your family\'s wellbeing'
        },
        {
          level: 'PROTECTIVE CONSEQUENCES',
          description: 'Limit contact to protect your family',
          examples: [
            'Temporary breaks from contact',
            'No unsupervised time with your children',
            'Limited information sharing',
            'Professional mediation required for contact'
          ],
          whenToUse: 'For serious violations that harm your family\'s wellbeing'
        },
        {
          level: 'COMPLETE BOUNDARIES',
          description: 'Ending or severely limiting the relationship',
          examples: [
            'No contact until significant changes are made',
            'Cutting off relationship entirely',
            'Legal boundaries if necessary',
            'Protecting children from harmful relationships'
          ],
          whenToUse: 'For abusive, manipulative, or consistently harmful behavior'
        }
      ],
      implementationGuidelines: [
        {
          principle: 'BE CLEAR ABOUT EXPECTATIONS',
          explanation: 'Make sure they understand what behavior you need to see',
          example: '"If you criticize my parenting during visits, the visit will end early."'
        },
        {
          principle: 'FOLLOW THROUGH CONSISTENTLY',
          explanation: 'Empty threats destroy your credibility',
          example: 'If you say you\'ll leave early, actually leave early'
        },
        {
          principle: 'STAY CALM DURING ENFORCEMENT',
          explanation: 'Don\'t enforce boundaries in anger',
          example: '"We need to leave now. We can try again next time."'
        },
        {
          principle: 'EXPLAIN ONCE, THEN ENFORCE',
          explanation: 'Don\'t keep explaining why the boundary exists',
          example: 'State the boundary clearly once, then focus on enforcement'
        }
      ],
      difficultTruths: [
        'Some people will choose to lose relationship with you rather than respect your boundaries',
        'You cannot control their response, only your own choices',
        'Protecting your family may mean disappointing people you love',
        'Healthy relationships require mutual respect - not just love',
        'You are not responsible for managing other people\'s emotions about your boundaries'
      ],
      emotionalSupport: [
        'Boundary enforcement is emotionally difficult even when necessary',
        'Seek support from friends, partners, or therapists during this process',
        'Remember why you\'re setting boundaries - to protect what matters most',
        'Grieve the relationship you wish you could have',
        'Celebrate your courage in protecting your family'
      ],
      hopefulNote: 'Sometimes enforcing boundaries actually improves relationships by creating clarity and respect. Many family members will adjust their behavior when they understand you\'re serious about your limits.',
      background: 'gradient-enforcement',
      backgroundImage: '/images/biff01_imagine_cozy_therapy_office_comfortable_armchair_warm__87ea8e1d-e48f-4436-a390-728d4d6d8640_3.png'
    }
  },
  {
    id: 10,
    type: 'week-practices',
    content: {
      title: 'Your Week 4 Family Dynamics Practices',
      subtitle: 'Building skills for healthier family relationships',
      practices: [
        {
          title: 'Boundary assessment',
          description: 'Identify one family boundary that needs attention',
          duration: '15 minutes',
          icon: '🔍'
        },
        {
          title: 'Partner conversation',
          description: 'Discuss family boundaries and unified approach with partner',
          duration: '30 minutes',
          icon: '💑'
        },
        {
          title: 'Script preparation',
          description: 'Prepare language for one difficult family conversation',
          duration: '10 minutes',
          icon: '📝'
        },
        {
          title: 'Response practice',
          description: 'Practice one new response to common family challenges',
          duration: 'As needed',
          icon: '🎭'
        },
        {
          title: 'Support check-in',
          description: 'Connect with someone who supports your family choices',
          duration: '15 minutes',
          icon: '🤝'
        }
      ],
      affirmation: 'I set loving boundaries that protect my family\'s wellbeing. I can love my family while choosing what\'s best for my children. My boundaries create healthier relationships.',
      reminder: 'Start with small boundaries and build your confidence. Every boundary you enforce teaches people how to treat your family.',
      background: 'gradient-practice',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_0.png'
    }
  },
  {
    id: 11,
    type: 'bridge-forward',
    content: {
      title: 'What\'s Coming Next',
      subtitle: 'In our final lesson: Creating Authentic Friendships',
      preview: 'After navigating family complexities, we\'ll explore how to build and maintain authentic friendships that survive the transition to motherhood - relationships that truly understand and support who you\'re becoming.',
      topics: [
        'Maintaining pre-baby friendships through major life changes',
        'Building new friendships with other parents',
        'Creating reciprocal relationships that work for everyone',
        'Letting go of friendships that no longer serve you'
      ],
      connectionToLesson: 'The boundary-setting skills you\'ve learned with family will help you create healthier dynamics in all your relationships.',
      truth: 'You deserve family relationships that support your growth, not hinder it. Protecting your family\'s wellbeing is an act of love.',
      closing: 'Your family boundaries are a gift to everyone - they create clarity, respect, and genuine connection.',
      background: 'gradient-sage-bloom',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__fe9419f0-6fe7-4ed9-9888-c062989a9600_1.png'
    }
  }
];

export default function Week4Lesson3Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        previousSlide();
      } else if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const previousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsMenuOpen(false);
  };

  const getBackgroundClass = (background: string) => {
    const backgrounds: Record<string, string> = {
      'gradient-family': 'bg-gradient-to-br from-rose-100 via-pink-50 to-red-100',
      'gradient-complexity': 'bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100',
      'gradient-boundaries': 'bg-gradient-to-br from-purple-100 via-violet-50 to-indigo-100',
      'gradient-advice': 'bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100',
      'gradient-partner': 'bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100',
      'gradient-traditions': 'bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100',
      'gradient-geography': 'bg-gradient-to-br from-cyan-100 via-blue-50 to-indigo-100',
      'gradient-conversations': 'bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100',
      'gradient-enforcement': 'bg-gradient-to-br from-red-100 via-rose-50 to-pink-100',
      'gradient-practice': 'bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100',
      'gradient-sage-bloom': 'bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-50'
    };
    return backgrounds[background] || 'bg-white';
  };

  const renderSlide = (slide: any) => {
    switch (slide.type) {
      case 'hero':
        return (
          <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            {slide.content.backgroundImage && (
              <div className="absolute inset-0">
                <Image
                  src={slide.content.backgroundImage}
                  alt="Background"
                  fill
                  className="object-cover"
                  priority
                />
                {slide.content.overlay && (
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-900/70 via-pink-800/50 to-red-700/40" />
                )}
              </div>
            )}
            
            {/* Content */}
            <div className="relative z-10 text-center px-8 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="mb-8"
              >
                <h1 className="text-6xl md:text-8xl font-playfair font-bold text-white mb-6 leading-tight">
                  {slide.content.title}
                </h1>
                <p className="text-3xl md:text-4xl text-white/90 font-light mb-8">
                  {slide.content.subtitle}
                </p>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed"
              >
                {slide.content.description}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="mt-12"
              >
                <Shield className="w-16 h-16 mx-auto text-white/60" />
              </motion.div>
            </div>
          </div>
        );

      case 'family-complexity':
        return (
          <div className="relative min-h-screen flex items-center justify-center px-8 py-16 overflow-hidden">
            {/* Background */}
            {slide.content.backgroundImage && (
              <div className="absolute inset-0">
                <Image
                  src={slide.content.backgroundImage}
                  alt="Background"
                  fill
                  className="object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/80 via-orange-50/80 to-yellow-100/80" />
              </div>
            )}

            <div className="relative z-10 max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <h1 className="text-5xl md:text-6xl font-playfair text-slate-800 mb-6">
                  {slide.content.title}
                </h1>
                <p className="text-2xl text-slate-600">
                  {slide.content.subtitle}
                </p>
              </motion.div>

              <div className="space-y-6 mb-12">
                {slide.content.whyDifficult.map((factor: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
                  >
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="bg-amber-50 p-4 rounded-xl">
                        <h3 className="font-bold text-amber-800">{factor.factor}</h3>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-xl">
                        <p className="text-orange-700 text-sm">{factor.description}</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-xl">
                        <p className="text-yellow-700 text-sm">{factor.impact}</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-xl">
                        <p className="text-red-700 text-sm italic">"{factor.example}"</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-8"
              >
                <h3 className="text-2xl font-bold text-amber-800 mb-6 text-center">Common New Parent Family Challenges</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {slide.content.newParentChallenges.map((challenge: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                      <p className="text-slate-700">{challenge}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="text-center bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-8 shadow-xl border-l-8 border-amber-400"
              >
                <Home className="w-12 h-12 mx-auto text-amber-600 mb-4" />
                <p className="text-2xl font-bold text-amber-800">
                  {slide.content.truthToRemember}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'bridge-forward':
        return (
          <div className="relative min-h-screen flex items-center justify-center px-8 py-16 overflow-hidden">
            {/* Background */}
            {slide.content.backgroundImage && (
              <div className="absolute inset-0">
                <Image
                  src={slide.content.backgroundImage}
                  alt="Background"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-teal-800/40 to-cyan-700/30" />
              </div>
            )}

            <div className="relative z-10 max-w-5xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
              >
                <h1 className="text-5xl md:text-6xl font-playfair text-white mb-6">
                  {slide.content.title}
                </h1>
                <p className="text-2xl text-white/90">
                  {slide.content.subtitle}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl mb-12"
              >
                <p className="text-xl text-slate-700 leading-relaxed mb-8">
                  {slide.content.preview}
                </p>
                
                <div className="bg-teal-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-teal-800 mb-4">Topics include:</h3>
                  <div className="space-y-2">
                    {slide.content.topics.map((topic: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-teal-600 flex-shrink-0" />
                        <p className="text-slate-700">{topic}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="space-y-8"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                  <p className="text-xl text-slate-700 mb-4">
                    {slide.content.connectionToLesson}
                  </p>
                  <p className="text-2xl font-playfair text-teal-800 mb-4">
                    {slide.content.truth}
                  </p>
                  <p className="text-xl text-slate-600 italic">
                    {slide.content.closing}
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 }}
                  className="mt-8 space-y-4"
                >
                  <Link
                    href="/course/week4/lesson4"
                    className="inline-block bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Continue to Lesson 4 →
                  </Link>
                  <p className="text-white/80 text-sm">
                    Creating Authentic Friendships in Motherhood
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2 }}
                  className="mt-12"
                >
                  <Image
                    src="/images/Logo/BLOOM-LOGO.png"
                    alt="Bloom Psychology"
                    width={200}
                    height={80}
                    className="mx-auto opacity-80"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        );

      default:
        return (
          <div className="relative min-h-screen flex items-center justify-center px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Slide Type: {slide.type}
              </h2>
              <p className="text-xl text-slate-600">
                {slide.content.title}
              </p>
            </div>
          </div>
        );
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 transition-all duration-700 ${getBackgroundClass(currentSlideData.content.background)}`} />

      {/* Navigation Header */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="flex justify-between items-center">
          <Link 
            href="/course/week4"
            className="text-white/80 hover:text-white bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Week 4
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-white/80 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-lg">
              Lesson 3: {currentSlide + 1} / {slides.length}
            </span>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-lg transition-colors text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Slide Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-white/95 backdrop-blur-lg shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-slate-800">Week 4 Lesson 3</h3>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-3">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => goToSlide(index)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      index === currentSlide
                        ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                        : 'hover:bg-gray-50 text-slate-700'
                    }`}
                  >
                    <span className="font-semibold">Slide {index + 1}</span>
                    <p className="text-sm opacity-80 mt-1 line-clamp-2">
                      {slide.content.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          {renderSlide(currentSlideData)}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-6 bg-white/90 backdrop-blur-lg rounded-full shadow-xl px-8 py-4">
          <button
            onClick={previousSlide}
            disabled={currentSlide === 0}
            className="p-3 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'w-12 bg-gradient-to-r from-rose-500 to-pink-500'
                    : 'w-3 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="p-3 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="fixed bottom-4 right-4 text-sm text-white/60 bg-black/20 backdrop-blur-sm px-3 py-2 rounded-lg">
        Use arrow keys or click to navigate
      </div>
    </div>
  );
}