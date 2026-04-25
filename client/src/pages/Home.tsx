import React, { useState, useRef, useEffect } from "react";
import { useAudioTranscription } from "../hooks/useAudioTranscription";
import { WordToken, SentenceBlock } from "../types/transcription";
import { SubtitleBar } from "../components/SubtitleBar";
import { TranscriptLog } from "../components/TranscriptLog";
import { SubtitleControls } from "../components/SubtitleControls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Radio } from "lucide-react";

interface Station {
  id: number;
  name: string;
  nameEn: string;
  url: string;
  country: string;
}

export default function Home() {
  const [stations, setStations] = useState<Station[]>([]);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { transcriptionState, updateTranscriptionState } = useAudioTranscription(audioRef.current);

  const { currentSentence, transcriptLog, showSubtitles, fontSize, delayCompensation } = transcriptionState;

  const setShowSubtitles = (value: boolean) => updateTranscriptionState({ showSubtitles: value });
  const setFontSize = (value: "small" | "medium" | "large") => updateTranscriptionState({ fontSize: value });
  const setDelayCompensation = (value: number) => updateTranscriptionState({ delayCompensation: value });

  useEffect(() => {
    fetch("/api/v2/stations")
      .then(res => res.json())
      .then(data => {
        setStations(data.radios || []);
        if (data.radios?.length > 0) setCurrentStation(data.radios[0]);
      });
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center gap-3 mb-8">
          <Radio className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Islamic Radio API</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Station List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Stations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stations.map(station => (
                <Button
                  key={station.id}
                  variant={currentStation?.id === station.id ? "default" : "ghost"}
                  className="w-full justify-start text-left h-auto py-3 px-4"
                  onClick={() => {
                    setCurrentStation(station);
                    setIsPlaying(false);
                  }}
                >
                  <div className="flex flex-col">
                    <span className="font-arabic" dir="rtl">{station.name}</span>
                    <span className="text-xs opacity-70">{station.nameEn}</span>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Player & Controls */}
          <div className="md:col-span-2 space-y-6">
            <Card className="overflow-hidden border-2 border-primary/20">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                {currentStation && (
                  <>
                    <div className="space-y-2">
                      <h2 className="text-3xl font-bold font-arabic" dir="rtl">{currentStation.name}</h2>
                      <p className="text-muted-foreground">{currentStation.nameEn}</p>
                      <span className="inline-block px-2 py-1 rounded bg-secondary text-xs font-medium">
                        {currentStation.country}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <Button 
                        className="rounded-full w-20 h-20 shadow-lg"
                        onClick={togglePlay}
                      >
                        {isPlaying ? <Pause className="!size-10" /> : <Play className="!size-10 ml-1" />}
                      </Button>
                    </div>

                    <audio
                      ref={audioRef}
                      src={currentStation.url}
                      onTimeUpdate={handleTimeUpdate}
                      crossOrigin="anonymous"
                    />
                  </>
                )}
              </CardContent>
            </Card>

            <SubtitleControls
              showSubtitles={showSubtitles}
              setShowSubtitles={setShowSubtitles}
              fontSize={fontSize}
              setFontSize={setFontSize}
              delayCompensation={delayCompensation}
              setDelayCompensation={setDelayCompensation}
            />

            <TranscriptLog log={transcriptLog} onSentenceClick={(timestamp) => {
              if (audioRef.current) {
                audioRef.current.currentTime = timestamp;
              }
            }} />
          </div>
        </div>
      </div>

      <SubtitleBar
        currentSentence={currentSentence}
        currentTime={currentTime + delayCompensation / 1000}
        visible={showSubtitles && isPlaying}
        fontSize={fontSize}
      />

      {/* Font for Arabic */}
      <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet" />
    </div>
  );
}
