import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card, { OptionBtn, Btn } from "../ui";
import { useGame } from "../GameState";
import Spinner from "../Spinner";
import { AlertCircle, Lock, BarChart3, Eye } from "lucide-react";

const options = [
  {
    label: "Turant reply karti ho",
    tag: AlertCircle,
    tagText: "Suspicious",
    resp: "Turant reply? Investigation team is alarmed. Too fast. Definitely hiding something.",
    bars: [
      { label: "Reply Speed", value: 98, color: "from-green-400 to-teal-400" },
      { label: "Suspicion Level", value: 91, color: "from-red-400 to-pink-400" },
      { label: "Mystery Level", value: 22, color: "from-purple-400 to-indigo-400" },
    ],
  },
  {
    label: "Thodi der baad reply karti ho",
    tag: BarChart3,
    tagText: "Normal",
    resp: "Thodi der baad. Classic. Pretending to be busy. We see through this strategy.",
    bars: [
      { label: "Reply Speed", value: 54, color: "from-yellow-400 to-orange-400" },
      { label: "Busy Pretending", value: 76, color: "from-pink-400 to-rose-400" },
      { label: "Mystery Level", value: 58, color: "from-purple-400 to-indigo-400" },
    ],
  },
  {
    label: "Bahut der baad reply karti ho",
    tag: Eye,
    tagText: "Classic",
    resp: "Bahut der baad. International mystery detected. Experts are already confused.",
    bars: [
      { label: "Reply Speed", value: 8, color: "from-red-400 to-rose-500" },
      { label: "Mystery Level", value: 89, color: "from-purple-400 to-indigo-400" },
      { label: "Experts Confused", value: 95, color: "from-yellow-400 to-orange-400" },
    ],
  },
  {
    label: "Reply karne ka sochti ho",
    tag: Lock,
    tagText: "Classified",
    resp: "Sochti ho but reply nahi. This is an advanced-level disappearing act. Respect.",
    bars: [
      { label: "Reply Speed", value: 1, color: "from-gray-400 to-slate-400" },
      { label: "Ghost Level", value: 99, color: "from-blue-400 to-cyan-400" },
      { label: "Mystery Level", value: 100, color: "from-purple-400 to-pink-400" },
    ],
  },
];

export default function Screen2({ onNext }) {
  const { unlock, awardRandom } = useGame();
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);

  const pick = (i) => {
    if (locked) return;
    setSelected(i);
  };

  const confirm = () => {
    setLocked(true);
    unlock("q1");
    awardRandom();
    setTimeout(() => onNext(selected), 1800);
  };

  const opt = selected !== null ? options[selected] : null;

  return (
    <Card>
      <p className="text-xs text-pink-300 uppercase tracking-widest mb-3 text-center">Question 1</p>
      <h2 className="text-white font-bold text-base mb-4 text-center leading-snug">
        Jab koi 'Hi' bhejta hai to tum generally...
      </h2>

      <div className="flex flex-col gap-2 mb-4">
        {options.map((o, i) => {
          const TagIcon = o.tag;
          return (
            <OptionBtn key={i} onClick={() => pick(i)} selected={selected === i}>
              <span>{o.label}</span>
              {selected === i && (
                <span className="ml-2 text-xs text-pink-300 flex items-center gap-1">
                  <TagIcon size={14} />
                  {o.tagText}
                </span>
              )}
            </OptionBtn>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {opt && !locked && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.22 }}
            className="bg-purple-500/20 border border-purple-400/30 rounded-2xl p-3 text-center mb-3"
          >
            <p className="text-white/90 text-sm">{opt.resp}</p>
          </motion.div>
        )}
        {locked && (
          <motion.div
            key="locked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-2 mb-3"
          >
            <Spinner size={28} color="text-purple-400" className="mb-2" />
            <p className="text-purple-200 text-xs">Analyzing response...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {opt && !locked && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <Btn onClick={confirm} icon={Lock}>Lock In Answer</Btn>
        </motion.div>
      )}
    </Card>
  );
}
