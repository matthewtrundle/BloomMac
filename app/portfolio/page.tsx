'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { courses } from '@/lib/data/courses';
import Button from '@/components/ui/Button';
import AnimatedTagline from '@/components/ui/AnimatedTagline';
import { Star, Clock, Users, BookOpen, ChevronRight, Heart, Brain, UserGroup, Sparkles } from 'lucide-react';

interface Course {
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

const categoryConfig = {
  mindfulness: {
    name: 'Mindfulness',
    icon: Brain,
    gradient: 'from-blue-500 to-purple-600',
    bgLight: 'bg-gradient-to-br from-blue-50 to-purple-50'
  },
  recovery: {
    name: 'Recovery',
    icon: Heart,
    gradient: 'from-pink-500 to-rose-600',
    bgLight: 'bg-gradient-to-br from-pink-50 to-rose-50'
  },
  community: {
    name: 'Community',
    icon: UserGroup,
    gradient: 'from-green-500 to-emerald-600',
    bgLight: 'bg-gradient-to-br from-green-50 to-emerald-50'
  },
  growth: {
    name: 'Growth',
    icon: Sparkles,
    gradient: 'from-amber-500 to-orange-600',
    bgLight: 'bg-gradient-to-br from-amber-50 to-orange-50'
  }
};

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(courses.filter(course => course.category === selectedCategory));
    }
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-bloom-cream to-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold text-bloom-charcoal mb-6">
              Course Catalog
            </h1>
            <AnimatedTagline 
              text="Transform your postpartum journey with expert-led courses"
              className="text-xl text-bloom-sage/80 max-w-2xl mx-auto mb-8"
            />
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-bloom-charcoal text-white'
                  : 'bg-white text-bloom-charcoal hover:bg-bloom-sage/10'
              }`}
            >
              All Courses
            </button>
            {Object.entries(categoryConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === key
                      ? `bg-gradient-to-r ${config.gradient} text-white`
                      : 'bg-white text-bloom-charcoal hover:bg-bloom-sage/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {config.name}
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => {
              const category = categoryConfig[course.category];
              const Icon = category.icon;
              
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Course Image */}
                  <div className="relative h-48 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-80`} />
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold text-bloom-charcoal">
                        ${course.price === 0 ? 'Free' : course.price}
                      </span>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    {/* Category Badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${category.bgLight} mb-4`}>
                      <Icon className={`w-4 h-4 bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`} />
                      <span className={`text-sm font-medium bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}>
                        {category.name}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-bloom-charcoal mb-2">
                      {course.title}
                    </h3>
                    <p className="text-bloom-sage/70 mb-4 line-clamp-2">
                      {course.shortDescription}
                    </p>

                    {/* Course Stats */}
                    <div className="flex items-center gap-4 mb-6 text-sm text-bloom-sage/60">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.lessons} lessons</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>4.9</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {course.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-bloom-sage/70">
                          <ChevronRight className="w-4 h-4 text-bloom-sage/40" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Link href={`/courses/${course.id}`}>
                      <Button
                        variant="secondary"
                        className="w-full justify-center"
                      >
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-bloom-sage/5 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-bloom-charcoal mb-2">500+</div>
              <div className="text-bloom-sage/70">Happy Mothers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-bloom-charcoal mb-2">12</div>
              <div className="text-bloom-sage/70">Expert Courses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-bloom-charcoal mb-2">98%</div>
              <div className="text-bloom-sage/70">Completion Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-bloom-charcoal mb-2">4.9★</div>
              <div className="text-bloom-sage/70">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-bloom-sage to-bloom-sage/90 rounded-3xl p-12 text-white"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of mothers who have transformed their postpartum experience with our expert-led courses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  variant="primary"
                  className="bg-white text-bloom-sage hover:bg-bloom-cream"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="/book">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-bloom-sage"
                >
                  Book Free Consultation
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}