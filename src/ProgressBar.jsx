import { motion } from "framer-motion";

const TOTAL = 13;

export default function ProgressBar({ step }) {
  return (
    <div className="w-full max-w-sm mx-auto mb-6 px-4">
      <div className="flex justify-between text-xs text-purple-300 mb-1">
        <span>Step {step} of {TOTAL}</span>
        <span>{Math.round((step / TOTAL) * 100)}%</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(step / TOTAL) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
