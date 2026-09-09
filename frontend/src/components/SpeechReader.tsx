import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react';

interface SpeechReaderProps {
  text: string;
}

export const SpeechReader: React.FC<SpeechReaderProps> = ({ text }) => {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSupported(false);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!supported) return null;

  const handleToggle = () => {
    if (!speaking) {
      // Clean markdown tags for natural speech
      const cleanText = text
        .replace(/[#*`_\[\]()]/g, '')
        .replace(/---/g, '')
        .substring(0, 5000); // 5000 chars for briefing

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      utterance.onend = () => {
        setSpeaking(false);
        setPaused(false);
      };
      utterance.onerror = () => {
        setSpeaking(false);
        setPaused(false);
      };

      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
      setPaused(false);
    } else if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  };

  return (
    <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs">
      <button
        onClick={handleToggle}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
          speaking && !paused 
            ? 'bg-brand-600 text-white animate-pulse' 
            : 'text-slate-300 hover:text-white hover:bg-white/5'
        }`}
      >
        {speaking && !paused ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        <span>{speaking ? (paused ? 'Resume Briefing' : 'Pause Audio') : 'Audio Briefing'}</span>
      </button>

      {speaking && (
        <button
          onClick={handleStop}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          title="Stop playback"
        >
          <VolumeX className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};
