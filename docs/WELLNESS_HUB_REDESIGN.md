# Wellness Hub Redesign Documentation

## Executive Summary

The Wellness Hub has been redesigned as **"My Growth Studio"** - a personalized, private space for postpartum mothers to access courses, track progress, and engage with wellness resources. This redesign addresses user feedback about the original name feeling too clinical and creates a more inviting, empowering experience.

## Key Decisions

### 1. Naming: "My Growth Studio"
- **Rationale**: Creates ownership, suggests creativity and personal development
- **Alternative considered**: "My Wellness Journey" (too passive)
- **Implementation**: Update all references from "Wellness Hub" to "My Growth Studio"

### 2. Core Design Principles
- **Private & Personal**: Each user's studio is their own safe space
- **Progress-Focused**: Visual progress tracking and achievement celebrations
- **Flexible Access**: Support for both course progression and à la carte exploration
- **Mobile-First**: Optimized for busy mothers accessing on phones

## Feature Set

### Phase 1: Foundation (Current Implementation)
1. **Course Library**
   - Display purchased courses with progress
   - Quick resume functionality
   - Visual progress indicators

2. **Dashboard Overview**
   - Personalized welcome message
   - Current course progress
   - Recent achievements
   - Quick access to continue learning

3. **Basic Navigation**
   - Clean, intuitive menu structure
   - Mobile-responsive design
   - Clear wayfinding

### Phase 2: Enhanced Experience (Next Sprint)
1. **Resource Library**
   - Downloadable worksheets
   - Guided meditations
   - Quick reference guides
   - Searchable content

2. **Progress Tracking**
   - Visual journey map
   - Milestone celebrations
   - Streak tracking
   - Achievement badges

3. **Personalization**
   - Custom dashboard widgets
   - Favorite resources
   - Personal notes/reflections

### Phase 3: Community Features (Future)
1. **Discussion Forums**
   - Private, moderated spaces
   - Topic-based discussions
   - Expert Q&A sessions

2. **Peer Support**
   - Anonymous sharing options
   - Success stories
   - Encouragement system

## Technical Implementation

### Database Structure
```
Tables already in place:
- user_profiles (user data)
- courses (course definitions)
- course_modules (weekly content)
- course_lessons (individual lessons)
- user_course_access (enrollments)
- course_progress (lesson completion)
- user_achievements (badges/milestones)
```

### API Endpoints
```
Existing endpoints to leverage:
- /api/courses/user-courses - Get user's enrolled courses
- /api/courses/[courseId]/progress - Get/update progress
- /api/user/achievements - Track milestones
- /api/user/profile - User preferences
```

### Cart System Integration
The existing cart system (`/app/cart/`) supports:
- Multiple course purchases
- Discount codes
- Secure checkout via Stripe
- Automatic enrollment upon purchase

### Authentication Flow
- Uses Supabase Auth
- Session-based access control
- Automatic redirect to login if not authenticated
- Remember me functionality

## Expert Recommendations Incorporated

### From Dr. Kristin Neff (Self-Compassion)
- Progress tracking includes self-compassion reminders
- No comparison with other users
- Celebration of small wins
- "Good enough" messaging throughout

### From Dr. Alexandra Sacks (Matrescence)
- Identity-affirming language
- Both/and framing (mother AND individual)
- Normalization of struggles
- Growth mindset emphasis

### From UX Research
- One-thumb navigation for mobile
- 3-tap maximum to any content
- Visual progress over numbers
- Calm, nurturing color palette

## Implementation Roadmap

### Week 1: Foundation Setup
- [x] Create wellness hub routes and pages
- [x] Implement basic dashboard
- [x] Connect to existing course data
- [x] Mobile responsive design

### Week 2: Core Features
- [ ] Update all UI text to "My Growth Studio"
- [ ] Implement progress visualization
- [ ] Add achievement system
- [ ] Create onboarding flow

### Week 3: Enhanced Experience
- [ ] Add resource library structure
- [ ] Implement favoriting system
- [ ] Create reflection/notes feature
- [ ] Add quick-access widgets

### Week 4: Polish & Launch
- [ ] User testing with target audience
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Soft launch to beta users

## Integration Points

### With Course Purchase Flow
1. After successful purchase → Auto-redirect to My Growth Studio
2. Welcome email includes direct link to studio
3. First-time setup wizard for new users

### With Email Automation
- Progress milestone emails
- Gentle reminders for inactive users
- Achievement celebration emails
- Weekly progress summaries (optional)

### With Analytics
- Track engagement metrics
- Monitor feature usage
- Identify drop-off points
- A/B test improvements

## Success Metrics

### Engagement
- Daily active users
- Average session duration
- Course completion rates
- Return visit frequency

### User Satisfaction
- NPS scores
- Feature usage analytics
- Support ticket volume
- User feedback themes

### Business Impact
- Course completion → Renewal rate
- Engagement → Word of mouth referrals
- Satisfaction → Positive reviews
- Retention → Lifetime value

## Security & Privacy Considerations

### HIPAA Compliance Note
- No PHI stored in Growth Studio
- Educational content only
- Anonymous progress tracking option
- Clear data usage policies

### Data Protection
- All progress data encrypted
- User-controlled privacy settings
- No sharing between users
- Regular security audits

## Future Enhancements

### AI-Powered Features
- Personalized content recommendations
- Adaptive learning paths
- Mood-based resource suggestions
- Smart reminder scheduling

### Integrations
- Calendar sync for lesson scheduling
- Wearable data for stress tracking
- Partner app for shared progress
- Healthcare provider portal (with consent)

## Maintenance & Updates

### Content Management
- Admin panel for resource uploads
- Version control for course updates
- A/B testing framework
- User feedback integration

### Technical Debt
- Migrate from wellness_hub to growth_studio naming
- Consolidate duplicate progress tracking
- Optimize database queries
- Implement caching strategy

## Conclusion

"My Growth Studio" represents a significant evolution in how we support postpartum mothers. By creating a personalized, private space focused on growth and progress, we're addressing the core needs identified through user research while building on the solid technical foundation already in place.

The phased approach allows for rapid initial deployment while maintaining flexibility for future enhancements based on user feedback and engagement data.

---

**Last Updated**: January 2025
**Status**: Phase 1 Implementation Complete
**Next Review**: After Week 2 Implementation