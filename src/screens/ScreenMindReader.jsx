import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card, { Btn } from "../ui";
import { useGame } from "../GameState";
import { Zap } from "lucide-react";

// Each option influences signal strength + which thought pool is used
const options = [
  {
    label: "Kuch nahi soch rahi 😶",
    signal: 34,
    signalLabel: "Weak signal — mind completely blank detected",
    thoughts: [
      "Mind blank. Either meditating or in sleep mode. Impressive.",
      "Zero thoughts detected. This is actually peaceful. Rare.",
      "Brain activity: offline. Phone: scrolling Reels. Makes sense.",
    ],
  },
  {
    label: "Zyada soch rahi hoon (overthinking)",
    signal: 92,
    signalLabel: "Strong signal — overthinking detected",
    thoughts: [
      "Signal OVERLOADED. Your brain is running 47 tabs. All open. None related.",
      "Thought traffic detected: Did I say that weird? Do I look fat? Is chai ready? SIMULTANEOUSLY.",
      "Maximum overthinking mode active. Investigation team needs therapy after reading this.",
    ],
  },
  {
    label: "Kuch important soch rahi hoon",
    signal: 67,
    signalLabel: "Moderate signal — classified thoughts detected",
    thoughts: [
      "Important thought intercepted. Classification: TOP SECRET. Content: Encrypted.",
      "Signal clear but meaning unclear. We read: blah blah blah. Very helpful.",
      "Thought detected but government database denies access. Even we cannot see it.",
    ],
  },
  {
    label: "Is app ke baare mein soch rahi hoon",
    signal: 99,
    signalLabel: "MAXIMUM signal — thinking about THIS app",
    thoughts: [
      "CRYSTAL CLEAR: You are thinking Is this thing actually reading my mind? Answer: No. But now we are curious.",
      "High confidence read: Ye app kahan se aaya? Ye ladka kitna weird hai? We are also confused.",
      "Thought confirmed. Subject currently: amused, confused, and oddly entertained. Investigation team: taking notes.",
    ],
  },
];

// Time-aware prefix for extra realism
function getTimeContext() {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return "Morning scan:";
  if (h >= 12 && h < 17) return "Afternoon read:";
  if (h >= 17 && h < 21) return "Evening signal:";
  return "Late night scan:";
}

// Brainwave canvas — amplitude driven by signal strength
function BrainwaveCanvas({ signal, scanning }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = 60;
    const W = canvas.width, H = canvas.height;
    let t = 0, id;

    const amp   = (signal / 100) * (H * 0.38) + 4;
    const freq  = 0.04 + (signal / 100) * 0.06;
    const speed = scanning ? 3 : 0.6;
    const color = signal > 80 ? "#a78bfa" : signal > 50 ? "#c084fc" : "#818cf8";

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.shadowBlur = scanning ? 8 : 3;
      ctx.shadowColor = color;
      ctx.beginPath();
      for (let x = 0; x < W; x++) {
        const y = H / 2
          - Math.sin((x + t) * freq) * amp
          - Math.sin((x + t) * freq * 2.1) * (amp * 0.25)
          + Math.sin((x + t) * freq * 0.5) * (amp * 0.15);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      t += speed;
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [signal, scanning]);

  return <canvas ref={ref} className="w-full" style={{ height: 60 }} />;
}

// Typewriter for the final thought
function TypewriterText({ text, onDone }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setShown(text.slice(0, i + 1));
      i++;
      if (i >= text.length) { clearInterval(iv); onDone?.(); }
    }, 38);
    return () => clearInterval(iv);
  }, [text]);

  return (
    <span className="text-white text-sm font-medium">
      {shown}
      {shown.length < text.length && <span className="animate-pulse text-purple-400">▌</span>}
    </span>
  );
}

const scanSteps = [
  "Establishing neural link...",
  "Scanning brainwaves...",
  "Decrypting signal...",
  "Filtering noise...",
  "Accessing memory cache...",
  "Thought detected. Decoding...",
];

