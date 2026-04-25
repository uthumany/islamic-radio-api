import { useMemo } from 'react';
import { WordToken, SentenceBlock } from '../types/transcription';

export function useWordHighlight(
  currentSentence: SentenceBlock | null,
  currentTime: number
) {
  return useMemo(() => {
    if (!currentSentence) return null;

    const words = currentSentence.words.map(word => ({
      ...word,
      active: currentTime >= word.start && currentTime <= word.end,
      spoken: currentTime > word.end,
      pending: currentTime < word.start,
    }));

    return words;
  }, [currentSentence, currentTime]);
}
