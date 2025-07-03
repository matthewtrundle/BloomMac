export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  image: string;
  duration: string;
  lessons: number;
  category: 'mindfulness' | 'recovery' | 'community' | 'growth';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  features: string[];
}

export const courses: Course[] = [
  {
    id: 'postpartum-wellness-foundations',
    title: 'Postpartum Wellness Foundations',
    description: 'A comprehensive self-paced program designed to help new mothers navigate the emotional challenges of postpartum life with confidence and clarity.',
    shortDescription: 'Build emotional balance and confidence in your postpartum journey',
    price: 197,
    image: '/images/optimized/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1c12cc3c-cebd-47e2-ad9b-66b9bbca6480_0.webp',
    duration: '6 weeks',
    lessons: 24,
    category: 'recovery',
    difficulty: 'beginner',
    features: [
      'Weekly video lessons with Dr. Jana',
      'Downloadable workbooks and exercises',
      'Audio meditations for busy moms',
      'Lifetime access to materials',
      'Certificate of completion'
    ]
  },
  {
    id: 'anxiety-management-new-moms',
    title: 'Anxiety Management for New Moms',
    description: 'Learn evidence-based techniques to manage postpartum anxiety and worry, specifically designed for the unique challenges of new motherhood.',
    shortDescription: 'Master anxiety relief techniques designed for busy mothers',
    price: 127,
    image: '/images/optimized/biff01_imagine_woman_in_meditation_pose_serene_environment_br_1f66e17b-a951-4d9f-b895-127fabc89208_1.webp',
    duration: '4 weeks',
    lessons: 16,
    category: 'mindfulness',
    difficulty: 'beginner',
    features: [
      'Weekly technique tutorials',
      'Anxiety tracking tools',
      'Quick relief exercises',
      'Emergency coping cards',
      'Progress tracking journal'
    ]
  },
  {
    id: 'partner-support-bootcamp',
    title: 'Partner Support Bootcamp',
    description: 'Equip partners with the knowledge and skills to provide meaningful support during the postpartum period.',
    shortDescription: 'Help your partner understand and support your journey',
    price: 97,
    image: '/images/optimized/biff01_imagine_mixed-race_parents_with_newborn_tender_family__1caa7f06-30ca-47c7-a1cd-038dc0cea487_1.webp',
    duration: '2 weeks',
    lessons: 8,
    category: 'community',
    difficulty: 'beginner',
    features: [
      'Short, practical video lessons',
      'Communication scripts',
      'Warning signs checklist',
      'Support action plans',
      'Partner discussion guides'
    ]
  },
  {
    id: 'mindful-motherhood',
    title: 'Mindful Motherhood',
    description: 'Develop a mindfulness practice that fits into your busy life as a mother, helping you stay present and calm.',
    shortDescription: 'Cultivate presence and calm in the chaos of motherhood',
    price: 87,
    image: '/images/optimized/biff01_imagine_woman_in_meditation_pose_serene_environment_br_1f66e17b-a951-4d9f-b895-127fabc89208_1.webp',
    duration: '3 weeks',
    lessons: 12,
    category: 'mindfulness',
    difficulty: 'beginner',
    features: [
      '5-minute daily practices',
      'Guided meditation audios',
      'Mindful parenting techniques',
      'Stress reduction strategies',
      'Sleep improvement methods'
    ]
  },
  {
    id: 'postpartum-body-image',
    title: 'Postpartum Body Image & Self-Acceptance',
    description: 'Navigate the complex feelings around body changes after pregnancy and develop a healthier relationship with your postpartum body.',
    shortDescription: 'Embrace and accept your postpartum body with confidence',
    price: 97,
    image: '/images/optimized/biff01_Mother_holding_baby_looking_out_window_at_sunrise_hope_7f2de060-da80-41fa-8c95-705189ef01be_1.webp',
    duration: '4 weeks',
    lessons: 16,
    category: 'growth',
    difficulty: 'intermediate',
    features: [
      'Body acceptance exercises',
      'Self-compassion practices',
      'Gentle movement guidance',
      'Nutrition for healing',
      'Wardrobe confidence tips'
    ]
  },
  {
    id: 'mom-community-connection',
    title: 'Building Your Mom Community',
    description: 'Learn how to find, build, and maintain meaningful connections with other mothers in your area and online.',
    shortDescription: 'Create lasting friendships and support networks',
    price: 67,
    image: '/images/optimized/biff01_imagine_group_of_diverse_mothers_sitting_in_circle_sup_d1a0c0e4-6b2e-4c7e-8f3a-5d9e8c7b6a4f_1.webp',
    duration: '3 weeks',
    lessons: 9,
    category: 'community',
    difficulty: 'beginner',
    features: [
      'Community finding strategies',
      'Conversation starters',
      'Boundary setting skills',
      'Online safety tips',
      'Playdate planning guide'
    ]
  }
];