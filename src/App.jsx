import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, ArrowRight, Volume2, VolumeX, CheckCircle2 } from "lucide-react";
import HTMLFlipBook from "react-pageflip";

// --- THE DATA ---
const TIMELINE_ACTS = [
  {
    id: 1,
    title: "Act I: height : 1mm",
    era: "Early Childhood",
    desc: "dheere dheer daath aane wala time, height badhni shuru hui h , par kabtak badhegi pata nhi(aur photo crop krne me kantalla aa rha tha ).",
    img: "/images/act1.jpg", 
  },
  {
    id: 2,
    title: "Act II: height : 2mm",
    era: "School Days",
    desc: "height badhi h thodi lekin fir bhi kam h , par attitude kaafi zyada ,lekin overall good good h jii .",
    img: "/images/act2.jpg",
  },
  {
    id: 3,
    title: "Act III: height : 2mm",
    era: "Teenage Years",
    desc: "height badhi hi nhi (bauni), par attitude kaafi kam ho gaya h, aur padhai likahi chhodd ke sab kuch krna h  .",
    img: "/images/act3.jpg",
  }
];

export default function App() {
  // --- STATES & REFS ---
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [cashClaimed, setCashClaimed] = useState(false);
  const [showShagunModal, setShowShagunModal] = useState(false); // Controls the pop-up
  const [transferComplete, setTransferComplete] = useState(false); // Controls the joke reveal
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const correctPin = "2004"; // Change this to any 4-digit code you want (e.g., birth year, house number)
  const videoRef = useRef(null);
  const bookRef = useRef();
  const audioRef = useRef(null);
// --- AI BOT STATES ---
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiMode, setAiMode] = useState(""); // 'roast' or 'toast'
  const [isFinale, setIsFinale] = useState(false);
  // --- AI GENERATION FUNCTION ---
  const generateAiMessage = async (mode) => {
    setIsAiLoading(true);
    setAiMode(mode);
    setAiResponse("");

    // PASTE YOUR GOOGLE AI STUDIO API KEY HERE
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    
    const systemPrompt = `You are playing the role of an annoying but deeply loving brother writing a short message to his sister on Raksha Bandhan. 
    The user wants a "${mode}". 
    CRITICAL INSTRUCTION: Generate a COMPLETELY UNIQUE, highly specific message every single time. Never repeat the same joke twice.
    If mode is "roast": Pick ONE random topic to tease her about: stealing hoodies, having terrible music taste, sleeping till noon, taking 3 hours to get ready, weird food habits, or sending too many reels. Be extremely sarcastic and dramatic, but clearly out of sibling love. Maximum 2 to 3 sentences.
    If mode is "toast": Write something genuinely sweet but slightly goofy. Focus on a random trait (like her weird laugh, her tendency to overthink things, or her bad advice). Maximum 2 to 3 sentences.`;
try {
      // 1. Model bumped to the active gemini-3.5-flash
      // 2. The ?key= remains in the URL for the AQ. credentials
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${API_KEY}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: systemPrompt }] }]
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error("Google API Error:", data);
        throw new Error("API rejected the request");
      }

      setAiResponse(data.candidates[0].content.parts[0].text);
    } catch (error) {    
      console.error("Bot Breakdown Details:", error);
      setAiResponse("Oops, the sibling bot broke down. Mom probably unplugged the router.");
    } finally {
      setIsAiLoading(false);
    }
  };
  // --- FUNCTIONS ---
  const triggerGoldConfetti = () => {
    const end = Date.now() + 2000;
    const colors = ["#d4af37", "#f3e5ab", "#ffffff", "#8b0000"];
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  const handleTieRakhi = () => {
    setIsPlayingVideo(true);
    triggerGoldConfetti();
    
    // Initialize and play the audio
    audioRef.current = new Audio('/audio/bg-music.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    audioRef.current.play().catch(e => console.log("Audio autoplay blocked until interaction"));
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
 

  const triggerCashConfetti = () => {
    const end = Date.now() + 1500;
    const colors = ["#85bb65", "#e5e4e2", "#d4af37"]; // Green, Silver, Gold
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };
const handleClaimCash = () => {
    setShowShagunModal(true);
    setTransferComplete(false); // Reset animation state
  };
  // NEW: Function to play the comic sound effect when transfer finishes
  const playShagunSound = () => {
    const shagunAudio = new Audio('/audio/shagun-sound.mp3');
    shagunAudio.volume = 0.8; // Set volume (0 to 1)
    shagunAudio.play().catch(e => console.log("Audio play blocked"));
    setTimeout(() => {
      shagunAudio.pause();
      shagunAudio.currentTime = 0; 
    }, 1500); 
  };
  

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#5C0002] font-serif selection:bg-[#D4AF37] selection:text-white overflow-hidden">
      
      {/* --- CSS FOR ANIMATIONS & SCROLLBAR --- */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 10px; }
        .animate-bounce-x { animation: bounce-x 1s infinite; }
        @keyframes bounce-x { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(5px); } }
        
        /* Magical Letter Effects */
        .magical-glow {
          text-shadow: 0 0 15px rgba(212, 175, 55, 0.4), 0 0 30px rgba(212, 175, 55, 0.2);
          animation: pulse-glow 4s ease-in-out infinite alternate;
        }
        @keyframes pulse-glow {
          0% { text-shadow: 0 0 10px rgba(212, 175, 55, 0.3); }
          100% { text-shadow: 0 0 25px rgba(212, 175, 55, 0.7); }
        }
        
        /* Staggered Text Reveal */
        .reveal-text > * {
          opacity: 0;
          animation: fade-up 2s ease-out forwards;
        }
        .reveal-text > *:nth-child(1) { animation-delay: 0.5s; }
        .reveal-text > *:nth-child(2) { animation-delay: 2.5s; }
        .reveal-text > *:nth-child(3) { animation-delay: 4.5s; }
        .reveal-text > *:nth-child(4) { animation-delay: 6.5s; }
        
       @keyframes fade-up {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}} />

      <AnimatePresence mode="wait">
        {!isUnlocked ? (
         
          /* ================= THE LANDING PAGE ================= */
        /* ================= THE LANDING PAGE ================= */
          <motion.section key="landing" exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 0.8 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1a110a] p-4 sm:p-6 overflow-hidden">
            
            {/* Dark temple ambient lighting in the background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none z-0"></div>

            {/* Floating embers in the dark background */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: ["100vh", "-10vh"],
                  x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                  opacity: [0, 0.6, 0]
                }}
                transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, delay: Math.random() * 5, ease: "linear" }}
                className="absolute w-1 h-1 bg-[#FFD700] rounded-full shadow-[0_0_8px_#FFD700] pointer-events-none z-0"
                style={{ left: `${Math.random() * 100}%` }}
              />
            ))}

           {!isPlayingVideo ? (
              /* THE PHYSICAL UNROLLING SCROLL CONTAINER */
              <div className="relative w-full max-w-md flex flex-col items-center justify-center z-10 drop-shadow-[0_30px_60px_rgba(0,0,0,0.9)]">
                  
                  {/* Top Wooden/Gold Roller */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-[calc(100%+40px)] h-12 bg-gradient-to-b from-[#5C0002] via-[#8B0000] to-[#2A0000] rounded-full shadow-[0_15px_25px_rgba(0,0,0,0.8)] z-30 border-x-8 border-[#D4AF37] flex items-center justify-center relative shrink-0"
                  >
                      <div className="w-full h-[2px] bg-white/20 mx-6 rounded-full blur-[1px]"></div>
                  </motion.div>

                  {/* The Unrolling Parchment */}
                  <motion.div 
                    initial={{ height: "0vh" }}
                    animate={{ height: "75vh" }}
                    transition={{ duration: 1.5, ease: [0.64, 0.04, 0.35, 1], delay: 0.3 }} // Creates the heavy, realistic unrolling speed
                    className="bg-[#FFF8E7] w-full relative z-20 border-x-4 border-double border-[#D4AF37]/60 overflow-y-auto overflow-x-hidden custom-scrollbar"
                  >
                      {/* TOP CURL SHADOW (Sticks to the top as you scroll) */}
                      <div className="sticky top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/40 to-transparent z-30 pointer-events-none"></div>

                      {/* Content Container - Fades in AFTER the scroll unrolls */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.6 }}
                        className="w-full min-h-full flex flex-col items-center text-center pb-12 px-6 sm:px-10 relative z-10"
                      >
                          <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_center,#5C0002_2px,transparent_2px)] bg-[length:20px_20px] pointer-events-none"></div>

                          <span className="text-[#8B0000] font-semibold tracking-[0.2em] uppercase text-[10px] sm:text-xs mb-4 font-sans mt-2 relative z-10">
                            The Sacred Bond
                          </span>
                          
                          <h1 className="text-4xl sm:text-5xl font-normal text-[#4A0000] mb-2 font-serif tracking-wide relative z-10">
                            To My Sister
                          </h1>
                          
                          <h2 className="text-3xl text-[#8B0000] italic font-serif mb-8 font-bold drop-shadow-sm relative z-10">
                            Raksha Bandhan
                          </h2>

                          {/* The Fixed Larger Image Frame */}
                          <div className="relative w-full mb-12 p-2 bg-gradient-to-br from-[#D4AF37] via-[#FFF8E7] to-[#B8860B] rounded shadow-xl mx-auto border border-[#D4AF37]/50 relative z-10">
                              <img src="/images/rakhi-art.png" alt="Tying Rakhi" className="w-full h-auto object-contain border border-[#8B0000]/20 bg-[#FFF8E7]" />
                              <Sparkles className="absolute -top-3 -left-3 w-6 h-6 text-[#FFD700] animate-pulse" />
                              <Sparkles className="absolute -bottom-3 -right-3 w-6 h-6 text-[#FFD700] animate-pulse" />
                          </div>

                          {/* The Scroll Text & Fixed Button */}
                          <div className="mt-auto w-full relative z-10">
                            <p className="text-[#8B0000] text-[10px] sm:text-xs tracking-widest uppercase mb-8 opacity-80 font-bold flex flex-col items-center gap-2">
                              Scroll down to seal the promise
                              <ArrowRight className="w-4 h-4 text-[#8B0000] animate-bounce-x rotate-90" />
                            </p>

                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleTieRakhi} 
                              className="relative group px-10 sm:px-12 py-5 sm:py-6 rounded-full bg-gradient-to-b from-[#8B0000] to-[#5C0002] text-[#FFD700] uppercase tracking-widest text-sm sm:text-base flex items-center justify-center gap-4 shadow-[0_10px_25px_rgba(0,0,0,0.5)] border-2 border-[#D4AF37] cursor-pointer overflow-hidden w-max mx-auto mb-4"
                            >
                              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"></div>
                              <Sparkles className="w-6 h-6 relative z-10 shrink-0" /> 
                              <span className="font-bold relative z-10 whitespace-nowrap">Tie Virtual Rakhi</span>
                            </motion.button>
                          </div>
                      </motion.div>

                      {/* BOTTOM CURL SHADOW (Sticks to the bottom as you scroll) */}
                      <div className="sticky bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent z-30 pointer-events-none mt-auto"></div>
                  </motion.div>

                  {/* Bottom Wooden/Gold Roller */}
                  <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-[calc(100%+40px)] h-12 bg-gradient-to-t from-[#5C0002] via-[#8B0000] to-[#2A0000] rounded-full shadow-[0_-15px_25px_rgba(0,0,0,0.8)] z-30 border-x-8 border-[#D4AF37] flex items-center justify-center relative shrink-0"
                  >
                      <div className="w-full h-[2px] bg-white/20 mx-6 rounded-full blur-[1px]"></div>
                  </motion.div>
              </div>
            ) : (
              /* The Video Player */
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="relative w-full max-w-xl aspect-video rounded-sm border-[12px] border-[#FFF8E7] outline-1 outline-[#D4AF37] bg-[#5C0002] z-10 shadow-2xl p-1">
                 <div className="w-full h-full border border-[#D4AF37]/40 overflow-hidden relative">
                     <video ref={videoRef} src="/videos/rakhi-ritual.mp4" autoPlay playsInline muted onEnded={() => setIsUnlocked(true)} className="w-full h-full object-cover" />
                     <button onClick={() => setIsUnlocked(true)} className="absolute bottom-4 right-4 text-[10px] uppercase bg-white/90 px-4 py-2 rounded-full border border-[#D4AF37] text-[#5C0002] font-bold tracking-widest shadow-lg z-50 cursor-pointer">Skip →</button>
                 </div>
              </motion.div>
            )}
          </motion.section>
        ) : (
          /* ================= THE 3D BOOK ENGINE ================= */
          <motion.main key="book" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="flex min-h-screen items-center justify-center bg-[#1A1A1A] p-4">
            
            <div className="w-full max-w-4xl h-[82vh] flex items-center justify-center">
                <HTMLFlipBook 
                    width={420} 
                    height={640} 
                    size="stretch"
                    minWidth={300}
                    maxWidth={550}
                    minHeight={450}
                    maxHeight={750}
                    maxShadowOpacity={0.5}
                    showCover={true}
                    mobileScrollSupport={true}
                    usePortrait={true}
                    className="shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
                    ref={bookRef}
                    onFlip={(e) => {
                      // If she tries to flip past page 7 (the Shagun page) without claiming cash, snap her back!
                      if (e.data > 7 && !cashClaimed) {
                        bookRef.current.pageFlip().flip(6);
                      }
                    }}
                >
                    {/* --- FRONT COVER (OUTSIDE) --- */}
                    <div className="page bg-[#5C0002] h-full w-full flex flex-col items-center justify-center p-6 border-l-16 border-[#3A0001] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                        <div className="border-2 border-[#D4AF37] p-8 text-center w-full h-full flex flex-col items-center justify-center relative bg-[#5C0002]">
                            <Sparkles className="w-8 h-8 text-[#FFD700] mb-6 absolute top-12" />
                            <h1 className="text-4xl font-serif text-[#FFD700] mb-4">Memory Lane</h1>
                            <div className="h-px w-24 bg-[#FFD700] mb-6 mx-auto"></div>
                            <p className="text-[#FFF8E7] uppercase tracking-widest text-xs">A Sister's Story</p>
                        </div>
                    </div>

                    {/* --- FRONT COVER (INSIDE) --- */}
                    <div className="page bg-[#FFF8E7] h-full w-full shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] border-r border-[#E6D5B8] flex flex-col items-center justify-center p-10 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,#5C0002_2px,transparent_2px)] bg-[length:20px_20px]"></div>
                        <div className="relative z-10">
                            <h3 className="text-2xl text-[#5C0002] font-serif mb-6">Before we begin...</h3>
                            <p className="text-base text-[#5C0002] leading-relaxed italic opacity-80">
                                "Some of your favorite chapters in life are the ones we wrote together. Here is a little trip to down memory lane."
                            </p>
                        </div>
                    </div>

                    {/* --- THE MEMORY ACTS --- */}
                    {TIMELINE_ACTS.flatMap((act) => [
                        <div key={`${act.id}-front`} className="page bg-[#FFF8E7] h-full w-full shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] border-r border-[#E6D5B8] overflow-hidden">
                            <div className="h-full w-full relative overflow-y-auto overflow-x-hidden custom-scrollbar">
                                <div className="sticky top-0 w-full h-[60vh] -z-10 flex items-center justify-center p-4 bg-[#1A1A1A]">
                                    <img src={act.img} alt={act.era} className="w-full h-full object-contain drop-shadow-2xl" />
                                </div>
                                <div className="relative z-10 bg-[#FFF8E7]/95 backdrop-blur-md mt-[45vh] min-h-[60vh] p-8 border-t border-[#D4AF37]/30 shadow-[0_-10px_20px_rgba(92,0,2,0.05)] rounded-t-3xl">
                                    <span className="text-[#D4AF37] text-xs tracking-widest uppercase font-bold">{act.era}</span>
                                    <h2 className="text-3xl text-[#5C0002] mt-2 mb-6 font-serif">{act.title}</h2>
                                    <p className="text-lg text-[#333] leading-relaxed">{act.desc}</p>
                                    <div className="mt-16 text-center opacity-60 flex flex-col items-center gap-2">
                                        <span className="text-sm italic text-[#5C0002]">Turn page</span>
                                        <ArrowRight className="w-4 h-4 text-[#5C0002] animate-bounce-x" />
                                    </div>
                                </div>
                            </div>
                        </div>,
                        <div key={`${act.id}-back`} className="page bg-[#FFF8E7] h-full w-full shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] border-l border-[#E6D5B8] flex flex-col items-center justify-center p-8 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,#5C0002_2px,transparent_2px)] bg-[length:20px_20px]"></div>
                            <div className="relative z-10 w-3/4 h-3/4 border border-[#D4AF37]/40 rounded-sm flex flex-col items-center justify-center opacity-40">
                                <Sparkles className="w-8 h-8 text-[#5C0002] mb-4" />
                                <p className="font-serif text-[#5C0002] text-sm tracking-widest uppercase text-center">{act.era}</p>
                            </div>
                        </div>
                    ])}
                  {/* --- ACT IV: THE SHAGUN (FRONT) --- */}
                    <div className="page bg-[#FFF8E7] h-full w-full shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] border-r border-[#E6D5B8] overflow-hidden">
                        <div className="h-full w-full flex flex-col items-center justify-center p-6 relative">
                            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,#5C0002_2px,transparent_2px)] bg-[length:20px_20px]"></div>
                            
                            <div className="relative z-10 w-full max-w-[280px] bg-white p-6 rounded-xl shadow-2xl border border-[#D4AF37]/50 text-center">
                                <h3 className="text-2xl font-serif text-[#5C0002] mb-1">The Shagun Vault</h3>
                                <p className="text-[11px] text-gray-500 mb-6 italic">Enter the secret  PIN code to unlock the transfer(HINT: birth year).</p>
                                
                                {!cashClaimed ? (
                                    <div className="space-y-4">
                                        {/* PIN Display Dots */}
                                        <div className="flex justify-center gap-3 mb-4">
                                            {[...Array(4)].map((_, i) => (
                                                <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#5C0002] flex items-center justify-center font-bold text-lg ${enteredPin.length > i ? 'bg-[#5C0002] text-[#FFD700]' : 'bg-transparent text-transparent'}`}>
                                                    {enteredPin.length > i ? "•" : ""}
                                                </div>
                                            ))}
                                        </div>

                                        {pinError && (
                                            <p className="text-red-600 text-xs animate-bounce font-bold">Incorrect PIN! Try again.</p>
                                        )}

                                        {/* Keypad */}
                                        <div className="grid grid-cols-3 gap-2">
                                            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "✓"].map((btn) => (
                                                <button
                                                    key={btn}
                                                    onClick={() => {
                                                        if (btn === "C") {
                                                            setEnteredPin("");
                                                            setPinError(false);
                                                        } else if (btn === "✓") {
                                                            if (enteredPin === correctPin) {
                                                                setShowShagunModal(true);
                                                                setTransferComplete(false);
                                                            } else {
                                                                setPinError(true);
                                                                setEnteredPin("");
                                                            }
                                                        } else {
                                                            if (enteredPin.length < 4) {
                                                                const newPin = enteredPin + btn;
                                                                setEnteredPin(newPin);
                                                                setPinError(false);
                                                                // Auto-verify if 4 digits are entered
                                                                if (newPin.length === 4) {
                                                                    if (newPin === correctPin) {
                                                                        setShowShagunModal(true);
                                                                        setTransferComplete(false);
                                                                    } else {
                                                                        setPinError(true);
                                                                        setTimeout(() => setEnteredPin(""), 500);
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }}
                                                    className="py-2 bg-[#FFF8E7] hover:bg-[#5C0002] hover:text-[#FFD700] border border-[#D4AF37] text-[#5C0002] font-bold rounded shadow-sm text-sm transition-colors cursor-pointer"
                                                >
                                                    {btn}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <motion.div 
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col items-center"
                                    >
                                        <CheckCircle2 className="w-10 h-10 text-green-600 mb-2" />
                                        <h4 className="text-green-800 font-bold mb-1">Vault Unlocked!</h4>
                                        <p className="text-xs text-green-600">Shagun successfully claimed.<br/>You may now proceed to the final chapter.</p>
                                    </motion.div>
                                )}
                            </div>
                            
                            <div className="mt-8 text-center opacity-60 flex flex-col items-center gap-1">
                                <span className="text-[11px] italic text-[#5C0002]">
                                    {cashClaimed ? "Turn page for the final chapter" : "🔒 Complete puzzle to proceed"}
                                </span>
                                <ArrowRight className="w-4 h-4 text-[#5C0002] animate-bounce-x" />
                            </div>
                        </div>
                    </div>

                    {/* --- ACT IV: THE SHAGUN (BACK) --- */}
                    <div className="page bg-[#FFF8E7] h-full w-full shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] border-l border-[#E6D5B8] flex flex-col items-center justify-center p-8 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,#5C0002_2px,transparent_2px)] bg-[length:20px_20px]"></div>
                        <div className="relative z-10 w-3/4 h-3/4 border border-[#D4AF37]/40 rounded-sm flex flex-col items-center justify-center opacity-40">
                            <Sparkles className="w-8 h-8 text-[#5C0002] mb-4" />
                            <p className="font-serif text-[#5C0002] text-sm tracking-widest uppercase text-center">Transaction Complete</p>
                        </div>
                    </div>
                    
                    {/* --- THE EMOTIONAL LETTER (FRONT OF FINAL PAGE) --- */}
                    <div className="page bg-[#3A0001] h-full w-full flex flex-col p-8 border-r border-[#2A0000] relative overflow-y-auto overflow-x-hidden custom-scrollbar shadow-[inset_0_0_50px_rgba(0,0,0,0.6)]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.15),transparent_60%)] pointer-events-none"></div>
                        <div className="relative z-10 w-full h-full flex flex-col mt-8">
                            <div className="flex justify-center mb-8">
                                <Sparkles className="w-8 h-8 text-[#FFD700] animate-pulse" />
                            </div>
                            <div className="reveal-text space-y-6 text-center">
                                <h2 className="text-3xl font-serif text-[#FFD700] magical-glow mb-8 tracking-wide">Happy Raksha Bandhan</h2>
                                <p className="text-lg text-[#FFF8E7] leading-loose font-serif italic opacity-90 px-2">
                                    "we've spent very little time together, but every moment has been a treasure. From our silly arguments(Bauni) to our shared secrets, you've been my partner , guidance and my confidante."
                                </p>
                                <p className="text-lg text-[#FFF8E7] leading-loose font-serif italic opacity-90 px-2">
                                    "But through all of it, thank you for being my constant rock, for humoring my terrible jokes, and for always having my back when it mattered most."
                                </p>
                                <div className="pt-12">
                                    <p className="text-[#FFD700] font-serif text-2xl magical-glow"> Once againHappy Raksha Bandhan.</p>
                                    <p className="text-[#D4AF37] text-sm mt-4 tracking-widest uppercase opacity-70">May your bond be as strong as the rakshi itself.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                  {/* --- BACK COVER (OUTSIDE) & AI TRIGGER --- */}
                    <div className="page bg-[#5C0002] h-full w-full flex flex-col items-center justify-center p-6 border-r-16 border-[#3A0001] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                         <div className="border border-[#D4AF37]/30 p-8 text-center w-full h-full flex flex-col items-center justify-center relative bg-[#5C0002]">
                             
                             <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowAiModal(true)}
                                className="cursor-pointer px-6 py-3 rounded-full border border-[#D4AF37]/50 bg-black/20 hover:bg-black/40 text-[#D4AF37] transition-colors flex items-center gap-2 shadow-lg mb-6"
                             >
                                <Sparkles className="w-4 h-4" />
                                <span className="text-xs uppercase tracking-widest font-bold">Ask AI Brother</span>
                             </motion.button>
                             
                             <div className="flex flex-col items-center justify-center h-full w-full">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsFinale(true)}
        className="cursor-pointer group flex flex-col items-center"
      >
          <h2 className="text-4xl font-serif text-[#5C0002] mb-2 group-hover:text-[#8B0000] transition-colors">
            THE END
          </h2>
          <p className="text-xs text-[#D4AF37] tracking-widest uppercase animate-pulse">
            (Tap to close the show)
          </p>
      </motion.button>
  </div>
                         </div>
                    </div>
                </HTMLFlipBook>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* ================= GLOBAL UI CONTROLS ================= */}
      {isUnlocked && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={toggleMute}
          className="fixed bottom-6 left-6 z-50 p-3 bg-[#5C0002]/90 backdrop-blur-md rounded-full border border-[#D4AF37]/50 text-[#FFD700] shadow-lg hover:scale-110 transition-transform cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </motion.button>
      )}

  {/* ================= SHAGUN TRANSFER MODAL ================= */}
      <AnimatePresence>
        {showShagunModal && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(5px)" }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#FFF8E7] w-full max-w-sm sm:max-w-md rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 border-[#D4AF37] overflow-hidden my-auto"
            >
              {/* Header */}
              <div className="bg-[#2e7d32] py-3 px-4 text-center shadow-md z-10 relative">
                <h3 className="font-serif text-[#FFF8E7] text-lg sm:text-xl tracking-widest uppercase">
                  Processing Shagun...
                </h3>
              </div>

              {/* Animation Area */}
              <div className="p-4 sm:p-8 flex flex-col items-center relative">
                
                {/* The Purses & Animation Row */}
                <div className="flex justify-between items-center w-full px-2 sm:px-4 mb-6 relative">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl sm:text-4xl mb-1">👛</span>
                    <span className="text-[10px] sm:text-xs uppercase font-bold text-[#5C0002] tracking-wider">His Purse</span>
                  </div>
                  
                  {/* The Moving Money */}
                  {!transferComplete && (
                    <motion.div
                      initial={{ x: -50, opacity: 0, scale: 0.8 }}
                      animate={{ x: 50, opacity: 1, scale: 1 }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                      onAnimationComplete={() => {
                        setTransferComplete(true);
                        playShagunSound(); // 👈 Plays the 5-sec comic sound effect!
                        triggerCashConfetti();
                        setCashClaimed(true);
                      }}
                      className="absolute left-1/2 -ml-[38px] top-2 flex items-center gap-1 bg-green-100 border border-green-500 text-green-800 px-2 py-0.5 rounded shadow-lg z-20 font-bold text-xs sm:text-sm"
                    >
                      <span>₹500</span>
                      <span className="bg-yellow-400 text-yellow-900 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[9px] border border-yellow-600 shadow-sm">₹1</span>
                    </motion.div>
                  )}

                  <div className="flex flex-col items-center">
                    <span className="text-3xl sm:text-4xl mb-1">👜</span>
                    <span className="text-[10px] sm:text-xs uppercase font-bold text-[#5C0002] tracking-wider">Your Purse</span>
                  </div>
                </div>

                {/* The Joke Reveal & Close Button */}
                <div className="min-h-[100px] flex flex-col items-center justify-center w-full">
                  {transferComplete ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center w-full"
                    >
                      <p className="text-[#5C0002] italic font-serif leading-relaxed mb-4 text-xs sm:text-sm px-2">
                        "aap jeet chuke h  saat crore rupay, kya krenge is raashi ke saath?" <br/><br/>
                        <span className="text-[10px] opacity-50 uppercase tracking-widest">(mallamal hone ke baad pagal toh nhi hui na )</span>
                      </p>
                      
                      <button
                        onClick={() => setShowShagunModal(false)}
                        className="px-6 py-2 bg-[#5C0002] text-[#FFD700] rounded-full uppercase tracking-widest text-xs hover:bg-[#7A0002] transition-colors border border-[#D4AF37] cursor-pointer"
                      >
                        Close & Continue
                      </button>
                    </motion.div>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-500 italic animate-pulse">
                      Awaiting bank confirmation...
                    </p>
                  )}
                </div>

              </div>
            </motion.div>
          </motion.div>
    )}
      </AnimatePresence>

      {/* ================= AI ROAST OR TOAST MODAL ================= */}
      <AnimatePresence>
        {showAiModal && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(5px)" }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#1A1A1A] w-full max-w-sm sm:max-w-md rounded-xl shadow-[0_0_50px_rgba(212,175,55,0.3)] border border-[#D4AF37]/50 overflow-hidden relative"
            >
              {/* Header */}
              <div className="bg-[#3A0001] p-4 text-center border-b border-[#D4AF37]/30">
                <Sparkles className="w-5 h-5 text-[#FFD700] mx-auto mb-1" />
                <h3 className="font-serif text-[#FFD700] text-sm tracking-widest uppercase">
                  Official Sibling AI Bot
                </h3>
              </div>

              <div className="p-6 flex flex-col items-center min-h-[250px]">
                
                {!aiResponse && !isAiLoading ? (
                  <div className="text-center w-full">
                    <p className="text-gray-400 text-sm mb-8 italic">
                      "I trained an AI on 20 years of sibling rivalry. Choose your fate."
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button onClick={() => generateAiMessage('roast')} className="flex-1 py-3 bg-[#5C0002] hover:bg-[#8B0000] text-[#FFD700] rounded uppercase tracking-widest text-xs font-bold transition-colors border border-[#D4AF37]/50 cursor-pointer">
                        🔥 Roast Me
                      </button>
                      <button onClick={() => generateAiMessage('toast')} className="flex-1 py-3 bg-[#D4AF37] hover:bg-[#FFD700] text-[#5C0002] rounded uppercase tracking-widest text-xs font-bold transition-colors cursor-pointer">
                        🥂 Toast Me
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center text-center">
                    <span className="text-2xl mb-4">{aiMode === 'roast' ? '🔥' : '🥂'}</span>
                    
                    {isAiLoading ? (
                      <p className="text-[#D4AF37] text-sm animate-pulse font-serif italic">
                        Processing 10,000 arguments over the TV remote...
                      </p>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                        <p className="text-[#FFF8E7] font-serif text-sm sm:text-base leading-relaxed mb-8">
                          "{aiResponse}"
                        </p>
                        <button onClick={() => { setAiResponse(""); setAiMode(""); }} className="text-[#D4AF37] text-xs uppercase tracking-widest hover:text-white underline underline-offset-4 mr-4 cursor-pointer">
                          Try Again
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Close Button */}
                <button onClick={() => setShowAiModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-white cursor-pointer p-2">
                  ✕
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
{/* ================= THE GRAND FINALE CURTAIN (DYNAMIC VERSION) ================= */}
      {isFinale && (
        <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none">
          
          {/* The Heavy Red Velvet Curtain - Now with Spring Physics */}
          <motion.div 
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            transition={{ 
              type: "spring", 
              damping: 12, 
              stiffness: 40, 
              mass: 2.5 
            }} 
            className="absolute inset-0 bg-gradient-to-b from-[#3A0000] via-[#8B0000] to-[#2A0000] flex flex-col items-center justify-center border-b-[24px] border-[#D4AF37] shadow-[0_50px_100px_rgba(0,0,0,1)] z-50 pointer-events-auto"
          >
            {/* Swaying Curtain Folds */}
            <motion.div 
              animate={{ x: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(90deg,transparent,transparent_40px,#000_50px,#000_80px)] mix-blend-multiply"
            ></motion.div>

            {/* Finale Text - Pops in with a dramatic scale */}
            <motion.div
              initial={{ opacity: 0, scale: 0.1, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 1.2, duration: 0.8, type: "spring", bounce: 0.5 }}
              className="relative z-20 text-center flex flex-col items-center"
            >
               <motion.div 
                 animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
                 transition={{ duration: 3, repeat: Infinity }}
               >
                 <Sparkles className="w-16 h-16 text-[#FFD700] mb-4 drop-shadow-[0_0_15px_#FFD700]" />
               </motion.div>
               
               <h1 className="text-6xl sm:text-8xl font-serif text-[#FFD700] drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] mb-6 tracking-wide">
                 Happy Rakhi!
               </h1>
               
               <motion.p 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 2, duration: 0.8 }}
                 className="text-[#FFF8E7] text-xl sm:text-2xl italic opacity-90 tracking-widest bg-black/30 px-6 py-2 rounded-full border border-[#D4AF37]/30"
               >
                 (Now seriously, jersey kab dilla rahi h bhai? 😅)
               </motion.p>
            </motion.div>

            {/* Explosive Firecrackers with Gravity */}
            {[...Array(40)].map((_, i) => {
              const startX = 50; 
              const endX = Math.random() * 100; 
              const peakY = Math.random() * 40 + 10; 
              const fallY = peakY + Math.random() * 30 + 10; 
              
              return (
                <motion.div
                  key={i}
                  initial={{ x: `${startX}vw`, y: "100vh", scale: 0, opacity: 1 }}
                  animate={{ 
                    x: [`${startX}vw`, `${endX}vw`, `${endX + (endX > 50 ? 5 : -5)}vw`], 
                    y: [`100vh`, `${peakY}vh`, `${fallY}vh`], 
                    scale: [0, Math.random() * 1.5 + 1, 0], 
                    opacity: [1, 1, 0] 
                  }}
                  transition={{ 
                    duration: Math.random() * 1.5 + 1.5, 
                    delay: 1.2 + Math.random() * 1.5, 
                    repeat: Infinity,
                    repeatDelay: Math.random() * 1.5,
                    ease: ["easeOut", "easeIn"] 
                  }}
                  className="absolute w-2 h-2 rounded-full z-10"
                  style={{
                    backgroundColor: ['#FFD700', '#FF4500', '#00FFFF', '#FF1493', '#39FF14', '#FFFFFF'][Math.floor(Math.random() * 6)],
                    boxShadow: '0 0 20px 2px currentColor'
                  }}
                />
              );
            })}
          </motion.div>
        </div>
      )}
    </div>
  );
}