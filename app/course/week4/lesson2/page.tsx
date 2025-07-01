'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Menu, X, Users, Network, Heart, Shield, MapPin, Target, Building, Handshake, Gift, Star, CheckCircle, AlertCircle, Clock, Phone } from 'lucide-react';
import CourseAuthWrapper from '@/components/CourseAuthWrapper';

// Beautiful slide data for Week 4 Lesson 2
const slides = [
  {
    id: 1,
    type: 'hero',
    content: {
      title: 'Building Support Systems That Actually Support',
      subtitle: 'Creating Your Network of Care',
      description: 'True support isn\'t just having people around - it\'s having the right people who understand your needs and can meet them. Today we design a support system that actually works.',
      background: 'gradient-support',
      backgroundImage: '/images/biff01_imagine_supportive_womens_group_therapy_session_circle_41bd705b-5dd8-4957-a199-b2fa0530b46f_3.png',
      overlay: true
    }
  },
  {
    id: 2,
    type: 'support-vs-presence',
    content: {
      title: 'True Support vs. Just Being Present',
      subtitle: 'Understanding what makes support actually supportive',
      comparison: [
        {
          type: 'JUST BEING PRESENT',
          icon: '👥',
          characteristics: [
            'People are around but not helpful',
            'Offers advice instead of asking what you need',
            'Creates more work (hosting, entertaining)',
            'Focuses on their comfort over your needs',
            'Available but not responsive to your reality'
          ],
          examples: [
            'Visitors who expect to be entertained',
            'People who give unsolicited parenting advice',
            'Those who say "let me know if you need anything" but never follow up'
          ],
          color: 'gray'
        },
        {
          type: 'ACTUAL SUPPORT',
          icon: '🤝',
          characteristics: [
            'Understands and responds to your specific needs',
            'Takes initiative without waiting to be asked',
            'Makes your life easier, not harder',
            'Respects your choices and boundaries',
            'Shows up consistently and reliably'
          ],
          examples: [
            'Someone who brings dinner without needing to be asked',
            'A friend who does dishes while visiting',
            'Family member who follows your parenting preferences'
          ],
          color: 'green'
        }
      ],
      redFlags: [
        'People who make visits about them',
        'Those who judge your choices while "helping"',
        'Support that comes with strings attached',
        'Help that requires you to manage their emotions',
        'People who disappear when things get really hard'
      ],
      greenFlags: [
        'They ask "How can I help?" and mean it',
        'They notice needs without being told',
        'They respect your way of doing things',
        'They show up during difficult times',
        'They make you feel better, not worse'
      ],
      insight: 'Quality of support matters more than quantity. One truly supportive person is worth ten who are just present.',
      background: 'gradient-comparison',
      backgroundImage: '/images/biff01_imagine_mixed-race_parents_with_newborn_tender_family__1caa7f06-30ca-47c7-a1cd-038dc0cea487_1.png'
    }
  },
  {
    id: 3,
    type: 'support-mapping',
    content: {
      title: 'Mapping Your Current Support Network',
      subtitle: 'Understanding who provides what kind of support',
      categories: [
        {
          title: 'EMOTIONAL SUPPORT',
          icon: '💝',
          description: 'People who listen, validate, and understand',
          questions: [
            'Who can you call when you\'re having a hard day?',
            'Who listens without trying to fix everything?',
            'Who makes you feel understood and validated?',
            'Who celebrates your wins and sits with your struggles?'
          ],
          color: 'pink'
        },
        {
          title: 'PRACTICAL SUPPORT',
          icon: '🛠️',
          description: 'People who help with tasks and logistics',
          questions: [
            'Who can help with childcare when needed?',
            'Who would bring you groceries if you were sick?',
            'Who can help with household tasks?',
            'Who has resources you might need to borrow?'
          ],
          color: 'blue'
        },
        {
          title: 'INFORMATIONAL SUPPORT',
          icon: '📚',
          description: 'People who provide knowledge and guidance',
          questions: [
            'Who has experience you can learn from?',
            'Who gives advice that actually helps?',
            'Who connects you with helpful resources?',
            'Who models what you want to emulate?'
          ],
          color: 'purple'
        },
        {
          title: 'SOCIAL SUPPORT',
          icon: '🎉',
          description: 'People who provide fun, connection, and belonging',
          questions: [
            'Who makes you laugh and feel lighter?',
            'Who do you enjoy spending time with?',
            'Who includes you and makes you feel valued?',
            'Who helps you maintain your identity beyond motherhood?'
          ],
          color: 'orange'
        }
      ],
      mappingExercise: {
        title: 'Your Support Map Exercise',
        instructions: [
          'Draw four circles labeled with each support type',
          'Write names of people in each circle who provide that support',
          'Notice which circles are full and which are empty',
          'Identify people who appear in multiple circles',
          'Star the people who are most reliable and consistent'
        ]
      },
      reflection: 'Where are the gaps? Which types of support do you need more of?',
      background: 'gradient-mapping',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_2.png'
    }
  },
  {
    id: 4,
    type: 'support-gaps',
    content: {
      title: 'Identifying and Addressing Support Gaps',
      subtitle: 'Common gaps and how to fill them strategically',
      commonGaps: [
        {
          gap: 'CHILDCARE SUPPORT',
          impact: 'Can\'t get breaks, attend appointments, or have couple time',
          solutions: [
            'Build reciprocal arrangements with other parents',
            'Research local babysitting cooperatives',
            'Ask family for regular scheduled help',
            'Consider hiring occasional childcare',
            'Connect with trusted neighbors'
          ],
          startSmall: 'Ask for 2 hours once a week from someone you trust'
        },
        {
          gap: 'HOUSEHOLD HELP',
          impact: 'Overwhelmed by endless tasks and cleaning',
          solutions: [
            'Ask family/friends to help with specific tasks',
            'Trade services with other families',
            'Hire help for tasks you hate most',
            'Set up systems that reduce maintenance',
            'Accept "good enough" in some areas'
          ],
          startSmall: 'Ask someone to do one load of laundry when they visit'
        },
        {
          gap: 'EMOTIONAL VALIDATION',
          impact: 'Feel isolated, misunderstood, or like you\'re failing',
          solutions: [
            'Join mom groups (online or in-person)',
            'Find a therapist who specializes in maternal mental health',
            'Connect with other parents at similar life stages',
            'Build relationships through shared activities',
            'Practice vulnerability with existing friends'
          ],
          startSmall: 'Share one honest struggle with a trusted friend this week'
        },
        {
          gap: 'PARTNER SUPPORT',
          impact: 'Feel like you\'re parenting alone or carrying too much',
          solutions: [
            'Have specific conversations about needs and expectations',
            'Create clear divisions of responsibility',
            'Schedule regular check-ins about how things are working',
            'Suggest couples counseling for communication help',
            'Express appreciation while also advocating for changes'
          ],
          startSmall: 'Ask partner to take responsibility for one daily routine'
        },
        {
          gap: 'PROFESSIONAL SUPPORT',
          impact: 'Struggle with feeding, sleep, development questions',
          solutions: [
            'Build relationships with healthcare providers you trust',
            'Find lactation consultants, sleep specialists as needed',
            'Connect with parenting educators or coaches',
            'Research local family resource centers',
            'Ask for referrals from people you trust'
          ],
          startSmall: 'Research one professional who could help with your biggest challenge'
        }
      ],
      gapStrategy: 'Start with the gap that\'s causing you the most stress. Small changes in high-impact areas create the biggest relief.',
      background: 'gradient-gaps',
      backgroundImage: '/images/biff01_imagine_woman_on_laptop_in_cozy_home_setting_having_vi_65b5942f-d2fb-4103-84e6-722269d37e3b_2.png'
    }
  },
  {
    id: 5,
    type: 'building-relationships',
    content: {
      title: 'Building New Supportive Relationships',
      subtitle: 'Where and how to connect with potential supporters',
      whereToConnect: [
        {
          venue: 'PARENTING CLASSES & GROUPS',
          types: [
            'New parent classes at hospitals or birth centers',
            'Baby wearing groups',
            'Breastfeeding support groups',
            'Library story times',
            'Mommy and me classes'
          ],
          pros: 'People at similar life stages with shared experiences',
          tip: 'Look for people who seem to share your values and approach'
        },
        {
          venue: 'NEIGHBORHOOD & COMMUNITY',
          types: [
            'Playground regulars',
            'Dog park connections',
            'Community center activities',
            'Local coffee shops with kid-friendly spaces',
            'Neighborhood walks'
          ],
          pros: 'Convenient for ongoing connection and practical help',
          tip: 'Start with friendly small talk and see who feels comfortable'
        },
        {
          venue: 'ONLINE COMMUNITIES',
          types: [
            'Local mom Facebook groups',
            'Apps like Peanut or Momzelle',
            'Reddit parenting communities',
            'Instagram mom accounts in your area',
            'Virtual parenting support groups'
          ],
          pros: 'Available 24/7, easy to find people with specific interests',
          tip: 'Look for groups with positive, supportive cultures'
        },
        {
          venue: 'SHARED INTERESTS & VALUES',
          types: [
            'Religious or spiritual communities',
            'Hobby groups that welcome families',
            'Volunteer organizations',
            'Professional associations for parents',
            'Alumni networks'
          ],
          pros: 'Built-in shared values and interests beyond parenting',
          tip: 'Don\'t abandon all your pre-baby interests'
        }
      ],
      connectionTips: [
        'Start with low-pressure interactions (smile, say hello)',
        'Show genuine interest in others',
        'Be willing to be vulnerable about your own struggles',
        'Suggest specific, small next steps ("Want to grab coffee sometime?")',
        'Follow up consistently without being pushy',
        'Focus on quality over quantity',
        'Give it time - relationships develop gradually'
      ],
      redFlags: [
        'People who are consistently negative or judgmental',
        'Those who seem to thrive on drama or competition',
        'People who don\'t respect boundaries',
        'Those who make you feel worse about yourself',
        'Anyone who pressures you into their way of doing things'
      ],
      reminder: 'Building new relationships takes time. Be patient with the process and with yourself.',
      background: 'gradient-building',
      backgroundImage: '/images/biff01_imagine_parent_and_child_connection_playful_interactio_b5f4a5f6-bb82-40c5-b2c8-2afa9175b6d4_0.png'
    }
  },
  {
    id: 6,
    type: 'reciprocal-relationships',
    content: {
      title: 'Creating Reciprocal Relationships',
      subtitle: 'Building sustainable give-and-take dynamics',
      reciprocityPrinciples: [
        {
          principle: 'EQUAL BUT NOT IDENTICAL',
          description: 'You don\'t have to give back exactly what you receive',
          examples: [
            'They help with childcare, you help with meal prep',
            'They provide emotional support, you offer practical help',
            'They share knowledge, you share resources'
          ]
        },
        {
          principle: 'TIMING FLEXIBILITY',
          description: 'Support can be given and received at different times',
          examples: [
            'They help you now when baby is small, you help them later',
            'You receive more support during difficult seasons',
            'Support flows back and forth as needs change'
          ]
        },
        {
          principle: 'STRENGTH-BASED EXCHANGE',
          description: 'Everyone contributes from their areas of strength',
          examples: [
            'You\'re good at organizing, they\'re good at cooking',
            'They have older kids to advise, you have professional skills to offer',
            'You have time, they have resources'
          ]
        },
        {
          principle: 'CAPACITY AWARENESS',
          description: 'Understanding that everyone\'s capacity fluctuates',
          examples: [
            'Some seasons you give more, some seasons you receive more',
            'Being understanding when someone needs to step back',
            'Adjusting expectations based on life circumstances'
          ]
        }
      ],
      waysToGive: [
        {
          category: 'PRACTICAL GIVING',
          options: [
            'Share resources (books, baby gear, recommendations)',
            'Offer skills (organizing, cooking, professional expertise)',
            'Provide transportation or errands',
            'Help with household tasks',
            'Childcare exchanges'
          ]
        },
        {
          category: 'EMOTIONAL GIVING',
          options: [
            'Listen without judgment',
            'Offer encouragement and validation',
            'Share your own experiences and wisdom',
            'Celebrate others\' victories',
            'Be present during difficult times'
          ]
        },
        {
          category: 'SOCIAL GIVING',
          options: [
            'Include others in activities',
            'Make introductions between people',
            'Remember important events and follow up',
            'Create fun, low-pressure social opportunities',
            'Help others feel valued and seen'
          ]
        }
      ],
      balanceChecks: [
        'Do I feel good about this relationship most of the time?',
        'Are both people\'s needs being considered?',
        'Can I say no without guilt or fear?',
        'Do we both initiate contact and plans?',
        'Does this relationship add energy to my life more than it drains it?'
      ],
      boundaries: 'It\'s okay to step back from relationships that consistently drain more than they give.',
      background: 'gradient-reciprocal',
      backgroundImage: '/images/biff01_imagine_two_mothers_with_their_baby_rainbow_subtle_ele_a05a6c20-728d-4ccc-93f4-400a990a192e_1.png'
    }
  },
  {
    id: 7,
    type: 'professional-support',
    content: {
      title: 'Building Your Professional Support Team',
      subtitle: 'When and how to seek professional help',
      coreTeam: [
        {
          role: 'PRIMARY CARE PHYSICIAN',
          when: 'For your physical health, postpartum checkups',
          whatToLookFor: [
            'Takes your concerns seriously',
            'Understands postpartum health issues',
            'Communicates clearly and respectfully',
            'Coordinates well with other providers'
          ],
          redFlags: ['Dismisses your symptoms', 'Rushes appointments', 'Doesn\'t listen']
        },
        {
          role: 'MENTAL HEALTH THERAPIST',
          when: 'For emotional support, processing challenges, developing coping skills',
          whatToLookFor: [
            'Specializes in maternal mental health',
            'Uses evidence-based approaches',
            'Creates a safe, non-judgmental space',
            'Helps you develop practical skills'
          ],
          redFlags: ['Judges your choices', 'Pushes their agenda', 'Doesn\'t understand parenting challenges']
        },
        {
          role: 'PEDIATRICIAN',
          when: 'For baby\'s health, development guidance',
          whatToLookFor: [
            'Supports your parenting choices',
            'Explains things clearly',
            'Available for questions and concerns',
            'Up-to-date on current recommendations'
          ],
          redFlags: ['Dismissive of concerns', 'Inflexible about feeding/sleep', 'Makes you feel judged']
        }
      ],
      specializedSupport: [
        {
          specialist: 'LACTATION CONSULTANT',
          when: 'Breastfeeding challenges, pain, supply concerns',
          benefit: 'Specialized knowledge beyond what most doctors have'
        },
        {
          specialist: 'SLEEP CONSULTANT',
          when: 'Persistent sleep issues, exhaustion affecting functioning',
          benefit: 'Personalized strategies based on your family\'s needs'
        },
        {
          specialist: 'PELVIC FLOOR THERAPIST',
          when: 'Postpartum physical recovery, pain, incontinence',
          benefit: 'Specialized care for postpartum body changes'
        },
        {
          specialist: 'POSTPARTUM DOULA',
          when: 'Need practical and emotional support at home',
          benefit: 'Trained support for the postpartum transition'
        },
        {
          specialist: 'COUPLES THERAPIST',
          when: 'Relationship stress, communication problems',
          benefit: 'Skills for navigating parenthood together'
        }
      ],
      findingProviders: [
        'Ask for referrals from people you trust',
        'Check with your insurance for covered providers',
        'Look for providers who specialize in your specific needs',
        'Read reviews and check credentials',
        'Ask questions during initial consultations',
        'Trust your gut about whether someone feels like a good fit'
      ],
      advocatingForYourself: [
        'Come prepared with specific questions',
        'Write down symptoms and concerns beforehand',
        'Ask for explanations in terms you understand',
        'Request time to process information',
        'Get second opinions when needed',
        'Remember: you\'re hiring them to help you'
      ],
      background: 'gradient-professional',
      backgroundImage: '/images/biff01_imagine_warm_modern_therapy_office_two_women_in_conver_1b19f253-c5eb-4b43-b05c-cabfbbf7c66b_3.png'
    }
  },
  {
    id: 8,
    type: 'support-maintenance',
    content: {
      title: 'Maintaining and Nurturing Your Support Network',
      subtitle: 'Keeping relationships strong over time',
      maintenanceStrategies: [
        {
          strategy: 'REGULAR CHECK-INS',
          description: 'Stay connected consistently, not just during crises',
          actions: [
            'Send periodic texts to see how people are doing',
            'Schedule regular coffee dates or phone calls',
            'Remember and follow up on important events',
            'Share updates about your life without always needing something'
          ],
          frequency: 'Weekly for closest supports, monthly for broader network'
        },
        {
          strategy: 'EXPRESS APPRECIATION',
          description: 'Let people know how much their support means',
          actions: [
            'Say thank you specifically for what they did',
            'Write thank you notes for significant help',
            'Acknowledge their support publicly when appropriate',
            'Remember their birthdays and important events'
          ],
          frequency: 'Immediately after receiving help, plus periodic general appreciation'
        },
        {
          strategy: 'BE PROACTIVE IN GIVING',
          description: 'Look for ways to support others without being asked',
          actions: [
            'Offer help when you know they\'re struggling',
            'Share resources that might benefit them',
            'Include them in activities and gatherings',
            'Be present during their difficult times'
          ],
          frequency: 'Ongoing awareness and responsiveness'
        },
        {
          strategy: 'ADAPT TO CHANGING NEEDS',
          description: 'Recognize that support needs evolve over time',
          actions: [
            'Communicate when your needs change',
            'Ask others about their evolving needs',
            'Be flexible as children grow and situations change',
            'Add new people as needs arise'
          ],
          frequency: 'Ongoing assessment, formal check-ins seasonally'
        }
      ],
      warningSignsToAddress: [
        'Relationships become one-sided consistently',
        'You feel drained rather than supported after interactions',
        'People are unreliable when you really need them',
        'Support comes with judgment or strings attached',
        'Your values and approaches are consistently criticized'
      ],
      whenToLetGo: [
        'When attempts to address problems are unsuccessful',
        'When relationships consistently harm your wellbeing',
        'When people repeatedly violate your boundaries',
        'When the relationship requires more energy than you have',
        'When fundamental values are incompatible'
      ],
      evolvingNeeds: 'Your support needs will change as your children grow. A network that works with a newborn may need adjustment as kids become toddlers, school-age, and beyond.',
      gratitudePractice: 'Regularly reflect on and appreciate the support you do have. Gratitude strengthens relationships and attracts more positive connections.',
      background: 'gradient-maintenance',
      backgroundImage: '/images/biff01_imagine_mixed-race_parents_with_newborn_tender_family__1caa7f06-30ca-47c7-a1cd-038dc0cea487_3.png'
    }
  },
  {
    id: 9,
    type: 'emergency-support',
    content: {
      title: 'Creating Your Emergency Support Plan',
      subtitle: 'Preparing for times when you need immediate help',
      emergencyScenarios: [
        {
          scenario: 'ILLNESS OR INJURY',
          needs: ['Childcare', 'Meal preparation', 'Household help', 'Transportation'],
          whoToCall: 'Someone reliable who can drop everything',
          preparation: 'Have contact info easily accessible, discuss plan in advance'
        },
        {
          scenario: 'MENTAL HEALTH CRISIS',
          needs: ['Emotional support', 'Professional help', 'Childcare', 'Reduced responsibilities'],
          whoToCall: 'Someone who understands mental health and won\'t judge',
          preparation: 'Identify crisis resources, share plan with key people'
        },
        {
          scenario: 'PARTNER UNAVAILABLE',
          needs: ['Backup childcare', 'Emotional support', 'Practical help'],
          whoToCall: 'Your most reliable local support person',
          preparation: 'Have multiple backup options, keep emergency supplies ready'
        },
        {
          scenario: 'FAMILY EMERGENCY',
          needs: ['Childcare for extended periods', 'Emotional support', 'Logistics help'],
          whoToCall: 'Someone who can commit to longer-term help',
          preparation: 'Discuss potential scenarios and availability in advance'
        }
      ],
      emergencyContactList: {
        title: 'Your Emergency Support Contact List',
        categories: [
          {
            type: 'IMMEDIATE RESPONSE (Day or Night)',
            description: '1-2 people who can help within 30 minutes',
            examples: ['Close family member', 'Best friend', 'Neighbor']
          },
          {
            type: 'SAME-DAY HELP',
            description: '3-4 people who can help within a few hours',
            examples: ['Extended family', 'Close friends', 'Mom group members']
          },
          {
            type: 'PROFESSIONAL EMERGENCY',
            description: 'Numbers for crisis situations',
            examples: ['Doctor\'s office', 'Mental health crisis line', 'Trusted babysitter']
          },
          {
            type: 'BACKUP SUPPORT',
            description: 'People to call if primary supports are unavailable',
            examples: ['Secondary friend group', 'Acquaintances who\'ve offered help']
          }
        ]
      },
      preparationSteps: [
        'Have this list saved in your phone and written down',
        'Share your list with your partner and key support people',
        'Update contact information regularly',
        'Discuss your emergency plan with people on your list',
        'Include non-local supports who can provide emotional help',
        'Keep some emergency supplies ready (snacks, entertainment for kids)',
        'Know your mental health resources and how to access them'
      ],
      practiceRuns: [
        'Ask for help with something small to practice',
        'Test your contact list by reaching out for non-emergency support',
        'Practice explaining your needs clearly and specifically',
        'Notice who responds quickly and reliably'
      ],
      selfCompassion: 'Having an emergency plan isn\'t pessimistic - it\'s responsible self-care. You\'re not planning to fail; you\'re planning to handle challenges with grace.',
      background: 'gradient-emergency',
      backgroundImage: '/images/biff01_imagine_calming_therapy_office_waiting_room_comfortabl_c7ddc6f2-21ca-462c-9f36-f7e006d516f8_0.png'
    }
  },
  {
    id: 10,
    type: 'week-practices',
    content: {
      title: 'Your Week 4 Support Building Practices',
      subtitle: 'Concrete steps to strengthen your network',
      practices: [
        {
          title: 'Support network mapping',
          description: 'Map your current support across all four categories',
          duration: '20 minutes',
          icon: '🗺️'
        },
        {
          title: 'Gap identification',
          description: 'Choose one support gap to address this week',
          duration: '10 minutes',
          icon: '🔍'
        },
        {
          title: 'Connection outreach',
          description: 'Reach out to one new potential support person',
          duration: 'One conversation',
          icon: '📞'
        },
        {
          title: 'Appreciation expression',
          description: 'Thank someone who has supported you recently',
          duration: '5 minutes',
          icon: '💝'
        },
        {
          title: 'Emergency plan creation',
          description: 'Start building your emergency support contact list',
          duration: '15 minutes',
          icon: '🆘'
        }
      ],
      affirmation: 'I deserve to be supported. I actively build relationships that nurture and sustain me. I am worthy of care and help.',
      reminder: 'Building support takes time. Focus on one small step at a time and celebrate any progress.',
      background: 'gradient-practice',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_0.png'
    }
  },
  {
    id: 11,
    type: 'bridge-forward',
    content: {
      title: 'What\'s Coming Next',
      subtitle: 'In our next lesson: Navigating Family Dynamics',
      preview: 'Now that you\'re building supportive relationships, we\'ll tackle one of the most complex areas: family dynamics. You\'ll learn to set loving boundaries with family members and navigate expectations while protecting your wellbeing.',
      topics: [
        'Setting boundaries with family members and in-laws',
        'Handling unsolicited advice and criticism',
        'Managing expectations and obligations',
        'Creating new traditions while honoring old ones'
      ],
      connectionToLesson: 'The support network you\'re building will give you strength and perspective for navigating challenging family dynamics.',
      truth: 'You get to choose how much energy you give to relationships. Invest most heavily in those that truly support your growth.',
      closing: 'Your support network is your foundation. Build it with intention and care.',
      background: 'gradient-sage-bloom',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__fe9419f0-6fe7-4ed9-9888-c062989a9600_1.png'
    }
  }
];

