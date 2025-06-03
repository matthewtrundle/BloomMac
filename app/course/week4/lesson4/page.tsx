'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Menu, X, Users, Heart, Star, Shield, Clock, Compass, Target, Crown, Balance, Gift, AlertTriangle, CheckCircle, Zap, Sparkles } from 'lucide-react';

// Beautiful slide data for Week 4 Lesson 4
const slides = [
  {
    id: 1,
    type: 'hero',
    content: {
      title: 'Creating Authentic Friendships in Motherhood',
      subtitle: 'Relationships That Understand Your Journey',
      description: 'Motherhood changes friendships forever. Some will adapt and grow stronger, others will fade. Today we learn to nurture the friendships that truly support who you\'re becoming and create space for new meaningful connections.',
      background: 'gradient-friendship',
      backgroundImage: '/images/biff01_imagine_two_mothers_with_their_baby_rainbow_subtle_ele_a05a6c20-728d-4ccc-93f4-400a990a192e_2.png',
      overlay: true
    }
  },
  {
    id: 2,
    type: 'friendship-reality',
    content: {
      title: 'The Reality of Friendship Changes in Motherhood',
      subtitle: 'Why some friendships struggle and others thrive',
      universalChanges: [
        {
          change: 'AVAILABILITY SHIFT',
          description: 'Less time and energy for social activities',
          impact: 'Some friends feel neglected or drift away',
          adaptation: 'True friends understand and adjust expectations'
        },
        {
          change: 'PRIORITY REORDERING',
          description: 'Your child\'s needs often come first',
          impact: 'Last-minute cancellations become common',
          adaptation: 'Supportive friends offer flexible, low-pressure options'
        },
        {
          change: 'IDENTITY INTEGRATION',
          description: 'Becoming a mother is now part of who you are',
          impact: 'Some friends can\'t relate to your new reality',
          adaptation: 'Growing friendships include and celebrate your role as a mother'
        },
        {
          change: 'CONVERSATION TOPICS',
          description: 'Baby and parenting naturally become part of discussions',
          impact: 'Some friends feel conversations are "all about the baby"',
          adaptation: 'Balanced friends are interested in your whole life'
        },
        {
          change: 'ENERGY AND MOOD FLUCTUATIONS',
          description: 'Hormones, sleep deprivation, and stress affect your social capacity',
          impact: 'You may seem different or "not yourself"',
          adaptation: 'Understanding friends give you grace during this transition'
        }
      ],
      normalGrief: 'It\'s normal to grieve friendships that don\'t survive this transition. This loss is real and deserves acknowledgment.',
      hopefulTruth: 'The friendships that do survive often become deeper and more meaningful than ever before.',
      background: 'gradient-reality',
      backgroundImage: '/images/biff01_imagine_supportive_womens_group_therapy_session_circle_41bd705b-5dd8-4957-a199-b2fa0530b46f_3.png'
    }
  },
  {
    id: 3,
    type: 'friendship-types',
    content: {
      title: 'Types of Friendships in Your Life',
      subtitle: 'Understanding different friendship needs and roles',
      friendshipCategories: [
        {
          type: 'INNER CIRCLE',
          icon: '💎',
          description: 'Your closest 2-3 friends who know everything',
          characteristics: [
            'You can be completely authentic with them',
            'They support you through major life changes',
            'Communication is honest and vulnerable',
            'They celebrate and grieve with you',
            'Distance or time doesn\'t weaken the bond'
          ],
          motheringNeed: 'Someone who loves both who you were and who you\'re becoming',
          color: 'purple'
        },
        {
          type: 'FELLOW TRAVELERS',
          icon: '🤝',
          description: 'Friends in similar life stages or situations',
          characteristics: [
            'Share similar challenges and experiences',
            'Provide practical support and advice',
            'Understand your current reality deeply',
            'May be newer friendships formed around shared experience',
            'Offer validation and normalization'
          ],
          motheringNeed: 'Someone who gets exactly what you\'re going through',
          color: 'blue'
        },
        {
          type: 'FUN FRIENDS',
          icon: '🎉',
          description: 'Friends who bring joy and lightness',
          characteristics: [
            'Help you laugh and feel carefree',
            'May not be deeply emotional connections',
            'Provide escape from daily stresses',
            'Remind you of your playful side',
            'Offer social energy and excitement'
          ],
          motheringNeed: 'Someone who helps you remember you\'re still fun',
          color: 'orange'
        },
        {
          type: 'WISDOM KEEPERS',
          icon: '🦉',
          description: 'Friends who are further along in their journey',
          characteristics: [
            'Offer perspective from experience',
            'Can reassure you about what\'s normal',
            'Model what\'s possible in the future',
            'Provide guidance without judgment',
            'Help you see the bigger picture'
          ],
          motheringNeed: 'Someone who can say "this too shall pass" with authority',
          color: 'green'
        },
        {
          type: 'MUTUAL SUPPORT',
          icon: '⚖️',
          description: 'Friends with whom you trade different kinds of support',
          characteristics: [
            'Balanced give and take over time',
            'May have different strengths you each offer',
            'Practical support exchanges',
            'Professional or skill-based connections',
            'Reliable for specific needs'
          ],
          motheringNeed: 'Someone with whom you can build reciprocal support',
          color: 'teal'
        }
      ],
      reflection: 'Which types of friendships do you have? Which do you need more of?',
      balanceTruth: 'You don\'t need every friend to fill every role. A diverse friendship network serves you better than expecting one friend to meet all needs.',
      background: 'gradient-types',
      backgroundImage: '/images/biff01_imagine_parent_and_child_connection_playful_interactio_b5f4a5f6-bb82-40c5-b2c8-2afa9175b6d4_3.png'
    }
  },
  {
    id: 4,
    type: 'maintaining-old-friendships',
    content: {
      title: 'Maintaining Pre-Baby Friendships',
      subtitle: 'Helping existing friendships evolve and grow',
      communicationStrategies: [
        {
          strategy: 'BE PROACTIVE ABOUT COMMUNICATION',
          approach: 'Don\'t wait for them to reach out first',
          actions: [
            'Send texts about non-baby topics occasionally',
            'Ask about their lives and remember their important events',
            'Share updates that include but aren\'t only about your baby',
            'Acknowledge when you\'ve been less available'
          ],
          script: '"I know I\'ve been harder to reach lately. I miss our connection and want to stay close as we both navigate our changing lives."'
        },
        {
          strategy: 'SUGGEST BABY-FRIENDLY HANGOUTS',
          approach: 'Make it easy for friends to include your new reality',
          actions: [
            'Invite them over during baby\'s good times',
            'Suggest walks or casual coffee dates',
            'Meet at baby-friendly restaurants',
            'Offer to bring baby to their events when appropriate'
          ],
          script: '"Would you like to come over for dinner Saturday? Baby is usually happy then, and we can catch up while they play."'
        },
        {
          strategy: 'SET REALISTIC EXPECTATIONS',
          approach: 'Help friends understand your new capacity',
          actions: [
            'Explain your current limitations without apologizing',
            'Suggest shorter meetups or flexible timing',
            'Be honest about your energy levels',
            'Appreciate their patience during this transition'
          ],
          script: '"I have about 2 hours of good social energy these days. Let\'s plan something that works within that."'
        },
        {
          strategy: 'MAINTAIN YOUR IDENTITY',
          approach: 'Continue sharing parts of yourself beyond motherhood',
          actions: [
            'Talk about books, shows, ideas that interest you',
            'Share your thoughts on current events',
            'Discuss your hopes and dreams',
            'Ask their advice on non-parenting topics'
          ],
          script: '"Being a mom is huge for me right now, and I also want to stay connected to other parts of who I am with you."'
        }
      ],
      boundariesWithOldFriends: [
        'It\'s okay to temporarily step back from demanding friendships',
        'You don\'t owe anyone an explanation for your changed capacity',
        'Some friends may need education about your new reality',
        'You can love someone and still need distance during this season',
        'True friends will understand that priorities shift with major life changes'
      ],
      whenToLetGo: [
        'When they consistently make you feel guilty for your choices',
        'When they refuse to acknowledge your changed circumstances',
        'When they compete with your baby for attention',
        'When interactions leave you feeling drained rather than supported',
        'When they pressure you to be who you were rather than who you\'re becoming'
      ],
      background: 'gradient-maintaining',
      backgroundImage: '/images/biff01_imagine_woman_on_laptop_in_cozy_home_setting_having_vi_65b5942f-d2fb-4103-84e6-722269d37e3b_2.png'
    }
  },
  {
    id: 5,
    type: 'making-new-friends',
    content: {
      title: 'Making New Mom Friends',
      subtitle: 'Building connections with people who understand your journey',
      whereTomeet: [
        {
          venue: 'PARENT GROUPS & CLASSES',
          types: [
            'New parent support groups',
            'Baby yoga or music classes',
            'Library storytimes',
            'Mommy and me swimming',
            'Childbirth education class reunions'
          ],
          pros: 'Built-in common ground and similar schedules',
          strategy: 'Show up consistently and be open to small conversations'
        },
        {
          venue: 'NEIGHBORHOOD CONNECTIONS',
          types: [
            'Playground regulars',
            'Stroller walks in your area',
            'Local coffee shops with kid areas',
            'Neighborhood parent Facebook groups',
            'Community center family events'
          ],
          pros: 'Geographic convenience for ongoing friendship',
          strategy: 'Start with friendly hellos and see who feels comfortable'
        },
        {
          venue: 'ONLINE TO OFFLINE',
          types: [
            'Local mom Facebook groups',
            'Bumper groups from pregnancy',
            'Neighborhood apps like Nextdoor',
            'Mom-specific apps like Peanut',
            'Instagram local mom hashtags'
          ],
          pros: 'Easy to connect before meeting in person',
          strategy: 'Engage genuinely online first, then suggest meetups'
        },
        {
          venue: 'SHARED INTERESTS BEYOND PARENTING',
          types: [
            'Book clubs for parents',
            'Hiking groups with strollers',
            'Professional networking for working moms',
            'Hobby groups that welcome families',
            'Volunteer organizations'
          ],
          pros: 'Friendship foundation beyond just being parents',
          strategy: 'Don\'t abandon all your interests - find parent-friendly versions'
        }
      ],
      conversationStarters: [
        '"How old is your little one? Mine is [age] and [current challenge]."',
        '"Do you live in this area? I\'m always looking for [local recommendation]."',
        '"How are you finding [current parenting stage]? I\'m struggling with [specific challenge]."',
        '"Have you found any good [resource/activity] around here?"',
        '"Your baby is so cute! Mine is fascinated by [current interest]."'
      ],
      connectionBuilding: [
        'Suggest specific, low-pressure next steps',
        'Exchange numbers and actually follow up',
        'Invite them to activities you\'re already doing',
        'Be vulnerable about your own struggles',
        'Remember details about their life and ask follow-up questions'
      ],
      redFlags: [
        'Competitive parenting or constant comparisons',
        'Judgment about your parenting choices',
        'Unwillingness to be flexible with plans',
        'Drama or gossip about other parents',
        'Making you feel worse about yourself'
      ],
      patience: 'Building new friendships takes time. Be patient with the process and don\'t take initial awkwardness personally.',
      background: 'gradient-new-friends',
      backgroundImage: '/images/biff01_imagine_Latina_mother_playing_peek-a-boo_with_laughing_9f91dae6-b308-42f4-935f-8c0bb0a6d485_0.png'
    }
  },
  {
    id: 6,
    type: 'friendship-challenges',
    content: {
      title: 'Common Friendship Challenges in Motherhood',
      subtitle: 'Navigating the difficult situations that arise',
      challenges: [
        {
          challenge: 'THE COMPARISON TRAP',
          description: 'Feeling judged or comparing parenting approaches',
          manifestations: [
            'Feeling defensive about your choices',
            'Competitive conversations about milestones',
            'Judgment about feeding, sleep, or childcare decisions',
            'Pressure to do things the same way'
          ],
          solutions: [
            'Remember that different approaches can all be valid',
            'Avoid sharing details you\'re sensitive about',
            'Change the subject when conversations become competitive',
            'Surround yourself with people who support your choices'
          ],
          mantra: '"Different families, different needs. I trust my choices."'
        },
        {
          challenge: 'SCHEDULING DIFFICULTIES',
          description: 'Coordinating social time around unpredictable baby schedules',
          manifestations: [
            'Frequent last-minute cancellations',
            'Difficulty finding mutually good times',
            'Feeling like you\'re always the one causing problems',
            'Missing events because of nap times or meltdowns'
          ],
          solutions: [
            'Build buffer time into social plans',
            'Suggest flexible activities (walks, home hangouts)',
            'Communicate your challenges without over-apologizing',
            'Find friends who are in similar situations'
          ],
          mantra: '"Flexibility is friendship during this season."'
        },
        {
          challenge: 'EMOTIONAL CAPACITY FLUCTUATIONS',
          description: 'Some days you feel social, others you need to hibernate',
          manifestations: [
            'Canceling plans because you\'re overwhelmed',
            'Feeling guilty for not being more available',
            'Struggling to be present during social time',
            'Feeling like you\'re not a good friend'
          ],
          solutions: [
            'Communicate your capacity honestly',
            'Suggest low-energy hangouts when needed',
            'Accept that some seasons require more solitude',
            'Practice self-compassion about your limitations'
          ],
          mantra: '"Taking care of myself helps me be a better friend."'
        },
        {
          challenge: 'THE ADVICE AVALANCHE',
          description: 'Friends offering constant unsolicited parenting advice',
          manifestations: [
            'Every conversation becomes about what you should do differently',
            'Feeling judged for your parenting decisions',
            'Friends sharing horror stories or warnings',
            'Pressure to try every suggestion'
          ],
          solutions: [
            'Set clear boundaries about advice-giving',
            'Use phrases like "I\'m not looking for advice, just support"',
            'Change the subject consistently',
            'Limit sharing details if someone can\'t stop advising'
          ],
          mantra: '"I can listen to input without taking it as instruction."'
        },
        {
          challenge: 'LONELINESS IN A CROWD',
          description: 'Being around people but not feeling truly understood',
          manifestations: [
            'Feeling isolated even in mom groups',
            'Conversations that stay surface-level',
            'Missing deeper emotional connections',
            'Feeling like you have to perform happiness'
          ],
          solutions: [
            'Be the first to share something vulnerable',
            'Ask deeper questions about others\' experiences',
            'Seek one-on-one connections within larger groups',
            'Remember that building depth takes time'
          ],
          mantra: '"Authentic connection starts with authentic sharing."'
        }
      ],
      universalTruth: 'Almost every new mother struggles with friendship changes. You\'re not alone in finding this challenging.',
      skillBuilding: 'The friendship skills you develop during this time will serve you throughout your life.',
      background: 'gradient-challenges',
      backgroundImage: '/images/biff01_imagine_woman_in_meditation_pose_serene_environment_br_43b6047c-916a-43b2-afc2-5449ec040f7c_1.png'
    }
  },
  {
    id: 7,
    type: 'authentic-connection',
    content: {
      title: 'Creating Authentic Connections',
      subtitle: 'Moving beyond surface-level mom chat',
      authenticityPrinciples: [
        {
          principle: 'SHARE YOUR REAL STRUGGLES',
          description: 'Be honest about the hard parts, not just the highlights',
          examples: [
            '"I\'m really struggling with the identity shift into motherhood"',
            '"Some days I miss my old life and then feel guilty about it"',
            '"I\'m finding it harder than I expected to love this stage"',
            '"I feel isolated even though I\'m with my baby all day"'
          ],
          benefit: 'Opens space for others to be real too'
        },
        {
          principle: 'ASK MEANINGFUL QUESTIONS',
          description: 'Go deeper than "How\'s the baby?"',
          examples: [
            '"How are you adjusting to being a mom?"',
            '"What\'s been the biggest surprise about parenthood for you?"',
            '"What do you miss most about your pre-baby life?"',
            '"How are you taking care of yourself these days?"'
          ],
          benefit: 'Shows genuine interest in their whole experience'
        },
        {
          principle: 'SHARE YOUR WHOLE SELF',
          description: 'Include non-parenting aspects of your identity',
          examples: [
            'Your thoughts on books, movies, current events',
            'Your career goals and professional challenges',
            'Your relationship with your partner',
            'Your hopes and dreams beyond motherhood'
          ],
          benefit: 'Creates multi-dimensional connections'
        },
        {
          principle: 'PRACTICE VULNERABLE RECIPROCITY',
          description: 'Match the level of openness others show',
          examples: [
            'When someone shares a struggle, share one of yours',
            'When someone celebrates a win, share your recent joy',
            'When someone asks for advice, ask for their perspective too',
            'When someone offers support, let them know how they can help'
          ],
          benefit: 'Builds balanced, mutual relationships'
        }
      ],
      conversationShifts: [
        {
          from: '"How\'s the baby sleeping?"',
          to: '"How are you sleeping? What\'s helping you get through the hard nights?"'
        },
        {
          from: '"Your baby is so good!"',
          to: '"You\'re doing such a great job. How are you feeling about everything?"'
        },
        {
          from: '"When did your baby first..."',
          to: '"What\'s been your favorite part of this stage so far?"'
        },
        {
          from: '"You should try..."',
          to: '"What\'s been working for your family?"'
        }
      ],
      boundariesForAuthenticity: [
        'You can be real without oversharing everything',
        'Start with smaller vulnerabilities and build trust',
        'It\'s okay if not everyone can handle deeper conversations',
        'Some people are meant for surface-level connections, and that\'s fine',
        'Protect your energy by choosing where to invest emotional labor'
      ],
      connectionGoal: 'Aim for friendships where you feel seen, heard, and accepted for all of who you are.',
      background: 'gradient-authentic',
      backgroundImage: '/images/biff01_imagine_warm_modern_therapy_office_two_women_in_conver_1b19f253-c5eb-4b43-b05c-cabfbbf7c66b_3.png'
    }
  },
  {
    id: 8,
    type: 'solo-mom-friendships',
    content: {
      title: 'Special Considerations for Solo Mothers',
      subtitle: 'Building friendships when you\'re parenting alone',
      uniqueChallenges: [
        {
          challenge: 'LIMITED CHILDCARE FOR SOCIAL TIME',
          impact: 'Harder to attend adult-only events or evening gatherings',
          strategies: [
            'Prioritize friendships that include your child',
            'Build community around kid-friendly activities',
            'Trade childcare with other single parents',
            'Focus on daytime or early evening social connections',
            'Be upfront about your childcare limitations'
          ]
        },
        {
          challenge: 'FEELING DIFFERENT IN COUPLE-DOMINATED SPACES',
          impact: 'May feel left out of conversations about partners and shared parenting',
          strategies: [
            'Find other single parents for some social connections',
            'Build relationships with individuals, not just couples',
            'Focus on friends who see you as a whole person, not half of a couple',
            'Create your own gatherings and invite who you want',
            'Remember that your perspective and experience are valuable'
          ]
        },
        {
          challenge: 'NEED FOR MORE PRACTICAL SUPPORT',
          impact: 'May need friends who can help with logistics, not just emotional support',
          strategies: [
            'Be specific about practical needs when building community',
            'Look for reciprocal support arrangements',
            'Connect with neighbors and local parents',
            'Join or create single parent support groups',
            'Build relationships with people who have resources to share'
          ]
        },
        {
          challenge: 'EMOTIONAL LOAD MANAGEMENT',
          impact: 'May need to be more selective about emotional energy output',
          strategies: [
            'Prioritize friendships that energize rather than drain you',
            'Set clear boundaries about advice and opinions',
            'Seek friends who celebrate your strength and independence',
            'Find people who understand your unique challenges',
            'Practice asking for specific types of support'
          ]
        }
      ],
      soloParentStrengths: [
        'You\'ve developed strong independence and decision-making skills',
        'You\'re clear about what you need and value efficiency',
        'You have deep appreciation for genuine support',
        'You\'re resilient and adaptable',
        'You can offer unique perspective and wisdom to other parents'
      ],
      buildingCommunity: [
        'Look for single parent groups online and in your area',
        'Connect with other parents at your child\'s school or activities',
        'Build relationships with neighbors who have children',
        'Consider chosen family relationships with close friends',
        'Remember that family comes in many forms'
      ],
      selfAdvocacy: [
        'Be clear about your needs and limitations',
        'Don\'t apologize for being a single parent',
        'Educate friends about your reality when necessary',
        'Ask for specific help rather than general offers',
        'Celebrate your strength while acknowledging your needs'
      ],
      validation: 'Parenting alone is incredibly challenging, and you deserve deep, supportive friendships that honor your journey.',
      background: 'gradient-solo',
      backgroundImage: '/images/biff01_imagine_confident_single_mother_holding_baby_standing__b3179601-8cbf-4af3-9b29-bedcbc4946a3_3.png'
    }
  },
  {
    id: 9,
    type: 'seasonal-friendships',
    content: {
      title: 'Understanding Seasonal Friendships',
      subtitle: 'Why some friendships are meant for specific life seasons',
      seasonalConcept: 'Just as nature has seasons, relationships do too. Some friendships are meant to last forever, while others serve important purposes for specific periods of time.',
      seasonTypes: [
        {
          season: 'PREPARATION SEASONS',
          description: 'Friendships that help you get ready for major changes',
          examples: [
            'Pregnancy friends who share the anticipation and preparation',
            'Career transition friends who understand professional changes',
            'Friends who help you envision your future self'
          ],
          purpose: 'Support you through periods of growth and change',
          duration: 'Often 6 months to 2 years'
        },
        {
          season: 'CRISIS SEASONS',
          description: 'Friendships that emerge during difficult times',
          examples: [
            'Fellow NICU parents who understand medical challenges',
            'Postpartum depression support group members',
            'Divorce or loss support connections'
          ],
          purpose: 'Provide understanding and survival support during hard times',
          duration: 'Variable, often until crisis resolves'
        },
        {
          season: 'LEARNING SEASONS',
          description: 'Friendships centered around acquiring new skills or knowledge',
          examples: [
            'New parent class friendships',
            'Breastfeeding support group connections',
            'Professional development relationships'
          ],
          purpose: 'Share information, encouragement, and progress',
          duration: 'Often 3 months to 1 year'
        },
        {
          season: 'EXPLORATION SEASONS',
          description: 'Friendships that help you try new things or discover new parts of yourself',
          examples: [
            'Fitness class buddies who encourage healthy habits',
            'Creative hobby groups that nurture artistic expression',
            'Travel companions for new adventures'
          ],
          purpose: 'Expand your horizons and support personal growth',
          duration: 'Variable, often activity-dependent'
        },
        {
          season: 'TRANSITION SEASONS',
          description: 'Friendships that help you move from one life stage to another',
          examples: [
            'Mentor relationships that guide career changes',
            'Empty nest friends who understand family evolution',
            'Moving or relocation support connections'
          ],
          purpose: 'Bridge the gap between who you were and who you\'re becoming',
          duration: 'Usually 1-3 years'
        }
      ],
      naturalEndings: [
        'Different life paths or priorities emerge',
        'The shared challenge or interest resolves',
        'Geographic changes make connection difficult',
        'The friendship served its purpose and feels complete',
        'Energy is better invested in other relationships'
      ],
      gratitudePractice: [
        'Appreciate seasonal friends for what they provided',
        'Acknowledge the growth that happened through the connection',
        'Release attachment to friendships lasting forever',
        'Trust that the right people come into your life when needed',
        'Make space for new seasonal friendships to develop'
      ],
      lifelongFriendships: 'While many friendships are seasonal, some friends transcend seasons and grow with you through multiple life changes. These are precious gifts to be treasured.',
      wisdom: 'Not every friendship ending means someone failed. Sometimes it means the friendship fulfilled its beautiful purpose.',
      background: 'gradient-seasons',
      backgroundImage: '/images/biff01_imagine_woman_walking_in_nature_path_trees_and_flowers_dc53f2ba-0c3a-4b5a-a758-62679e547b70_1.png'
    }
  },
  {
    id: 10,
    type: 'friendship-investment',
    content: {
      title: 'How to Invest in Friendships That Matter',
      subtitle: 'Nurturing the connections that deserve your energy',
      investmentPrinciples: [
        {
          principle: 'CONSISTENT SMALL GESTURES',
          description: 'Regular connection matters more than grand gestures',
          actions: [
            'Send encouraging texts during their hard weeks',
            'Remember birthdays and important events',
            'Share articles or memes that remind you of them',
            'Check in during their stressful times',
            'Celebrate their wins and milestones'
          ],
          timeInvestment: '5-10 minutes per week per close friend'
        },
        {
          principle: 'QUALITY TIME PRIORITIZATION',
          description: 'Make time for meaningful connection, even if brief',
          actions: [
            'Schedule regular coffee dates or phone calls',
            'Plan activities you both enjoy',
            'Create traditions or recurring meetups',
            'Be fully present during your time together',
            'Protect friend time from other distractions'
          ],
          timeInvestment: '1-2 hours per month per close friend'
        },
        {
          principle: 'EMOTIONAL INVESTMENT',
          description: 'Share vulnerably and hold space for their emotions',
          actions: [
            'Ask how they\'re really doing and listen to the answer',
            'Share your own struggles and joys authentically',
            'Offer comfort during difficult times',
            'Avoid trying to fix everything - sometimes just witness',
            'Express appreciation for who they are'
          ],
          timeInvestment: 'Ongoing emotional availability'
        },
        {
          principle: 'PRACTICAL SUPPORT',
          description: 'Offer concrete help during busy or difficult seasons',
          actions: [
            'Bring meals during their challenging times',
            'Offer childcare trades or help',
            'Share resources and recommendations',
            'Help with moves, projects, or overwhelming tasks',
            'Use your skills to benefit them'
          ],
          timeInvestment: 'Variable, based on needs and capacity'
        }
      ],
      reciprocityBalance: [
        'Track the overall balance over months, not individual interactions',
        'Different friends may offer different types of support',
        'Some seasons you give more, some seasons you receive more',
        'Both people should feel valued and supported',
        'Address imbalances before resentment builds'
      ],
      investmentBoundaries: [
        'You can\'t invest equally in every friendship',
        'It\'s okay to have different levels of emotional investment',
        'Seasonal capacity changes affect how much you can give',
        'Some friends require more energy than others',
        'Protect your energy for relationships that reciprocate'
      ],
      signsOfHealthyInvestment: [
        'Both people initiate contact and plans',
        'Conversations include both people\'s lives and concerns',
        'You feel energized after spending time together',
        'Both people offer support during difficult times',
        'The friendship enhances rather than drains your life'
      ],
      whenToReduceInvestment: [
        'When the friendship consistently drains your energy',
        'When support is one-sided despite your efforts',
        'When your values become incompatible',
        'When the friend violates your boundaries repeatedly',
        'When you\'re carrying all the emotional labor'
      ],
      investmentGoal: 'Pour your friendship energy into relationships that help you flourish and where you can help others flourish too.',
      background: 'gradient-investment',
      backgroundImage: '/images/biff01_imagine_two_mothers_with_their_baby_rainbow_subtle_ele_a05a6c20-728d-4ccc-93f4-400a990a192e_1.png'
    }
  },
  {
    id: 11,
    type: 'week-practices',
    content: {
      title: 'Your Week 4 Friendship Practices',
      subtitle: 'Nurturing authentic connections',
      practices: [
        {
          title: 'Friendship assessment',
          description: 'Evaluate your current friendships and identify what you need',
          duration: '20 minutes',
          icon: '🔍'
        },
        {
          title: 'Reconnection outreach',
          description: 'Reach out to one old friend you want to maintain connection with',
          duration: 'One conversation',
          icon: '📱'
        },
        {
          title: 'New connection attempt',
          description: 'Make an effort to connect with one potential new friend',
          duration: 'One interaction',
          icon: '👋'
        },
        {
          title: 'Authentic sharing',
          description: 'Practice vulnerability with someone safe',
          duration: 'As opportunity arises',
          icon: '💗'
        },
        {
          title: 'Friendship gratitude',
          description: 'Express appreciation to someone who supports you',
          duration: '5 minutes',
          icon: '🙏'
        }
      ],
      affirmation: 'I deserve friendships that see and celebrate all of who I am. I am worthy of authentic connection and mutual support.',
      reminder: 'Building authentic friendships takes time. Focus on quality over quantity and trust the process.',
      background: 'gradient-practice',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_0.png'
    }
  },
  {
    id: 12,
    type: 'bridge-forward',
    content: {
      title: 'Completing Week 4: Relationships & Communication',
      subtitle: 'You\'ve built the foundation for meaningful connections',
      weekSummary: 'This week you\'ve learned to communicate your needs, build support systems, navigate family dynamics, and create authentic friendships. These relationship skills will serve you throughout your motherhood journey.',
      keyAchievements: [
        'Developed tools for expressing needs without guilt',
        'Learned to build support systems that actually work',
        'Gained strategies for setting loving boundaries with family',
        'Discovered how to nurture authentic friendships through life changes'
      ],
      upcomingPreview: 'Next week, we move into Week 5: Creating Your Village - where we\'ll focus on building community, finding your tribe, and creating the larger network of support that sustains families long-term.',
      integrationFocus: 'Take time this week to practice the communication and boundary skills you\'ve learned. Every conversation is an opportunity to build stronger relationships.',
      truth: 'You are not meant to navigate motherhood alone. The relationships you build and nurture will be your greatest source of strength.',
      closing: 'Authentic connection is a gift you give yourself and others. You deserve to be seen, supported, and celebrated.',
      background: 'gradient-sage-bloom',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__fe9419f0-6fe7-4ed9-9888-c062989a9600_1.png'
    }
  }
];

