
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  X, Bot, Volume2, Mic, 
  Globe, Sparkles, VolumeX, SendHorizontal, Loader2,
  Square, Waves
} from 'lucide-react';
import { GoogleGenAI, Modality, ThinkingLevel } from "@google/genai";
import { MOCK_SCHEMES } from '../constants';
import { generateContentWithRetry, generateTTSWithRetry } from '../lib/ai-utils';

type LanguageOption = {
  name: string;
  code: string;
  voice: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';
  native: string;
  greeting: string;
};

const LANGUAGES: LanguageOption[] = [
  { name: 'English', native: 'English', code: 'en', voice: 'Puck', greeting: 'Hello! I am your Gov-Smart AI. Ask me anything about government schemes!' },
  { name: 'Hindi', native: 'हिन्दी', code: 'hi', voice: 'Kore', greeting: 'नमस्ते! मैं आपका सरकारी योजना सहायक हूँ। मुझसे कुछ भी पूछें।' },
  { name: 'Telugu', native: 'తెలుగు', code: 'te', voice: 'Zephyr', greeting: 'నమస్కారం! నేను మీ గోవ్-స్మార్ట్ AI సహాయకుడిని. ప్రభుత్వ పథకాల గురించి నన్ను ఏదైనా అడగండి.' },
  { name: 'Marathi', native: 'मराठी', code: 'mr', voice: 'Kore', greeting: 'नमस्कार! मी तुमचा सरकारी योजना सहाय्यक आहे. मला काहीही विचारा.' },
  { name: 'Tamil', native: 'தமிழ்', code: 'ta', voice: 'Zephyr', greeting: 'வணக்கம்! நான் உங்கள் அரசு திட்ட உதவியாளர். என்னிடம் எது வேண்டுமானாலும் కేளுங்கள்.' },
];

