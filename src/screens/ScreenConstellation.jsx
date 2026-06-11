import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card, { Btn } from "../ui";
import { useGame } from "../GameState";

const loadMsgs = ["Analyzing data...", "Connecting stars...", "Generating profile...", "Almost ready..."];

const traitPool = [
  { label: "Curious",           color: "text-yellow-300",  bg: "bg-yellow-500/15 border-yellow-400/25" },
  { label: "Mysterious",        color: "text-purple-300",  bg: "bg-purple-500/15 border-purple-400/25" },
  { label: "Selectively Social",color: "text-blue-300",    bg: "bg-blue-500/15 border-blue-400/25" },
  { label: "Difficult To Decode",color: "text-pink-300",   bg: "bg-pink-500/15 border-pink-400/25" },
  { label: "Quietly Chaotic",   color: "text-orange-300",  bg: "bg-orange-500/15 border-orange-400/25" },
  { label: "Expert Overthinker",color: "text-teal-300",    bg: "bg-teal-500/15 border-teal-400/25" },
  { label: "Professionally Busy",color: "text-green-300",  bg: "bg-green-500/15 border-green-400/25" },
  { label: "Certified Introvert",color: "text-indigo-300", bg: "bg-indigo-500/15 border-indigo-400/25" },
];

function pick4() {
  const shuffled = [...traitPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}

// Star positions for decoration
const stars = Array.from({ length: 12 }, (_, i) => ({
  cx: 20 + (i % 4) * 60,
  cy: 20 + Math.floor(i / 4) * 40,
}));

export default function ScreenConstellation({ onNext }) {
  const { unlock, awardRandom } = useGame();
  const [phase, setPhase] = useState("loading");
  const [msgIdx, setMsgIdx] = useState(0);
  const [traits] = useState(pick4);
  const [visibleTraits, setVisibleTraits] = useState(0);
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => setMsgIdx((p) => (p + 1) % loadMsgs.length), 750);
    const t = setTimeout(() => {
      clearInterval(iv);
      setPhase("reveal");
      unlock("constellation");
      awardRandom();
    }, 3500);
    return () => { clearInterval(iv); clearTimeout(t); };
  }, []);

  useEffect(() => {
    if (phase !== "reveal") return;
    if (visibleTraits >= traits.length) { setTimeout(() => setShowBtn(true), 400); return; }
    const t = setTimeout(() => setVisibleTraits((p) => p + 1), 500);
    return () => clearTimeout(t);
  }, [phase, visibleTraits]);

  return (
    <Card>
      <p className="text-xs text-pink-300 uppercase tracking-widest mb-2 text-center">Profile Analysis</p>
      <h2 className="text-white font-bold text-base text-center mb-1">Building Personality Constellation ⭐</h2>

      <AnimatePresence mode="wait">
        {phase === "loading" && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-4">
            {/* Animated star grid */}
            <svg viewBox="0 0 260 120" className="w-full max-h-28 mb-4">
              {stars.map((s, i) => (
                <motion.circle key={i} cx={s.cx} cy={s.cy} r="3"
                  fill="#c084fc"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.3, 1] }}
                  transition={{ delay: i * 0.15, duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
                />
              ))}
              {stars.slice(0, -1).map((s, i) => (
                <motion.line key={`l${i}`} x1={s.cx} y1={s.cy} x2={stars[i + 1].cx} y2={stars[i + 1].cy}
                  stroke="#c084fc" strokeWidth="0.5" strokeDasharray="4 4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ delay: i * 0.1 + 1 }}
                />
              ))}
            </svg>
            <AnimatePresence mode="wait">
              <motion.p key={msgIdx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="text-purple-200 text-sm font-medium">{loadMsgs[msgIdx]}</motion.p>
            </AnimatePresence>
          </motion.div>
        )}

        {phase === "reveal" && (
          <motion.div key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-xs text-purple-300 uppercase tracking-widest text-center mb-4">Constellation Complete ✨</p>
            <div className="flex flex-col gap-2 mb-4">
              {traits.slice(0, visibleTraits).map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 280, damping: 20 }}
                  className={`flex items-center gap-3 border rounded-2xl px-4 py-2.5 ${t.bg}`}
                >
                  <motion.span
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 0.4 }}
                    className="text-lg"
                  >⭐</motion.span>
                  <span className={`font-semibold text-sm ${t.color}`}>{t.label}</span>
                </motion.div>
              ))}
            </div>
            <AnimatePresence>
              {showBtn && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
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
