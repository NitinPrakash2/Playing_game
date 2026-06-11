import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card, { Btn } from "../ui";
import { useGame } from "../GameState";
import { Send, CheckCircle, AlertCircle, Database } from "lucide-react";

// Step 1 — initial defence
const defences = [
  { label: "Bilkul nahi! Main akdu nahi hoon 😤", short: "Full Denial" },
  { label: "Thoda sa... kabhi kabhi 😌",           short: "Partial Admit" },
  { label: "Depends on the situation 🤷",          short: "Conditional" },
  { label: "Evidence kahan hai? 🧐",               short: "Evidence Challenge" },
];

// Step 2 — follow-up question changes based on step 1 pick
const followUps = [
  {
    q: "Investigator: Theek hai. Toh jab koi tumse kuch aise puchhe jo tumhe pasand na ho, tum kya karti ho?",
    opts: [
      { label: "Politely ignore karta hoon",    verdict: "passive_akdu" },
      { label: "Short mein jawab deta hoon",     verdict: "classic_akdu" },
      { label: "Expression se bata deta hoon",   verdict: "expert_akdu" },
      { label: "Seedha bol deta hoon",           verdict: "honest" },
    ],
  },
  {
    q: "Investigator: Kabhi kabhi matlab — kitni baar? Ek estimate?",
    opts: [
      { label: "Shaayad... week mein ek do baar", verdict: "mild_akdu" },
      { label: "Bas jab koi irritate kare",       verdict: "justified_akdu" },
      { label: "Actually yaad nahi 😅",           verdict: "memory_issue" },
      { label: "Main count nahi karta",           verdict: "classic_akdu" },
    ],
  },
  {
    q: "Investigator: Situation kaunsi? Specifically.",
    opts: [
      { label: "Jab mood sahi na ho",            verdict: "mood_based" },
      { label: "Jab koi zyada questions kare",    verdict: "expert_akdu" },
      { label: "Jab disturb kiya jaye",           verdict: "classic_akdu" },
      { label: "Honestly... most situations",     verdict: "honest_akdu" },
    ],
  },
  {
    q: "Investigator: Evidence? Humara poora database hai. Kya aap database dekhna chahenge?",
    opts: [
      { label: "Haan, dikhao 😤",                verdict: "confident" },
      { label: "...Nahi theek hai 😅",            verdict: "backing_off" },
      { label: "Database galat hoga",             verdict: "denial" },
      { label: "Okay thoda sa hai maanta hoon",   verdict: "confession" },
    ],
  },
];

// Final case notes — per verdict
const caseNotes = {
  passive_akdu:   { level: 74, tag: "Passive Akdu", note: "Subject avoids conflict using silence. Advanced technique. Noted.", color: "from-yellow-400 to-orange-400" },
  classic_akdu:   { level: 81, tag: "Classic Akdu", note: "Short answers, minimal engagement. Textbook case. File updated.", color: "from-red-400 to-pink-500" },
  expert_akdu:    { level: 89, tag: "Expert Level", note: "No words needed. The expression does the work. Rare talent.", color: "from-purple-400 to-red-500" },
  honest:         { level: 22, tag: "Surprisingly Honest", note: "Direct communication detected. Investigation team impressed. Slightly suspicious.", color: "from-green-400 to-teal-400" },
  mild_akdu:      { level: 48, tag: "Mild Case", note: "Occasional akdu episodes. Manageable. Monitoring continues.", color: "from-yellow-400 to-amber-400" },
  justified_akdu: { level: 61, tag: "Justified Defence", note: "Only triggered by external irritants. Understandable. Still noted.", color: "from-orange-400 to-red-400" },
  memory_issue:   { level: 55, tag: "Memory Selective", note: "Cannot recall frequency. Memory conveniently unavailable.", color: "from-blue-400 to-cyan-400" },
  mood_based:     { level: 67, tag: "Mood Dependent", note: "Mood-triggered akdu mode confirmed. Meteorological correlation suspected.", color: "from-indigo-400 to-purple-400" },
  honest_akdu:    { level: 94, tag: "Honest Admission", note: "Subject admitted most situations trigger it. Unprecedented honesty. Case nearly closed.", color: "from-pink-400 to-rose-500" },
  confident:      { level: 77, tag: "Overconfident", note: "Subject called the bluff. Bold. Database was fake. Investigation team nervous.", color: "from-red-400 to-orange-400" },
  backing_off:    { level: 58, tag: "Strategic Retreat", note: "Evidence request withdrawn immediately. Tells us everything we needed.", color: "from-yellow-400 to-orange-400" },
  denial:         { level: 85, tag: "Database Denial", note: "Subject claims database is wrong. Database says otherwise. Stalemate.", color: "from-red-400 to-pink-400" },
  confession:     { level: 42, tag: "Voluntary Confession", note: "Subject admitted it themselves. Investigation team didn't expect this. Respect.", color: "from-green-400 to-emerald-400" },
};

function TypingText({ text }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setShown(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(iv);
    }, 22);
    return () => clearInterval(iv);
  }, [text]);
  return <span>{shown}</span>;
}

const filingLines = [
  { text: "> Saving interrogation transcript...", color: "text-green-400" },
  { text: "> Cross-referencing previous cases...", color: "text-yellow-300" },
  { text: "> Updating suspect database...",        color: "text-purple-300" },
  { text: "> Case report filed successfully ✔",   color: "text-green-300 font-bold" },
];

