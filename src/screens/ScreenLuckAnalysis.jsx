import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card, { Btn } from "../ui";
import { useGame } from "../GameState";

const loadMsgs = ["Calculating luck...", "Consulting universe...", "Avoiding bugs...", "Checking stars...", "Filing report..."];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const statColors = [
  "from-green-400 to-teal-400",
  "from-yellow-400 to-orange-400",
  "from-blue-400 to-cyan-400",
  "from-purple-400 to-pink-400",
];

function buildStats() {
  return [
    { label: "Luck",             emoji: "🍀", value: rand(50, 100), color: statColors[0] },
    { label: "Chai Attraction",  emoji: "☕", value: rand(50, 100), color: statColors[1] },
    { label: "Reel Resistance",  emoji: "📱", value: rand(1,  100), color: statColors[2] },
    { label: "Sleep Probability",emoji: "💤", value: rand(1,  100), color: statColors[3] },
  ];
}

export default function ScreenLuckAnalysis({ onNext }) {
  const { unlock, awardRandom } = useGame();
  const [phase, setPhase] = useState("idle");
  const [msgIdx, setMsgIdx] = useState(0);
  const [stats] = useState(buildStats);

  const analyze = () => {
    setPhase("loading");
    const iv = setInterval(() => setMsgIdx((p) => (p + 1) % loadMsgs.length), 600);
    setTimeout(() => { clearInterval(iv); setPhase("result"); unlock("luck"); awardRandom(); }, 3000);
  };

  return (
    <Card>
      <p className="text-xs text-pink-300 uppercase tracking-widest mb-2 text-center">Ministry of Luck</p>
      <h2 className="text-white font-bold text-lg text-center mb-1">Government Luck Analysis 🍀</h2>
      <p className="text-purple-200 text-sm text-center mb-5">Today's luck report is ready.</p>

      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="text-6xl mb-6"
            >🍀</motion.div>
            <Btn onClick={analyze}>Analyze Luck</Btn>
          </motion.div>
        )}

        {phase === "loading" && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-6">
            <motion.div className="relative w-16 h-16 mx-auto mb-5">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-green-400/30 border-t-green-400"
              />
              <span className="absolute inset-0 flex items-center justify-center text-2xl">🍀</span>
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.p key={msgIdx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="text-purple-200 text-sm font-medium">{loadMsgs[msgIdx]}</motion.p>
            </AnimatePresence>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs text-green-300 uppercase tracking-widest text-center mb-4">Report Generated ✔</p>
            <div className="flex flex-col gap-3 mb-5">
              {stats.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
                  <div className="flex justify-between text-xs text-white/80 mb-1">
                    <span>{s.emoji} {s.label}</span>
                    <span className="font-bold">{s.value}%</span>
                  </div>
                  <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${s.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${s.value}%` }}
                      transition={{ duration: 0.9, delay: i * 0.15 + 0.2, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              className="text-white/40 text-xs text-center italic mb-4">
              Report certified by: Ministry of Made-Up Statistics
            </motion.p>
            <Btn onClick={onNext}>Continue</Btn>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
