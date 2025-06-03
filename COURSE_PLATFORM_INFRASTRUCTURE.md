# Course Platform Infrastructure & Execution Plan
## Complete Technical & Legal Requirements

---

## 🏗️ **INFRASTRUCTURE OVERVIEW**

### Option 1: Use Existing Course Platform (RECOMMENDED TO START)
**Platforms**: Teachable, Thinkific, Kajabi
- **Pros**: 
  - Built-in video hosting
  - Student progress tracking
  - Payment processing
  - Basic analytics
  - No HIPAA concerns (educational content)
- **Cons**: 
  - Monthly fees ($39-299)
  - Limited customization
  - Can't capture detailed workbook data
- **Best for**: Quick launch, testing market

### Option 2: Custom Build on Bloom Site
**Tech Stack Required**:
```
Frontend:
- Student portal pages
- Video player
- Progress tracking UI
- Workbook forms

Backend:
- User authentication (Supabase Auth)
- Video hosting (Vimeo/Cloudflare Stream)
- Progress tracking database
- Form data storage
- Analytics

Infrastructure:
- HIPAA-compliant hosting (if needed)
- Secure file storage
- Backup systems
- CDN for videos
```

---

## 🔒 **HIPAA COMPLIANCE CONSIDERATIONS**

### When HIPAA Applies:
- ❌ Educational content = NOT covered by HIPAA
- ✅ Personal health info in workbooks = POTENTIALLY covered
- ✅ If you review/respond to health issues = COVERED

