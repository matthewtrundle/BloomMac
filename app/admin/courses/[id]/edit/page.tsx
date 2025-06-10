'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
  ChevronRight
} from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  subtitle: string;
  status: 'draft' | 'published' | 'archived';
  version: number;
  duration_weeks: number;
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
  duration_minutes: number;
  lesson_type: 'video' | 'reading' | 'exercise' | 'quiz';
  content_body: string;
  video_script: string;
  slides_html: string;
  slides_url: string;
  video_url: string;
  order_index: number;
  is_preview: boolean;
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

type TabType = 'details' | 'structure' | 'content' | 'assets';

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
                { id: 'content', label: 'Content Management', icon: Video },
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
                      value={course.status}
                      onChange={(e) => setCourse({ ...course, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-bloom-dark mb-2">
                      Duration (weeks)
                    </label>
                    <input
                      type="number"
                      value={course.duration_weeks}
                      onChange={(e) => setCourse({ ...course, duration_weeks: parseInt(e.target.value) })}
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
                              <div key={lesson.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg">
                                <div>
                                  <h5 className="font-medium text-bloom-dark">
                                    Lesson {lesson.lesson_number}: {lesson.title}
                                  </h5>
                                  <p className="text-sm text-bloom-dark/60">{lesson.description}</p>
                                  <div className="flex items-center gap-4 mt-1 text-xs text-bloom-dark/50">
                                    <span>{lesson.duration_minutes} min</span>
                                    <span>{lesson.lesson_type}</span>
                                    {lesson.is_preview && <span className="text-green-600">Preview</span>}
                                  </div>
                                </div>
                                <button
                                  onClick={() => setSelectedLesson(lesson)}
                                  className="text-bloompink hover:text-bloom-pink-dark transition-colors"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
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
                <h3 className="text-xl font-semibold text-bloom-dark">Content Management</h3>
                {selectedLesson ? (
                  <div className="bg-bloom-sage-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-bloom-dark">
                        Editing: {selectedLesson.title}
                      </h4>
                      <button
                        onClick={() => setSelectedLesson(null)}
                        className="text-bloom-dark/70 hover:text-bloom-dark"
                      >
                        Close
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-bloom-dark mb-2">
                          Video Script
                        </label>
                        <textarea
                          value={selectedLesson.video_script || ''}
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                          placeholder="Enter the video script content..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-bloom-dark mb-2">
                          Slides HTML
                        </label>
                        <textarea
                          value={selectedLesson.slides_html || ''}
                          rows={8}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent font-mono text-sm"
                          placeholder="Enter HTML slides content..."
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-bloom-dark mb-2">
                            Slides URL
                          </label>
                          <input
                            type="url"
                            value={selectedLesson.slides_url || ''}
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-bloom-dark/60">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-bloom-dark/30" />
                    <p>Select a lesson from the Course Structure tab to edit its content</p>
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
    </div>
  );
}