# Bloom Psychology User Platform - Comprehensive Planning Document

## 🌟 Vision Statement
Create a supportive, pressure-free digital wellness platform that helps mothers navigate postpartum challenges at their own pace, celebrating progress without creating guilt or comparison.

## 📋 Table of Contents
1. [Platform Overview](#platform-overview)
2. [User Journey & Features](#user-journey--features)
3. [Technical Architecture](#technical-architecture)
4. [Badge & Achievement System](#badge--achievement-system)
5. [Privacy & Security](#privacy--security)
6. [Visual Design System](#visual-design-system)
7. [Implementation Roadmap](#implementation-roadmap)
8. [Success Metrics](#success-metrics)

---

## Platform Overview

### Core Principles
- **No Pressure**: No streaks, no guilt, no comparison
- **Self-Paced**: Every mother's journey is unique
- **Supportive**: Celebrate effort over perfection
- **Private First**: Control over what to share
- **Accessible**: One-handed operation, clear navigation

### Key Components
1. **User Authentication & Profile Management**
2. **Personalized Wellness Dashboard**
3. **Course Progress Tracking**
4. **Appointment Management Integration**
5. **Badge/Star Achievement System**
6. **Resource Library & Recommendations**
7. **Optional Community Features**

---

## User Journey & Features

### 1. Entry Points & Authentication

#### Public Header Enhancement
```typescript
interface HeaderAuthSection {
  loggedOut: {
    primaryCTA: "Start Your Journey", // Leads to signup
    secondaryCTA: "Member Login",     // Quick login access
    placement: "Right of navigation", // Prominent position
    style: "bloom-sage background"    // Calming, noticeable
  },
  loggedIn: {
    display: "Profile photo or initial",
    quickStats: {
      stars: number,              // Total stars earned
      nextAppointment: string,    // "In 3 days"
      currentCourse: string       // "Week 2 of 6"
    },
    dropdown: [
      "My Wellness Hub",
      "Appointments", 
      "Resources",
      "Settings",
      "Sign Out"
    ]
  }
}
```

### 2. First-Time User Onboarding

#### Welcome Flow (5 gentle steps)
1. **Warm Welcome**
   - Video message from Dr. Jana
   - "Your pace, your journey" messaging
   - Option to skip and explore

2. **Basic Profile** (Optional)
   - First name only required
   - Postpartum stage (optional)
   - Timezone for gentle reminders

3. **Intention Setting** (Not Goals!)
   - "What brought you here today?"
   - "What kind of support feels right?"
   - Multi-select, skippable options

4. **Privacy Preferences**
   - Default: Everything private
   - Explain each setting simply
   - "You can change this anytime"

5. **First Star Earned!**
   - "Welcome Star" for joining
   - Brief, celebratory animation
   - Introduction to star system

### 3. Wellness Dashboard

#### Dashboard Layout
```typescript
interface WellnessDashboard {
  header: {
    greeting: string,           // "Welcome back, [Name]"
    date: string,              // "Tuesday, March 5"
    quickMood: MoodWidget      // Optional 1-click mood entry
  },
  
  sections: {
    todaysFocus: {
      message: string,         // Personalized encouragement
      suggestedAction: Action, // One simple thing to try
      skipOption: boolean      // Always present
    },
    
    activeJourneys: {
      courses: CourseProgress[],
      appointments: UpcomingAppointment[],
      resources: SavedResource[]
    },
    
    starCollection: {
      recentStars: Achievement[],
      totalStars: number,
      nextMilestone: string    // "5 stars to Wellness Explorer"
    },
    
    quickActions: [
      "Browse Resources",
      "Book Appointment", 
      "Message Support",
      "Take a Break"         // Always visible
    ]
  }
}
```

### 4. Course Integration

#### Course Progress Display
- Visual progress bars (soft, non-judgmental)
- "Pause Course" always visible
- No due dates or deadlines
- Celebrate any progress

#### Course Features
```typescript
interface CourseExperience {
  progress: {
    type: 'visual-journey',    // Path/journey metaphor
    showPercentage: false,     // Reduces pressure
    showTimeEstimates: false,  // No time pressure
    allowReset: true           // Start fresh anytime
  },
  
  achievements: {
    perLesson: 'Completion Star',
    perWeek: 'Week Journey Star',
    exploration: 'Curiosity Star', // For reviewing materials
    participation: 'Engagement Star' // For workbook completion
  },
  
  flexibility: {
    pauseCourse: 'prominent',
    skipContent: 'allowed',
    reviewPrevious: 'always',
    downloadAll: true
  }
}
```

### 5. Appointment Management

#### Calendly Integration Wrapper
```typescript
interface AppointmentHub {
  preAppointment: {
    moodCheckIn: SimpleMoodScale,
    topicsToDiscuss: string[],
    questionnaire: CustomForm,
    reminderPreferences: ReminderSettings
  },
  
  booking: {
    embeddedCalendly: true,
    passUserContext: {
      name: string,
      preferences: string,
      previousTopics: string[]
    }
  },
  
  postAppointment: {
    privateNotes: TextArea,
    resourceSuggestions: Resource[],
    nextSessionGoals: string[],
    celebrateAttendance: Star
  },
  
  history: {
    pastAppointments: Session[],
    progressNotes: Note[],
    privateReflections: Entry[]
  }
}
```

---

## Technical Architecture

### Database Schema Additions

```sql
-- User profile enhancements
ALTER TABLE user_profiles ADD COLUMN
  display_name VARCHAR(50),
  avatar_url TEXT,
  wellness_preferences JSONB DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{"all": "private"}',
  onboarding_completed_at TIMESTAMPTZ;

-- Star/Achievement system
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  achievement_type VARCHAR(50) NOT NULL,
  achievement_key VARCHAR(100) NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  is_private BOOLEAN DEFAULT true,
  UNIQUE(user_id, achievement_key)
);

-- Wellness tracking (optional)
CREATE TABLE wellness_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  entry_type VARCHAR(50), -- 'mood', 'gratitude', 'need_support'
  entry_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointment integration
CREATE TABLE appointment_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  calendly_event_id VARCHAR(255),
  pre_appointment_data JSONB,
  post_appointment_notes TEXT,
  appointment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User preferences
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES user_profiles(id),
  notification_settings JSONB DEFAULT '{"email": false, "browser": false}',
  display_preferences JSONB DEFAULT '{"theme": "light", "reduced_motion": false}',
  content_preferences JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### API Structure

```typescript
// Key API endpoints
interface APIEndpoints {
  auth: {
    '/api/auth/signup': 'POST',
    '/api/auth/login': 'POST', 
    '/api/auth/logout': 'POST',
    '/api/auth/session': 'GET'
  },
  
  profile: {
    '/api/profile': 'GET/PUT',
    '/api/profile/achievements': 'GET',
    '/api/profile/preferences': 'GET/PUT'
  },
  
  wellness: {
    '/api/wellness/dashboard': 'GET',
    '/api/wellness/mood': 'POST',
    '/api/wellness/stars': 'GET'
  },
  
  appointments: {
    '/api/appointments': 'GET',
    '/api/appointments/notes': 'POST',
    '/api/appointments/prepare': 'GET'
  }
}
```

---

## Badge & Achievement System

### Star Collection Philosophy
- **Stars, not streaks**: Collect beautiful moments, no pressure
- **Always earning**: Any positive action earns recognition
- **Never losing**: Stars are permanent, celebrating your journey
- **Private first**: Choose what to share, if anything

### Achievement Categories

```typescript
interface AchievementSystem {
  categories: {
    journey: {
      name: "Journey Stars",
      achievements: [
        "First Step",          // Joining platform
        "Course Explorer",     // Starting any course
        "Week Traveler",       // Completing a week
        "Knowledge Seeker",    // Accessing resources
        "Full Journey"         // Completing a course
      ]
    },
    
    selfCare: {
      name: "Self-Care Stars",
      achievements: [
        "Mood Tracker",        // Using mood check-in
        "Resource Reader",     // Reading an article
        "Video Watcher",       // Watching content
        "Workbook Worker",     // Downloading materials
        "Break Taker"          // Using pause features
      ]
    },
    
    connection: {
      name: "Connection Stars",
      achievements: [
        "Appointment Keeper",  // Attending session
        "Note Taker",         // Adding reflections
        "Community Viewer",    // Reading community posts
        "Support Seeker"       // Using help resources
      ]
    },
    
    special: {
      name: "Special Stars",
      achievements: [
        "Night Owl",          // Late night access (no judgment!)
        "Early Bird",         // Early morning use
        "Weekend Warrior",    // Weekend engagement
        "Holiday Hero",       // Using platform on holidays
        "Milestone Moments"   // Personal milestones
      ]
    }
  }
}
```

### Visual Design for Stars

```css
/* Star display styles */
.star-badge {
  background: linear-gradient(135deg, #FFE5B4, #FFD700);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  animation: gentle-sparkle 3s ease-in-out infinite;
}

.star-collection {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
}

@keyframes gentle-sparkle {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}
```

---

## Privacy & Security

### Core Privacy Features

```typescript
interface PrivacyControls {
  profileVisibility: {
    options: ['private', 'community-anonymous', 'community-named'],
    default: 'private',
    granular: {
      achievements: boolean,
      progress: boolean,
      activity: boolean
    }
  },
  
  dataManagement: {
    export: 'one-click download all data',
    delete: 'permanent deletion option',
    pause: 'freeze account temporarily',
    retention: '6 months default, customizable'
  },
  
  sharing: {
    achievements: 'opt-in only',
    anonymousMode: 'available always',
    blockedContent: 'customizable filters'
  }
}
```

### Security Measures
- End-to-end encryption for personal data
- HTTPS everywhere
- Session timeout controls
- Two-factor authentication (optional)
- Regular security audits

---

## Visual Design System

### Color Palette
```scss
// Primary colors - calming and supportive
$bloom-sky-soft: #E8F4F8;      // Primary background
$bloom-cream: #FFF9E6;          // Warm accents
$bloom-lavender: #E8D5F2;       // Achievement colors
$bloom-sage-light: #E8F0E8;     // Success states

// Text colors - gentle contrast
$text-primary: #4A5568;         // Main text
$text-secondary: #718096;       // Secondary text
$text-soft: #A0AEC0;           // Muted elements

// Interactive elements
$interactive-hover: #F7FAFC;
$interactive-focus: #E2E8F0;
$interactive-active: #CBD5E0;
```

### Typography
```css
/* Calm, readable typography */
:root {
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Inter', -apple-system, sans-serif;
  --font-size-base: 16px;
  --font-size-large: 18px; /* Mobile-friendly */
  --line-height-relaxed: 1.7;
}
```

### Component Patterns
- **Rounded corners**: 12-16px for softness
- **Shadows**: Subtle, multi-layered for depth
- **Spacing**: Generous whitespace (1.5x standard)
- **Animations**: Gentle, optional, respect prefers-reduced-motion
- **Icons**: Soft, rounded, friendly style

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2) ✅ COMPLETED
- [✅] Update header with prominent auth buttons
- [✅] Create user dashboard page structure  
- [✅] Implement basic routing and auth flow
- [✅] Set up database schema
- [✅] Create privacy settings page

**Deliverables**: Working login/signup, basic dashboard ✅

### Phase 2: Core Features (Weeks 3-4) ✅ COMPLETED
- [✅] Build wellness dashboard components
- [✅] Implement star achievement system
- [✅] Create course progress tracking
- [✅] Add appointment wrapper UI
- [✅] Design and implement first achievements

**Deliverables**: Functional dashboard with achievements ✅

### Phase 3: Integration (Weeks 5-6) 🚧 IN PROGRESS
- [✅] Calendly webhook integration (basic)
- [ ] Email notification system
- [ ] Resource recommendation engine
- [ ] Mobile responsiveness optimization
- [ ] Accessibility audit and fixes

**Deliverables**: Full platform integration

### Phase 4: Polish (Weeks 7-8)
- [ ] User testing and feedback
- [ ] Performance optimization
- [ ] Add remaining achievement types
- [ ] Community features (if ready)
- [ ] Launch preparation

**Deliverables**: Production-ready platform

---

## Success Metrics

### User-Centric Metrics
```typescript
interface SuccessMetrics {
  engagement: {
    'Weekly Active Users': 'Logged in at least once',
    'Dashboard Views': 'Engagement with platform',
    'Star Collections': 'Positive reinforcement working',
    'Resource Access': 'Finding helpful content'
  },
  
  wellbeing: {
    'Self-Reported Mood': 'Optional tracking trends',
    'Appointment Attendance': 'Therapy engagement',
    'Course Progress': 'Learning journey (no pressure)',
    'Support Utilization': 'Using available help'
  },
  
  satisfaction: {
    'Platform NPS': 'Would recommend to other moms',
    'Feature Adoption': 'Which features provide value',
    'Return Visits': 'Platform stickiness',
    'Feedback Sentiment': 'Qualitative insights'
  }
}
```

### What We DON'T Measure
- Streak lengths (we don't have them!)
- Completion speeds
- Comparative rankings  
- Time pressure metrics
- Failure rates

---

## Next Steps

1. **Review and approve this plan**
2. **Begin Phase 1 implementation**
3. **Create component library**
4. **Set up monitoring and analytics**
5. **Prepare user testing protocols**

## Document Version
- **Version**: 1.0
- **Last Updated**: [Current Date]
- **Status**: Planning Phase
- **Next Review**: After Phase 1 completion

---

## Appendix: Anti-Patterns to Avoid

### Never Implement:
- ❌ Streak counters or streak losses
- ❌ Public leaderboards or rankings
- ❌ Shame-based messaging
- ❌ Time-limited challenges
- ❌ Mandatory daily actions
- ❌ Before/after comparisons
- ❌ Push notifications at night
- ❌ Complex point systems
- ❌ Social pressure features
- ❌ "Failed" or negative labeling

### Always Remember:
- ✅ Progress is not linear
- ✅ Rest is productive
- ✅ Every mother's journey is unique
- ✅ Small steps are victories
- ✅ Community is optional
- ✅ Privacy is paramount
- ✅ Simplicity reduces stress
- ✅ Flexibility is essential

---

*This document is a living guide. As we learn from our users, we'll adapt and improve while maintaining our core principle: **Supporting mothers without pressure.***