import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript }) => {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
    }
  }, []);

  if (!supported) return null;

  const toggleListen = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (!listening) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript(transcript);
        }
      };
      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);

      recognition.start();
    } else {
      setListening(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListen}
      className={`p-2.5 rounded-xl border transition-all ${
        listening 
          ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse' 
          : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white hover:border-brand-500/30'
      }`}
      title={listening ? 'Listening to voice input...' : 'Voice Dictation'}
    >
      {listening ? <Mic className="h-4 w-4 text-rose-400" /> : <MicOff className="h-4 w-4" />}
    </button>
  );
};
