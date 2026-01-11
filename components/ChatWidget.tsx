
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  X, Bot, Volume2, Mic, MicOff, 
  Globe, Sparkles, VolumeX, SendHorizontal, Loader2,
  Square, Waves, Mic2, ChevronRight
} from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import { MOCK_SCHEMES } from '../constants';

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
  const [isListening, setIsListening] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const currentTtsTextRef = useRef<string | null>(null);
  const transcriptBufferRef = useRef<string>('');
  const isListeningRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLang.code === 'en' ? 'en-IN' : `${selectedLang.code}-IN`;

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          transcriptBufferRef.current += event.results[i][0].transcript + ' ';
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setInput(transcriptBufferRef.current + interimTranscript);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'aborted') return;
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
      isListeningRef.current = false;
    };
    
    recognition.onend = () => {
      if (isListeningRef.current) {
        try {
          recognition.start();
        } catch (e) {}
      }
    };

    recognitionRef.current = recognition;

    return () => {
      isListeningRef.current = false;
      recognition.onend = null;
      recognition.onerror = null;
      try {
        recognition.stop();
      } catch (e) {}
    };
  }, [selectedLang]);

  const toggleListening = async () => {
    await initAudio();
    if (isListening) {
      stopListening();
    } else {
      transcriptBufferRef.current = input ? input + ' ' : '';
      setIsListening(true);
      isListeningRef.current = true;
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.warn("Recognition start failed:", e);
      }
    }
  };

  const stopListening = () => {
    setIsListening(false);
    isListeningRef.current = false;
    try {
      recognitionRef.current?.stop();
    } catch (e) {}
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
    
    const ctx = audioContextRef.current!;
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const cleanText = text.replace(/[*#_`]/g, '').slice(0, 1000); 

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: cleanText }] }],
        config: {
          // Fix: Use Modality.AUDIO from @google/genai as per guidelines
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
      console.error("TTS Response Error:", error);
      stopAudioSilently();
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuery = input;

    if (isListening) {
      stopListening();
    }

    setInput('');
    transcriptBufferRef.current = '';
    setMessages(prev => [...prev, { role: 'user', text: userQuery }]);
    setIsLoading(true);
    stopAudioSilently();

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const schemeMatch = location.pathname.match(/\/scheme\/([^/]+)/);
    const contextScheme = schemeMatch ? MOCK_SCHEMES.find(s => s.id === schemeMatch[1]) : null;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userQuery,
        config: {
          thinkingConfig: { thinkingBudget: 0 },
          systemInstruction: `You are the "Gov-Smart AI Expert". Respond in ${selectedLang.name}.
          Context: ${contextScheme ? `User is viewing: "${contextScheme.title}".` : 'General portal portal.'}
          Rule: Be snappy, professional, and very concise. Use short sentences. Provide accurate scheme information. For ${selectedLang.name}, keep it natural but snappy.`
        }
      });
      
      // Fix: response.text is a property, ensuring correct access without calling it as a function
      const aiResponse = response.text || "I'm sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);

      // ALWAYS automatically speak the response as requested
      handleTTS(aiResponse);

    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Service busy. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[10000] flex flex-col items-end pointer-events-none">
      {isOpen && (
        <div className={`
          w-[calc(100vw-32px)] sm:w-[400px] 
          h-[min(600px,calc(100dvh-120px))]
          bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_25px_70px_-15px_rgba(15,23,42,0.4)] 
          border border-white/40 flex flex-col overflow-hidden mb-5 
          transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] 
          animate-in fade-in slide-in-from-bottom-4 pointer-events-auto
        `}>
          {/* Header */}
          <div className="bg-[#1e293b] px-5 py-5 flex items-center justify-between relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b] to-[#334155] opacity-95"></div>
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                <Bot size={20} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-white font-bold text-sm tracking-tight">Gov-Smart AI</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Active Now</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-1">
              <button 
                onClick={() => setShowSettings(!showSettings)} 
                className={`p-2 rounded-lg transition-all ${showSettings ? 'bg-white/10 text-orange-400' : 'text-gray-400 hover:text-white'}`}
              >
                <Globe size={18} />
              </button>
              <button 
                onClick={() => { setIsOpen(false); stopAudioSilently(); }} 
                className="p-2 text-gray-400 hover:text-red-400 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#f8fafc]/40 custom-scrollbar flex flex-col">
            {showSettings && (
              <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-xl mb-6 animate-in zoom-in-95 duration-300">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Language Select</p>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map(lang => (
                    <button 
                      key={lang.code} 
                      onClick={() => { 
                        setSelectedLang(lang); 
                        setShowSettings(false); 
                        setMessages([{role:'ai', text: lang.greeting}]); 
                        stopAudioSilently(); 
                      }}
                      className={`
                        px-3 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between
                        ${selectedLang.code === lang.code ? 'bg-[#1e293b] text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'}
                      `}
                    >
                      {lang.native}
                      {selectedLang.code === lang.code && <Sparkles size={12} className="text-orange-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1 space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`
                    max-w-[85%] px-5 py-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm
                    ${msg.role === 'user' ? 'bg-[#1e293b] text-white rounded-tr-none shadow-navy/20' : 'bg-white text-[#1e293b] border border-gray-100 rounded-tl-none shadow-sm'}
                  `}>
                    <div className="font-medium whitespace-pre-wrap">{msg.text}</div>
                    
                    {msg.role === 'ai' && (
                      <div className="mt-4 pt-3 border-t border-gray-50">
                        <button 
                          onClick={() => handleTTS(msg.text)} 
                          disabled={isTtsLoading !== null && isTtsLoading !== msg.text}
                          className={`
                            flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all
                            ${(isPlaying || isTtsLoading === msg.text) && currentTtsTextRef.current === msg.text 
                              ? 'bg-orange-100 text-orange-600 border border-orange-200' 
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-navy'}
                            disabled:opacity-20
                          `}
                        >
                          {isTtsLoading === msg.text ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (isPlaying && currentTtsTextRef.current === msg.text) ? (
                            <VolumeX size={14} />
                          ) : (
                            <Volume2 size={14} />
                          )}
                          {isTtsLoading === msg.text ? 'Processing...' : (isPlaying && currentTtsTextRef.current === msg.text) ? 'Stop Voice' : 'Listen'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-50 flex flex-col gap-3 shrink-0">
            {isListening && (
              <div className="flex items-center justify-center gap-3 px-4 py-2 bg-red-50 text-red-600 rounded-2xl animate-pulse mb-1">
                <Waves size={16} className="animate-bounce" />
                <span className="text-[10px] font-black uppercase tracking-widest">Listening... Click Send when ready</span>
              </div>
            )}
            
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
              <div className="relative flex-1 bg-gray-50 rounded-2xl border border-transparent focus-within:bg-white focus-within:border-orange-100 transition-all flex items-center">
                <textarea 
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? "Transcribing..." : "Ask something..."}
                  className="w-full pl-5 pr-12 py-3.5 bg-transparent text-sm font-semibold text-[#1e293b] outline-none resize-none max-h-32 overflow-y-auto custom-scrollbar"
                />
                <button 
                  type="button" 
                  onClick={toggleListening} 
                  className={`absolute right-1 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white shadow-lg' : 'text-gray-400 hover:text-navy'}`}
                >
                  {isListening ? <Square size={14} fill="white" /> : <Mic size={20} />}
                </button>
              </div>
              
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading} 
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95 bg-[#1e293b] text-white hover:bg-orange-primary disabled:opacity-20"
              >
                <SendHorizontal size={20} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Launcher */}
      <div className="relative pointer-events-auto">
        {!isOpen && (
          <div className="absolute inset-0 bg-orange-primary/20 rounded-[2rem] blur-xl animate-pulse"></div>
        )}
        <button 
          onClick={() => { setIsOpen(!isOpen); if(!isOpen) initAudio(); }}
          className={`
            relative w-16 h-16 rounded-[1.8rem] shadow-xl flex items-center justify-center text-white transition-all duration-500 transform hover:scale-110 active:scale-90
            ${isOpen ? 'bg-[#1e293b] rotate-90' : 'bg-gradient-to-br from-orange-400 to-orange-600'}
          `}
        >
          {isOpen ? <X size={28} /> : <Bot size={28} />}
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
