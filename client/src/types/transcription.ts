export interface WordToken {
  word: string;
  start: number;
  end: number;
}

export interface SentenceBlock {
  text: string;
  start: number;
  end: number;
  words: WordToken[];
}

export interface TranscriptionState {
  currentSentence: SentenceBlock | null;
  transcriptLog: SentenceBlock[];
  isTranscribing: boolean;
  fontSize: "small" | "medium" | "large";
  showSubtitles: boolean;
}
