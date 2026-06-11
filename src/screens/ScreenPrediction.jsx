import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card, { Btn } from "../ui";
import { useGame } from "../GameState";
import { Crystal } from "lucide-react";

const loadingMsgs = ["Analyzing destiny...", "Analyzing luck...", "Analyzing WiFi...", "Consulting the universe..."];

const predictions = [
  { label: "Reels today", value: "17 likely", emoji: "📱", color: "from-pink-400 to-rose-500", pct: 17 },
  { label: "Chai consumption probability", value: "87%", emoji: "☕", color: "from-yellow-400 to-orange-500", pct: 87 },
  { label: "Nap probability", value: "94%", emoji: "😴", color: "from-purple-400 to-indigo-500", pct: 94 },
  { label: "Ignoring notifications", value: "63%", emoji: "😌", color: "from-blue-400 to-cyan-500", pct: 63 },
  { label: "Mysterious silence chance", value: "99%", emoji: "🤫", color: "from-green-400 to-teal-500", pct: 99 },
  { label: "Getting confused probability", value: "78%", emoji: "🤨", color: "from-red-400 to-pink-500", pct: 78 },
];

export default function ScreenPrediction({ onNext }) {
  const { unlock, awardRandom } = useGame();
  const [phase, setPhase] = useState("idle"); // idle | loading | result
  const [msgIdx, setMsgIdx] = useState(0);
  const [prediction, setPrediction] = useState(null);

  const predict = () => {
    setPrediction(predictions[Math.floor(Math.random() * predictions.length)]);
    setPhase("loading");
    const iv = setInterval(() => setMsgIdx((p) => (p + 1) % loadingMsgs.length), 700);
    setTimeout(() => { clearInterval(iv); setPhase("result"); unlock("prediction"); awardRandom(); }, 3000);
  };

  return (
    <Card>
      <p className="text-xs text-pink-300 uppercase tracking-widest mb-2 text-center">Department of Destiny</p>
      <h2 className="text-white font-bold text-lg text-center mb-1">Future Prediction Machine 🔮</h2>
      <p className="text-purple-200 text-sm text-center mb-5">100% scientifically inaccurate.</p>

      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="flex justify-center mb-6"
            >
              <Crystal size={56} className="text-purple-400" strokeWidth={1.5} />
            </motion.div>
            <Btn onClick={predict}>Predict My Future</Btn>
          </motion.div>
        )}

        {phase === "loading" && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="flex justify-center mb-5"
            >
              <Crystal size={48} className="text-purple-400" strokeWidth={1.5} />
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.p
                key={msgIdx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="text-purple-200 text-sm font-medium"
              >{loadingMsgs[msgIdx]}</motion.p>
            </AnimatePresence>
          </motion.div>
        )}

        {phase === "result" && prediction && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 18 }} className="text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="flex justify-center mb-3"
            >
              {prediction.emoji && <span className="text-5xl">{prediction.emoji}</span>}
            </motion.div>
            <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Today's Prediction:</p>
            <p className="text-white font-bold text-base mb-3">{prediction.label}</p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-5">
              <p className={`text-2xl font-black bg-gradient-to-r ${prediction.color} bg-clip-text text-transparent mb-2`}>
                {prediction.value}
              </p>
              <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${prediction.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${prediction.pct}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                />
              </div>
            </div>
            <p className="text-white/40 text-xs mb-5 italic">Results may vary. Investigation team not responsible.</p>
            <Btn onClick={onNext}>Accept Fate & Continue</Btn>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
