import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card, { Btn } from "../ui";
import { useGame } from "../GameState";

const questions = [
  "Kya tum kabhi boring nahi hoti? 🤔",
  "Kya tumhara phone battery 20% se upar rehti hai? 🔋",
  "Kya tum notifications turant check karti ho? 📳",
  "Kya tum actually productive hoti kabhi kabhi? 💼",
];

const answers = {
  yes: [
    { resp: "LIE DETECTED 📈 Stress graph went vertical. Investigation team skeptical.", stress: 91, label: "Deception Index" },
    { resp: "Impossible. Government records show otherwise. Case noted.", stress: 78, label: "Suspicion Level" },
    { resp: "Bold claim. Zero evidence found to support this. Filing under: Unverified.", stress: 83, label: "Doubt Level" },
    { resp: "Surprisingly believable. But investigation team is still watching.", stress: 44, label: "Trust Level" },
  ],
  no: [
    { resp: "HONESTY DETECTED ✅ Rare trait. Investigation team impressed. Slightly.", stress: 12, label: "Honesty Index" },
    { resp: "Confirmed. This matches all available satellite data.", stress: 8, label: "Deception Index" },
    { resp: "Fair enough. Case marked as: Realistic Human Behaviour.", stress: 15, label: "Suspicion Level" },
    { resp: "Appreciated. Rare moment of transparency. Logged.", stress: 20, label: "Doubt Level" },
  ],
};

// Animated stress line using canvas
function StressGraph({ value, animate: doAnimate }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = 56;
    const points = [];
    let t = 0;
    let id;

    const baseY = H * 0.6;
    const amplitude = doAnimate ? (value / 100) * (H * 0.38) : H * 0.06;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = value > 60 ? "#f87171" : "#4ade80";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 6;
      ctx.shadowColor = value > 60 ? "#f87171" : "#4ade80";
      ctx.beginPath();
      for (let x = 0; x < W; x++) {
        const freq = doAnimate ? 0.05 + (value / 100) * 0.08 : 0.04;
        const y = baseY - Math.sin((x + t) * freq) * amplitude
          - Math.sin((x + t) * freq * 2.3) * (amplitude * 0.3);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      t += doAnimate ? 2.5 : 0.8;
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [value, doAnimate]);

  return <canvas ref={canvasRef} className="w-full" style={{ height: 56 }} />;
}

export default function ScreenLieDetector({ onNext }) {
  const { awardRandom } = useGame();
  const [phase, setPhase] = useState("idle"); // idle | scanning | result
  const [result, setResult] = useState(null);
  const [qIdx] = useState(() => Math.floor(Math.random() * questions.length));

  const answer = (choice) => {
    setPhase("scanning");
    setTimeout(() => {
      const pool = answers[choice];
      setResult(pool[qIdx % pool.length]);
      setPhase("result");
      awardRandom();
    }, 2200);
  };

  return (
    <Card>
      <p className="text-xs text-pink-300 uppercase tracking-widest mb-2 text-center">Lie Detector Test 🔴</p>
      <h2 className="text-white font-bold text-base text-center mb-4">
        {questions[qIdx]}
      </h2>

      {/* Live stress graph — always visible */}
      <div className="bg-black/40 border border-white/10 rounded-2xl px-3 pt-2 pb-1 mb-4">
        <p className="text-white/30 text-xs mb-1">Live Stress Monitor</p>
        <StressGraph
          value={phase === "result" ? result.stress : phase === "scanning" ? 85 : 18}
          animate={phase !== "idle"}
        />
        <p className="text-white/20 text-xs text-right mt-0.5">
          {phase === "idle" ? "Baseline normal" : phase === "scanning" ? "Analyzing..." : `${result.label}: ${result.stress}%`}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex gap-2">
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => answer("yes")}
              className="flex-1 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-green-500 to-teal-500 touch-manipulation">
              Haan ✅
            </motion.button>
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => answer("no")}
              className="flex-1 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 touch-manipulation">
              Nahi ❌
            </motion.button>
          </motion.div>
        )}

        {phase === "scanning" && (
          <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center py-2">
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}
              className="text-3xl mb-2">🔴</motion.div>
            <p className="text-red-300 text-sm font-medium">Analyzing response...</p>
          </motion.div>
        )}

        {phase === "result" && result && (
          <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}>
            <div className={`rounded-2xl p-3 mb-4 text-center ${result.stress > 50
              ? "bg-red-500/15 border border-red-400/25"
              : "bg-green-500/15 border border-green-400/25"}`}>
              <p className="text-white text-sm">{result.resp}</p>
            </div>
            <Btn onClick={onNext}>Continue</Btn>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
