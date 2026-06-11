import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card, { Btn } from "../ui";
import { useGame } from "../GameState";

function useConfetti(ref, active) {
  useEffect(() => {
    if (!active) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const pieces = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: -10,
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
    const t = setTimeout(() => cancelAnimationFrame(id), 2500);
    return () => { cancelAnimationFrame(id); clearTimeout(t); };
  }, [active]);
}

export default function ScreenCertificate({ onNext }) {
  const { unlock, awardRandom } = useGame();
  const [claimed, setClaimed] = useState(false);
  const canvasRef = useRef(null);
  useConfetti(canvasRef, claimed);

  const claim = () => {
    setClaimed(true);
    unlock("certificate");
    awardRandom();
    setTimeout(onNext, 2800);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {claimed && (
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 5 }} />
      )}
      <Card>
        <p className="text-xs text-yellow-300 uppercase tracking-widest mb-3 text-center font-bold">🏛️ Official Document</p>

        {/* Certificate card */}
        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-2xl p-4 mb-4">
          <p className="text-yellow-300 font-bold text-center text-base mb-3">Official Verification Certificate</p>
          <div className="space-y-2 font-mono text-sm">
            {[
              ["Name",              "Unknown Subject",          "text-white"],
              ["Human Status",      "Confirmed ✔",              "text-green-400"],
              ["Danger Level",      "Low",                      "text-blue-300"],
              ["Mystery Level",     "High",                     "text-purple-300"],
              ["Investigation",     "Passed ✔",                 "text-green-400"],
            ].map(([k, v, c], i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }} className="flex justify-between text-white/70">
                <span>{k}:</span><span className={c}>{v}</span>
              </motion.div>
            ))}
          </div>
          {/* Gold badge */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.7 }}
            className="text-center mt-4"
          >
            <span className="text-4xl">🏆</span>
            <p className="text-yellow-300 text-xs font-bold mt-1">Officially Verified Human</p>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {!claimed ? (
            <motion.div key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Btn onClick={claim} className="bg-gradient-to-r from-yellow-500 to-orange-500">Claim Certificate 🎉</Btn>
            </motion.div>
          ) : (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-2">
              <p className="text-green-400 font-bold text-sm">Certificate Claimed! 🎉</p>
              <p className="text-white/50 text-xs mt-1">Proceeding to final report...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
