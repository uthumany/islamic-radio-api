import React from 'react';
import { WordToken } from '../types/transcription';

interface SubtitleBarProps {
  words: WordToken[];
  currentTime: number;
  visible: boolean;
  fontSize: "small" | "medium" | "large";
}

export const SubtitleBar: React.FC<SubtitleBarProps> = ({ words, currentTime, visible, fontSize }) => {
  if (!visible) return null;

  const sizeClasses = {
    small: "text-lg",
    medium: "text-2xl",
    large: "text-4xl"
  };

  // Only show words near current time
  const visibleWords = words.filter(w => Math.abs(currentTime - w.start) < 5);

  return (
    <div className="fixed bottom-24 left-0 right-0 flex justify-center p-4 pointer-events-none">
      <div className="bg-black/70 backdrop-blur-md rounded-2xl p-6 max-w-4xl w-full text-center shadow-2xl border border-white/10">
        <div 
          className={`flex flex-wrap justify-center gap-3 direction-rtl ${sizeClasses[fontSize]} font-arabic leading-relaxed`}
          dir="rtl"
          style={{ fontFamily: "'Amiri', serif" }}
        >
          {visibleWords.map((w, i) => {
            const isActive = currentTime >= w.start && currentTime <= w.end;
            const isSpoken = currentTime > w.end;

            return (
              <span 
                key={i}
                className={`transition-all duration-200 px-1 rounded ${
                  isActive 
                    ? "text-yellow-400 scale-110 bg-yellow-400/10 font-bold" 
                    : isSpoken 
                      ? "text-white/40" 
                      : "text-white"
                }`}
              >
                {w.word}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