### HIPAA Requirements if Applicable:
1. **Business Associate Agreements** (BAAs)
   - Hosting provider (Vercel won't sign)
   - Database (Supabase WILL sign)
   - Email service
   - Any third-party tools

2. **Technical Safeguards**
   - Encryption at rest and in transit
   - Access controls and audit logs
   - Automatic logoff
   - Unique user IDs

3. **Administrative Safeguards**
   - Privacy policies
   - Training documentation
   - Incident response plan
   - Risk assessments

### SMART WORKAROUND:
**Make courses purely educational**
- Don't collect health information
- Workbooks = self-reflection only
- No therapist feedback on personal issues
- Clear disclaimers: "This is education, not therapy"

---

## 📚 **WORKBOOK IMPLEMENTATION OPTIONS**

### Option 1: Downloadable PDFs (Simple)
```
How it works:
1. Student downloads PDF
2. Fills out on computer/prints
3. Keeps for personal use
4. No data collection = No HIPAA
```

### Option 2: Online Forms (Track Progress)
```typescript
// Database schema for workbook responses
interface WorkbookEntry {
  id: string;
  userId: string;
  courseId: string;
  moduleNumber: number;
  responses: {
    question: string;
    answer: string;
    timestamp: Date;
  }[];
  completedAt: Date;
}

// Features:
- Save progress
- Return later
- View past entries
- Track completion
```

### Option 3: Hybrid Approach (Recommended)
- PDFs for sensitive content
- Online for progress tracking
- Clear separation of educational vs. personal data

---

## 👤 **USER PORTAL REQUIREMENTS**

### Student Dashboard Page Structure:
```
/courses/dashboard
├── My Courses (purchased courses)
├── Current Progress (% complete)
├── Upcoming Live Sessions
├── Community Updates
└── Resources/Downloads

/courses/[courseId]/module/[moduleNumber]
├── Video Player
├── Workbook Section
├── Resources
├── Mark Complete Button
└── Next Module →
```

### Database Schema:
```sql
-- Users (extends existing auth)
users (
  id uuid PRIMARY KEY,
  email text UNIQUE,
  created_at timestamp
)

-- Course Enrollments
enrollments (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users,
  course_id text,
  purchased_at timestamp,
  expires_at timestamp,
  status text -- active, completed, expired
)

-- Progress Tracking
progress (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users,
  course_id text,
  module_number int,
  video_watched boolean,
  workbook_completed boolean,
  completed_at timestamp
)

-- Workbook Responses (if collecting)
workbook_responses (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users,
  module_id text,
  responses jsonb,
  created_at timestamp
)
```

---

## 🎁 **BONUS MATERIALS CREATION**

### Yes, I Can Create These! Here's How:

#### 1. **Emergency Coping Cards**
```markdown
Format: Canva template → Export as PDF
Content structure:

FRONT:
"When Baby Won't Stop Crying"
[Calming gradient background]

BACK:
1. Put baby in safe place (crib)
2. Step outside for 60 seconds
3. Call: [support number]
Remember: It's okay to take a break
```

#### 2. **Partner Communication Guide**
```markdown
# How to Talk to Your Partner About Postpartum

## Conversation Starters:
"I need to share how I'm feeling..."
"Here's how you can help me..."

## What Partners Can Do:
- Take night shift 2x/week
- Handle dinner on Thursdays
- Listen without fixing
[Full 10-page guide with examples]
```

#### 3. **Meal Planning Template**
```markdown
## Postpartum Power Meals

### Breakfast (5 min):
□ Overnight oats + berries
□ Protein smoothie packs
□ Hard-boiled egg toast

### Freezer Meals:
□ Lactation cookies
□ Burrito bowls
□ Soup portions
[Complete shopping lists included]
```

---

## 🚀 **PHASED IMPLEMENTATION PLAN**

### Phase 1: MVP Launch (4 weeks)
**Use Teachable/Thinkific**
- Upload videos
- Create PDF workbooks
- Set up Facebook group
- Launch with "Founding Member" pricing

**Cost**: $100/month
**Time**: 40 hours
**Revenue potential**: 20 students × $297 = $5,940

### Phase 2: Custom Integration (3 months)
**Build on Bloom site**
- Student portal
- Progress tracking
- Basic workbook forms
- Email automation

**Cost**: $5,000-10,000 (developer)
**Benefits**: Full control, better margins

### Phase 3: Full Platform (6 months)
**Advanced features**
- Interactive workbooks
- AI-powered insights
- Community features
- Mobile app

**Investment**: $20,000+
**Only if**: Proven demand from Phase 1

---

## 💻 **TECHNICAL IMPLEMENTATION**

### For Custom Build:

#### 1. Authentication & Authorization
```typescript
// Middleware to check course access
export async function checkCourseAccess(userId: string, courseId: string) {
  const enrollment = await supabase
    .from('enrollments')
    .select('*')
    .match({ user_id: userId, course_id: courseId })
    .single();
    
  return enrollment?.status === 'active';
}
```

#### 2. Video Hosting
- **Vimeo Pro**: $75/month, privacy controls
- **Cloudflare Stream**: $5/1000 minutes
- **YouTube Unlisted**: Free but less secure

#### 3. Progress Tracking
```typescript
// Track video completion
async function markVideoComplete(userId: string, moduleId: string) {
  await supabase.from('progress').upsert({
    user_id: userId,
    module_id: moduleId,
    video_watched: true,
    updated_at: new Date()
  });
}
```

---

## 📊 **ANALYTICS & FEEDBACK SYSTEM**

### What to Track:
- Course completion rates
- Popular/unpopular modules
- Quiz scores
- Time spent per module
- Community engagement

### Feedback Collection:
- Post-module surveys (Google Forms)
- Course completion survey
- 30-day follow-up email
- Success story collection

### Using Data (Without HIPAA):
- "85% found Module 3 most helpful"
- "Average mood improvement: 40%"
- "Most requested topic: sleep training"
- Anonymous aggregate data only

---

## 🎯 **RECOMMENDED APPROACH**

### Start Here (Month 1):
1. **Create content** in simple tools
2. **Use Teachable** for delivery ($99/month)
3. **PDFs only** for workbooks
4. **Facebook group** for community
5. **Zoom** for live Q&As

### Upgrade When (Month 6+):
- 100+ students enrolled
- Proven course completion
- Clear feature requests
- Revenue justifies investment

### Build Custom When:
- 500+ students
- Multiple courses
- Need detailed analytics
- Want full control

---

## ✅ **EXECUTION CHECKLIST**

### Week 1-2: Content Creation
- [ ] Record first module videos
- [ ] Create Module 1 workbook PDF
- [ ] Design coping cards in Canva
- [ ] Write partner guide outline

### Week 3: Platform Setup
- [ ] Create Teachable account
- [ ] Upload Module 1 content
- [ ] Set up pricing/checkout
- [ ] Create Facebook group

### Week 4: Testing
- [ ] Beta test with 5 users
- [ ] Gather feedback
- [ ] Fix technical issues
- [ ] Prepare launch emails

### Week 5: Launch
- [ ] Announce to email list
- [ ] Social media campaign
- [ ] Track enrollments
- [ ] Support first students

---

## 💡 **COST-BENEFIT ANALYSIS**

### Minimal Viable Product:
- **Cost**: $200/month + 40 hours
- **Break-even**: 1 student/month
- **Potential**: $5,000-10,000/month

### Full Custom Platform:
- **Cost**: $20,000 + ongoing maintenance
- **Break-even**: 67 students
- **Potential**: $50,000+/month
- **Timeline**: 6-12 months

### Recommendation:
**Start simple, scale smart**. Use existing platforms to validate demand, then invest in custom solutions only when growth justifies it.

---

## 🚨 **RISK MITIGATION**

### Legal Protection:
- Clear disclaimers on all materials
- "Educational content only"
- "Not a substitute for therapy"
- Terms of service agreement
- No personal health advice

### Technical Protection:
- Regular backups
- Secure password requirements
- SSL certificates
- Payment via established processor
- Student data exports

### Business Protection:
- Start small to test
- Get feedback early
- Iterate based on data
- Keep overhead low
- Focus on student success

This infrastructure plan provides a clear path from simple MVP to sophisticated platform, with costs and timelines at each stage.