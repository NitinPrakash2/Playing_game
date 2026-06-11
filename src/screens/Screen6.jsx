import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card, { OptionBtn, Btn } from "../ui";
import { useGame } from "../GameState";

const options = [
  {
    label: "Haan yaad hai 😎",
    tag: "✅ Verified",
    emoji: "🧠",
    resp: "Memory functional. This is suspicious. Normal people forget things. Investigation team concerned.",
    note: "Memory status: Unnaturally good.",
    color: "from-green-400 to-teal-400",
    val: 95,
  },
  {
    label: "Nahi yaad 😭",
    tag: "📋 Noted",
    emoji: "😅",
    resp: "Expected response. Investigation team was betting on this. Memory unit: partially offline.",
    note: "Memory status: Selectively unavailable.",
    color: "from-yellow-400 to-orange-400",
    val: 38,
  },
  {
    label: "Kaunsa page? 🤨",
    tag: "🐠 Goldfish Mode",
    emoji: "🐠",
    resp: "Goldfish memory detected. You started this app 5 minutes ago. Investigation team is in shock.",
    note: "Memory status: Factory reset recommended.",
    color: "from-blue-400 to-cyan-400",
    val: 4,
  },
];

export default function Screen6({ onNext }) {
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
      <p className="text-xs text-pink-300 uppercase tracking-widest mb-2 text-center">Memory Test 🧠</p>
      <h2 className="text-white font-bold text-base mb-4 text-center leading-snug">
        Kya tumhe pehla page yaad hai?
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
          <motion.div key={sel} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="bg-pink-500/15 border border-pink-400/25 rounded-2xl p-3 mb-3">
            <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5 }}
              className="text-3xl text-center mb-2">{opt.emoji}</motion.div>
            <p className="text-white/90 text-sm mb-2 text-center">{opt.resp}</p>
            <div className="flex justify-between text-xs text-white/50 mb-1">
              <span>Memory Level</span><span>{opt.val}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
              <motion.div className={`h-full rounded-full bg-gradient-to-r ${opt.color}`}
                initial={{ width: 0 }} animate={{ width: `${opt.val}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }} />
            </div>
            <p className="text-purple-300 text-xs italic text-center">{opt.note}</p>
          </motion.div>
        )}
        {locked && (
          <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-2 mb-3">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="text-2xl w-fit mx-auto mb-1">🔄</motion.div>
            <p className="text-purple-200 text-xs">Filing response...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {opt && !locked && <Btn onClick={confirm}>Submit Response</Btn>}
    </Card>
  );
}
