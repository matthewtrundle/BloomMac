'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedSlideViewer from '@/components/course/EnhancedSlideViewer';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Plus, 
  Trash2, 
  Edit3, 
  FileText, 
  Video, 
  Image,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Code,
  Monitor
} from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import dynamic from 'next/dynamic';

// Dynamically import the rich text editor to avoid SSR issues
const RichTextEditor = dynamic(
  () => import('@/components/admin/RichTextEditor'),
  { ssr: false }
);

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  subtitle: string;
  is_active: boolean;
  version: number;
  duration: string;
  total_lessons: number;
  price: number;
  original_price: number;
  target_audience: string;
  learning_outcomes: string[];
  course_features: string[];
}

interface CourseWeek {
  id: string;
  week_number: number;
  title: string;
  description: string;
  objectives: string[];
  order_index: number;
  course_lessons: CourseLesson[];
}

interface CourseLesson {
  id: string;
  lesson_number: number;
  title: string;
  description: string;
  video_duration_minutes: number;
  content_body: string;
  video_script_formatted: string;
  script_notes: string;
  script_status: 'draft' | 'reviewed' | 'final' | 'archived';
  script_duration_estimate: number;
  talking_points: any[];
  slides_html: string;
  slides_url: string;
  video_url: string;
  order_index: number;
  is_preview: boolean;
  is_published: boolean;
}

interface CourseAsset {
  id: string;
  filename: string;
  original_filename: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  download_url: string;
  is_public: boolean;
  description: string;
  created_at: string;
}

type TabType = 'details' | 'structure' | 'content' | 'scripts' | 'assets';

