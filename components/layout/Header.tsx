'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { services } from '@/lib/data/services';
import Button from '@/components/ui/Button';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedInToCourses, setIsLoggedInToCourses] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Measure header height for mobile menu positioning
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  // Check course login status
  useEffect(() => {
    const checkCourseAuth = () => {
      const token = localStorage.getItem('course_auth_token');
      setIsLoggedInToCourses(!!token);
    };
    
    checkCourseAuth();
    
    // Listen for storage changes (login/logout)
    window.addEventListener('storage', checkCourseAuth);
    return () => window.removeEventListener('storage', checkCourseAuth);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header ref={headerRef} className="fixed w-full z-50">
      {/* Top Announcement Bar - Refined Design */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a7f] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5"></div>
        <div className="container mx-auto px-4 py-2.5 relative">
          <Link href="/virtual-therapy" className="flex items-center justify-center gap-3 group">
            <div className="flex items-center gap-3">
              {/* Pulse animation for attention */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f8b5c4] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f8b5c4]"></span>
              </span>
              
              <span className="text-sm font-light tracking-wide">
                Now accepting virtual clients across Texas
              </span>
              
              <span className="text-[#f8b5c4]/60 mx-1">•</span>
              
              <span className="text-sm font-medium text-[#f8b5c4]">
                Same-week appointments available
              </span>
              
              {/* Arrow indicator */}
              <svg 
                className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className={`transition-all duration-300 ${isScrolled ? 'py-4 bg-white shadow-md' : 'py-6 bg-white'}`}>
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between relative">
            {/* Left Brand Logo - Larger and Better Positioned */}
            <Link href="/" className="absolute left-0 hidden xl:block z-20 hover:opacity-90 transition-all duration-500 group">
              <div className={`relative ml-4 transform transition-all duration-700 group-hover:scale-105 ${
                isScrolled 
                  ? 'h-20 w-40 2xl:h-24 2xl:w-48 mt-0' 
                  : 'h-36 w-72 2xl:h-40 2xl:w-80 mt-6'
              }`}>
                {/* Very subtle white glow for depth */}
                <div className="absolute inset-0 bg-white/50 rounded-full blur-xl scale-75 opacity-30 group-hover:opacity-40 transition-opacity duration-500"></div>
                
                {/* Delicate pink accent */}
                <div className="absolute inset-0 bg-bloompink/10 rounded-full blur-lg scale-90 opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                
                <Image 
                  src="/images/Logo/BLOOM-LOGO.png" 
                  alt="Bloom Psychology" 
                  fill
                  className="object-contain object-left relative z-10"
                  priority
                  style={{
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.05)) drop-shadow(0 0 12px rgba(255,255,255,0.4))'
                  }}
                />
              </div>
            </Link>

            {/* Centered Navigation Container */}
            <div className="flex items-center justify-center w-full">
              {/* Center Nav Items with proper spacing */}
              <nav className="flex items-center gap-10">
                <Link href="/about" className="text-bloom font-medium hover:text-bloom-blush transition-all duration-300 text-sm tracking-wider">
                  ABOUT
                </Link>
                
                <div className="relative group">
                  <button className="text-bloom font-medium hover:text-bloom-blush transition-all duration-300 flex items-center text-sm tracking-wider">
                    SERVICES
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-64 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 bg-white rounded-lg py-3 shadow-lg border border-gray-100 z-50">
                    {services.map((service) => (
                      <Link 
                        key={service.id}
                        href={`/services/${service.slug}`}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-bloom transition duration-200"
                      >
                        {service.title}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 my-2"></div>
                    <Link 
                      href="/virtual-therapy"
                      className="block px-4 py-2.5 text-sm text-bloom font-medium hover:bg-gray-50 transition duration-200 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Virtual Therapy
                    </Link>
                  </div>
                </div>
                
                <div className="relative group">
                  <button className="text-bloom font-medium hover:text-bloom-blush transition-all duration-300 flex items-center text-sm tracking-wider">
                    COURSES
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-72 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 bg-white rounded-lg py-3 shadow-lg border border-gray-100 z-50">
                    <Link 
                      href="/courses"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-bloom transition duration-200 flex items-center font-medium"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Browse All Courses
                    </Link>
                    
                    <div className="border-t border-gray-100 my-2"></div>
                    
                    <Link 
                      href="/courses/postpartum-wellness-foundations"
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-bloom transition duration-200"
                    >
                      Postpartum Wellness
                    </Link>
                    
                    <Link 
                      href="/courses/anxiety-management-new-moms"
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-bloom transition duration-200"
                    >
                      Anxiety Management
                    </Link>
                    
                    <Link 
                      href="/courses/partner-support-bootcamp"
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-bloom transition duration-200"
                    >
                      Partner Support
                    </Link>
                    
                    <div className="border-t border-gray-100 my-2"></div>
                    
                    <Link 
                      href="/resources"
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-bloom transition duration-200"
                    >
                      Free Resources
                    </Link>
                    
                    {user ? (
                      <>
                        <div className="border-t border-gray-100 my-2"></div>
                        <Link 
                          href="/my-courses"
                          className="block px-4 py-2.5 text-sm text-bloom font-medium hover:bg-gray-50 transition duration-200 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          My Courses
                        </Link>
                      </>
                    ) : (
                      <>
                        <div className="border-t border-gray-100 my-2"></div>
                        <Link 
                          href="/auth/login?redirect=/my-courses"
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-bloom transition duration-200"
                        >
                          Sign In to Access Courses
                        </Link>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="w-px h-4 bg-gray-300"></div>
                
                <Link href="/contact" className="text-bloom font-medium hover:text-bloom-blush transition-all duration-300 text-sm tracking-wider">
                  CONTACT
                </Link>
                
                <Link href="/faq" className="text-bloom font-medium hover:text-bloom-blush transition-all duration-300 text-sm tracking-wider">
                  FAQ
                </Link>
                
                <Link href="/blog" className="text-bloom font-medium hover:text-bloom-blush transition-all duration-300 text-sm tracking-wider">
                  BLOG
                </Link>
              </nav>
            </div>
            
            {/* Right Actions - Absolute positioned */}
            <div className="absolute right-0 flex items-center space-x-4">
              <Link 
                href="https://www.instagram.com/bloompsychology.atx/" 
                className="text-pink-900 hover:text-bloom transition duration-300"
                aria-label="Visit our Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </Link>
              <Link 
                href="https://www.facebook.com/profile.php?id=61564681768097" 
                className="text-pink-900 hover:text-bloom transition duration-300"
                aria-label="Visit our Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </Link>
              <DarkModeToggle />
              
              {/* Auth Buttons */}
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-3 py-1.5 bg-bloom-sage/10 hover:bg-bloom-sage/20 rounded-full transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 bg-bloom-sage rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-bloom-dark group-hover:text-bloom-sage transition-colors">
                      My Wellness Hub
                    </span>
                  </Link>
                  <Button 
                    href="/book"
                    variant="pink"
                    size="sm"
                  >
                    Book Now
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/auth/login"
                    className="text-sm font-medium text-bloom-dark hover:text-bloom-sage transition-colors"
                  >
                    Login
                  </Link>
                  <Button
                    href="/auth/signup"
                    variant="sage"
                    size="sm"
                    className="bg-bloom-sage text-white hover:bg-bloom-sage/90"
                  >
                    Start Your Journey
                  </Button>
                  <Button 
                    href="/book"
                    variant="pink"
                    size="sm"
                  >
                    Book Now
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center justify-between py-2">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="relative h-10 w-28 mr-2">
                <Image 
                  src="/images/Logo/logo2.png" 
                  alt="Bloom Psychology" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMenu}
              className="text-bloom focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white shadow-lg fixed left-0 right-0 z-50 overflow-y-auto mobile-menu-scroll"
          style={{
            top: 'var(--header-height, 80px)',
            maxHeight: 'calc(100vh - var(--header-height, 80px))',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin',
            scrollbarColor: '#C06B93 #f3f4f6'
          }}
        >
          <div className="container mx-auto px-4 py-3 pb-6">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/about"
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 text-bloom hover:text-bloom-blush transition duration-300 border-b border-gray-100 pb-2"
              >
                ABOUT
              </Link>
              
              <div className="px-3 py-2 border-b border-gray-100 pb-2">
                <h3 className="font-medium mb-2">SERVICES</h3>
                <div className="pl-2 flex flex-col space-y-3">
                  {services.map((service) => (
                    <Link 
                      key={service.id}
                      href={`/services/${service.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-sm text-bloom hover:text-bloom-blush transition duration-300"
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="px-3 py-2 border-b border-gray-100 pb-2">
                <h3 className="font-medium mb-2">COURSES & RESOURCES</h3>
                <div className="pl-2 flex flex-col space-y-3">
                  <Link 
                    href="/courses"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm text-bloom hover:text-bloom-blush transition duration-300 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2 text-bloom-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Browse All Courses
                  </Link>
                  
                  <p className="text-xs font-medium text-bloom-dark/60 uppercase mt-2">Courses for Moms</p>
                  <Link 
                    href="/courses/postpartum-wellness-foundations"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm text-bloom hover:text-bloom-blush transition duration-300 pl-4 flex items-center"
                  >
                    <span className="text-bloompink mr-2">🌸</span>
                    Postpartum Wellness Foundations
                  </Link>
                  <Link 
                    href="/courses/anxiety-management-new-moms"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm text-bloom hover:text-bloom-blush transition duration-300 pl-4 flex items-center"
                  >
                    <span className="text-bloom-accent mr-2">🧘‍♀️</span>
                    Anxiety Management for New Moms
                  </Link>
                  
                  <p className="text-xs font-medium text-bloom-dark/60 uppercase mt-2">Courses for Support Network</p>
                  <Link 
                    href="/courses/partner-support-bootcamp"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm text-bloom hover:text-bloom-blush transition duration-300 pl-4 flex items-center"
                  >
                    <span className="text-bloom mr-2">👥</span>
                    Partner Support Bootcamp
                  </Link>
                  
                  <p className="text-xs font-medium text-bloom-dark/60 uppercase mt-2">Free Support Guides</p>
                  <Link 
                    href="/supporting-your-partner"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm text-bloom hover:text-bloom-blush transition duration-300 pl-4 flex items-center"
                  >
                    <span className="text-bloompink mr-2">💝</span>
                    Supporting Your Partner
                  </Link>
                  <Link 
                    href="/when-family-wants-to-help"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm text-bloom hover:text-bloom-blush transition duration-300 pl-4 flex items-center"
                  >
                    <span className="text-bloom-accent mr-2">👨‍👩‍👧</span>
                    When Family Wants to Help
                  </Link>
                  <Link 
                    href="/resources"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm text-bloom hover:text-bloom-blush transition duration-300 pl-4 flex items-center"
                  >
                    <span className="text-bloom mr-2">📚</span>
                    Resource Library
                  </Link>
                  
                  {isLoggedInToCourses && (
                    <>
                      <p className="text-xs font-medium text-bloom-dark/60 uppercase mt-2">My Learning</p>
                      <Link 
                        href="/my-courses"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-sm text-bloompink font-medium hover:text-bloom-blush transition duration-300 flex items-center pl-4"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        My Courses
                      </Link>
                    </>
                  )}
                </div>
              </div>
              
              <Link 
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 text-bloom hover:text-bloom-blush transition duration-300 border-b border-gray-100 pb-2"
              >
                CONTACT
              </Link>
              
              <Link 
                href="/faq"
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 text-bloom hover:text-bloom-blush transition duration-300 border-b border-gray-100 pb-2"
              >
                FAQ
              </Link>
              
              <Link 
                href="/blog"
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 text-bloom hover:text-bloom-blush transition duration-300 border-b border-gray-100 pb-2"
              >
                BLOG
              </Link>
              
              <Link 
                href="https://www.instagram.com/bloompsychology.atx/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-3 py-2 text-bloom hover:text-bloom-blush transition duration-300 border-b border-gray-100 pb-2"
                aria-label="Visit our Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </Link>
              
              <Link 
                href="/book"
                onClick={() => setIsMenuOpen(false)}
                className="btn-pink text-center mx-3 my-4"
              >
                Book Now
              </Link>
              
              <Link 
                href="/book"
                onClick={() => setIsMenuOpen(false)}
                className="text-center text-sm text-bloom font-medium mx-3"
              >
                Book Now →
              </Link>
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
