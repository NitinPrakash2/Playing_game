import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card, { Btn } from "../ui";
import { useGame } from "../GameState";
import { RotateCw, XCircle } from "lucide-react";

const emojis = ["🐱", "🍕", "🌙", "🐶", "🎧", "☕", "📚", "🎮", "🌧️"];

export default function ScreenCaptcha({ onNext }) {
  const { unlock, awardRandom } = useGame();
  const [selected, setSelected] = useState(new Set());
  const [phase, setPhase] = useState("select"); // select | loading | failed | done
  const [shake, setShake] = useState(false);

  const toggle = (i) => {
    if (phase !== "select") return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const verify = () => {
    setPhase("loading");
    setTimeout(() => {
      setPhase("failed");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }, 2000);
  };

  return (
    <Card>
      <p className="text-xs text-pink-300 uppercase tracking-widest mb-2 text-center">Security Check 🔐</p>
      <h2 className="text-white font-bold text-base mb-1 text-center">CAPTCHA Verification 🤖</h2>
      <p className="text-purple-200 text-sm text-center mb-4">Select all images containing Priya.</p>

      <AnimatePresence mode="wait">
        {phase === "select" && (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {emojis.map((e, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggle(i)}
                  className={`aspect-square rounded-2xl text-3xl flex items-center justify-center border-2 transition-all cursor-pointer
                    ${selected.has(i) ? "border-pink-400 bg-pink-500/30" : "border-white/20 bg-white/5"}`}
                >
                  {e}
                </motion.button>
              ))}
            </div>
            <Btn onClick={verify} disabled={selected.size === 0}>Verify</Btn>
          </motion.div>
        )}

        {phase === "loading" && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-8">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} className="flex justify-center mb-4">
              <RotateCw size={40} className="text-purple-400" strokeWidth={2} />
            </motion.div>
            <p className="text-purple-200 text-sm">Searching for Priya...</p>
          </motion.div>
        )}

        {phase === "failed" && (
          <motion.div
            key="failed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={shake ? { x: [-8, 8, -8, 8, 0] } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-4"
          >
            <div className="flex justify-center mb-3">
              <XCircle size={48} className="text-red-400" strokeWidth={1.5} />
            </div>
            <p className="text-white font-bold text-lg mb-1">Verification Failed</p>
            <p className="text-purple-200 text-sm mb-2">Priya not found.</p>
            <div className="bg-yellow-500/10 border border-yellow-400/20 rounded-2xl p-3 mb-4">
              <p className="text-yellow-300 text-sm">Subject successfully hidden from the internet 😂</p>
            </div>
            <Btn onClick={() => { unlock("captcha"); awardRandom(); onNext(); }}>Continue</Btn>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
