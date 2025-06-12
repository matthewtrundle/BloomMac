'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Home, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedSlideViewerProps {
  slides: string[];
  lessonTitle: string;
  lessonNumber: number;
  weekNumber: number;
}

export default function EnhancedSlideViewer({ 
  slides, 
  lessonTitle, 
  lessonNumber,
  weekNumber 
}: EnhancedSlideViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        previousSlide();
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const previousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setShowMenu(false);
  };

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error('Error attempting to exit fullscreen:', err);
      }
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Add styles to properly display each slide
  const slideStyles = `
    <style>
      /* Import fonts first */
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@300;400;500;600&display=swap');
      
      /* Reset container styles */
      .enhanced-slide-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: auto;
      }
      
      /* Override slide container inline styles */
      .slide-container {
        width: 100% !important;
        height: 100% !important;
        min-height: ${isFullscreen ? '100vh' : '70vh'} !important;
        display: flex !important;
        position: relative !important;
        overflow: auto !important;
        margin: 0 !important;
        box-sizing: border-box !important;
      }
      
      /* Ensure consistent font rendering */
      .slide-container * {
        font-smoothing: antialiased;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        box-sizing: border-box;
      }
      
      /* Fix content overflow */
      .content-wrapper {
        max-width: 100% !important;
        padding: 40px !important;
      }
      
      .concept-grid,
      .container-grid,
      .stats-grid {
        max-width: 100% !important;
        padding: 0 20px !important;
      }
      
      /* Adjust font sizes for better fit */
      .main-title {
        font-size: clamp(36px, 5vw, 64px) !important;
      }
      
      .subtitle {
        font-size: clamp(20px, 3vw, 28px) !important;
      }
      
      .concept-title,
      .section-title,
      .stats-title {
        font-size: clamp(32px, 4vw, 52px) !important;
      }
      
      .concept-description {
        font-size: clamp(18px, 2vw, 22px) !important;
      }
      
      /* Fix responsive sizing */
      @media (max-width: 768px) {
        .slide-container {
          min-height: ${isFullscreen ? '100vh' : '60vh'} !important;
        }
        
        .content-wrapper {
          padding: 20px !important;
        }
        
        .main-title {
          font-size: 36px !important;
        }
        
        .subtitle {
          font-size: 20px !important;
        }
        
        .stats-grid {
          grid-template-columns: 1fr !important;
          gap: 20px !important;
        }
        
        .container-grid {
          grid-template-columns: 1fr !important;
          gap: 30px !important;
        }
        
        .concept-grid {
          grid-template-columns: 1fr !important;
          gap: 40px !important;
        }
        
        .visual-metaphor {
          height: 400px !important;
        }
      }
      
      /* Fullscreen specific adjustments */
      ${isFullscreen ? `
        body {
          overflow: hidden !important;
        }
        
        .enhanced-slide-wrapper {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          z-index: 9999 !important;
          background: white !important;
        }
        
        .slide-container {
          height: 100vh !important;
          max-height: 100vh !important;
        }
      ` : ''}
      
      /* Ensure practice slides and stats fit properly */
      .practice-card {
        max-width: 90% !important;
        margin: 0 auto !important;
      }
      
      .stat-card {
        min-height: auto !important;
        padding: 30px 20px !important;
      }
      
      .practice-wrapper,
      .closing-wrapper {
        max-width: 90% !important;
        width: 100% !important;
      }
    </style>
  `;

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {/* Slide Display Area */}
      <div className={`relative ${isFullscreen ? 'h-screen' : 'h-[70vh] rounded-lg'} bg-white overflow-hidden shadow-lg`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute inset-0 overflow-auto"
          >
            <div className="enhanced-slide-wrapper">
              <div 
                className="w-full h-full enhanced-slide-content"
                dangerouslySetInnerHTML={{ 
                  __html: slideStyles + slides[currentSlide] 
                }}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/20 to-transparent z-10">
          <div className="flex justify-between items-center">
            <div className="text-white bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg">
              <span className="text-sm">Week {weekNumber}, Lesson {lessonNumber}</span>
              <h3 className="font-semibold">{lessonTitle}</h3>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 bg-black/30 backdrop-blur-sm text-white rounded-lg hover:bg-black/40 transition-colors"
                title="Slide Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-black/30 backdrop-blur-sm text-white rounded-lg hover:bg-black/40 transition-colors"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Slide Menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-md shadow-xl z-20 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Slide Navigation</h3>
                  <button
                    onClick={() => setShowMenu(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        index === currentSlide
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className="font-semibold">Slide {index + 1}</span>
                      {index === 0 && <p className="text-sm opacity-80 mt-1">Welcome</p>}
                      {index === slides.length - 1 && <p className="text-sm opacity-80 mt-1">Closing</p>}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex items-center gap-4 bg-white/90 backdrop-blur-md rounded-full shadow-lg px-6 py-3">
            <button
              onClick={previousSlide}
              disabled={currentSlide === 0}
              className={`p-2 rounded-full transition-all ${
                currentSlide === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title="Previous Slide (← arrow key)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-3 px-4">
              <span className="font-medium text-gray-700">
                {currentSlide + 1} / {slides.length}
              </span>
              
              <div className="flex gap-1">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? 'w-8 bg-gradient-to-r from-pink-500 to-rose-500'
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className={`p-2 rounded-full transition-all ${
                currentSlide === slides.length - 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title="Next Slide (→ arrow key or spacebar)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="absolute bottom-4 right-4 text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg">
          <span className="opacity-70">
            ← → Navigate • {isFullscreen ? 'ESC Exit Fullscreen' : 'F Fullscreen'} • Space Next
          </span>
        </div>
        
        {/* Fullscreen Tip - show only when not in fullscreen */}
        {!isFullscreen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-20 right-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm"
          >
            <span className="flex items-center gap-2">
              <Maximize2 className="w-4 h-4" />
              Press F for presentation mode
            </span>
          </motion.div>
        )}
      </div>

      {/* Progress Bar - hide in fullscreen */}
      {!isFullscreen && (
        <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-500 to-rose-500"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
    </div>
  );
}