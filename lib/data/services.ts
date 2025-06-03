export type Service = {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  heroImage: string;
  secondaryImage?: string;
  pricing: {
    sessionFee: string;
    initialConsultation: string;
    specialOptions?: string[];
    insurance: string;
    slidingScale: boolean;
    paymentPlans: boolean;
  };
  howItWorks: {
    title: string;
    steps: Array<{
      title: string;
      description: string;
    }>;
  };
  benefits: Array<{
    title: string;
    description: string;
  }>;
  caseStudy: {
    title: string;
    quote: string;
    author: string;
    outcome: string;
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

export const services: Service[] = [
  {
    id: 'women',
    slug: 'therapy-for-women',
    title: 'Therapy for Women',
    description: 'Are you feeling the stress of "doing it all"? Whether you\'re a young adult finding yourself or a new mom navigating motherhood, Dr. Rundle helps you move from overwhelm to fulfillment and connection.',
    shortDescription: 'Custom therapy for women at all life stages, specializing in overwhelm, identity, and life transitions.',
    heroImage: '/images/optimized/Home/Confident Women.webp',
    pricing: {
      sessionFee: "$150 per session (50 minutes)",
      initialConsultation: "Free 15-minute consultation",
      insurance: "Out-of-network provider. Super Bills provided for potential reimbursement.",
      slidingScale: true,
      paymentPlans: true
    },
    howItWorks: {
      title: 'Your Path to Fulfillment',
      steps: [
        {
          title: 'Initial Consultation',
          description: 'Begin with a judgment-free conversation to identify your unique challenges and establish personalized goals for therapy.'
        },
        {
          title: 'Customized Treatment',
          description: 'Develop practical strategies using evidence-based approaches tailored to your specific needs and lifestyle.'
        },
        {
          title: 'Ongoing Support',
          description: 'Regular sessions to refine techniques, celebrate progress, and navigate new challenges with confidence.'
        }
      ]
    },
    benefits: [
      {
        title: 'Rediscover Your Identity',
        description: 'Reconnect with your authentic self beyond roles and responsibilities.'
      },
      {
        title: 'Healthy Boundaries',
        description: 'Learn to establish and maintain boundaries that protect your wellbeing.'
      },
      {
        title: 'Stress Management',
        description: 'Develop practical tools to manage daily stressors and prevent burnout.'
      },
      {
        title: 'Improved Relationships',
        description: 'Build more fulfilling connections with partners, children, friends, and colleagues.'
      },
      {
        title: 'Work-Life Balance',
        description: 'Create sustainable routines that honor your professional and personal needs.'
      },
      {
        title: 'Self-Compassion',
        description: 'Replace self-criticism with kindness and understanding toward yourself.'
      }
    ],
    caseStudy: {
      title: 'Emily\'s Journey',
      quote: 'I was drowning in expectations—both my own and others\'. Dr. Rundle helped me prioritize what truly matters and find joy again.',
      author: 'Emily, 34',
      outcome: 'After six months of therapy, Emily established healthier boundaries at work, reconnected with her partner, and rediscovered her passion for painting.'
    },
    faqs: [
      {
        question: 'How long will therapy take?',
        answer: 'Every woman\'s journey is unique. Some clients see meaningful improvements in 8-12 sessions, while others benefit from longer-term support. We\'ll regularly assess your progress and adjust as needed.'
      },
      {
        question: 'Do you accept insurance?',
        answer: 'Dr. Rundle is considered an out-of-network provider on all insurance panels. We can provide a Super Bill for you to submit to insurance for reimbursement if you have out-of-network benefits. Dr. Rundle also offers a sliding-fee scale for those who need it.'
      },
      {
        question: 'What if I\'m not sure what I need help with?',
        answer: 'Many women come to therapy feeling overwhelmed but unsure of the root causes. Our initial sessions focus on exploration and understanding, helping you gain clarity on what\'s most important to address.'
      },
      {
        question: 'Can therapy help with both personal and professional challenges?',
        answer: 'Absolutely! Our holistic approach acknowledges that challenges in one area often affect others. We\'ll work together to create balance and fulfillment across all domains of your life.'
      }
    ]
  },
  {
    id: 'moms',
    slug: 'therapy-for-moms',
    title: 'Therapy for Moms',
    description: 'Comprehensive care for expecting, new, and seasoned moms—available in-home to reduce stress. If you suspect postpartum depression or anxiety, you\'re not alone; we bring support to you.',
    shortDescription: 'Specialized therapy for mothers at all stages, with flexible options including in-home sessions.',
    heroImage: '/images/optimized/Home/new-mom.webp',
    secondaryImage: '/images/optimized/Services/New Mothers.webp',
    pricing: {
      sessionFee: "$150 per session (50 minutes)",
      initialConsultation: "Free 15-minute consultation",
      specialOptions: ["In-home sessions: $175 per session", "Telehealth available"],
      insurance: "Out-of-network provider. Super Bills provided for potential reimbursement.",
      slidingScale: true,
      paymentPlans: true
    },
    howItWorks: {
      title: 'Motherhood Support System',
      steps: [
        {
          title: 'Compassionate Assessment',
          description: 'Begin with a thorough evaluation of your current challenges, whether you\'re expecting, newly postpartum, or navigating ongoing parenting stress.'
        },
        {
          title: 'Flexible Care Plan',
          description: 'Develop a personalized treatment approach with options for in-home, telehealth, or office sessions to accommodate your family\'s needs.'
        },
        {
          title: 'Integrated Support',
          description: 'Access a network of resources including support groups, parenting skills, and when needed, coordination with your healthcare providers.'
        }
      ]
    },
    benefits: [
      {
        title: 'Reduced Overwhelm',
        description: 'Practical strategies to manage the daily demands of motherhood.'
      },
      {
        title: 'Emotional Regulation',
        description: 'Tools to navigate the intense emotions that accompany motherhood.'
      },
      {
        title: 'Identity Integration',
        description: 'Reconcile your pre-mom identity with your evolving role as a mother.'
      },
      {
        title: 'Relationship Nurturing',
        description: 'Maintain connection with your partner while meeting your children\'s needs.'
      },
      {
        title: 'Maternal Confidence',
        description: 'Build trust in your parenting decisions amid conflicting advice.'
      },
      {
        title: 'Community Connection',
        description: 'Reduce isolation through thoughtful introduction to supportive parent networks.'
      }
    ],
    caseStudy: {
      title: 'Sarah\'s Story',
      quote: 'I felt like I was failing at everything—being a mom, wife, employee. In-home therapy meant I didn\'t have to arrange childcare, and Dr. Rundle helped me see I wasn\'t failing at all.',
      author: 'Sarah, 29',
      outcome: 'With therapy support, Sarah recognized her postpartum anxiety symptoms, implemented daily coping strategies, and gradually rebuilt her confidence in both parenting and self-care.'
    },
    faqs: [
      {
        question: 'How does in-home therapy work?',
        answer: 'We bring professional therapeutic support directly to your home, eliminating childcare concerns and allowing us to observe and address real-life challenges in your everyday environment.'
      },
      {
        question: 'What if I think I have postpartum depression?',
        answer: 'If you\'re experiencing persistent sadness, anxiety, fatigue beyond normal newborn exhaustion, or thoughts of harming yourself or your baby, we provide prompt assessment and treatment. For severe symptoms, we coordinate with medical providers to ensure comprehensive care.'
      },
      {
        question: 'Can my baby be present during sessions?',
        answer: 'Absolutely. We design our mom-focused sessions with the understanding that your baby may be present and may need attention during our time together.'
      },
      {
        question: 'Do you work with moms of older children too?',
        answer: 'Yes! The challenges of motherhood evolve but don\'t disappear as children grow. We support mothers through all stages from pregnancy through the empty nest transition.'
      }
    ]
  },
  {
    id: 'parent',
    slug: 'parent-support',
    title: 'Parent Support',
    description: 'Parenting is the hardest job you\'ll ever do. We help you pinpoint sticking points, align on values, and build a healthy family system that thrives at every stage.',
    shortDescription: 'Evidence-based guidance for parents navigating challenges from toddler tantrums to teen independence.',
    heroImage: '/images/optimized/Services/Experienced Parents.webp',
    secondaryImage: '/images/optimized/Services/Walking through fields.webp',
    pricing: {
      sessionFee: "$175 per session (60 minutes)",
      initialConsultation: "Free 15-minute consultation",
      specialOptions: ["Family sessions: $200 per session", "In-home visits available"],
      insurance: "Out-of-network provider. Super Bills provided for potential reimbursement.",
      slidingScale: true,
      paymentPlans: true
    },
    howItWorks: {
      title: 'Building Your Parenting Toolkit',
      steps: [
        {
          title: 'Family Assessment',
          description: 'Identify current parenting challenges, family dynamics, and the unique temperaments of each family member.'
        },
        {
          title: 'Targeted Skill Building',
          description: 'Learn evidence-based techniques specific to your child\'s developmental stage and your family\'s values.'
        },
        {
          title: 'Implementation Support',
          description: 'Receive ongoing guidance as you apply new approaches, with adjustments based on what works for your unique family.'
        }
      ]
    },
    benefits: [
      {
        title: 'Reduced Conflict',
        description: 'Decrease power struggles and increase cooperation through effective communication strategies.'
      },
      {
        title: 'Consistent Approach',
        description: 'Develop united parenting practices between all caregivers based on shared values.'
      },
      {
        title: 'Emotional Intelligence',
        description: 'Help children recognize, express, and manage their emotions in healthy ways.'
      },
      {
        title: 'Developmental Insight',
        description: 'Understand typical behavior at each age to set realistic expectations and appropriate boundaries.'
      },
      {
        title: 'Strengthened Connection',
        description: 'Maintain strong parent-child bonds even during challenging phases and transitions.'
      },
      {
        title: 'Caregiver Wellbeing',
        description: 'Prioritize your own mental health while meeting your family\'s needs.'
      }
    ],
    caseStudy: {
      title: 'The Rodriguez Family',
      quote: 'Our household was constant chaos—tantrums, sibling fights, and parental disagreements. Dr. Rundle helped us establish routines and responses that transformed our daily life.',
      author: 'Miguel & Camila Rodriguez',
      outcome: 'Through parent coaching, the Rodriguez family implemented consistent routines, emotional regulation techniques, and collaborative problem-solving that reduced household tension by over 50%.'
    },
    faqs: [
      {
        question: 'Do both parents need to participate?',
        answer: 'While involvement from all primary caregivers is ideal, we can work effectively with just one parent. We\'ll provide tools to help align approaches even if not everyone participates directly.'
      },
      {
        question: 'Do you address specific issues like ADHD, anxiety, or defiance?',
        answer: 'Yes, we provide specialized parenting strategies for children with various behavioral, emotional, and neurodevelopmental challenges, tailoring our approach to your child\'s specific needs.'
      },
      {
        question: 'How long does parent coaching typically last?',
        answer: 'Many families see significant improvements in 8-12 sessions, though this varies based on the complexity of challenges. Some families benefit from occasional "booster" sessions during new developmental stages.'
      },
      {
        question: 'Do children attend the sessions?',
        answer: 'Some sessions may include children for family observation or skill practice, while others focus exclusively on parent strategies. We\'ll design a format that best addresses your specific needs.'
      }
    ]
  },
  {
    id: 'anxiety',
    slug: 'anxiety-stress-management',
    title: 'Anxiety &\nStress Management',
    description: 'Custom anxiety management using CBT, ERP, and somatic exercises to reduce stress, improve daily functioning, and restore balance.',
    shortDescription: 'Specialized treatment for anxiety, panic, and chronic stress using proven therapeutic approaches.',
    heroImage: '/images/optimized/Services/AnxietyManagement1.webp',
    secondaryImage: '/images/optimized/Services/AnxietyManagement2.webp',
    pricing: {
      sessionFee: "$150 per session (50 minutes)",
      initialConsultation: "Free 15-minute consultation",
      specialOptions: ["Intensive sessions: $225 per 75-minute session"],
      insurance: "Out-of-network provider. Super Bills provided for potential reimbursement.",
      slidingScale: true,
      paymentPlans: true
    },
    howItWorks: {
      title: 'Your Path to Calm',
      steps: [
        {
          title: 'Comprehensive Assessment',
          description: 'Identify your anxiety triggers, physical symptoms, thought patterns, and the impact on your daily functioning.'
        },
        {
          title: 'Personalized Treatment Plan',
          description: 'Develop a tailored approach combining cognitive techniques, mindfulness practices, and physiological regulation strategies.'
        },
        {
          title: 'Skills Integration',
          description: 'Learn to seamlessly incorporate anxiety management tools into your daily life, gradually building confidence in challenging situations.'
        }
      ]
    },
    benefits: [
      {
        title: 'Symptom Reduction',
        description: 'Decrease the frequency and intensity of anxiety symptoms, including worry, panic, and physical tension.'
      },
      {
        title: 'Cognitive Restructuring',
        description: 'Transform anxious thought patterns into more balanced, realistic perspectives.'
      },
      {
        title: 'Physiological Regulation',
        description: 'Master techniques to calm your nervous system during stress responses.'
      },
      {
        title: 'Exposure Confidence',
        description: 'Gradually face feared situations with new coping skills and increasing comfort.'
      },
      {
        title: 'Preventative Practices',
        description: 'Develop daily habits that build resilience against future anxiety and stress.'
      },
      {
        title: 'Reclaimed Freedom',
        description: 'Re-engage in activities that anxiety previously limited or prevented.'
      }
    ],
    caseStudy: {
      title: 'David\'s Recovery',
      quote: 'My anxiety had shrunk my world to the point where I avoided social events, travel, and even certain work responsibilities. Dr. Rundle helped me expand my life again, one step at a time.',
      author: 'David, 42',
      outcome: 'After four months of treatment, David successfully managed a work presentation, resumed regular social activities, and planned a family vacation without debilitating anxiety.'
    },
    faqs: [
      {
        question: 'How is your approach different from medication?',
        answer: 'While medication can be valuable for symptom management, our therapeutic approaches address the underlying causes and thought patterns while teaching lifelong coping skills. Many clients find therapy provides sustainable relief, either alongside medication or as an alternative.'
      },
      {
        question: 'Do you treat specific phobias?',
        answer: 'Yes, we offer evidence-based exposure therapy for specific phobias such as fear of flying, needles, heights, or other triggers. This gradual, supported approach has high success rates for phobia reduction.'
      },
      {
        question: 'How quickly will I notice improvement?',
        answer: 'Many clients report some symptom relief within the first few sessions as they begin implementing basic regulation techniques. More significant and lasting changes typically emerge within 8-12 weeks of consistent practice.'
      },
      {
        question: 'What if my anxiety returns after treatment?',
        answer: 'Occasional anxiety is a normal part of life, but the tools you learn in therapy become lifelong skills. Many clients schedule occasional "booster" sessions during high-stress periods. We also provide resources for ongoing practice to maintain your progress.'
      }
    ]
  },
  {
    id: 'postpartum',
    slug: 'postpartum-depression-support',
    title: 'Postpartum Depression\nSupport',
    description: 'Evidence-based support for moms navigating postpartum mood changes—combining talk therapy, guided mindfulness, and peer support groups.',
    shortDescription: 'Specialized treatment for postpartum depression, anxiety, and mood disorders with compassionate, judgment-free support.',
    heroImage: '/images/optimized/Services/Symbolic Shoes.webp',
    secondaryImage: '/images/optimized/Services/Hopeful Hands.webp',
    pricing: {
      sessionFee: "$150 per session (50 minutes)",
      initialConsultation: "Free 15-minute consultation",
      specialOptions: ["Emergency sessions available", "Support groups: $75 per session", "In-home sessions: $175"],
      insurance: "Out-of-network provider. Super Bills provided for potential reimbursement.",
      slidingScale: true,
      paymentPlans: true
    },
    howItWorks: {
      title: 'Your Path to Recovery',
      steps: [
        {
          title: 'Prompt Assessment',
          description: 'Begin with a thorough evaluation to understand your specific symptoms, risk factors, and support needs, with priority scheduling for postpartum concerns.'
        },
        {
          title: 'Multi-Faceted Care',
          description: 'Receive a personalized treatment plan that may include individual therapy, medication coordination, support groups, and family involvement.'
        },
        {
          title: 'Gradual Healing',
          description: 'Experience progressive symptom relief while developing long-term resilience and bonding strategies with your baby.'
        }
      ]
    },
    benefits: [
      {
        title: 'Symptom Relief',
        description: 'Reduce depression, anxiety, irritability, and intrusive thoughts with proven therapeutic techniques.'
      },
      {
        title: 'Maternal Identity',
        description: 'Reconcile expectations with reality while developing confidence in your unique mothering style.'
      },
      {
        title: 'Infant Bonding',
        description: 'Strengthen connection with your baby through guided interaction and attachment exercises.'
      },
      {
        title: 'Relationship Support',
        description: 'Navigate changes in partnerships and family dynamics during this vulnerable transition.'
      },
      {
        title: 'Self-Care Integration',
        description: 'Develop realistic, sustainable self-care practices that fit within your new family reality.'
      },
      {
        title: 'Peer Connection',
        description: 'Combat isolation through optional peer support groups with other postpartum women.'
      }
    ],
    caseStudy: {
      title: 'Jennifer\'s Healing',
      quote: 'I felt robbed of the joy I was "supposed" to feel as a new mom. Instead, I was crying daily and resenting my baby. With treatment, I discovered both the mother and the woman I wanted to be.',
      author: 'Jennifer, 31',
      outcome: 'Through a combination of therapy, support groups, and temporary medication, Jennifer overcame severe postpartum depression, developed a secure attachment with her daughter, and created a supportive network of other mothers.'
    },
    faqs: [
      {
        question: 'How do I know if I have postpartum depression versus "baby blues"?',
        answer: 'Baby blues typically fade within two weeks after birth, while postpartum depression involves more persistent and intense symptoms that interfere with daily functioning. If you\'re unsure, we offer rapid screening to determine appropriate support.'
      },
      {
        question: 'Can I bring my baby to sessions?',
        answer: 'Yes, we welcome your baby in both individual and group sessions. Our office is equipped with changing facilities, feeding privacy, and soothing options for fussy moments.'
      },
      {
        question: 'Do you coordinate with my medical providers?',
        answer: 'With your permission, we collaborate with your OB/GYN, midwife, pediatrician, or psychiatrist to ensure comprehensive care, especially if medication is part of your treatment plan.'
      },
      {
        question: 'What if I\'m having thoughts of harming myself or my baby?',
        answer: 'If you\'re experiencing these thoughts, please call us immediately for an emergency appointment. These symptoms can be successfully treated with prompt intervention. If you\'re in crisis outside of business hours, we provide emergency contact information for immediate assistance.'
      }
    ]
  },
  {
    id: 'postpartum-anxiety',
    slug: 'postpartum-anxiety-support',
    title: 'Postpartum Anxiety\nSupport',
    description: 'Postpartum anxiety can create intrusive thoughts, fears, and unwanted sensations leaving you feeling stuck. Feeling this way while also trying to care for a baby can make you wonder if something is really wrong or if you\'re a bad mom. At Bloom, we create a safe space where you feel seen and heard to help you explore, address, and overcome your anxieties.',
    shortDescription: 'Specialized treatment for anxiety, intrusive thoughts, or worries so that you can feel more like yourself again.',
    heroImage: '/images/optimized/Services/AnxietyManagement2.webp',
    secondaryImage: '/images/optimized/Services/Hopeful Hands.webp',
    pricing: {
      sessionFee: "$150 per session (50 minutes)",
      initialConsultation: "Free 15-minute consultation",
      specialOptions: ["Crisis sessions available", "Baby-friendly sessions", "Support groups: $75 per session"],
      insurance: "Out-of-network provider. Super Bills provided for potential reimbursement.",
      slidingScale: true,
      paymentPlans: true
    },
    howItWorks: {
      title: 'Your Journey to Calm',
      steps: [
        {
          title: 'Personalized Assessment',
          description: 'Begin with a comprehensive evaluation of your anxiety symptoms, triggers, and how they\'re affecting your daily life and relationship with your baby.'
        },
        {
          title: 'Customized Treatment Plan',
          description: 'Receive a tailored approach combining cognitive-behavioral techniques, mindfulness practices, and maternal-focused strategies.'
        },
        {
          title: 'Ongoing Support',
          description: 'Experience continued guidance as you implement new skills, with adjustments to address emerging challenges throughout your postpartum journey.'
        }
      ]
    },
    benefits: [
      {
        title: 'Reduced Worry',
        description: 'Learn to manage excessive concerns about your baby\'s health, safety, and development.'
      },
      {
        title: 'Intrusive Thought Management',
        description: 'Develop techniques to cope with and reduce distressing or unwanted thoughts.'
      },
      {
        title: 'Sleep Improvement',
        description: 'Address anxiety-related sleep difficulties even within the constraints of newborn care.'
      },
      {
        title: 'Physical Symptom Relief',
        description: 'Reduce physical manifestations of anxiety like tension, racing heart, and shortness of breath.'
      },
      {
        title: 'Confident Decision-Making',
        description: 'Move past analysis-paralysis to make parenting decisions with greater ease.'
      },
      {
        title: 'Present-Moment Connection',
        description: 'Develop the ability to be fully present with your baby rather than caught in anxiety spirals.'
      }
    ],
    caseStudy: {
      title: 'Alicia\'s Transformation',
      quote: 'I couldn\'t stop checking if my baby was breathing. My mind would spiral with worst-case scenarios. With Dr. Rundle\'s help, I\'ve learned to manage these anxious thoughts and actually enjoy time with my daughter.',
      author: 'Alicia, 33',
      outcome: 'Through targeted therapy, Alicia reduced her anxious checking behaviors by 80%, learned to recognize and interrupt catastrophic thinking patterns, and developed a toolkit of quick anxiety management techniques she could use while caring for her baby.'
    },
    faqs: [
      {
        question: 'Is postpartum anxiety different from regular anxiety?',
        answer: 'Yes, postpartum anxiety often features specific concerns related to infant care, maternal competence, and the enormous life change of becoming a mother. Treatment is tailored to address these unique aspects while recognizing the physiological and hormonal factors involved.'
      },
      {
        question: 'Are intrusive thoughts normal or do they mean I\'m a bad mother?',
        answer: 'Intrusive thoughts are extremely common in new mothers and do NOT reflect your character or mothering abilities. These unwanted thoughts are a symptom of anxiety, not an indication of your true desires or future actions. With proper treatment, their frequency and intensity can be significantly reduced.'
      },
      {
        question: 'I fear that I\'m a bad mom because I\'m not feeling like myself or I\'m worried all the time. Is this true?',
        answer: 'Absolutely not. These feelings are very common and are symptoms of postpartum anxiety, not a reflection of your mothering abilities. The fact that you\'re concerned about being a good mom actually demonstrates how much you care. Worry and anxiety can make you feel disconnected from yourself and your baby, but this doesn\'t mean you\'re failing as a mother. With support, you can reconnect with your authentic self and enjoy motherhood more fully.'
      },
      {
        question: 'How quickly can I expect relief?',
        answer: 'Many mothers experience some immediate relief simply from understanding that their symptoms are common and treatable. More substantial improvement typically begins within 3-4 sessions as you implement initial coping strategies. A full course of treatment usually spans 8-12 sessions.'
      },
      {
        question: 'Can I bring my baby to therapy sessions?',
        answer: 'Absolutely. Our office is baby-friendly, and having your baby present can actually be beneficial as we can observe interactions and practice techniques in real time. However, we can also work around nap times or when you have childcare if you prefer focused adult time.'
      }
    ]
  }
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find(service => service.slug === slug);
}

export function getAllServiceSlugs(): string[] {
  return services.map(service => service.slug);
}