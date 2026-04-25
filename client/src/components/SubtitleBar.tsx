import React from 'react';
import { useWordHighlight } from '../hooks/useWordHighlight';
import { SentenceBlock, WordToken } from '../types/transcription';

interface SubtitleBarProps {
  currentSentence: SentenceBlock | null;
  currentTime: number;
  visible: boolean;
  fontSize: "small" | "medium" | "large";
}

export const SubtitleBar: React.FC<SubtitleBarProps> = ({ currentSentence, currentTime, visible, fontSize }) => {
  const highlightedWords = useWordHighlight(currentSentence, currentTime);
  
  if (!visible || !highlightedWords) return null;

  const sizeClasses = {
    small: "text-lg",
    medium: "text-2xl",
    large: "text-4xl"
  };

  const wordsToDisplay = highlightedWords;

  return (
    <div className="fixed bottom-24 left-0 right-0 flex justify-center p-4 pointer-events-none">
      <div className="bg-black/70 backdrop-blur-md rounded-2xl p-6 max-w-4xl w-full text-center shadow-2xl border border-white/10">
        <div 
          className={`flex flex-wrap justify-center gap-3 direction-rtl ${sizeClasses[fontSize]} font-arabic leading-relaxed`}
          dir="rtl"
          style={{ fontFamily: "'Amiri', serif" }}
        >
          {wordsToDisplay.map((w, i) => {
            return (
              <span 
                key={i}
                className={`transition-all duration-200 px-2 py-1 rounded ${
                  w.active 
                    ? "text-yellow-300 scale-110 bg-yellow-400/20 font-bold shadow-lg" 
                    : w.spoken 
                      ? "text-white/50" 
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