export default function Week4Lesson4Page() {
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
      'gradient-friendship': 'bg-gradient-to-br from-pink-100 via-rose-50 to-red-100',
      'gradient-reality': 'bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100',
      'gradient-types': 'bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100',
      'gradient-maintaining': 'bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100',
      'gradient-new-friends': 'bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100',
      'gradient-challenges': 'bg-gradient-to-br from-cyan-100 via-blue-50 to-indigo-100',
      'gradient-authentic': 'bg-gradient-to-br from-rose-100 via-pink-50 to-red-100',
      'gradient-solo': 'bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100',
      'gradient-seasons': 'bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100',
      'gradient-investment': 'bg-gradient-to-br from-purple-100 via-violet-50 to-indigo-100',
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
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-900/70 via-rose-800/50 to-red-700/40" />
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
                <Users className="w-16 h-16 mx-auto text-white/60" />
              </motion.div>
            </div>
          </div>
        );

      case 'friendship-reality':
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
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/80 via-indigo-50/80 to-purple-100/80" />
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
                {slide.content.universalChanges.map((change: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
                  >
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <h3 className="font-bold text-blue-800">{change.change}</h3>
                      </div>
                      <div className="bg-indigo-50 p-4 rounded-xl">
                        <p className="text-indigo-700 text-sm">{change.description}</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-xl">
                        <p className="text-red-700 text-sm">{change.impact}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-xl">
                        <p className="text-green-700 text-sm">{change.adaptation}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  className="bg-orange-50 rounded-3xl p-8 shadow-xl"
                >
                  <Heart className="w-12 h-12 text-orange-600 mb-4" />
                  <p className="text-xl font-bold text-orange-800 mb-4">Normal Grief</p>
                  <p className="text-orange-700">{slide.content.normalGrief}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="bg-green-50 rounded-3xl p-8 shadow-xl"
                >
                  <Star className="w-12 h-12 text-green-600 mb-4" />
                  <p className="text-xl font-bold text-green-800 mb-4">Hopeful Truth</p>
                  <p className="text-green-700">{slide.content.hopefulTruth}</p>
                </motion.div>
              </div>
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
                  {slide.content.weekSummary}
                </p>
                
                <div className="bg-teal-50 rounded-xl p-6 mb-8">
                  <h3 className="text-xl font-bold text-teal-800 mb-4">Key Achievements This Week:</h3>
                  <div className="space-y-2">
                    {slide.content.keyAchievements.map((achievement: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                        <p className="text-slate-700">{achievement}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-lg text-slate-600 italic">
                  {slide.content.upcomingPreview}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="space-y-8"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                  <p className="text-xl text-slate-700 mb-4">
                    {slide.content.integrationFocus}
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
                    href="/course/week5"
                    className="inline-block bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Continue to Week 5 →
                  </Link>
                  <p className="text-white/80 text-sm">
                    Creating Your Village
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
              Lesson 4: {currentSlide + 1} / {slides.length}
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
                <h3 className="text-2xl font-bold text-slate-800">Week 4 Lesson 4</h3>
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
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
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
                    ? 'w-12 bg-gradient-to-r from-pink-500 to-rose-500'
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