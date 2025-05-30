'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { services } from '@/lib/data/services';
import Button from '@/components/ui/Button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed w-full z-50">
      {/* Top Announcement Bar */}
      <div className="bg-pink-200 text-pink-900 text-center py-1 px-4 shadow-sm">
        <div className="container mx-auto flex flex-wrap justify-center md:justify-between items-center">
          <p className="text-sm font-medium md:text-base">
            Now accepting new clients with same-week appointments
          </p>
          <Link 
            href="/book" 
            className="hidden md:inline-block text-sm font-medium hover:underline ml-2 text-bloom"
          >
            Book Now →
          </Link>
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className={`transition-all duration-300 ${isScrolled ? 'py-3 bg-white shadow-md' : 'py-4 bg-white'}`}>
        <div className="container mx-auto px-4 md:px-6">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between">
            {/* Left Nav Items */}
            <nav className="flex items-center space-x-8">
              <Link href="/about" className="text-bloom font-medium hover:text-bloom-blush transition duration-300">
                ABOUT
              </Link>
              <div className="relative group">
                <button className="text-bloom font-medium hover:text-bloom-blush transition duration-300 flex items-center">
                  SERVICES
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-60 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 glass-panel-pink rounded-md py-2 shadow-xl z-50">
                  {services.map((service) => (
                    <Link 
                      key={service.id}
                      href={`/services/${service.slug}`}
                      className="block px-4 py-2 text-sm text-bloom hover:bg-bloom-blush/20 transition duration-300"
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
            
            {/* Center Logo */}
            <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
              <div className="relative h-14 w-32">
                <Image 
                  src="/images/Logo/logo2.png" 
                  alt="Bloom Psychology" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            
            {/* Right Nav Items */}
            <nav className="flex items-center space-x-8">
              <Link href="/contact" className="text-bloom font-medium hover:text-bloom-blush transition duration-300">
                CONTACT
              </Link>
              <Link href="/faq" className="text-bloom font-medium hover:text-bloom-blush transition duration-300">
                FAQ
              </Link>
              <Link 
                href="/blog" 
                className="text-bloom font-medium hover:text-bloom-blush transition duration-300"
              >
                BLOG
              </Link>
              <Link 
                href="https://www.instagram.com/bloompsychology.atx/" 
                className="text-bloom hover:text-bloom-blush transition duration-300"
                aria-label="Visit our Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </Link>
              <Link 
                href="https://www.linkedin.com/company/bloom-psychology-atx/" 
                className="text-bloom hover:text-bloom-blush transition duration-300"
                aria-label="Visit our LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                </svg>
              </Link>
              <Button 
                href="/book"
                variant="pink"
                size="sm"
                className="ml-4"
              >
                Book Now
              </Button>
            </nav>
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
              <span className="font-playfair text-bloom font-medium text-lg ml-2">
                <span className="text-pink-500">Bloom</span> Psychology
              </span>
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
          className="md:hidden bg-white shadow-lg"
        >
          <div className="container mx-auto px-4 py-3">
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
                href="https://www.linkedin.com/company/bloom-psychology-atx/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-3 py-2 text-bloom hover:text-bloom-blush transition duration-300 border-b border-gray-100 pb-2"
                aria-label="Visit our LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                </svg>
                <span>LinkedIn</span>
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
