import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card, { Btn } from "../ui";
import { useGame } from "../GameState";

const statements = [
  "I saw nothing.",
  "Subject seems normal. Mostly.",
  "Reply speed remains unknown.",
  "No comments without lawyer.",
  "Investigation getting complicated.",
  "I was also confused. Still am.",
];

function Typewriter({ text, onDone }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) { clearInterval(iv); setTimeout(() => onDone?.(), 400); }
    }, 45);
    return () => clearInterval(iv);
  }, [text]);

  return (
    <span className="text-white font-medium text-base">
      {displayed}
      {displayed.length < text.length && <span className="animate-pulse text-pink-400">|</span>}
    </span>
  );
}

export default function ScreenWitness({ onNext }) {
  const { unlock, awardRandom } = useGame();
  const [phase, setPhase] = useState("intro"); // intro | typing | done
  const [statement] = useState(() => statements[Math.floor(Math.random() * statements.length)]);

  return (
    <Card>
      <p className="text-xs text-pink-300 uppercase tracking-widest mb-2 text-center">Official Testimony</p>
      <h2 className="text-white font-bold text-lg text-center mb-1">Witness Interview 🎤</h2>
      <p className="text-purple-200 text-sm text-center mb-5">We interviewed a witness.</p>

      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <motion.div
              animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="text-5xl mb-6"
            >🕵️</motion.div>
            <Btn onClick={() => { setPhase("typing"); unlock("witness"); awardRandom(); }}>Show Statement</Btn>
          </motion.div>
        )}

        {(phase === "typing" || phase === "done") && (
          <motion.div key="statement" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="bg-black/30 border border-white/20 rounded-2xl p-5 mb-2 min-h-[80px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-purple-300 text-xs mb-2 uppercase tracking-widest">Witness Statement:</p>
                <Typewriter text={`"${statement}"`} onDone={() => setPhase("done")} />
              </div>
            </div>
            <p className="text-white/40 text-xs mb-5 text-center italic">— Anonymous Witness, Investigation File</p>
            <AnimatePresence>
              {phase === "done" && (
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
