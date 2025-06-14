import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { services } from '@/lib/data/services';
import Button from '@/components/ui/Button';
import NewsletterSignup from '@/components/ui/NewsletterSignup';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative bg-bloom text-white overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-bloom to-bloom/95"></div>
      
      {/* Main footer content */}
      <div className="relative z-10">
        {/* Footer Content */}
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo and Brief Info */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <div className="relative h-14 w-36 bg-white rounded-md overflow-hidden shadow-md">
                  <Image 
                    src="/images/Logo/logo.jpg" 
                    alt="Bloom Psychology" 
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </div>
              <p className="text-sm text-white/80 mt-4 max-w-xs">
                Specialized therapy for women, moms, and parents in Texas.
              </p>
              <div className="flex items-center space-x-6 mt-6">
                <a 
                  href="https://www.instagram.com/bloompsychology.atx/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition duration-300"
                  aria-label="Instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.facebook.com/profile.php?id=61564681768097" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition duration-300"
                  aria-label="Facebook"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
              <Link 
                href="/book"
                className="inline-block mt-4"
              >
                <Button variant="pink" size="sm">
                  Book Now
                </Button>
              </Link>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-xl font-playfair font-medium mb-4 text-bloom-accent">Our Services</h3>
              <ul className="space-y-2">
                {services.map((service) => (
                  <li key={service.id}>
                    <Link 
                      href={`/services/${service.slug}`}
                      className="text-white/80 hover:text-bloom-accent hover:translate-x-1 inline-block transition-all duration-300"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-playfair font-medium mb-4 text-bloom-accent">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/about"
                    className="text-white/80 hover:text-bloom-accent hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact"
                    className="text-white/80 hover:text-bloom-accent hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/faq"
                    className="text-white/80 hover:text-bloom-accent hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/careers"
                    className="text-white/80 hover:text-bloom-accent hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/privacy-policy"
                    className="text-white/80 hover:text-bloom-accent hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Contact Information */}
            <div>
              <h3 className="text-xl font-playfair font-medium mb-4 text-bloom-accent">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-1 text-bloom-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-white/80">
                    13706 N Highway 183, Suite 114<br />
                    Austin, Texas 78750
                  </span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-bloom-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a 
                    href="tel:+15128989510" 
                    className="text-white/80 hover:text-bloom-accent transition duration-300"
                  >
                    (512) 898-9510
                  </a>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-bloom-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a 
                    href="mailto:jana@bloompsychologynorthaustin.com" 
                    className="text-white/80 hover:text-bloom-accent transition duration-300 break-words"
                  >
                    jana@bloompsychologynorthaustin.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Newsletter Section - Redesigned to be wider and less tall */}
        <div className="border-t border-white/10 py-8 bg-gradient-to-r from-bloom-dark/20 to-bloom/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {/* Single row layout with all elements */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="flex flex-col lg:flex-row items-center gap-6">
                  {/* Left side - Text content */}
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-xl font-playfair font-medium text-white mb-2">
                      Stay Connected & Flourish
                    </h3>
                    <p className="text-white/80 text-sm">
                      Weekly insights on mental health, parenting tips, and tools to help you bloom.
                    </p>
                    {/* Trust indicators inline */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-3 text-white/60 text-xs">
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3 text-bloom-accent" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Monthly insights</span>
                      </div>
                      <span className="text-white/40">•</span>
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3 text-bloom-accent" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>No spam</span>
                      </div>
                      <span className="text-white/40">•</span>
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3 text-bloom-accent" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>500+ subscribers</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side - Form */}
                  <div className="w-full lg:w-auto">
                    <NewsletterSignup 
                      variant="footer"
                      source="footer"
                      className="!bg-transparent !border-0 !shadow-none !p-0"
                    />
                  </div>
                </div>
                
                {/* Social proof inline at bottom */}
                <div className="text-center mt-4 pt-4 border-t border-white/10">
                  <p className="text-white/50 text-xs italic">
                    "These weekly insights have been a game-changer for my mental health journey." - Sarah M.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright Bar */}
        <div className="bg-bloom-dark/10 backdrop-blur-sm border-t border-white/10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              {/* Copyright */}
              <p className="mb-3 md:mb-0 text-white/60 text-sm">© {currentYear} Bloom Psychology. All rights reserved.</p>
              
              {/* Social Media Links */}
              <div className="flex items-center space-x-4 mb-3 md:mb-0">
                <a 
                  href="https://www.instagram.com/bloom.psychology.atx/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition duration-300"
                  aria-label="Instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.facebook.com/profile.php?id=61564681768097" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition duration-300"
                  aria-label="Facebook"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
              
              {/* Footer Links */}
              <div className="flex space-x-6 text-white/60 text-sm">
                <Link href="/privacy-policy" className="hover:text-white transition duration-300">Privacy</Link>
                <Link href="/careers" className="hover:text-white transition duration-300">Careers</Link>
                <Link href="/faq" className="hover:text-white transition duration-300">FAQ</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;