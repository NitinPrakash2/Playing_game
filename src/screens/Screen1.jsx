import { useEffect } from "react";
import { motion } from "framer-motion";
import Card, { Btn } from "../ui";
import { useGame } from "../GameState";

export default function Screen1({ onNext }) {
  const { unlock } = useGame();
  useEffect(() => { unlock("start"); }, []);
  return (
    <Card>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="text-5xl text-center mb-4"
      >
        🔍
      </motion.div>
      <h1 className="text-2xl font-bold text-center text-white mb-2">
        Welcome Priya 👋
      </h1>
      <p className="text-purple-200 text-center text-sm mb-1">
        Hame shak hai ki tum secretly ek human ho.
      </p>
      <p className="text-pink-300 text-center text-sm font-medium mb-6">
        Verification required.
      </p>
      <Btn onClick={onNext}>Prove It 😌</Btn>
    </Card>
  );
}