export default function ScreenMindReader({ onNext }) {
  const { unlock, awardRandom } = useGame();
  const [phase, setPhase]       = useState("pick"); // pick | scanning | reveal | done
  const [sel, setSel]           = useState(null);
  const [scanStep, setScanStep] = useState(0);
  const [thought, setThought]   = useState("");
  const [typeDone, setTypeDone] = useState(false);
  const timeCtx = useRef(getTimeContext());

  const opt = sel !== null ? options[sel] : null;

  const startScan = () => {
    const chosen = options[sel];
    const pool   = chosen.thoughts;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setThought(picked);
    setPhase("scanning");

    let i = 0;
    const iv = setInterval(() => {
      i++;
      setScanStep(i);
      if (i >= scanSteps.length - 1) {
        clearInterval(iv);
        setTimeout(() => { setPhase("reveal"); unlock("mindreader"); awardRandom(); }, 500);
      }
    }, 480);
  };

  return (
    <Card>
      <p className="text-xs text-pink-300 uppercase tracking-widest mb-2 text-center">Neural Scan Technology 🧠</p>
      <h2 className="text-white font-bold text-base text-center mb-1">Mind Reader Machine</h2>
      <p className="text-purple-200 text-sm text-center mb-4">Abhi kya chal raha hai dimag mein?</p>

      {/* Brainwave — visible across all phases */}
      <div className="bg-black/40 border border-purple-500/20 rounded-2xl px-3 pt-2 pb-1 mb-4">
        <div className="flex justify-between text-xs text-white/30 mb-1">
          <span>Neural Activity</span>
          <span>{opt ? `${opt.signal}%` : "—"}</span>
        </div>
        <BrainwaveCanvas signal={opt?.signal ?? 15} scanning={phase === "scanning"} />
        <p className="text-purple-400/60 text-xs mt-1 truncate">
          {phase === "scanning" ? scanSteps[scanStep] : opt ? opt.signalLabel : "Awaiting input..."}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {phase === "pick" && (
          <motion.div key="pick" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex flex-col gap-2 mb-3">
              {options.map((o, i) => (
                <motion.button key={i} whileTap={{ scale: 0.97 }}
                  onClick={() => setSel(i)}
                  className={`w-full text-left py-3.5 px-4 rounded-2xl border text-sm text-white touch-manipulation transition-colors duration-150
                    ${sel === i ? "border-purple-400 bg-purple-500/25" : "border-white/20 bg-white/5"}`}>
                  {o.label}
                </motion.button>
              ))}
            </div>
            <AnimatePresence>
              {sel !== null && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <Btn onClick={startScan} icon={Zap}>Start Neural Scan</Btn>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {phase === "scanning" && (
          <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center py-2">
            <div className="flex gap-1 justify-center mb-2">
              {scanSteps.map((_, i) => (
                <motion.div key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${i <= scanStep ? "bg-purple-400 w-5" : "bg-white/15 w-2"}`} />
              ))}
            </div>
            <p className="text-purple-300 text-xs">{Math.round((scanStep / (scanSteps.length - 1)) * 100)}% complete</p>
          </motion.div>
        )}

        {(phase === "reveal" || phase === "done") && (
          <motion.div key="reveal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 20 }}>
            <div className="bg-purple-500/10 border border-purple-400/25 rounded-2xl p-4 mb-3">
              <p className="text-purple-300 text-xs uppercase tracking-widest mb-2">
                {timeCtx.current} Thought Intercepted
              </p>
              <TypewriterText text={thought} onDone={() => setPhase("done")} />
            </div>
            <div className="flex justify-between text-xs text-white/30 mb-4 px-1">
              <span>Signal strength: {opt?.signal}%</span>
              <span>Confidence: {opt?.signal > 70 ? "High" : opt?.signal > 40 ? "Medium" : "Low"}</span>
            </div>
            <AnimatePresence>
              {phase === "done" && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <Btn onClick={onNext}>Continue</Btn>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
