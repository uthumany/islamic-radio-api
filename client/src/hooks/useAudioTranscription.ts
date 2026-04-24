import { useEffect, useRef, useState } from 'react';
import { WordToken, SentenceBlock } from '../types/transcription';

export function useAudioTranscription(audioElement: HTMLAudioElement | null) {
  const [words, setWords] = useState<WordToken[]>([]);
  const [transcriptLog, setTranscriptLog] = useState<SentenceBlock[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  useEffect(() => {
    if (!audioElement) return;

    // Setup WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}/ws/transcribe`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.words) {
        setWords((prev) => [...prev, ...data.words]);
        const newSentence: SentenceBlock = {
          text: data.text,
          start: data.words[0]?.start || 0,
          end: data.words[data.words.length - 1]?.end || 0,
          words: data.words,
        };
        setTranscriptLog((prev) => [...prev, newSentence]);
      }
    };

    // Setup Web Audio API
    const setupAudioTap = async () => {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const context = new AudioContext();
      audioContextRef.current = context;

      const source = context.createMediaElementSource(audioElement);
      const processor = context.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(context.destination);

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        // Convert Float32 PCM to Int16 PCM
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }
        
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(pcmData.buffer);
        }
      };
    };

    audioElement.onplay = () => {
      if (!audioContextRef.current) {
        setupAudioTap();
      } else if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };

    return () => {
      socket.close();
      if (processorRef.current) processorRef.current.disconnect();
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [audioElement]);

  return { words, transcriptLog };
}
