import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, AlertTriangle, CheckCircle, Database } from "lucide-react";
import Card, { Btn } from "../ui";

const scanLines = [
  { text: "> Accessing Aadhaar database...", color: "text-green-400" },
  { text: "> Searching voter ID records...", color: "text-green-400" },
  { text: "> Cross-referencing PAN details...", color: "text-yellow-300" },
  { text: "> Checking social media traces...", color: "text-yellow-300" },
  { text: "> Analyzing phone metadata...", color: "text-purple-300" },
  { text: "> Matching government records...", color: "text-purple-300" },
  { text: "> Facial recognition scan active...", color: "text-blue-300" },
];

function TerminalScan({ entered, onDone }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [charBuf, setCharBuf] = useState("");
  const [charIdx, setCharIdx] = useState(0);
  
  const dynamicLine = `> MATCH FOUND: ${entered.toUpperCase()} ✓`;
  const dynamicScanLines = [...scanLines, { text: dynamicLine, color: "text-green-300 font-bold" }];

  useEffect(() => {
    if (visibleLines >= dynamicScanLines.length) {
      setTimeout(onDone, 700);
      return;
    }

    const line = dynamicScanLines[visibleLines].text;

    if (charIdx < line.length) {
      const t = setTimeout(() => {
        setCharBuf(line.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
        setProgress(Math.round(((visibleLines + (charIdx + 1) / line.length) / dynamicScanLines.length) * 100));
      }, 28);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setVisibleLines((v) => v + 1);
        setCharBuf("");
        setCharIdx(0);
      }, 180);
      return () => clearTimeout(t);
    }
  }, [visibleLines, charIdx, dynamicScanLines]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-2 mb-3">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}>
          <Database size={18} className="text-green-400" strokeWidth={2.5} />
        </motion.div>
        <p className="text-green-400 text-xs font-mono font-bold uppercase tracking-widest">
          Government Verification Active
        </p>
      </div>

      <div className="bg-black/70 border border-green-500/30 rounded-2xl p-3 font-mono text-xs mb-3 min-h-[220px]">
        {dynamicScanLines.slice(0, visibleLines).map((l, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            className={`mb-1 ${l.color}`}>
            {l.text}
          </motion.div>
        ))}
        {visibleLines < dynamicScanLines.length && (
          <div className={`mb-1 ${dynamicScanLines[visibleLines].color}`}>
            {charBuf}
            <span className="animate-pulse">▌</span>
          </div>
        )}
      </div>

      <div className="flex justify-between text-xs text-white/40 mb-1 font-mono">
        <span>Verifying identity of "{entered}"</span>
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

function CaughtFlow({ entered, onNext }) {
  const [step, setStep] = useState(0);

  const advance = () => setStep((s) => s + 1);

  return (
    <AnimatePresence mode="wait">
      {step === 0 && (
        <motion.div key="s0" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} className="text-center">
          <motion.div animate={{ rotate: [-4, 4, -4, 4, 0] }} transition={{ duration: 0.5 }}
            className="flex justify-center mb-4">
            <ShieldAlert size={48} className="text-purple-400" strokeWidth={1.5} />
          </motion.div>
          <p className="text-white font-bold text-lg mb-2">Wait... suspicion detected 🤔</p>
          <p className="text-purple-200 text-sm mb-5">
            You entered <span className="text-pink-300 font-semibold">"{entered}"</span>...<br />
            Let me verify this against government records.
          </p>
          <Btn onClick={advance}>Access Aadhaar Database</Btn>
        </motion.div>
      )}

      {step === 1 && (
        <motion.div key="s1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} className="text-center">
          <motion.div animate={{ rotate: [-4, 4, -4, 4, 0] }} transition={{ duration: 0.5 }}
            className="flex justify-center mb-4">
            <AlertTriangle size={48} className="text-yellow-400" strokeWidth={1.5} />
          </motion.div>
          <p className="text-white font-bold text-lg mb-2">Running verification scan... 🔍</p>
          <p className="text-purple-200 text-sm mb-5">
            Cross-checking Aadhaar, voter ID, PAN database...<br />
            Please wait while we verify your identity.
          </p>
          <Btn onClick={advance}>Run Full Database Scan</Btn>
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
            className="flex justify-center mb-4">
            <CheckCircle size={48} className="text-green-400" strokeWidth={1.5} />
          </motion.div>
          <p className="text-green-400 font-bold text-lg mb-1">Identity Verified Successfully ✓</p>
          <p className="text-pink-300 text-sm mb-2">
            Database confirmed: <span className="font-bold text-white">{entered}</span>
          </p>
          <p className="text-purple-200 text-sm mb-5">
            Government records updated. Investigation proceeding with verified identity.
          </p>
          <Btn onClick={() => onNext(entered)}>Continue Investigation</Btn>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ScreenNameEntry({ onNext }) {
  const [name, setName] = useState("");
  const [phase, setPhase] = useState("input");

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPhase("processing");
  };

  return (
    <Card>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
        className="flex justify-center mb-3">
        <ShieldAlert size={48} className="text-pink-400" strokeWidth={1.5} />
      </motion.div>

      <p className="text-xs text-pink-300 uppercase tracking-widest mb-2 text-center">
        Investigation Dept. of India
      </p>

      <AnimatePresence mode="wait">
        {phase === "input" && (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="text-white font-bold text-xl text-center mb-1">Identity Verification</h1>
            <p className="text-purple-200 text-sm text-center mb-5">
              Apna actual naam darj karein. Database se match hona chahiye.
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
            <Btn onClick={submit} disabled={!name.trim()}>Verify Identity</Btn>
          </motion.div>
        )}

        {phase === "processing" && (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CaughtFlow entered={name} onNext={onNext} />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
