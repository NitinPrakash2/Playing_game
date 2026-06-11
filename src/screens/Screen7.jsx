import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card, { Btn } from "../ui";
import { useGame } from "../GameState";
import { Lock } from "lucide-react";

const lines = [
  { text: "PRIYA.EXE", style: "text-green-400 font-bold text-lg" },
  { text: "> Human: Confirmed ✔", style: "text-green-300" },
  { text: "> Mystery: Very High ✔", style: "text-purple-300" },
  { text: "> Reply Speed: Classified 🔒", style: "text-yellow-300" },
  { text: "> Cuteness Level: Access Denied 🚫", style: "text-pink-300" },
  { text: "> Akdu Level: Evidence Inconclusive 🤨", style: "text-blue-300" },
];

function TypingLine({ text, style, onDone }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) { clearInterval(iv); onDone?.(); }
    }, 28);
    return () => clearInterval(iv);
  }, []);

  return <div className={`mb-1.5 font-mono text-sm ${style}`}>{displayed}<span className="animate-pulse">▌</span></div>;
}

export default function Screen7({ onNext }) {
  const [opened, setOpened] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [showFooter, setShowFooter] = useState(false);

  const { unlock, awardRandom } = useGame();

  const revealNext = () => {
    setVisibleLines((p) => {
      const next = p + 1;
      if (next >= lines.length) setTimeout(() => { setShowFooter(true); unlock("secretfile"); awardRandom(); }, 400);
      return next;
    });
  };

  return (
    <Card>
      <p className="text-xs text-pink-300 uppercase tracking-widest mb-3 text-center">Secret File Found 🔒</p>
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-6">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex justify-center mb-6"
            >
              <Lock size={48} className="text-pink-400" strokeWidth={1.5} />
            </motion.div>
            <Btn onClick={() => { setOpened(true); setVisibleLines(1); }}>Open File</Btn>
          </motion.div>
        ) : (
          <motion.div key="terminal" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-black/50 rounded-2xl p-4 font-mono text-sm mb-4 border border-green-500/30 min-h-[160px]">
              {lines.slice(0, visibleLines).map((l, i) => (
                <TypingLine
                  key={i}
                  text={l.text}
                  style={l.style}
                  onDone={i === visibleLines - 1 && visibleLines < lines.length ? revealNext : undefined}
                />
              ))}
            </div>
            <AnimatePresence>
              {showFooter && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <p className="text-purple-200 text-sm text-center mb-1">Government records are incomplete.</p>
                  <p className="text-pink-300 text-sm text-center mb-4">Further investigation required 😌</p>
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
