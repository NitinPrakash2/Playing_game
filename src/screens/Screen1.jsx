import { useEffect } from "react";
import { motion } from "framer-motion";
import Card, { Btn } from "../ui";
import { useGame } from "../GameState";
import { Search, Wand2 } from "lucide-react";

export default function Screen1({ onNext, answers }) {
  const { unlock } = useGame();
  const userName = answers?.[0] || "Priya";
  useEffect(() => { unlock("start"); }, []);
  return (
    <Card>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="flex justify-center mb-4"
      >
        <Search size={48} className="text-pink-400" strokeWidth={1.5} />
      </motion.div>
      <h1 className="text-2xl font-bold text-center text-white mb-2">
        Welcome {userName}
      </h1>
      <p className="text-purple-200 text-center text-sm mb-1">
        Hame lagta hai tum secretly ek human ho.
      </p>
      <p className="text-pink-300 text-center text-sm font-medium mb-6">
        Verification required.
      </p>
      <Btn onClick={onNext} icon={Wand2}>Prove It</Btn>
    </Card>
  );
}
