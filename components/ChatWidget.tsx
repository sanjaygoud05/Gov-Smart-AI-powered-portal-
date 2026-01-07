
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  MessageSquare, X, Send, Bot, Volume2, Mic, MicOff, 
  Settings2, Globe, Sparkles, VolumeX, Minus, Maximize2,
  Zap
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
  { name: 'Hindi', native: 'हिन्दी', code: 'hi', voice: 'Kore', greeting: 'नमस्ते! నేను మీ ప్రభుత్వ పథకాల సహాయకుడిని. మీరు నన్ను ఏదైనా అడగవచ్చు.' },
  { name: 'Telugu', native: 'తెలుగు', code: 'te', voice: 'Zephyr', greeting: 'నమస్కారం! నేను మీ గోవ్-స్మార్ట్ AI సహాయకుడిని. ప్రభుత్వ పథకాల గురించి నన్ను ఏదైనా అడగండి.' },
  { name: 'Marathi', native: 'मराठी', code: 'mr', voice: 'Kore', greeting: 'नमस्कार! मी तुमचा सरकारी योजना सहाय్యక్ आहे. मला काहीही विचारा.' },
  { name: 'Tamil', native: 'தமிழ்', code: 'ta', voice: 'Zephyr', greeting: 'வணக்கம்! నేను మీ ప్రభుత్వ పథకాల సహాయకుడిని. మీరు నన్ను ఏదైనా అడగవచ్చు.' },
];

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
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
  const [isListening, setIsListening] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const currentTtsTextRef = useRef<string | null>(null);

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
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = selectedLang.code === 'en' ? 'en-IN' : `${selectedLang.code}-IN`;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [selectedLang]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleTTS = async (text: string) => {
    if (isPlaying && currentTtsTextRef.current === text) {
      audioSourceRef.current?.stop();
      setIsPlaying(false);
      return;
    }

    audioSourceRef.current?.stop();
    setIsPlaying(true);
    currentTtsTextRef.current = text;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
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
      if (base64Audio) {
        const ctx = audioContextRef.current;
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => {
          if (currentTtsTextRef.current === text) setIsPlaying(false);
        };
        audioSourceRef.current = source;
        source.start();
      } else {
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("TTS Error:", error);
      setIsPlaying(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuery = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userQuery }]);
    setIsLoading(true);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const schemeMatch = location.pathname.match(/\/scheme\/([^/]+)/);
    const contextScheme = schemeMatch ? MOCK_SCHEMES.find(s => s.id === schemeMatch[1]) : null;

    try {
      // Fixed the systemInstruction template literal and removed stray characters that caused syntax errors
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userQuery,
        config: {
          systemInstruction: `You are the "Gov-Smart Expert Assistant", a highly specialized AI designed to help Indian citizens find, understand, and apply for government schemes. 
          
          IDENTITY & TONE:
          - You are warm, professional, and empathetic. 
          - You respond in a helpful, polite manner. 
          - Your goal is 99% accuracy regarding government policy and benefits.
          
          CONTEXTUAL BEHAVIOR:
          - If the user says "Hi", "Hello", or "Namaste", reply with a friendly greeting like: "Hello! I am your Gov-Smart Assistant. How can I help you discover the right government schemes today?"
          - Current Page Context: ${contextScheme ? `The user is currently viewing the details for: "${contextScheme.title}". Provide specific help for this scheme if requested.` : 'General portal browsing.'}
          - User Preferred Language: ${selectedLang.name}. You MUST respond entirely in ${selectedLang.name} unless the user switches language.
          
          KNOWLEDGE BASE (PRIORITY):
          Use this verified data for high-accuracy answers: ${JSON.stringify(MOCK_SCHEMES.map(s => ({ title: s.title, desc: s.description, eligibility: s.eligibility, benefits: s.benefits })))}.
          
          RULES FOR ACCURACY:
          1. If the user asks about a scheme in the data above, provide precise details about eligibility and benefits.
          2. If the user asks about a scheme NOT in the list, use your general training data about Indian Government schemes but add a small note that "I recommend checking the official india.gov.in portal for the most recent official updates."
          3. For eligibility questions, be clear and structured. Use bullet points for readability.
          4. Never provide false financial promises. Always mention that final approval rests with the respective government departments.
          5. If you don't know something, say "I don't have the specific details on that right now, but I can help you find related schemes or direct you to the official portal."`
        }
      });
      
      const aiResponse = response.text || "I'm sorry, I encountered an issue processing your request.";
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error("AI Generation Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "The service is currently overwhelmed. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[10000] flex flex-col items-end pointer-events-none">
      {isOpen && (
        <div className={`
          w-[calc(100vw-32px)] sm:w-[400px] 
          h-[min(580px,calc(100dvh-120px))]
          bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_25px_70px_-15px_rgba(15,23,42,0.4)] 
          border border-white/40 flex flex-col overflow-hidden mb-5 
          transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] 
          animate-in fade-in slide-in-from-bottom-4 pointer-events-auto
        `}>
          {/* Enhanced Header */}
          <div className="bg-[#1e293b] px-5 py-5 flex items-center justify-between relative overflow-hidden group/header shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b] via-[#1e293b] to-[#334155] opacity-95"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-tr from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg transform group-hover/header:scale-105 transition-transform duration-300">
                <Bot size={22} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-white font-bold text-sm tracking-tight leading-tight">AI Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Always Ready</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-1">
              <button 
                onClick={() => setShowSettings(!showSettings)} 
                title="Change Language"
                className={`p-2 rounded-lg transition-all ${showSettings ? 'bg-white/10 text-orange-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <Globe size={18} />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <>
            {/* Responsive Chat Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#f8fafc]/40 relative custom-scrollbar flex flex-col">
              {showSettings && (
                <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-xl mb-6 animate-in zoom-in-95 duration-300">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Consultation Language</p>
                  <div className="grid grid-cols-2 gap-2">
                    {LANGUAGES.map(lang => (
                      <button 
                        key={lang.code} 
                        onClick={() => { setSelectedLang(lang); setShowSettings(false); setMessages([{role:'ai', text: lang.greeting}]) }}
                        className={`
                          px-3 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between
                          ${selectedLang.code === lang.code 
                            ? 'bg-[#1e293b] text-white shadow-md' 
                            : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'}
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
                      ${msg.role === 'user' 
                        ? 'bg-[#1e293b] text-white rounded-tr-none' 
                        : 'bg-white text-[#1e293b] border border-gray-100 rounded-tl-none'}
                    `}>
                      <div className="font-medium whitespace-pre-wrap">{msg.text}</div>
                      
                      {msg.role === 'ai' && (
                        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center">
                          <button 
                            onClick={() => handleTTS(msg.text)} 
                            className={`
                              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all
                              ${isPlaying && currentTtsTextRef.current === msg.text 
                                ? 'bg-orange-100 text-orange-600 border border-orange-200' 
                                : 'bg-gray-100 text-gray-400 hover:text-[#1e293b] border border-transparent'}
                            `}
                          >
                            {isPlaying && currentTtsTextRef.current === msg.text ? <VolumeX size={14} /> : <Volume2 size={14} />}
                            {isPlaying && currentTtsTextRef.current === msg.text ? 'Stop Listening' : 'Voice Guide'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 p-5 rounded-2xl rounded-tl-none flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                      </div>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Analyzing Query</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-5 bg-white border-t border-gray-50 flex items-center gap-3 shrink-0">
              <div className="relative flex-1 group">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="
                    w-full pl-5 pr-11 py-4 bg-gray-50 border border-transparent rounded-2xl 
                    text-sm font-semibold text-[#1e293b] focus:bg-white focus:border-orange-200 
                    focus:ring-4 focus:ring-orange-500/5 outline-none transition-all placeholder:text-gray-400
                  "
                />
                <button 
                  type="button" 
                  onClick={toggleListening} 
                  className={`
                    absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center transition-all
                    ${isListening 
                      ? 'bg-red-500 text-white shadow-lg animate-pulse' 
                      : 'text-gray-400 hover:text-[#1e293b] hover:bg-gray-100'}
                  `}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
              </div>
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading} 
                className="
                  w-12 h-12 bg-[#1e293b] text-white rounded-2xl flex items-center justify-center 
                  hover:bg-orange-primary disabled:opacity-20 transition-all shadow-xl shadow-navy/10
                  active:scale-95
                "
              >
                <Send size={20} />
              </button>
            </form>
          </>
        </div>
      )}

      {/* Improved Launcher - Premium AI Aesthetic */}
      <div className="relative group pointer-events-auto">
        {!isOpen && (
          <>
            <div className="absolute inset-0 bg-orange-primary/20 rounded-[2rem] blur-xl animate-pulse group-hover:bg-orange-primary/40 transition-all"></div>
            <div className="absolute -inset-1 border border-orange-primary/30 rounded-[2rem] animate-[ping_3s_ease-in-out_infinite] opacity-50"></div>
          </>
        )}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`
            relative w-16 h-16 rounded-[1.8rem] shadow-[0_15px_40px_-10px_rgba(249,115,22,0.5)] 
            flex items-center justify-center text-white 
            transition-all duration-500 transform hover:scale-110 active:scale-90
            ${isOpen 
              ? 'bg-[#1e293b] rotate-90 shadow-navy/20' 
              : 'bg-gradient-to-br from-orange-400 via-orange-primary to-orange-600'}
          `}
        >
          {isOpen ? (
            <X size={28} strokeWidth={2.5} />
          ) : (
            <div className="relative">
              <Bot size={30} strokeWidth={2.5} className="animate-in zoom-in-50 duration-500" />
              <div className="absolute -top-1 -right-1">
                <Sparkles size={14} className="text-orange-200 animate-pulse" />
              </div>
            </div>
          )}
          {!isOpen && (
            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 rounded-full border-4 border-[#f9fafb] flex items-center justify-center animate-bounce shadow-md">
              <span className="text-[10px] font-black">1</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
