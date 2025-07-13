'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Volume2, Clock } from 'lucide-react';

interface MeditationPlayerProps {
  audioUrl: string;
  title: string;
  duration: string;
  weekNumber: number;
}

export default function MeditationPlayer({ 
  audioUrl, 
  title, 
  duration, 
  weekNumber 
}: MeditationPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        const mins = Math.floor(audio.currentTime / 60);
        const secs = Math.floor(audio.currentTime % 60);
        setCurrentTime(`${mins}:${secs.toString().padStart(2, '0')}`);
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    audio.currentTime = percentage * audio.duration;
  };

  return (
    <div className="bg-gradient-to-br from-bloom-sage-50/30 to-bloom-pink-50/30 rounded-2xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-bloom-dark">
            Week {weekNumber}: {title}
          </h3>
          <p className="text-sm text-bloom-dark/60 mt-1">
            Duration: {duration} • Dr. Jana Rundle
          </p>
        </div>
        <a
          href={audioUrl}
          download={`week${weekNumber}-meditation.mp3`}
          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          title="Download for offline listening"
        >
          <Download className="w-5 h-5 text-bloom-dark/60" />
        </a>
      </div>

      {/* Visual Waveform Placeholder */}
      <div className="h-20 bg-gradient-to-r from-bloom-sage/20 via-bloom-sage/30 to-bloom-sage/20 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center gap-1">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className={`w-1 bg-bloom-sage/40 rounded-full transition-all duration-300 ${
                isPlaying ? 'animate-pulse' : ''
              }`}
              style={{
                height: `${20 + Math.sin(i * 0.5) * 15}px`,
                animationDelay: `${i * 50}ms`
              }}
            />
          ))}
        </div>
        {!isPlaying && (
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center">
            <p className="text-bloom-dark/60 text-sm">Click play to begin your practice</p>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div 
        className="h-2 bg-bloom-sage/20 rounded-full mb-4 cursor-pointer"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-gradient-to-r from-bloom-sage to-bloom-sage/70 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="w-14 h-14 bg-white hover:bg-bloom-sage-50 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 group"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-bloom-dark group-hover:scale-110 transition-transform" />
            ) : (
              <Play className="w-6 h-6 text-bloom-dark ml-1 group-hover:scale-110 transition-transform" />
            )}
          </button>
          
          <div className="text-sm text-bloom-dark/60">
            {currentTime} / {duration}
          </div>
        </div>

        <Volume2 className="w-5 h-5 text-bloom-dark/40" />
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Practice Tips */}
      <div className="mt-6 p-4 bg-white/50 rounded-lg">
        <p className="text-sm text-bloom-dark/70">
          <span className="font-medium">Practice tip:</span> Find a comfortable position 
          where you won't be disturbed. You can keep your eyes open or closed, whatever 
          feels right for you today.
        </p>
      </div>
    </div>
  );
}