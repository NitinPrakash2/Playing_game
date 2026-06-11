import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card, { OptionBtn, Btn } from "../ui";
import { useGame } from "../GameState";
import { RotateCw } from "lucide-react";

const options = [
  {
    label: "Sona 😴",
    tag: "💤 Sleep Expert",
    resp: "Sleep selected. Investigation team was not surprised. Sleep efficiency: government-certified.",
    stat: { label: "Productivity Level", value: 3, color: "from-blue-400 to-indigo-500" },
    verdict: "Napping is a personality. Respect.",
  },
  {
    label: "Reels 📱",
    tag: "📱 Screen Addict",
    resp: "Reels. Of course. Investigation team has been watching you scroll for the past 2 hours.",
    stat: { label: "Screen Time Index", value: 94, color: "from-pink-400 to-rose-500" },
    verdict: "Just 5 more minutes... said 47 times.",
  },
  {
    label: "Padhna 📚",
    tag: "🧠 Suspicious",
    resp: "Padhna? Either genuinely intellectual or hiding something. Investigation continues.",
    stat: { label: "Suspicion Level", value: 61, color: "from-purple-400 to-violet-500" },
    verdict: "Too cultured. Needs further monitoring.",
  },
  {
    label: "Secret 🤫",
    tag: "🔒 Classified",
    resp: "Secret hobby detected. This is exactly what a mysterious person would say. Evidence logged.",
    stat: { label: "Mystery Level", value: 100, color: "from-purple-500 to-pink-500" },
    verdict: "File sealed. Investigation team crying.",
  },
];

export default function Screen5({ onNext }) {
  const { awardRandom } = useGame();
  const [sel, setSel] = useState(null);
  const [locked, setLocked] = useState(false);

  const confirm = () => {
    setLocked(true);
    awardRandom();
    setTimeout(onNext, 1600);
  };

  const opt = sel !== null ? options[sel] : null;

  return (
    <Card>
      <p className="text-xs text-pink-300 uppercase tracking-widest mb-3 text-center">Field Research 🔬</p>
      <h2 className="text-white font-bold text-base mb-4 text-center leading-snug">
        Tumhara favourite hobby kya hai?
      </h2>
      <div className="flex flex-col gap-2 mb-3">
        {options.map((o, i) => (
          <OptionBtn key={i} onClick={() => { if (!locked) setSel(i); }} selected={sel === i}>
            <span>{o.label}</span>
            {sel === i && <span className="ml-2 text-xs text-pink-300">{o.tag}</span>}
          </OptionBtn>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {opt && !locked && (
          <motion.div key={sel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="bg-purple-500/15 border border-purple-400/25 rounded-2xl p-3 mb-3">
            <p className="text-white/90 text-sm mb-2">{opt.resp}</p>
            <div className="flex justify-between text-xs text-white/50 mb-1">
              <span>{opt.stat.label}</span><span>{opt.stat.value}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
              <motion.div className={`h-full rounded-full bg-gradient-to-r ${opt.stat.color}`}
                initial={{ width: 0 }} animate={{ width: `${opt.stat.value}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }} />
            </div>
            <p className="text-pink-300 text-xs italic">{opt.verdict}</p>
          </motion.div>
        )}
        {locked && (
          <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-2 mb-3">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="flex justify-center mb-1">
              <RotateCw size={24} className="text-purple-400" strokeWidth={2} />
            </motion.div>
            <p className="text-purple-200 text-xs">Filing response...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {opt && !locked && <Btn onClick={confirm}>Submit Response</Btn>}
    </Card>
  );
}