export default function CourseEditPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [weeks, setWeeks] = useState<CourseWeek[]>([]);
  const [assets, setAssets] = useState<CourseAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);
  const [editingLesson, setEditingLesson] = useState<CourseLesson | null>(null);
  const [showHtmlEditor, setShowHtmlEditor] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`);
      if (!response.ok) throw new Error('Failed to fetch course');
      
      const data = await response.json();
      setCourse(data.course);
      setWeeks(data.weeks || []);
      setAssets(data.assets || []);
    } catch (error) {
      console.error('Error fetching course:', error);
      setError('Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCourse = async () => {
    if (!course) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
      });

      if (!response.ok) throw new Error('Failed to save course');
      
      setError('');
      // Show success message (could add a toast here)
    } catch (error) {
      console.error('Error saving course:', error);
      setError('Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const toggleWeekExpansion = (weekId: string) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(weekId)) {
      newExpanded.delete(weekId);
    } else {
      newExpanded.add(weekId);
    }
    setExpandedWeeks(newExpanded);
  };

  const handleSaveLesson = async (lesson: CourseLesson) => {
    try {
      const response = await fetch(`/api/admin/courses/lessons/${lesson.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lesson)
      });

      if (!response.ok) throw new Error('Failed to save lesson');
      
      // Update the lesson in the local state
      setWeeks(weeks.map(week => ({
        ...week,
        course_lessons: week.course_lessons?.map(l => 
          l.id === lesson.id ? lesson : l
        )
      })));
      
      setSelectedLesson(null);
      setEditingLesson(null);
      // Show success message (could add a toast here)
    } catch (error) {
      console.error('Error saving lesson:', error);
      setError('Failed to save lesson');
    }
  };

  const openLessonEditor = (lesson: CourseLesson) => {
    setEditingLesson(lesson);
    setSelectedLesson(lesson);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
        <AdminHeader />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bloompink"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
        <AdminHeader />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-semibold text-bloom-dark mb-4">Course not found</h1>
            <Link href="/admin/courses" className="text-bloompink hover:text-bloom-pink-dark">
              ← Back to Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
      <AdminHeader />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/courses"
              className="flex items-center gap-2 text-bloom-dark/70 hover:text-bloom-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Courses
            </Link>
            <div className="w-px h-6 bg-gray-300"></div>
            <h1 className="text-3xl font-playfair text-bloom-dark">{course.title}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href={`/courses/${course.slug}`}
              target="_blank"
              className="flex items-center gap-2 bg-bloom-sage text-white px-4 py-2 rounded-lg hover:bg-bloom-sage-dark transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview
            </Link>
            <button
              onClick={handleSaveCourse}
              disabled={saving}
              className="flex items-center gap-2 bg-bloompink text-white px-4 py-2 rounded-lg hover:bg-bloom-pink-dark transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-soft border border-bloom-sage/10 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'details', label: 'Course Details', icon: Edit3 },
                { id: 'structure', label: 'Course Structure', icon: FileText },
                { id: 'content', label: 'Slides & Content', icon: FileText },
                { id: 'scripts', label: 'Video Scripts', icon: Video },
                { id: 'assets', label: 'Assets & Resources', icon: Image }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-bloompink text-bloompink bg-bloom-pink-50/30'
                      : 'border-transparent text-bloom-dark/70 hover:text-bloom-dark hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Course Details Tab */}
            {activeTab === 'details' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-bloom-dark mb-2">
                      Course Title
                    </label>
                    <input
                      type="text"
                      value={course.title}
                      onChange={(e) => setCourse({ ...course, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-bloom-dark mb-2">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={course.slug}
                      onChange={(e) => setCourse({ ...course, slug: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-bloom-dark mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={course.subtitle || ''}
                    onChange={(e) => setCourse({ ...course, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-bloom-dark mb-2">
                    Description
                  </label>
                  <textarea
                    value={course.description}
                    onChange={(e) => setCourse({ ...course, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-bloom-dark mb-2">
                      Status
                    </label>
                    <select
                      value={course.is_active ? 'active' : 'inactive'}
                      onChange={(e) => setCourse({ ...course, is_active: e.target.value === 'active' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-bloom-dark mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={course.duration}
                      onChange={(e) => setCourse({ ...course, duration: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-bloom-dark mb-2">
                      Total Lessons
                    </label>
                    <input
                      type="number"
                      value={course.total_lessons}
                      onChange={(e) => setCourse({ ...course, total_lessons: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-bloom-dark mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={course.price}
                      onChange={(e) => setCourse({ ...course, price: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-bloom-dark mb-2">
                      Original Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={course.original_price}
                      onChange={(e) => setCourse({ ...course, original_price: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Course Structure Tab */}
            {activeTab === 'structure' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-bloom-dark">Course Structure</h3>
                  <button className="flex items-center gap-2 bg-bloompink text-white px-4 py-2 rounded-lg hover:bg-bloom-pink-dark transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Week
                  </button>
                </div>

                <div className="space-y-4">
                  {weeks.map((week) => (
                    <div key={week.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div 
                        className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => toggleWeekExpansion(week.id)}
                      >
                        <div className="flex items-center gap-3">
                          {expandedWeeks.has(week.id) ? (
                            <ChevronDown className="w-5 h-5 text-bloom-dark/70" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-bloom-dark/70" />
                          )}
                          <h4 className="font-medium text-bloom-dark">
                            Week {week.week_number}: {week.title}
                          </h4>
                          <span className="text-sm text-bloom-dark/60">
                            ({week.course_lessons?.length || 0} lessons)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-bloom-dark/70 hover:text-bloom-dark transition-colors">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:text-red-700 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {expandedWeeks.has(week.id) && (
                        <div className="p-4 border-t border-gray-200">
                          <div className="space-y-3">
                            {week.course_lessons?.map((lesson) => (
                              <div key={lesson.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                                <div className="flex-1">
                                  <h5 className="font-medium text-bloom-dark">
                                    Lesson {lesson.lesson_number}: {lesson.title}
                                  </h5>
                                  <p className="text-sm text-bloom-dark/60">{lesson.description}</p>
                                  <div className="flex items-center gap-4 mt-1 text-xs text-bloom-dark/50">
                                    <span>{lesson.video_duration_minutes} min</span>
                                    {lesson.is_preview && <span className="text-green-600">Preview</span>}
                                    {lesson.is_published && <span className="text-blue-600">Published</span>}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openLessonEditor(lesson);
                                    }}
                                    className="p-2 text-bloompink hover:text-bloom-pink-dark transition-colors"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  {lesson.slides_html && (
                                    <Link
                                      href={`/admin/courses/${courseId}/preview/${lesson.id}`}
                                      target="_blank"
                                      className="p-2 text-bloom-sage hover:text-bloom-sage-dark transition-colors"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Link>
                                  )}
                                </div>
                              </div>
                            ))}
                            <button className="flex items-center gap-2 text-bloompink hover:text-bloom-pink-dark transition-colors text-sm">
                              <Plus className="w-4 h-4" />
                              Add Lesson
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Content Management Tab */}
            {activeTab === 'content' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-bloom-dark">Slides & Content Management</h3>
                  {selectedLesson && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowHtmlEditor(!showHtmlEditor)}
                        className="flex items-center gap-2 text-bloom-dark/70 hover:text-bloom-dark transition-colors"
                      >
                        <Code className="w-4 h-4" />
                        {showHtmlEditor ? 'Visual Editor' : 'HTML Editor'}
                      </button>
                      <button
                        onClick={() => setPreviewMode(!previewMode)}
                        className="flex items-center gap-2 text-bloom-sage hover:text-bloom-sage-dark transition-colors"
                      >
                        <Monitor className="w-4 h-4" />
                        {previewMode ? 'Edit' : 'Preview'}
                      </button>
                      
                      {/* Full Preview Button */}
                      <Link
                        href={`/course/${course.slug}/week/${weeks.find(w => w.course_lessons?.some(l => l.id === selectedLesson.id))?.week_number}/lesson/${selectedLesson.lesson_number}`}
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 bg-bloompink text-white rounded-lg hover:bg-bloom-pink-dark transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Full Preview
                      </Link>
                    </div>
                  )}
                </div>

                {/* Lesson Selector Dropdown */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-bloom-dark mb-2">
                    Select Lesson to Edit
                  </label>
                  <select
                    value={selectedLesson?.id || ''}
                    onChange={(e) => {
                      const lesson = weeks
                        .flatMap(w => w.course_lessons || [])
                        .find(l => l.id === e.target.value);
                      setSelectedLesson(lesson || null);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                  >
                    <option value="">Choose a lesson...</option>
                    {weeks.map((week) => (
                      <optgroup key={week.id} label={`Week ${week.week_number}: ${week.title}`}>
                        {week.course_lessons?.map((lesson) => (
                          <option key={lesson.id} value={lesson.id}>
                            Lesson {lesson.lesson_number}: {lesson.title}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {selectedLesson && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedLesson.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                    >
                      {previewMode ? (
                        <div className="p-8">
                          <h4 className="text-xl font-semibold text-bloom-dark mb-4">
                            Preview: {selectedLesson.title}
                          </h4>
                          {selectedLesson.slides_html ? (
                            <EnhancedSlideViewer
                              slides={selectedLesson.slides_html.split('<!-- SLIDE -->').filter(Boolean)}
                              lessonTitle={selectedLesson.title}
                              lessonNumber={selectedLesson.lesson_number}
                              weekNumber={weeks.find(w => w.course_lessons?.some(l => l.id === selectedLesson.id))?.week_number || 1}
                            />
                          ) : (
                            <p className="text-gray-500">No slides content yet</p>
                          )}
                        </div>
                      ) : (
                        <div className="p-6 space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-bloom-dark mb-2">
                              Lesson Title
                            </label>
                            <input
                              type="text"
                              value={selectedLesson.title}
                              onChange={(e) => setSelectedLesson({ ...selectedLesson, title: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-bloom-dark mb-2">
                              Description
                            </label>
                            <textarea
                              value={selectedLesson.description || ''}
                              onChange={(e) => setSelectedLesson({ ...selectedLesson, description: e.target.value })}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-bloom-dark mb-2">
                                Duration (minutes)
                              </label>
                              <input
                                type="number"
                                value={selectedLesson.video_duration_minutes || 0}
                                onChange={(e) => setSelectedLesson({ 
                                  ...selectedLesson, 
                                  video_duration_minutes: parseInt(e.target.value) 
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-bloom-dark mb-2">
                                Is Preview?
                              </label>
                              <select
                                value={selectedLesson.is_preview ? 'yes' : 'no'}
                                onChange={(e) => setSelectedLesson({ 
                                  ...selectedLesson, 
                                  is_preview: e.target.value === 'yes' 
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                              >
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-bloom-dark mb-2">
                                Published?
                              </label>
                              <select
                                value={selectedLesson.is_published ? 'yes' : 'no'}
                                onChange={(e) => setSelectedLesson({ 
                                  ...selectedLesson, 
                                  is_published: e.target.value === 'yes' 
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                              >
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-bloom-dark mb-2">
                              Slides Content
                            </label>
                            {showHtmlEditor ? (
                              <textarea
                                value={selectedLesson.slides_html || ''}
                                onChange={(e) => setSelectedLesson({ ...selectedLesson, slides_html: e.target.value })}
                                rows={20}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent font-mono text-sm"
                                placeholder="Enter HTML slides content..."
                              />
                            ) : (
                              <RichTextEditor
                                value={selectedLesson.slides_html || ''}
                                onChange={(value) => setSelectedLesson({ ...selectedLesson, slides_html: value })}
                                placeholder="Create your lesson slides here..."
                              />
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-bloom-dark mb-2">
                                Slides URL (optional)
                              </label>
                              <input
                                type="url"
                                value={selectedLesson.slides_url || ''}
                                onChange={(e) => setSelectedLesson({ ...selectedLesson, slides_url: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                                placeholder="https://..."
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-bloom-dark mb-2">
                                Video URL
                              </label>
                              <input
                                type="url"
                                value={selectedLesson.video_url || ''}
                                onChange={(e) => setSelectedLesson({ ...selectedLesson, video_url: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                                placeholder="https://..."
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-3 pt-4 border-t">
                            <button
                              onClick={() => setSelectedLesson(null)}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-bloom-dark/70 hover:text-bloom-dark transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveLesson(selectedLesson)}
                              className="px-4 py-2 bg-bloompink text-white rounded-lg hover:bg-bloom-pink-dark transition-colors"
                            >
                              Save Lesson
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}

                {!selectedLesson && (
                  <div className="text-center py-12 text-bloom-dark/60">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-bloom-dark/30" />
                    <p>Select a lesson from the dropdown above to edit its content</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Scripts Tab */}
            {activeTab === 'scripts' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-bloom-dark">Video Scripts Management</h3>
                  <div className="text-sm text-bloom-dark/60">
                    {weeks.reduce((total, week) => total + (week.course_lessons?.length || 0), 0)} total lessons
                  </div>
                </div>

                {/* Script Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">Final Scripts</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900">
                      {weeks.reduce((total, week) => 
                        total + week.course_lessons.filter(l => l.script_status === 'final').length, 0
                      )}
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-yellow-900">Under Review</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-900">
                      {weeks.reduce((total, week) => 
                        total + week.course_lessons.filter(l => l.script_status === 'reviewed').length, 0
                      )}
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Total Duration</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">
                      {Math.round(weeks.reduce((total, week) => 
                        total + week.course_lessons.reduce((sum, l) => 
                          sum + (l.script_duration_estimate || 0), 0
                        ), 0
                      ) / 60)} min
                    </p>
                  </div>
                </div>

                {/* Scripts by Week */}
                <div className="space-y-4">
                  {weeks.map((week) => (
                    <div key={week.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div 
                        className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => toggleWeekExpansion(week.id)}
                      >
                        <div className="flex items-center gap-3">
                          {expandedWeeks.has(week.id) ? (
                            <ChevronDown className="w-5 h-5 text-bloom-dark/70" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-bloom-dark/70" />
                          )}
                          <h4 className="font-medium text-bloom-dark">
                            Week {week.week_number}: {week.title}
                          </h4>
                          <span className="text-sm text-bloom-dark/60">
                            ({week.course_lessons?.filter(l => l.script_notes).length || 0}/{week.course_lessons?.length || 0} scripts)
                          </span>
                        </div>
                      </div>

                      {expandedWeeks.has(week.id) && (
                        <div className="p-4 border-t border-gray-200 space-y-3">
                          {week.course_lessons?.map((lesson) => (
                            <div 
                              key={lesson.id} 
                              className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => {
                                setSelectedLesson(lesson);
                                setActiveTab('scripts');
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-bloom-dark mb-1">
                                    Lesson {lesson.lesson_number}: {lesson.title}
                                  </h5>
                                  
                                  <div className="flex items-center gap-4 text-sm">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                      lesson.script_status === 'final' ? 'bg-green-100 text-green-700' :
                                      lesson.script_status === 'reviewed' ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-gray-100 text-gray-700'
                                    }`}>
                                      {lesson.script_status || 'draft'}
                                    </span>
                                    
                                    {lesson.script_duration_estimate && (
                                      <span className="text-bloom-dark/60 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {Math.round(lesson.script_duration_estimate / 60)} min
                                      </span>
                                    )}
                                    
                                    {lesson.script_notes && (
                                      <span className="text-bloom-dark/60">
                                        {lesson.script_notes.length} characters
                                      </span>
                                    )}
                                  </div>
                                  
                                  {lesson.talking_points && lesson.talking_points.length > 0 && (
                                    <div className="mt-2 text-sm text-bloom-dark/70">
                                      <strong>Key Points:</strong> {lesson.talking_points.slice(0, 3).join(' • ')}
                                      {lesson.talking_points.length > 3 && ' ...'}
                                    </div>
                                  )}
                                </div>
                                
                                <button
                                  className="text-bloompink hover:text-bloom-pink-dark transition-colors p-2"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Script Editor Modal/Panel */}
                {selectedLesson && activeTab === 'scripts' && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                    >
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-bloom-dark">
                              Edit Script: {selectedLesson.title}
                            </h3>
                            <p className="text-sm text-bloom-dark/60 mt-1">
                              Lesson {selectedLesson.lesson_number} • Estimated duration: {Math.round((selectedLesson.script_duration_estimate || 0) / 60)} minutes
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedLesson(null)}
                            className="text-bloom-dark/70 hover:text-bloom-dark p-2"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
                        <div className="space-y-6">
                          {/* Script Status */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-bloom-dark mb-2">
                                Script Status
                              </label>
                              <select
                                value={selectedLesson.script_status || 'draft'}
                                onChange={(e) => setSelectedLesson({ 
                                  ...selectedLesson, 
                                  script_status: e.target.value as any 
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                              >
                                <option value="draft">Draft</option>
                                <option value="reviewed">Under Review</option>
                                <option value="final">Final</option>
                                <option value="archived">Archived</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-bloom-dark mb-2">
                                Duration (minutes)
                              </label>
                              <input
                                type="number"
                                value={Math.round((selectedLesson.script_duration_estimate || 0) / 60)}
                                onChange={(e) => setSelectedLesson({ 
                                  ...selectedLesson, 
                                  script_duration_estimate: parseInt(e.target.value) * 60 
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-bloom-dark mb-2">
                                Video URL
                              </label>
                              <input
                                type="url"
                                value={selectedLesson.video_url || ''}
                                onChange={(e) => setSelectedLesson({ 
                                  ...selectedLesson, 
                                  video_url: e.target.value 
                                })}
                                placeholder="https://..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                              />
                            </div>
                          </div>
                          
                          {/* Main Script Content */}
                          <div>
                            <label className="block text-sm font-medium text-bloom-dark mb-2">
                              Video Script
                            </label>
                            <textarea
                              value={selectedLesson.script_notes || ''}
                              onChange={(e) => setSelectedLesson({ 
                                ...selectedLesson, 
                                script_notes: e.target.value 
                              })}
                              rows={20}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent font-mono text-sm"
                              placeholder="Enter the full video script here..."
                            />
                            <p className="text-xs text-bloom-dark/60 mt-1">
                              {(selectedLesson.script_notes || '').length} characters • 
                              ~{Math.round((selectedLesson.script_notes || '').split(' ').length / 150)} minutes speaking time
                            </p>
                          </div>
                          
                          {/* Talking Points */}
                          <div>
                            <label className="block text-sm font-medium text-bloom-dark mb-2">
                              Key Talking Points
                            </label>
                            <textarea
                              value={(selectedLesson.talking_points || []).join('\n')}
                              onChange={(e) => setSelectedLesson({ 
                                ...selectedLesson, 
                                talking_points: e.target.value.split('\n').filter(p => p.trim()) 
                              })}
                              rows={5}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                              placeholder="Enter key points (one per line)..."
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                        <button
                          onClick={() => setSelectedLesson(null)}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-bloom-dark/70 hover:text-bloom-dark transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveLesson(selectedLesson)}
                          className="px-4 py-2 bg-bloompink text-white rounded-lg hover:bg-bloom-pink-dark transition-colors"
                        >
                          Save Script
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Assets Tab */}
            {activeTab === 'assets' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-bloom-dark">Course Assets</h3>
                  <button className="flex items-center gap-2 bg-bloompink text-white px-4 py-2 rounded-lg hover:bg-bloom-pink-dark transition-colors">
                    <Plus className="w-4 h-4" />
                    Upload Asset
                  </button>
                </div>

                {assets.length === 0 ? (
                  <div className="text-center py-12 text-bloom-dark/60">
                    <Image className="w-12 h-12 mx-auto mb-4 text-bloom-dark/30" />
                    <p>No assets uploaded yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {assets.map((asset) => (
                      <div key={asset.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-bloom-dark truncate">
                            {asset.original_filename}
                          </h4>
                          <button className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-bloom-dark/60 mb-2">{asset.description}</p>
                        <div className="flex items-center justify-between text-xs text-bloom-dark/50">
                          <span>{asset.file_type}</span>
                          <span>{Math.round(asset.file_size / 1024)} KB</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Lesson Editor Modal */}
      {editingLesson && activeTab === 'structure' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-bloom-dark">
                  Edit Lesson Details
                </h3>
                <button
                  onClick={() => setEditingLesson(null)}
                  className="text-bloom-dark/70 hover:text-bloom-dark p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-bloom-dark mb-2">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    value={editingLesson.title}
                    onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-bloom-dark mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingLesson.description || ''}
                    onChange={(e) => setEditingLesson({ ...editingLesson, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-bloom-dark mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={editingLesson.video_duration_minutes || 0}
                      onChange={(e) => setEditingLesson({ 
                        ...editingLesson, 
                        video_duration_minutes: parseInt(e.target.value) 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-bloom-dark mb-2">
                      Lesson Number
                    </label>
                    <input
                      type="number"
                      value={editingLesson.lesson_number}
                      onChange={(e) => setEditingLesson({ 
                        ...editingLesson, 
                        lesson_number: parseInt(e.target.value) 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-bloom-dark mb-2">
                      Is Preview?
                    </label>
                    <select
                      value={editingLesson.is_preview ? 'yes' : 'no'}
                      onChange={(e) => setEditingLesson({ 
                        ...editingLesson, 
                        is_preview: e.target.value === 'yes' 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-bloom-dark mb-2">
                      Published?
                    </label>
                    <select
                      value={editingLesson.is_published ? 'yes' : 'no'}
                      onChange={(e) => setEditingLesson({ 
                        ...editingLesson, 
                        is_published: e.target.value === 'yes' 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setEditingLesson(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-bloom-dark/70 hover:text-bloom-dark transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleSaveLesson(editingLesson);
                  setEditingLesson(null);
                }}
                className="px-4 py-2 bg-bloompink text-white rounded-lg hover:bg-bloom-pink-dark transition-colors"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}