import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card, { Btn } from "../ui";
import { useGame } from "../GameState";
import { RotateCw } from "lucide-react";

const msgs = [
  "Scanning personality...",
  "Analyzing reply speed...",
  "Checking mystery level...",
  "Consulting experts...",
  "Experts are confused...",
];

// Matches index order from Screen2 options
const barSets = [
  // Turant reply
  [
    { label: "Reply Speed", value: 98, color: "from-green-400 to-teal-400" },
    { label: "Suspicion Level", value: 91, color: "from-red-400 to-pink-400" },
    { label: "Mystery Level", value: 22, color: "from-purple-400 to-indigo-400" },
  ],
  // Thodi der baad
  [
    { label: "Reply Speed", value: 54, color: "from-yellow-400 to-orange-400" },
    { label: "Busy Pretending", value: 76, color: "from-pink-400 to-rose-400" },
    { label: "Mystery Level", value: 58, color: "from-purple-400 to-indigo-400" },
  ],
  // Bahut der baad
  [
    { label: "Reply Speed", value: 8, color: "from-red-400 to-rose-500" },
    { label: "Mystery Level", value: 89, color: "from-purple-400 to-indigo-400" },
    { label: "Experts Confused", value: 95, color: "from-yellow-400 to-orange-400" },
  ],
  // Sochti ho reply nahi
  [
    { label: "Reply Speed", value: 1, color: "from-gray-400 to-slate-400" },
    { label: "Ghost Level", value: 99, color: "from-blue-400 to-cyan-400" },
    { label: "Mystery Level", value: 100, color: "from-purple-400 to-pink-400" },
  ],
];

const verdictMap = [
  "Reply speed: Dangerously fast 🚨",
  "Busy status: Unverified 🤨",
  "Reply ETA: Unknown 🕵️",
  "Ghost mode: Fully activated 👻",
];

// fallback if answer not passed
const defaultBars = [
  { label: "Cute Level", value: 87, color: "from-pink-400 to-rose-400" },
  { label: "Mystery Level", value: 73, color: "from-purple-400 to-indigo-400" },
  { label: "Reply Pending", value: 1, color: "from-yellow-400 to-orange-400" },
];

export default function Screen3({ onNext, answers }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [done, setDone] = useState(false);

  const answer = answers?.[2]; // Screen2 is now step index 2 (after ScreenNameEntry + Screen1)
  const bars = (answer !== undefined && barSets[answer]) ? barSets[answer] : defaultBars;
  const verdict = (answer !== undefined && verdictMap[answer]) ? verdictMap[answer] : "Analysis complete 📊";

  const { unlock, awardRandom } = useGame();

  useEffect(() => {
    const iv = setInterval(() => setMsgIdx((p) => (p + 1) % msgs.length), 900);
    const t = setTimeout(() => { clearInterval(iv); setDone(true); unlock("scan"); awardRandom(); }, 4500);
    return () => { clearInterval(iv); clearTimeout(t); };
  }, []);

  return (
    <Card>
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="flex justify-center mb-6"
            >
              <RotateCw size={40} className="text-purple-400" strokeWidth={2} />
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.p
                key={msgIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-purple-200 text-sm font-medium"
              >{msgs[msgIdx]}</motion.p>
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs text-pink-300 uppercase tracking-widest text-center mb-4">Scan Complete</p>
            <div className="flex flex-col gap-4 mb-4">
              {bars.map((b, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs text-white/80 mb-1">
                    <span>{b.label}</span><span>{b.value}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${b.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${b.value}%` }}
                      transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-2.5 text-center mb-4"
            >
              <p className="text-pink-300 text-xs">{verdict}</p>
            </motion.div>
            <Btn onClick={onNext}>Continue</Btn>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
