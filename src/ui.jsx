import { motion } from "framer-motion";

export const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.42, ease: "easeOut" } },
  exit: { opacity: 0, y: -30, scale: 0.95, transition: { duration: 0.28 } },
};

export default function Card({ children, className = "" }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-5 w-full max-w-sm mx-auto ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function Btn({ children, onClick, className = "", disabled = false }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 rounded-2xl font-semibold text-white text-base bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg active:opacity-90 transition-opacity touch-manipulation select-none ${disabled ? "opacity-40 pointer-events-none" : ""} ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function OptionBtn({ children, onClick, selected }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`w-full text-left py-3.5 px-4 rounded-2xl border transition-colors duration-150 touch-manipulation select-none text-sm text-white
        ${selected
          ? "border-pink-400 bg-pink-500/30"
          : "border-white/20 bg-white/5 active:bg-white/15"}`}
    >
      {children}
    </motion.button>
  );
}
