import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Spinner({ size = 32, color = "text-purple-400", className = "" }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className={`w-fit mx-auto ${className}`}
      style={{ width: size, height: size }}
    >
      <Loader2 size={size} className={color} strokeWidth={2} />
    </motion.div>
  );
}
