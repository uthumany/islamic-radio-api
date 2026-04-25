import { useEffect, useRef, useState, useCallback } from 'react';
import { WordToken, SentenceBlock, TranscriptionState } from '../types/transcription';

// Define the AudioWorkletProcessor code as a string
const audioWorkletProcessorCode = `
class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = [];
    this.bufferSize = 0;
    this.port.onmessage = (event) => {
      if (event.data.type === 'SET_DELAY_COMPENSATION') {
        this.delayCompensation = event.data.value;
      }
    };
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const channelData = input[0]; // Assuming mono audio

    if (!channelData) {
      return true;
    }

    // Convert Float32Array to Int16Array
    const pcmData = new Int16Array(channelData.length);
    for (let i = 0; i < channelData.length; i++) {
      pcmData[i] = Math.max(-1, Math.min(1, channelData[i])) * 0x7FFF;
    }

    this.port.postMessage({ type: 'AUDIO_CHUNK', chunk: pcmData.buffer }, [pcmData.buffer]);

    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);
`;

export function useAudioTranscription(audioElement: HTMLAudioElement | null) {
  const [transcriptionState, setTranscriptionState] = useState<TranscriptionState>({
    currentSentence: null,
    transcriptLog: [],
    isTranscribing: false,
    showSubtitles: localStorage.getItem('showSubtitles') === 'true',
    fontSize: (localStorage.getItem('fontSize') as 'small' | 'medium' | 'large') || 'medium',
    delayCompensation: parseFloat(localStorage.getItem('delayCompensation') || '0'),
  });

  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioWorkletNodeRef = useRef<AudioWorkletNode | null>(null);
  const mediaSourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const audioQueueRef = useRef<Int16Array[]>([]);
  const processingIntervalRef = useRef<number | null>(null);

  const updateTranscriptionState = useCallback((newState: Partial<TranscriptionState>) => {
    setTranscriptionState(prevState => ({
      ...prevState,
      ...newState,
    }));
  }, []);

  useEffect(() => {
    localStorage.setItem('showSubtitles', String(transcriptionState.showSubtitles));
  }, [transcriptionState.showSubtitles]);

  useEffect(() => {
    localStorage.setItem('fontSize', transcriptionState.fontSize);
  }, [transcriptionState.fontSize]);

  useEffect(() => {
    localStorage.setItem('delayCompensation', String(transcriptionState.delayCompensation));
  }, [transcriptionState.delayCompensation]);

  useEffect(() => {
    if (!audioElement) return;

    const setupWebSocket = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const socket = new WebSocket(`${protocol}//${window.location.host}/ws/transcribe`);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('Transcription WebSocket connected');
        updateTranscriptionState({ isTranscribing: true });
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.words && data.words.length > 0) {
          const newSentence: SentenceBlock = {
            text: data.text,
            start: data.words[0].start,
            end: data.words[data.words.length - 1].end,
            words: data.words,
          };

          setTranscriptionState(prevState => ({
            ...prevState,
            transcriptLog: [...prevState.transcriptLog, newSentence],
            currentSentence: newSentence, // Update current sentence for immediate display
          }));
        }
      };

      socket.onclose = () => {
        console.log('Transcription WebSocket closed');
        updateTranscriptionState({ isTranscribing: false });
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        updateTranscriptionState({ isTranscribing: false });
      };
    };

    const setupAudioWorklet = async () => {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const context = new AudioContext({ sampleRate: 16000 }); // Ensure 16kHz sample rate
      audioContextRef.current = context;

      // Add the AudioWorkletProcessor module
      const blob = new Blob([audioWorkletProcessorCode], { type: 'application/javascript' });
      const blobUrl = URL.createObjectURL(blob);
      await context.audioWorklet.addModule(blobUrl);
      URL.revokeObjectURL(blobUrl);

      const source = context.createMediaElementSource(audioElement);
      mediaSourceRef.current = source;

      const audioWorkletNode = new AudioWorkletNode(context, 'audio-processor');
      audioWorkletNodeRef.current = audioWorkletNode;

      audioWorkletNode.port.onmessage = (event) => {
        if (event.data.type === 'AUDIO_CHUNK') {
          audioQueueRef.current.push(new Int16Array(event.data.chunk));
        }
      };

      source.connect(audioWorkletNode);
      audioWorkletNode.connect(context.destination);

      // Start processing interval to send audio chunks to WebSocket
      processingIntervalRef.current = window.setInterval(() => {
        if (audioQueueRef.current.length > 0 && socketRef.current?.readyState === WebSocket.OPEN) {
          const chunk = audioQueueRef.current.shift();
          if (chunk) {
            socketRef.current.send(chunk.buffer);
          }
        }
      }, 250); // Send chunks every 250ms
    };

    const handlePlay = () => {
      if (!audioContextRef.current) {
        setupAudioWorklet();
      } else if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      // Send delay compensation to AudioWorkletProcessor
      audioWorkletNodeRef.current?.port.postMessage({ type: 'SET_DELAY_COMPENSATION', value: transcriptionState.delayCompensation });
    };

    audioElement.addEventListener('play', handlePlay);

    setupWebSocket();

    return () => {
      audioElement.removeEventListener('play', handlePlay);
      socketRef.current?.close();
      if (audioWorkletNodeRef.current) audioWorkletNodeRef.current.disconnect();
      if (mediaSourceRef.current) mediaSourceRef.current.disconnect();
      if (audioContextRef.current) audioContextRef.current.close();
      if (processingIntervalRef.current) clearInterval(processingIntervalRef.current);
    };
  }, [audioElement, transcriptionState.delayCompensation, updateTranscriptionState]);

  return { transcriptionState, updateTranscriptionState };
}
