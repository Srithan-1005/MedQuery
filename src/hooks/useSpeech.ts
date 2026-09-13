import { useState, useEffect, useRef } from "react";

export interface SpeechVoice {
  name: string;
  lang: string;
  gender: 'male' | 'female' | 'clinical';
  nativeVoice: SpeechSynthesisVoice;
}

export function useSpeech() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechVoice[]>([]);
  const [activeVoice, setActiveVoice] = useState<SpeechVoice | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize Speech Synthesis and Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Initialize Speech Recognition
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setRecognitionSupported(true);
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-US";
        
        rec.onstart = () => {
          setIsListening(true);
          setTranscript("");
        };
        
        rec.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };
        
        rec.onend = () => {
          setIsListening(false);
        };
        
        recognitionRef.current = rec;
      }

      // 2. Initialize Speech Synthesis
      if (window.speechSynthesis) {
        synthRef.current = window.speechSynthesis;
        
        const loadVoices = () => {
          const rawVoices = window.speechSynthesis.getVoices();
          const parsedVoices: SpeechVoice[] = rawVoices.map(v => {
            const nameLower = v.name.toLowerCase();
            let gender: 'male' | 'female' | 'clinical' = 'female'; // Default
            
            if (nameLower.includes("david") || nameLower.includes("mark") || nameLower.includes("george") || nameLower.includes("male")) {
              gender = 'male';
            } else if (nameLower.includes("zira") || nameLower.includes("hazel") || nameLower.includes("female") || nameLower.includes("google us english")) {
              gender = 'clinical'; // Crisp clinical female standard
            }
            
            return {
              name: v.name,
              lang: v.lang,
              gender,
              nativeVoice: v
            };
          });
          
          setVoices(parsedVoices);
          
          // Select default clinical or female voice if available
          const defaultVoice = parsedVoices.find(v => v.gender === 'clinical' && v.lang.startsWith("en")) ||
                               parsedVoices.find(v => v.lang.startsWith("en")) ||
                               parsedVoices[0];
          setActiveVoice(defaultVoice || null);
        };

        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = loadVoices;
        }
      }
    }
    
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // 1. Microphone actions
  const startListening = (onResultCallback?: (result: string) => void) => {
    if (!recognitionRef.current) {
      console.warn("Speech recognition is not supported on this browser.");
      return;
    }
    
    // Cancel any ongoing speaking first
    stopSpeaking();
    
    recognitionRef.current.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript;
      setTranscript(resultText);
      if (onResultCallback) {
        onResultCallback(resultText);
      }
    };

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error("Failed to start speech recognition", err);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // 2. Synthesizer (Text-to-Speech) actions
  const speakText = (text: string, rate: number = 1.05) => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel(); // Stop any active speech first
    
    // Strip markdown formatting for cleaner reading
    const cleanText = text
      .replace(/[*#_`[\]()]/g, "")
      .replace(/Source: \w+-\w+-\d+/gi, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;
    
    if (activeVoice) {
      utterance.voice = activeVoice.nativeVoice;
    }
    
    utterance.rate = rate;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const changeVoice = (voiceName: string) => {
    const selected = voices.find(v => v.name === voiceName);
    if (selected) {
      setActiveVoice(selected);
    }
  };

  return {
    isListening,
    transcript,
    recognitionSupported,
    isSpeaking,
    voices,
    activeVoice,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    changeVoice
  };
}
