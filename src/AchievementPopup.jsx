import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "./GameState";

export default function AchievementPopup() {
  const { queue, dismissFirst } = useGame();
  const current = queue[0];

  useEffect(() => {
    if (!current) return;
    const t = setTimeout(dismissFirst, 3200);
    return () => clearTimeout(t);
  }, [current]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs px-4 pointer-events-none">
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: -20, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border border-yellow-400/40 rounded-2xl px-4 py-3 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <motion.span
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
                className="text-2xl"
              >{current.icon}</motion.span>
              <div>
                <p className="text-yellow-300 text-xs font-bold uppercase tracking-widest">Achievement Unlocked</p>
                <p className="text-white text-sm font-semibold">{current.title}</p>
                <p className="text-white/50 text-xs">{current.desc}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
