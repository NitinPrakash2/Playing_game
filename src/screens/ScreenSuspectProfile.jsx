import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card, { Btn } from "../ui";
import { useGame } from "../GameState";

const steps = [
  {
    q: "Current mood?",
    opts: [
      { label: "😌 Chill", val: "Suspiciously relaxed" },
      { label: "🤔 Confused", val: "Professionally confused" },
      { label: "😤 Annoyed", val: "Mildly dangerous" },
      { label: "😴 Sleepy", val: "Critically low battery" },
    ],
  },
  {
    q: "Energy level right now?",
    opts: [
      { label: "⚡ High", val: "Unnaturally energetic" },
      { label: "🔋 Medium", val: "Operating at 60%" },
      { label: "🪫 Low", val: "Needs chai immediately" },
      { label: "💀 Zero", val: "Survival mode active" },
    ],
  },
  {
    q: "What are you actually doing right now?",
    opts: [
      { label: "📱 Scrolling", val: "Scrolling (as expected)" },
      { label: "🛋️ Just lying down", val: "Horizontal investigation" },
      { label: "🤫 Pretending to work", val: "Expert multitasker" },
      { label: "😂 Laughing at this app", val: "Highly suspicious" },
    ],
  },
];

export default function ScreenSuspectProfile({ onNext }) {
  const { awardRandom } = useGame();
  const [stepIdx, setStepIdx] = useState(0);
  const [picks, setPicks] = useState([]);
  const [done, setDone] = useState(false);

  const pick = (opt) => {
    const next = [...picks, opt];
    setPicks(next);
    if (stepIdx < steps.length - 1) {
      setStepIdx((p) => p + 1);
    } else {
      setTimeout(() => { setDone(true); awardRandom(); }, 300);
    }
  };

  const current = steps[stepIdx];

  return (
    <Card>
      <p className="text-xs text-pink-300 uppercase tracking-widest mb-2 text-center">Building Suspect Profile 🗂️</p>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key={stepIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
            {/* Step indicator */}
            <div className="flex gap-1.5 justify-center mb-3">
              {steps.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= stepIdx ? "bg-pink-400 w-6" : "bg-white/20 w-3"}`} />
              ))}
            </div>
            <h2 className="text-white font-bold text-base mb-4 text-center">{current.q}</h2>
            <div className="flex flex-col gap-2">
              {current.opts.map((o, i) => (
                <motion.button key={i} whileTap={{ scale: 0.97 }}
                  onClick={() => pick(o)}
                  className="w-full text-left py-3.5 px-4 rounded-2xl border border-white/20 bg-white/5 active:bg-white/15 text-white text-sm touch-manipulation">
                  {o.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="dossier" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 20 }}>
            <p className="text-xs text-green-300 uppercase tracking-widest text-center mb-3">Profile Generated ✔</p>
            <div className="bg-black/40 border border-white/15 rounded-2xl p-4 font-mono text-sm mb-4 space-y-2.5">
              <div className="text-green-400 font-bold text-base mb-1">SUSPECT_PROFILE.txt</div>
              {[
                ["Mood Status",    picks[0]?.val],
                ["Energy Level",   picks[1]?.val],
                ["Current Activity", picks[2]?.val],
                ["Threat Level",   "Low (probably)"],
                ["Investigation",  "Ongoing 🔍"],
              ].map(([k, v], i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }} className="flex justify-between text-white/75">
                  <span className="text-purple-300">{k}:</span>
                  <span className="text-right text-xs">{v}</span>
                </motion.div>
              ))}
            </div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="text-white/40 text-xs text-center italic mb-4">
              Profile filed under: Classified / Mysterious
            </motion.p>
            <Btn onClick={onNext}>Continue Investigation</Btn>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
