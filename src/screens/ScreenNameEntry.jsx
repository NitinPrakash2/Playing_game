import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card, { Btn } from "../ui";

// Terminal lines that type out one by one during the scan
const scanLines = [
  { text: "> Accessing government database...", color: "text-green-400" },
  { text: "> Searching identity records...",    color: "text-green-400" },
  { text: "> Cross-referencing Aadhaar...",     color: "text-yellow-300" },
  { text: "> Checking social media traces...",  color: "text-yellow-300" },
  { text: "> Analyzing typing pattern...",      color: "text-purple-300" },
  { text: "> Name mismatch detected ⚠",        color: "text-red-400" },
  { text: "> Running deep scan...",             color: "text-green-400" },
  { text: "> MATCH FOUND: PRIYA ✔",            color: "text-green-300 font-bold" },
];

function TerminalScan({ entered, onDone }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress]         = useState(0);
  const [charBuf, setCharBuf]           = useState("");   // currently typing line
  const [charIdx, setCharIdx]           = useState(0);    // char position in current line

  // Reveal lines one by one with per-character typing
  useEffect(() => {
    if (visibleLines >= scanLines.length) {
      setTimeout(onDone, 700);
      return;
    }
    //hello

    const line = scanLines[visibleLines].text;

    if (charIdx < line.length) {
      const t = setTimeout(() => {
        setCharBuf(line.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
        setProgress(Math.round(((visibleLines + (charIdx + 1) / line.length) / scanLines.length) * 100));
      }, 28);
      return () => clearTimeout(t);
    } else {
      // Line done — pause then move to next line
      const t = setTimeout(() => {
        setVisibleLines((v) => v + 1);
        setCharBuf("");
        setCharIdx(0);
      }, 180);
      return () => clearTimeout(t);
    }
  }, [visibleLines, charIdx]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <motion.div animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-4 h-4 rounded-full border-2 border-green-400/40 border-t-green-400 flex-shrink-0" />
        <p className="text-green-400 text-xs font-mono font-bold uppercase tracking-widest">
          Database Scan Active
        </p>
      </div>

      {/* Terminal box */}
      <div className="bg-black/70 border border-green-500/30 rounded-2xl p-3 font-mono text-xs mb-3 min-h-[160px]">
        {scanLines.slice(0, visibleLines).map((l, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            className={`mb-1 ${l.color}`}>
            {l.text}
          </motion.div>
        ))}
        {/* Currently typing line */}
        {visibleLines < scanLines.length && (
          <div className={`mb-1 ${scanLines[visibleLines].color}`}>
            {charBuf}
            <span className="animate-pulse">▌</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="flex justify-between text-xs text-white/40 mb-1 font-mono">
        <span>Scanning identity of "{entered}"</span>
        <span>{progress}%</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-green-400 to-teal-400 rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

// ── Caught flow ────────────────────────────────────────────────────────────
function CaughtFlow({ entered, onNext }) {
  const [step, setStep] = useState(0);
  // step 0 = denial, 1 = caught, 2 = scanning terminal, 3 = match found

  const advance = () => setStep((s) => s + 1);

  return (
    <AnimatePresence mode="wait">

      {step === 0 && (
        <motion.div key="s0" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} className="text-center">
          <motion.div animate={{ rotate: [-4, 4, -4, 4, 0] }} transition={{ duration: 0.5 }}
            className="text-5xl mb-4">🕵️</motion.div>
          <p className="text-white font-bold text-lg mb-2">Nahi nahi nahi... 🤨</p>
          <p className="text-purple-200 text-sm mb-5">
            Tumne likha <span className="text-pink-300 font-semibold">"{entered}"</span>?<br />
            Hume nahi lagta ye sach hai 😂
          </p>
          <Btn onClick={advance}>Aage...</Btn>
        </motion.div>
      )}

      {step === 1 && (
        <motion.div key="s1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} className="text-center">
          <motion.div animate={{ rotate: [-4, 4, -4, 4, 0] }} transition={{ duration: 0.5 }}
            className="text-5xl mb-4">🕵️</motion.div>
          <p className="text-white font-bold text-lg mb-2">Jhooth pakda gaya! 😂</p>
          <p className="text-purple-200 text-sm mb-5">
            Hum abhi tumhara asli naam dhundh rahe hain.<br />
            Government records check ho rahe hain... 🗂️
          </p>
          <Btn onClick={advance}>Records Check Karo</Btn>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <TerminalScan entered={entered} onDone={advance} />
        </motion.div>
      )}

      {step === 3 && (
        <motion.div key="s3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 240, damping: 18 }}
          className="text-center">
          <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 0.5, repeat: 2 }}
            className="text-5xl mb-4">✅</motion.div>
          <p className="text-green-400 font-bold text-lg mb-1">Database match mili — PRIYA ✔</p>
          <p className="text-pink-300 text-sm mb-2">
            Tumhara asli naam Priya hai. Hum jaante the 😌
          </p>
          <p className="text-purple-200 text-sm mb-5">
            Chalo ab sach mein shuru karte hain.
          </p>
          <Btn onClick={() => onNext("Priya")}>Theek hai, chalo 😅</Btn>
        </motion.div>
      )}

    </AnimatePresence>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function ScreenNameEntry({ onNext }) {
  const [name, setName]   = useState("");
  const [phase, setPhase] = useState("input"); // input | priya | caught

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPhase(trimmed.toLowerCase() === "priya" ? "priya" : "caught");
  };

  return (
    <Card>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
        className="text-5xl text-center mb-3">🔍</motion.div>

      <p className="text-xs text-pink-300 uppercase tracking-widest mb-2 text-center">
        Investigation Dept. of India
      </p>

      <AnimatePresence mode="wait">

        {phase === "input" && (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="text-white font-bold text-xl text-center mb-1">Identity Verification</h1>
            <p className="text-purple-200 text-sm text-center mb-5">
              Apna naam darj karein to proceed karein.
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Apna naam likho..."
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3.5 text-white placeholder-white/30 text-sm outline-none focus:border-purple-400/60 mb-4"
              autoComplete="off"
            />
            <Btn onClick={submit} disabled={!name.trim()}>Submit Identity</Btn>
          </motion.div>
        )}

        {phase === "priya" && (
          <motion.div key="priya" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 240, damping: 18 }}
            className="text-center">
            <motion.div animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ duration: 0.6, delay: 0.2 }} className="text-5xl mb-4">👋</motion.div>
            <h2 className="text-white font-bold text-xl mb-2">Arey Priya! Finally! 😄</h2>
            <p className="text-purple-200 text-sm mb-2">Hame pata tha tum aogi.</p>
            <p className="text-pink-300 text-sm mb-1">Investigation team taiyaar hai.</p>
            <p className="text-white/40 text-xs mb-6 italic">Suspects file: PRIYA.EXE — loading...</p>
            <Btn onClick={() => onNext("Priya")}>Chalo Shuru Karte Hain 🚀</Btn>
          </motion.div>
        )}

        {phase === "caught" && (
          <CaughtFlow key="caught" entered={name.trim()} onNext={onNext} />
        )}

      </AnimatePresence>
    </Card>
  );
}
