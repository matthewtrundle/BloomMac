'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';

interface NewCourseData {
  title: string;
  slug: string;
  description: string;
  subtitle: string;
  duration_weeks: number;
  total_lessons: number;
  price: number;
  original_price: number;
  target_audience: string;
  learning_outcomes: string[];
  course_features: string[];
  status: 'draft' | 'published';
}

export default function NewCoursePage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const [courseData, setCourseData] = useState<NewCourseData>({
    title: '',
    slug: '',
    description: '',
    subtitle: '',
    duration_weeks: 6,
    total_lessons: 24,
    price: 197,
    original_price: 297,
    target_audience: '',
    learning_outcomes: [''],
    course_features: [''],
    status: 'draft'
  });

  const handleTitleChange = (title: string) => {
    setCourseData({
      ...courseData,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    });
  };

  const addLearningOutcome = () => {
    setCourseData({
      ...courseData,
      learning_outcomes: [...courseData.learning_outcomes, '']
    });
  };

  const updateLearningOutcome = (index: number, value: string) => {
    const outcomes = [...courseData.learning_outcomes];
    outcomes[index] = value;
    setCourseData({ ...courseData, learning_outcomes: outcomes });
  };

  const removeLearningOutcome = (index: number) => {
    if (courseData.learning_outcomes.length > 1) {
      const outcomes = courseData.learning_outcomes.filter((_, i) => i !== index);
      setCourseData({ ...courseData, learning_outcomes: outcomes });
    }
  };

  const addCourseFeature = () => {
    setCourseData({
      ...courseData,
      course_features: [...courseData.course_features, '']
    });
  };

  const updateCourseFeature = (index: number, value: string) => {
    const features = [...courseData.course_features];
    features[index] = value;
    setCourseData({ ...courseData, course_features: features });
  };

  const removeCourseFeature = (index: number) => {
    if (courseData.course_features.length > 1) {
      const features = courseData.course_features.filter((_, i) => i !== index);
      setCourseData({ ...courseData, course_features: features });
    }
  };

  const handleCreateCourse = async () => {
    if (!courseData.title || !courseData.description) {
      setError('Title and description are required');
      return;
    }

    setCreating(true);
    setError('');

    try {
      // Filter out empty learning outcomes and features
      const filteredData = {
        ...courseData,
        learning_outcomes: courseData.learning_outcomes.filter(outcome => outcome.trim()),
        course_features: courseData.course_features.filter(feature => feature.trim())
      };

      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filteredData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create course');
      }

      const result = await response.json();
      
      // Redirect to the course editor
      router.push(`/admin/courses/${result.course.id}/edit`);
    } catch (error: any) {
      console.error('Error creating course:', error);
      setError(error.message || 'Failed to create course');
    } finally {
      setCreating(false);
    }
  };

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
            <h1 className="text-3xl font-playfair text-bloom-dark">Create New Course</h1>
          </div>
          
          <button
            onClick={handleCreateCourse}
            disabled={creating || !courseData.title || !courseData.description}
            className="flex items-center gap-2 bg-bloompink text-white px-6 py-2 rounded-lg hover:bg-bloom-pink-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {creating ? 'Creating...' : 'Create Course'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-soft border border-bloom-sage/10 p-8"
        >
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-bloom-dark border-b border-gray-200 pb-2">
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-bloom-dark mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={courseData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    placeholder="e.g., Postpartum Wellness Foundations"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-bloom-dark mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={courseData.slug}
                    onChange={(e) => setCourseData({ ...courseData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    placeholder="postpartum-wellness-foundations"
                  />
                  <p className="text-xs text-bloom-dark/60 mt-1">
                    This will be the URL: /courses/{courseData.slug}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-bloom-dark mb-2">
                  Course Subtitle
                </label>
                <input
                  type="text"
                  value={courseData.subtitle}
                  onChange={(e) => setCourseData({ ...courseData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                  placeholder="e.g., Your 6-Week Journey to Emotional Balance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-bloom-dark mb-2">
                  Course Description *
                </label>
                <textarea
                  value={courseData.description}
                  onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                  placeholder="Describe what this course is about and who it's for..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-bloom-dark mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={courseData.target_audience}
                  onChange={(e) => setCourseData({ ...courseData, target_audience: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                  placeholder="e.g., New mothers in the postpartum period"
                />
              </div>
            </div>

            {/* Course Structure */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-bloom-dark border-b border-gray-200 pb-2">
                Course Structure
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-bloom-dark mb-2">
                    Duration (weeks)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={courseData.duration_weeks}
                    onChange={(e) => setCourseData({ ...courseData, duration_weeks: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-bloom-dark mb-2">
                    Total Lessons
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={courseData.total_lessons}
                    onChange={(e) => setCourseData({ ...courseData, total_lessons: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-bloom-dark mb-2">
                    Status
                  </label>
                  <select
                    value={courseData.status}
                    onChange={(e) => setCourseData({ ...courseData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-bloom-dark border-b border-gray-200 pb-2">
                Pricing
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-bloom-dark mb-2">
                    Current Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={courseData.price}
                    onChange={(e) => setCourseData({ ...courseData, price: parseFloat(e.target.value) || 0 })}
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
                    min="0"
                    value={courseData.original_price}
                    onChange={(e) => setCourseData({ ...courseData, original_price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                  />
                  <p className="text-xs text-bloom-dark/60 mt-1">
                    Used to show discounts (optional)
                  </p>
                </div>
              </div>
            </div>

            {/* Learning Outcomes */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-bloom-dark border-b border-gray-200 pb-2">
                Learning Outcomes
              </h2>
              
              <div className="space-y-3">
                {courseData.learning_outcomes.map((outcome, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={outcome}
                      onChange={(e) => updateLearningOutcome(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                      placeholder="What will students learn or achieve?"
                    />
                    <button
                      onClick={() => removeLearningOutcome(index)}
                      disabled={courseData.learning_outcomes.length <= 1}
                      className="p-2 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={addLearningOutcome}
                  className="flex items-center gap-2 text-bloompink hover:text-bloom-pink-dark transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Learning Outcome
                </button>
              </div>
            </div>

            {/* Course Features */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-bloom-dark border-b border-gray-200 pb-2">
                Course Features
              </h2>
              
              <div className="space-y-3">
                {courseData.course_features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateCourseFeature(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                      placeholder="What's included in this course?"
                    />
                    <button
                      onClick={() => removeCourseFeature(index)}
                      disabled={courseData.course_features.length <= 1}
                      className="p-2 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={addCourseFeature}
                  className="flex items-center gap-2 text-bloompink hover:text-bloom-pink-dark transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Course Feature
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}