function FilingTerminal() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [charBuf, setCharBuf]           = useState("");
  const [charIdx, setCharIdx]           = useState(0);

  useEffect(() => {
    if (visibleLines >= filingLines.length) return;
    const line = filingLines[visibleLines].text;
    if (charIdx < line.length) {
      const t = setTimeout(() => {
        setCharBuf(line.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      }, 30);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setVisibleLines((v) => v + 1);
        setCharBuf("");
        setCharIdx(0);
      }, 160);
      return () => clearTimeout(t);
    }
  }, [visibleLines, charIdx]);

  return (
    <div className="bg-black/60 border border-green-500/25 rounded-2xl p-3 font-mono text-xs">
      <div className="flex items-center gap-2 mb-2">
        <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-2 h-2 rounded-full bg-green-400" />
        <span className="text-green-400 uppercase tracking-widest text-xs">Filing Report</span>
      </div>
      {filingLines.slice(0, visibleLines).map((l, i) => (
        <div key={i} className={`mb-1 ${l.color}`}>{l.text}</div>
      ))}
      {visibleLines < filingLines.length && (
        <div className={filingLines[visibleLines].color}>
          {charBuf}<span className="animate-pulse">▌</span>
        </div>
      )}
    </div>
  );
}

export default function Screen4({ onNext }) {
  const { awardRandom } = useGame();
  const [phase, setPhase]     = useState("defence");   // defence | followup | result | filing
  const [defSel, setDefSel]   = useState(null);
  const [followSel, setFollowSel] = useState(null);
  const [verdict, setVerdict] = useState(null);

  const pickDefence = (i) => setDefSel(i);

  const submitDefence = () => setPhase("followup");

  const pickFollow = (i) => {
    setFollowSel(i);
    const v = followUps[defSel].opts[i].verdict;
    setVerdict(caseNotes[v]);
    setPhase("result");
  };

  const submit = () => {
    setPhase("filing");
    awardRandom();
    setTimeout(onNext, 1800);
  };

  return (
    <Card>
      <p className="text-xs text-pink-300 uppercase tracking-widest mb-2 text-center">
        Interrogation Room 🔴
      </p>

      <AnimatePresence mode="wait">

        {/* STEP 1 — Defence */}
        {phase === "defence" && (
          <motion.div key="defence" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}>
            <div className="bg-black/30 border border-white/10 rounded-2xl p-3 mb-4">
              <p className="text-white/50 text-xs mb-1 flex items-center gap-1"><AlertCircle size={12} /> Investigator says:</p>
              <p className="text-white text-sm font-medium">
                "Humein reliable sources se pata chala hai ki tum thodi si akdu hoti ho. Kya kehna hai tumhara?"
              </p>
            </div>
            <div className="flex flex-col gap-2 mb-3">
              {defences.map((d, i) => (
                <motion.button key={i} whileTap={{ scale: 0.97 }}
                  onClick={() => pickDefence(i)}
                  className={`w-full text-left py-3 px-4 rounded-2xl border text-sm text-white touch-manipulation transition-all duration-150
                    ${defSel === i ? "border-pink-400 bg-pink-500/20" : "border-white/20 bg-white/5"}`}>
                  {d.label}
                  {defSel === i && <span className="ml-2 text-xs text-pink-300 font-medium">— {d.short}</span>}
                </motion.button>
              ))}
            </div>
            <AnimatePresence>
              {defSel !== null && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <Btn onClick={submitDefence} icon={Send}>Submit Response</Btn>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* STEP 2 — Follow-up */}
        {phase === "followup" && (
          <motion.div key="followup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="bg-red-500/10 border border-red-400/20 rounded-2xl p-3 mb-4">
              <p className="text-red-300 text-xs mb-1 uppercase tracking-widest flex items-center gap-1"><Database size={12} /> Follow-up Question</p>
              <p className="text-white text-sm font-medium leading-snug">
                {followUps[defSel].q}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {followUps[defSel].opts.map((o, i) => (
                <motion.button key={i} whileTap={{ scale: 0.97 }}
                  onClick={() => pickFollow(i)}
                  className="w-full text-left py-3 px-4 rounded-2xl border border-white/20 bg-white/5 active:bg-white/15 text-white text-sm touch-manipulation">
                  {o.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 3 — Case note result */}
        {phase === "result" && verdict && (
          <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 20 }}>
            <div className="bg-black/40 border border-white/15 rounded-2xl p-4 font-mono text-xs mb-4">
              <p className="text-green-400 font-bold mb-2 flex items-center gap-1"><CheckCircle size={14} /> CASE NOTE FILED</p>
              <div className="space-y-1.5 text-white/70">
                <div className="flex justify-between">
                  <span className="text-purple-300">Defence:</span>
                  <span>{defences[defSel].short}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Classification:</span>
                  <span className="text-pink-300">{verdict.tag}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Akdu Level:</span>
                  <span className="text-yellow-300 font-bold">{verdict.level}%</span>
                </div>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mt-2 mb-3">
                <motion.div className={`h-full rounded-full bg-gradient-to-r ${verdict.color}`}
                  initial={{ width: 0 }} animate={{ width: `${verdict.level}%` }}
                  transition={{ duration: 1, ease: "easeOut" }} />
              </div>
              <p className="text-white/60 leading-relaxed">{verdict.note}</p>
            </div>
            <Btn onClick={submit}>Submit & Continue</Btn>
          </motion.div>
        )}

        {/* Filing — terminal style */}
        {phase === "filing" && (
          <motion.div key="filing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-2">
            <FilingTerminal />
          </motion.div>
        )}

      </AnimatePresence>
    </Card>
  );
}