function Week4Lesson2Content() {
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
      'gradient-support': 'bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100',
      'gradient-comparison': 'bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100',
      'gradient-mapping': 'bg-gradient-to-br from-purple-100 via-violet-50 to-indigo-100',
      'gradient-gaps': 'bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100',
      'gradient-building': 'bg-gradient-to-br from-rose-100 via-pink-50 to-red-100',
      'gradient-reciprocal': 'bg-gradient-to-br from-cyan-100 via-blue-50 to-indigo-100',
      'gradient-professional': 'bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100',
      'gradient-maintenance': 'bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100',
      'gradient-emergency': 'bg-gradient-to-br from-red-100 via-rose-50 to-pink-100',
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
                  <div className="absolute inset-0 bg-gradient-to-br from-green-900/70 via-emerald-800/50 to-teal-700/40" />
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
                <Network className="w-16 h-16 mx-auto text-white/60" />
              </motion.div>
            </div>
          </div>
        );

      case 'support-vs-presence':
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

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {slide.content.comparison.map((item: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className={`${item.color === 'gray' ? 'bg-gray-50' : 'bg-green-50'} rounded-3xl p-8 shadow-xl`}
                  >
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-4">{item.icon}</div>
                      <h3 className={`text-2xl font-bold ${item.color === 'gray' ? 'text-gray-800' : 'text-green-800'}`}>
                        {item.type}
                      </h3>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      {item.characteristics.map((characteristic: string, charIndex: number) => (
                        <div key={charIndex} className="flex items-start gap-3">
                          {item.color === 'gray' ? (
                            <AlertCircle className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                          )}
                          <p className={`${item.color === 'gray' ? 'text-gray-700' : 'text-green-700'}`}>
                            {characteristic}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className={`p-4 ${item.color === 'gray' ? 'bg-gray-100' : 'bg-green-100'} rounded-xl`}>
                      <h4 className={`font-bold ${item.color === 'gray' ? 'text-gray-800' : 'text-green-800'} mb-2`}>
                        Examples:
                      </h4>
                      <div className="space-y-1">
                        {item.examples.map((example: string, exIndex: number) => (
                          <p key={exIndex} className={`text-sm ${item.color === 'gray' ? 'text-gray-700' : 'text-green-700'}`}>
                            • {example}
                          </p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-red-50 rounded-3xl p-6 shadow-xl"
                >
                  <h3 className="text-xl font-bold text-red-800 mb-4">🚩 Red Flags</h3>
                  <div className="space-y-2">
                    {slide.content.redFlags.map((flag: string, index: number) => (
                      <p key={index} className="text-red-700 text-sm">• {flag}</p>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-green-50 rounded-3xl p-6 shadow-xl"
                >
                  <h3 className="text-xl font-bold text-green-800 mb-4">✅ Green Flags</h3>
                  <div className="space-y-2">
                    {slide.content.greenFlags.map((flag: string, index: number) => (
                      <p key={index} className="text-green-700 text-sm">• {flag}</p>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-center bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl p-8 shadow-xl"
              >
                <Heart className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                <p className="text-2xl font-bold text-blue-800">
                  {slide.content.insight}
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
                        <Shield className="w-5 h-5 text-teal-600 flex-shrink-0" />
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
                    href="/course/week4/lesson3"
                    className="inline-block bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Continue to Lesson 3 →
                  </Link>
                  <p className="text-white/80 text-sm">
                    Navigating Family Dynamics and Expectations
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
              Lesson 2: {currentSlide + 1} / {slides.length}
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
                <h3 className="text-2xl font-bold text-slate-800">Week 4 Lesson 2</h3>
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
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
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
                    ? 'w-12 bg-gradient-to-r from-green-500 to-emerald-500'
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

export default function Week4Lesson2Page() {
  return (
    <CourseAuthWrapper courseSlug="postpartum-wellness-foundations">
      <Week4Lesson2Content />
    </CourseAuthWrapper>
  );
}