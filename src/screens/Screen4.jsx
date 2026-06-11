import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card, { OptionBtn, Btn } from "../ui";
import { useGame } from "../GameState";

const options = [
  {
    label: "Ye jhooth hai 😤",
    tag: "🚨 Denial Detected",
    resp: "Classic denial response. Investigation team expected this. Akdu meter just went up 12 points.",
    evidence: 82,
    evidenceLabel: "Akdu Meter",
    color: "from-red-400 to-pink-500",
  },
  {
    label: "Thoda sa 😌",
    tag: "✅ Partial Confession",
    resp: "Partial confession accepted. Honesty level surprisingly high. Akdu status: confirmed but manageable.",
    evidence: 45,
    evidenceLabel: "Akdu Meter",
    color: "from-yellow-400 to-orange-400",
  },
  {
    label: "Evidence destroy karo 🚨",
    tag: "🔒 Obstruction Logged",
    resp: "Too late. Screenshots already saved in the imagination folder. Evidence destruction attempt: noted.",
    evidence: 99,
    evidenceLabel: "Suspicion Level",
    color: "from-purple-400 to-red-500",
  },
];

export default function Screen4({ onNext }) {
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
      <p className="text-xs text-pink-300 uppercase tracking-widest mb-3 text-center">Rumour Investigation 🕵️</p>
      <h2 className="text-white font-bold text-base mb-4 text-center leading-snug">
        Rumours say tum thodi si akdu ho.
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
            className="bg-pink-500/15 border border-pink-400/25 rounded-2xl p-3 mb-3">
            <p className="text-white/90 text-sm mb-2">{opt.resp}</p>
            <div className="flex justify-between text-xs text-white/50 mb-1">
              <span>{opt.evidenceLabel}</span><span>{opt.evidence}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div className={`h-full rounded-full bg-gradient-to-r ${opt.color}`}
                initial={{ width: 0 }} animate={{ width: `${opt.evidence}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }} />
            </div>
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