function decodeBase64ToUint8(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeRawPcm(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000
): Promise<AudioBuffer> {
  const dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const numSamples = data.byteLength / 2;
  const audioBuffer = ctx.createBuffer(1, numSamples, sampleRate);
  const channelData = audioBuffer.getChannelData(0);

  for (let i = 0; i < numSamples; i++) {
    const pcmSample = dataView.getInt16(i * 2, true);
    channelData[i] = pcmSample / 32768.0;
  }
  return audioBuffer;
}

const ChatWidget: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedLang, setSelectedLang] = useState<LanguageOption>(LANGUAGES[0]);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTtsLoading, setIsTtsLoading] = useState<string | null>(null);
  const [isKeyMissing, setIsKeyMissing] = useState(false);

  useEffect(() => {
    const rawKey = process.env.GEMINI_API_KEY || process.env.API_KEY || "";
    if (!rawKey || rawKey === "undefined" || rawKey === "null") {
      setIsKeyMissing(true);
    }
  }, []);
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const currentTtsTextRef = useRef<string | null>(null);
  const isListeningRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Buffers to handle persistent speech input
  const baseInputRef = useRef(''); // Text present before voice session
  const confirmedTranscriptRef = useRef(''); // Text finalized by voice engine in this session
  
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const initAudio = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  };

  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      initAudio();
    };
    window.addEventListener('launch-ai-chat', handleOpenChat);
    return () => window.removeEventListener('launch-ai-chat', handleOpenChat);
  }, []);

  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'ai', text: selectedLang.greeting }]);
    }
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  // Handle Volume Visualization for the pulse effect
  useEffect(() => {
    let animationId: number;
    if (isListening) {
      const updateVolume = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const sum = dataArray.reduce((a, b) => a + b, 0);
          const avg = sum / dataArray.length;
          setVolume(avg);
        }
        animationId = requestAnimationFrame(updateVolume);
      };
      updateVolume();
    } else {
      setVolume(0);
    }
    return () => cancelAnimationFrame(animationId);
  }, [isListening]);

  // Robust Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLang.code === 'en' ? 'en-IN' : `${selectedLang.code}-IN`;

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let sessionFinalized = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          sessionFinalized += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Update the confirmed buffer if we got a new final segment
      if (sessionFinalized) {
        confirmedTranscriptRef.current += (confirmedTranscriptRef.current ? ' ' : '') + sessionFinalized.trim();
      }
      
      // Calculate full display input: BASE (pre-voice) + CONFIRMED (this voice session) + INTERIM (current guessing)
      const currentSpeech = (confirmedTranscriptRef.current + (interimTranscript ? ' ' + interimTranscript : '')).trim();
      const combined = (baseInputRef.current + (baseInputRef.current && currentSpeech ? ' ' : '') + currentSpeech).trim();
      
      setInput(combined);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'aborted') return;
      stopListening();
    };
    
    recognition.onend = () => {
      if (isListeningRef.current) {
        try { recognition.start(); } catch (e) {}
      }
    };

    recognitionRef.current = recognition;

    return () => {
      stopListening();
    };
  }, [selectedLang]);

  const toggleListening = async () => {
    await initAudio();
    if (isListening) {
      stopListening();
    } else {
      stopAudioSilently(); 
      
      // Capture state before voice session starts
      baseInputRef.current = input.trim();
      confirmedTranscriptRef.current = '';
      
      setIsListening(true);
      isListeningRef.current = true;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const source = audioContextRef.current!.createMediaStreamSource(stream);
        const analyser = audioContextRef.current!.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;
        
        recognitionRef.current?.start();
      } catch (e) {
        setIsListening(false);
        isListeningRef.current = false;
      }
    }
  };

  const stopListening = () => {
    setIsListening(false);
    isListeningRef.current = false;
    try {
      recognitionRef.current?.stop();
    } catch (e) {}
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const stopAudioSilently = () => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
        audioSourceRef.current.disconnect();
      } catch (e) {}
      audioSourceRef.current = null;
    }
    currentTtsTextRef.current = null;
    setIsPlaying(false);
    setIsTtsLoading(null);
  };

  const handleTTS = async (text: string) => {
    await initAudio();
    if ((isPlaying || isTtsLoading) && currentTtsTextRef.current === text) {
      stopAudioSilently();
      return;
    }

    stopAudioSilently();
    setIsTtsLoading(text);
    currentTtsTextRef.current = text;
    
    try {
      const cleanText = text.replace(/[*#_`]/g, '').replace(/\([^)]*\)/g, '').trim().slice(0, 1000); 
      const response = await generateTTSWithRetry({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: cleanText }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedLang.voice },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (currentTtsTextRef.current !== text) return;

      if (base64Audio) {
        const bytes = decodeBase64ToUint8(base64Audio);
        const ctx = audioContextRef.current!;
        const audioBuffer = await decodeRawPcm(bytes, ctx, 24000);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => {
          if (currentTtsTextRef.current === text) {
            setIsPlaying(false);
            currentTtsTextRef.current = null;
          }
        };
        audioSourceRef.current = source;
        setIsTtsLoading(null);
        setIsPlaying(true);
        source.start();
      } else {
        stopAudioSilently();
      }
    } catch (error) {
      stopAudioSilently();
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuery = input;
    if (isListening) stopListening();

    setInput('');
    baseInputRef.current = '';
    confirmedTranscriptRef.current = '';
    setMessages(prev => [...prev, { role: 'user', text: userQuery }]);
    setIsLoading(true);
    stopAudioSilently();

    const schemeMatch = location.pathname.match(/\/scheme\/([^/]+)/);
    const contextScheme = schemeMatch ? MOCK_SCHEMES.find(s => s.id === schemeMatch[1]) : null;

    try {
      const response = await generateContentWithRetry({
        model: 'gemini-3-flash-preview',
        contents: userQuery,
        config: {
          systemInstruction: `You are "Gov-Smart AI". Be extremely concise (under 30 words). 
          Language: ${selectedLang.name}.
          When asked about applying for a scheme, always mention that the user should click the "Apply Now" button on the scheme details page to visit the official government portal. 
          If you know the official URL (like pmkisan.gov.in), mention it briefly.`
        }
      });
      const aiResponse = response.text || "I couldn't process that.";
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      handleTTS(aiResponse);
    } catch (error: any) {
      let errorMessage = "I'm having trouble connecting right now. Please try again in a moment.";
      if (error?.message?.includes("429") || error?.message?.toLowerCase().includes("busy")) {
        errorMessage = "The service is currently very busy. Please wait a few seconds and try again.";
      }
      setMessages(prev => [...prev, { role: 'ai', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[10000] flex flex-col items-end pointer-events-none">
      {isOpen && (
        <div className={`
          w-[calc(100vw-32px)] sm:w-[400px] 
          h-[min(650px,calc(100dvh-120px))]
          bg-white rounded-[2.5rem] shadow-[0_25px_70px_-15px_rgba(15,23,42,0.4)] 
          border border-white/40 flex flex-col overflow-hidden mb-5 
          transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] 
          animate-in fade-in slide-in-from-bottom-4 pointer-events-auto
        `}>
          {/* Header */}
          <div className="bg-[#1e293b] px-6 py-5 flex items-center justify-between relative overflow-hidden shrink-0">
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                <Bot size={20} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-white font-bold text-sm tracking-tight">AI Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isKeyMissing ? 'bg-red-500' : isListening ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></span>
                  <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                    {isKeyMissing ? 'Offline' : isListening ? 'Voice Mode' : 'Ready'}
                  </span>
                </div>
              </div>
            </div>
            <div className="relative z-10 flex items-center gap-1">
              <button onClick={() => setShowSettings(!showSettings)} className={`p-2 rounded-lg transition-all ${showSettings ? 'bg-white/10 text-orange-400' : 'text-gray-400 hover:text-white'}`}>
                <Globe size={18} />
              </button>
              <button onClick={() => { setIsOpen(false); stopAudioSilently(); stopListening(); }} className="p-2 text-gray-400 hover:text-red-400 transition-all">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#f8fafc]/40 custom-scrollbar flex flex-col">
            {showSettings && (
              <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-xl mb-6 animate-in zoom-in-95 duration-300">
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map(lang => (
                    <button 
                      key={lang.code} 
                      onClick={() => { setSelectedLang(lang); setShowSettings(false); setMessages([{role:'ai', text: lang.greeting}]); stopAudioSilently(); stopListening(); }}
                      className={`px-3 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${selectedLang.code === lang.code ? 'bg-[#1e293b] text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'}`}
                    >
                      {lang.native} {selectedLang.code === lang.code && <Sparkles size={12} className="text-orange-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex-1 space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                  <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-[14px] shadow-sm ${msg.role === 'user' ? 'bg-[#1e293b] text-white rounded-tr-none' : 'bg-white text-[#1e293b] border border-gray-100 rounded-tl-none font-medium leading-relaxed'}`}>
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    {msg.role === 'ai' && (
                      <div className="mt-4 pt-3 border-t border-gray-50">
                        <button onClick={() => handleTTS(msg.text)} disabled={isTtsLoading !== null && isTtsLoading !== msg.text} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all ${(isPlaying || isTtsLoading === msg.text) && currentTtsTextRef.current === msg.text ? 'bg-orange-100 text-orange-600 border border-orange-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                          {isTtsLoading === msg.text ? <Loader2 size={12} className="animate-spin" /> : (isPlaying && currentTtsTextRef.current === msg.text) ? <VolumeX size={12} /> : <Volume2 size={12} />}
                          {isTtsLoading === msg.text ? 'Syncing...' : (isPlaying && currentTtsTextRef.current === msg.text) ? 'Stop' : 'Replay'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl flex items-center gap-2 shadow-sm">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-50 flex flex-col gap-3 shrink-0">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
              <div className={`
                relative flex-1 rounded-2xl border transition-all flex items-center shadow-inner overflow-hidden
                ${isListening ? 'border-orange-500 bg-orange-50/30 ring-4 ring-orange-500/10' : 'bg-gray-50 border-transparent focus-within:bg-white focus-within:border-orange-100'}
              `}>
                <textarea 
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? "Listening..." : "Type or speak..."}
                  className="w-full pl-5 pr-14 py-4 bg-transparent text-sm font-semibold text-[#1e293b] outline-none resize-none max-h-32 overflow-y-auto custom-scrollbar"
                />
                
                {/* Minimal Volume Visualizer */}
                {isListening && (
                  <div className="absolute right-12 flex items-center gap-0.5 h-4">
                    {[...Array(4)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-0.5 bg-orange-400 rounded-full animate-pulse" 
                        style={{ height: `${20 + (volume/255) * 80 * Math.random()}%` }}
                      />
                    ))}
                  </div>
                )}

                <button 
                  type="button" 
                  onClick={toggleListening} 
                  className={`absolute right-1.5 w-11 h-11 rounded-xl flex items-center justify-center transition-all ${isListening ? 'bg-orange-primary text-white shadow-lg animate-pulse' : 'text-gray-400 hover:text-navy hover:bg-white'}`}
                >
                  {isListening ? <Square size={14} fill="white" /> : <Mic size={20} />}
                </button>
              </div>
              
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading} 
                className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl active:scale-95 bg-[#1e293b] text-white hover:bg-orange-primary disabled:opacity-20 shrink-0"
              >
                <SendHorizontal size={22} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Launcher */}
      <div className="relative pointer-events-auto">
        <button 
          onClick={() => { setIsOpen(!isOpen); if(!isOpen) initAudio(); }}
          className={`relative w-16 h-16 rounded-[1.8rem] shadow-2xl flex items-center justify-center text-white transition-all duration-500 transform hover:scale-110 active:scale-90 ${isOpen ? 'bg-[#1e293b] rotate-90' : 'bg-gradient-to-br from-orange-400 to-orange-600'}`}
        >
          {isOpen ? <X size={28} /> : <Bot size={28} />}
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
