import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card, { Btn } from "../ui";
import { useGame } from "../GameState";

const verdictMsgs = [
  "Generating Final Verdict...",
  "Reviewing all evidence...",
  "Consulting senior investigators...",
  "Finalizing report...",
];

function ConfettiBurst({ onDone }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const pieces = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: -10,
      r: Math.random() * 5 + 2,
      d: Math.random() * 3 + 1.5,
      color: ["#f9a8d4","#c084fc","#fde68a","#6ee7b7","#93c5fd"][Math.floor(Math.random()*5)],
      tilt: Math.random() * 10 - 5,
    }));
    let id;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.fill();
        p.y += p.d; p.tilt += 0.1; p.x += Math.sin(p.tilt) * 1.5;
        if (p.y > canvas.height) p.y = -10;
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    const t = setTimeout(() => { cancelAnimationFrame(id); onDone?.(); }, 3000);
    return () => { cancelAnimationFrame(id); clearTimeout(t); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 5 }}
    />
  );
}

function AnimatedCounter({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let current = 0;
    const step = Math.ceil(value / 30);
    const iv = setInterval(() => {
      current = Math.min(current + step, value);
      setDisplay(current);
      if (current >= value) clearInterval(iv);
    }, 40);
    return () => clearInterval(iv);
  }, [value]);
  return <span>{display}</span>;
}

export default function ScreenFinal() {
  const { score = { curiosity: 0, patience: 0, mystery: 0, skill: 0 }, unlocked = [], unlock } = useGame();
  const [phase, setPhase] = useState("report");
  const [msgIdx, setMsgIdx] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const total = score.curiosity + score.patience + score.mystery + score.skill;

  useEffect(() => { unlock("survived"); }, []);

  const startVerdict = () => {
    setPhase("loading");
    const iv = setInterval(() => setMsgIdx((p) => (p + 1) % verdictMsgs.length), 750);
    setTimeout(() => { clearInterval(iv); setPhase("verdict"); setShowConfetti(true); }, 3000);
  };

  return (
    <div className="relative z-10 w-full max-w-sm mx-auto">
      {showConfetti && <ConfettiBurst onDone={() => setShowConfetti(false)} />}
      <Card>
        <AnimatePresence mode="wait">

          {phase === "report" && (
            <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                className="text-4xl text-center mb-3">✅</motion.div>
              <h2 className="text-white font-bold text-center text-lg mb-4">INVESTIGATION COMPLETE ✅</h2>
              <div className="bg-black/30 rounded-2xl p-4 font-mono text-sm mb-4 space-y-2">
                {[
                  ["Human",       "Confirmed ✔",           "text-green-400"],
                  ["Mystery",     "Confirmed ✔",           "text-purple-400"],
                  ["Reply Speed", "🔒 Classified",          "text-yellow-400"],
                  ["Akdu Status", "🤨 Under Investigation", "text-orange-400"],
                ].map(([k, v, c], i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }} className="flex justify-between text-white/80">
                    <span>{k}:</span><span className={c}>{v}</span>
                  </motion.div>
                ))}
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                <Btn onClick={startVerdict}>Generate Final Verdict 🔍</Btn>
              </motion.div>
            </motion.div>
          )}

          {phase === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-8">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                className="text-4xl mb-5 w-fit mx-auto">🔍</motion.div>
              <AnimatePresence mode="wait">
                <motion.p key={msgIdx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  className="text-purple-200 text-sm font-medium">{verdictMsgs[msgIdx]}</motion.p>
              </AnimatePresence>
            </motion.div>
          )}

          {phase === "verdict" && (
            <motion.div key="verdict" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }} className="text-center">
              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: 2 }}
                className="text-5xl mb-4">🎉</motion.div>
              <p className="text-white/60 text-xs uppercase tracking-widest mb-2">After extensive investigation...</p>
              <p className="text-white font-bold text-base mb-2 leading-snug">
                We have successfully confirmed that<br />
                <span className="text-pink-300">you are indeed a human 🎉</span>
              </p>
              <div className="bg-green-500/10 border border-green-400/20 rounded-2xl p-3 mb-5">
                <p className="text-green-300 text-sm">Verification: Complete ✔</p>
              </div>
              <Btn onClick={() => setPhase("score")}>See Investigation Score 📊</Btn>
            </motion.div>
          )}

          {phase === "score" && (
            <motion.div key="score" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-xs text-pink-300 uppercase tracking-widest text-center mb-4">Hidden Score Revealed 📊</p>
              <div className="bg-black/30 rounded-2xl p-4 font-mono text-sm mb-4 space-y-2">
                {[
                  ["Curiosity",           score.curiosity, "text-yellow-300"],
                  ["Patience",            score.patience,  "text-green-300"],
                  ["Mystery Resistance",  score.mystery,   "text-purple-300"],
                  ["Investigation Skill", score.skill,     "text-blue-300"],
                ].map(([k, v, c], i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12 }} className="flex justify-between text-white/80">
                    <span>{k}</span>
                    <span className={`font-bold ${c}`}><AnimatedCounter value={v} /></span>
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                  className="border-t border-white/10 pt-2 flex justify-between text-white font-bold">
                  <span>Total Score</span>
                  <span className="text-pink-300"><AnimatedCounter value={total} /></span>
                </motion.div>
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                <Btn onClick={() => setPhase("achievements")}>View Achievements 🏆</Btn>
              </motion.div>
            </motion.div>
          )}

          {phase === "achievements" && (
            <motion.div key="achievements" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-xs text-yellow-300 uppercase tracking-widest text-center mb-3 font-bold">
                Achievements Unlocked 🏆
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {unlocked.map((a, i) => (
                  <motion.div key={a.id} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-yellow-500/10 border border-yellow-400/20 rounded-2xl p-2.5 text-center">
                    <div className="text-xl mb-1">{a.icon}</div>
                    <p className="text-white text-xs font-semibold leading-tight">{a.title}</p>
                  </motion.div>
                ))}
              </div>
              <Btn onClick={() => setPhase("closed")}>Close Case 📂</Btn>
            </motion.div>
          )}

          {phase === "closed" && (
            <motion.div key="closed" initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }} className="text-center py-6">
              <motion.div animate={{ rotate: [0, -5, 5, -5, 0] }} transition={{ duration: 0.5, repeat: 2 }}
                className="text-5xl mb-4">😌</motion.div>
              <p className="text-white font-bold text-lg mb-1">Investigation archived.</p>
              <p className="text-purple-300 text-sm mb-1">Subject remains interesting.</p>
              <p className="text-pink-300 text-sm mb-5">Goodbye 👋</p>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                <p className="text-white/50 text-xs italic">
                  "Thanks for surviving this completely unnecessary investigation."
                </p>
                <p className="text-purple-300 text-xs mt-1 font-medium">Case Closed 📂 · Have a nice day, Verified Human 😌✨</p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </Card>
    </div>
  );
}
