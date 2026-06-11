import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card, { Btn } from "../ui";
import { useGame } from "../GameState";
import { HardDrive, RotateCcw, ShieldAlert } from "lucide-react";

const steps = [10, 25, 57, 89];

function useProgress(run) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (idx >= steps.length - 1) return;
    const t = setTimeout(() => setIdx((p) => p + 1), 900);
    return () => clearTimeout(t);
  }, [idx, run]);
  return steps[idx];
}

export default function ScreenPersonalityDownload({ onNext }) {
  const { unlock, awardRandom } = useGame();
  const [phase, setPhase] = useState("downloading"); // downloading | glitch | error | retry | denied
  const [runProgress, setRunProgress] = useState(true);
  const [glitch, setGlitch] = useState(false);
  const progress = useProgress(runProgress && phase === "downloading");

  useEffect(() => {
    if (progress === 89 && phase === "downloading") {
      setTimeout(() => {
        setGlitch(true);
        setRunProgress(false);
        setTimeout(() => { setGlitch(false); setPhase("error"); }, 1200);
      }, 800);
    }
  }, [progress, phase]);

  const handleRetry = () => {
    setPhase("retry");
    setTimeout(() => { setPhase("denied"); unlock("download"); awardRandom(); }, 1800);
  };

  return (
    <Card>
      <p className="text-xs text-pink-300 uppercase tracking-widest mb-3 text-center">System Access</p>

      <AnimatePresence mode="wait">
        {(phase === "downloading" || phase === "glitch") && (
          <motion.div key="dl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-2">
            <motion.div
              animate={glitch ? { x: [-4, 4, -4, 4, 0], skewX: [-5, 5, 0] } : {}}
              transition={{ duration: 0.3, repeat: glitch ? 2 : 0 }}
              className="flex justify-center mb-4"
            >
              <HardDrive size={40} className="text-yellow-400" strokeWidth={2} />
            </motion.div>
            <h2 className="text-white font-bold text-base mb-5">
              {glitch ? <span className="text-red-400 font-mono">GL!TCH D3T3CT3D...</span> : "Downloading Personality..."}
            </h2>
            <div className="mb-2">
              <div className="flex justify-between text-xs text-white/60 mb-1">
                <span>{glitch ? "ERROR" : "Progress"}</span>
                <span className={glitch ? "text-red-400 animate-pulse" : ""}>{progress}%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${glitch ? "bg-red-500" : "bg-gradient-to-r from-pink-400 to-purple-500"}`}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {phase === "error" && (
          <motion.div key="error" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
            <div className="flex justify-center text-4xl mb-3">
              <XCircle size={48} className="text-red-400" strokeWidth={1.5} />
            </div>
            <p className="text-white font-bold text-lg mb-2">ERROR ❌</p>
            <div className="bg-red-500/10 border border-red-400/20 rounded-2xl p-3 mb-5">
              <p className="text-red-300 text-sm">Subject denied access.</p>
            </div>
            <Btn onClick={handleRetry}>Try Again</Btn>
          </motion.div>
        )}

        {phase === "retry" && (
          <motion.div key="retry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-8">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} className="flex justify-center mb-4">
              <RotateCcw size={40} className="text-purple-400" strokeWidth={2} />
            </motion.div>
            <p className="text-purple-200 text-sm">Retrying access...</p>
          </motion.div>
        )}

        {phase === "denied" && (
          <motion.div key="denied" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
            <div className="flex justify-center text-4xl mb-3">
              <ShieldAlert size={48} className="text-red-400" strokeWidth={1.5} />
            </div>
            <p className="text-white font-bold text-base mb-2">Subject denied access again 😂</p>
            <div className="bg-purple-500/10 border border-purple-400/20 rounded-2xl p-3 mb-5">
              <p className="text-purple-300 text-sm">Personality remains classified.</p>
            </div>
            <Btn onClick={onNext}>Continue</Btn>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
