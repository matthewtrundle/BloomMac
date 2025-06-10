'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AdminHeader from '@/components/admin/AdminHeader';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  is_active: boolean;
  price: number;
  original_price: number;
  duration: string;
  total_modules: number;
  total_lessons: number;
  created_at: string;
  updated_at: string;
}

interface CourseWeek {
  id: string;
  week_number: number;
  title: string;
  lesson_count: number;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseWeeks, setCourseWeeks] = useState<Record<string, CourseWeek[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/admin/courses');
      if (!response.ok) throw new Error('Failed to fetch courses');
      
      const data = await response.json();
      setCourses(data.courses || []);
      setCourseWeeks(data.courseWeeks || {});
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (courseId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update course status');
      
      // Refresh courses
      fetchCourses();
    } catch (error) {
      console.error('Error updating course status:', error);
      setError('Failed to update course status');
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
      <AdminHeader />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-playfair text-bloom-dark mb-2">Course Management</h1>
            <p className="text-bloom-dark/60">Manage your digital courses, content, and materials</p>
          </div>
          
          <div className="flex gap-3">
            <Link 
              href="/admin/courses/import"
              className="bg-bloom-sage text-white px-4 py-2 rounded-lg hover:bg-bloom-sage-dark transition-colors"
            >
              Import Existing Content
            </Link>
            <Link 
              href="/admin/courses/new"
              className="bg-bloompink text-white px-4 py-2 rounded-lg hover:bg-bloom-pink-dark transition-colors"
            >
              Create New Course
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Course Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-soft p-6 border border-bloom-sage/10">
            <h3 className="text-lg font-semibold text-bloom-dark mb-2">Total Courses</h3>
            <p className="text-3xl font-bold text-bloompink">{courses.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-soft p-6 border border-bloom-sage/10">
            <h3 className="text-lg font-semibold text-bloom-dark mb-2">Active</h3>
            <p className="text-3xl font-bold text-green-600">
              {courses.filter(c => c.is_active).length}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-soft p-6 border border-bloom-sage/10">
            <h3 className="text-lg font-semibold text-bloom-dark mb-2">Inactive</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {courses.filter(c => !c.is_active).length}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-soft p-6 border border-bloom-sage/10">
            <h3 className="text-lg font-semibold text-bloom-dark mb-2">Total Lessons</h3>
            <p className="text-3xl font-bold text-bloom-sage">
              {courses.reduce((total, course) => total + (course.total_lessons || 0), 0)}
            </p>
          </div>
        </div>

        {/* Course List */}
        <div className="bg-white rounded-lg shadow-soft overflow-hidden border border-bloom-sage/10">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-bloom-dark">Course Library</h2>
          </div>
          
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-bloom-dark mb-2">No courses yet</h3>
              <p className="text-bloom-dark/60 mb-4">Create your first course to get started</p>
              <Link 
                href="/admin/courses/new"
                className="bg-bloompink text-white px-6 py-2 rounded-lg hover:bg-bloom-pink-dark transition-colors"
              >
                Create Course
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-bloom-dark">
                          {course.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.is_active)}`}>
                          {course.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <p className="text-bloom-dark/70 mb-3 max-w-2xl">{course.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-bloom-dark/60">
                        <span>{course.duration || `${course.total_modules} weeks`}</span>
                        <span>{course.total_lessons} lessons</span>
                        <span>${course.price}</span>
                        <span>Updated {new Date(course.updated_at).toLocaleDateString()}</span>
                      </div>

                      {/* Course weeks preview */}
                      {courseWeeks[course.id] && (
                        <div className="mt-4">
                          <button
                            onClick={() => setSelectedCourse(selectedCourse === course.id ? null : course.id)}
                            className="text-sm text-bloompink hover:text-bloom-pink-dark transition-colors"
                          >
                            {selectedCourse === course.id ? 'Hide' : 'Show'} Course Structure ({courseWeeks[course.id].length} weeks)
                          </button>
                          
                          {selectedCourse === course.id && (
                            <div className="mt-3 pl-4 border-l-2 border-bloom-sage/20">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {courseWeeks[course.id].map((week) => (
                                  <div key={week.id} className="bg-bloom-sage-50 rounded-lg p-3">
                                    <h4 className="font-medium text-sm text-bloom-dark">
                                      Week {week.week_number}: {week.title}
                                    </h4>
                                    <p className="text-xs text-bloom-dark/60 mt-1">
                                      {week.lesson_count} lessons
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {/* Status change buttons */}
                      {!course.is_active && (
                        <button
                          onClick={() => handleStatusChange(course.id, 'active')}
                          className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          Activate
                        </button>
                      )}
                      
                      {course.is_active && (
                        <button
                          onClick={() => handleStatusChange(course.id, 'inactive')}
                          className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg hover:bg-yellow-200 transition-colors"
                        >
                          Deactivate
                        </button>
                      )}
                      
                      <Link
                        href={`/admin/courses/${course.id}/edit`}
                        className="text-sm bg-bloompink text-white px-3 py-1 rounded-lg hover:bg-bloom-pink-dark transition-colors"
                      >
                        Edit
                      </Link>
                      
                      <Link
                        href={`/courses/${course.slug}`}
                        target="_blank"
                        className="text-sm bg-bloom-sage text-white px-3 py-1 rounded-lg hover:bg-bloom-sage-dark transition-colors"
                      >
                        Preview
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            href="/admin/courses/templates"
            className="bg-white border border-bloom-sage/10 rounded-lg p-6 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="text-2xl mb-3">📋</div>
            <h3 className="font-semibold text-bloom-dark mb-2 group-hover:text-bloompink transition-colors">
              Course Templates
            </h3>
            <p className="text-sm text-bloom-dark/60">
              Manage reusable course templates and content blocks
            </p>
          </Link>
          
          <Link 
            href="/admin/courses/analytics"
            className="bg-white border border-bloom-sage/10 rounded-lg p-6 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="text-2xl mb-3">📊</div>
            <h3 className="font-semibold text-bloom-dark mb-2 group-hover:text-bloompink transition-colors">
              Course Analytics
            </h3>
            <p className="text-sm text-bloom-dark/60">
              View student progress and course performance metrics
            </p>
          </Link>
          
          <Link 
            href="/admin/courses/settings"
            className="bg-white border border-bloom-sage/10 rounded-lg p-6 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="text-2xl mb-3">⚙️</div>
            <h3 className="font-semibold text-bloom-dark mb-2 group-hover:text-bloompink transition-colors">
              Course Settings
            </h3>
            <p className="text-sm text-bloom-dark/60">
              Configure course delivery and access settings
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}