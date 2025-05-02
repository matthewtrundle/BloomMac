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
      <div className="bg-bloom-accent text-bloom text-center py-2 px-4 shadow-sm">
        <div className="container mx-auto flex flex-wrap justify-center md:justify-between items-center">
          <p className="text-sm font-medium md:text-base">
            Now in-network with Aetna | Accepting new clients
          </p>
          <Link 
            href="/contact" 
            className="hidden md:inline-block text-sm font-medium hover:underline ml-2 text-bloom"
          >
            Book a FREE Consult Call →
          </Link>
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className={`transition-all duration-300 ${isScrolled ? 'py-2 bg-white shadow-md' : 'py-4 bg-white'}`}>
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
              <div className="relative h-16 w-36">
                <Image 
                  src="/images/Logo/logo.jpg" 
                  alt="Bloom Psychology North Austin" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            
            {/* Right Nav Items */}
            <nav className="flex items-center space-x-8">
              <Link href="#" className="text-bloom font-medium hover:text-bloom-blush transition duration-300">
                RATES
              </Link>
              <Link href="/contact" className="text-bloom font-medium hover:text-bloom-blush transition duration-300">
                CONTACT
              </Link>
              <Button 
                href="/contact"
                variant="pink"
                size="sm"
                className="ml-4"
              >
                Schedule Consultation
              </Button>
            </nav>
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center justify-between py-2">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="relative h-12 w-32 mr-2">
                <Image 
                  src="/images/Logo/logo.jpg" 
                  alt="Bloom Psychology North Austin" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-playfair text-bloom font-medium text-lg ml-2">
                Bloom Psychology
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
                href="#"
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 text-bloom hover:text-bloom-blush transition duration-300 border-b border-gray-100 pb-2"
              >
                RATES
              </Link>
              
              <Link 
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 text-bloom hover:text-bloom-blush transition duration-300 border-b border-gray-100 pb-2"
              >
                CONTACT
              </Link>
              
              <Link 
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="btn-pink text-center mx-3 my-4"
              >
                Schedule Consultation
              </Link>
              
              <Link 
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="text-center text-sm text-bloom font-medium mx-3"
              >
                Book a FREE Consult Call →
              </Link>
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
