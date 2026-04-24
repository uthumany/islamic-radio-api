import React from 'react';
import { SentenceBlock } from '../types/transcription';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Copy, Download } from 'lucide-react';

interface TranscriptLogProps {
  log: SentenceBlock[];
}

export const TranscriptLog: React.FC<TranscriptLogProps> = ({ log }) => {
  const copyTranscript = () => {
    const text = log.map(s => s.text).join('\n');
    navigator.clipboard.writeText(text);
  };

  const downloadTranscript = () => {
    const text = log.map(s => s.text).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${new Date().toISOString()}.txt`;
    a.click();
  };

  return (
    <div className="mt-8 bg-card rounded-xl border p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Live Transcript</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyTranscript}>
            <Copy className="w-4 h-4 mr-2" /> Copy
          </Button>
          <Button variant="outline" size="sm" onClick={downloadTranscript}>
            <Download className="w-4 h-4 mr-2" /> Download
          </Button>
        </div>
      </div>
      <ScrollArea className="h-64 rounded-md border p-4 bg-muted/50">
        <div className="space-y-4" dir="rtl">
          {log.map((s, i) => (
            <div key={i} className="flex gap-4 items-start">
              <span className="text-xs font-mono text-muted-foreground whitespace-nowrap mt-1">
                [{new Date(s.start * 1000).toISOString().substr(11, 8)}]
              </span>
              <p className="text-lg font-arabic leading-relaxed" style={{ fontFamily: "'Amiri', serif" }}>
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
