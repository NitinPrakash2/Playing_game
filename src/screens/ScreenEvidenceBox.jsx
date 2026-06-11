import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card, { Btn } from "../ui";
import { useGame } from "../GameState";
import { Package } from "lucide-react";

const items = [
  { emoji: "🍕", title: "Pizza Coupon", sub: "Expired" },
  { emoji: "🐱", title: "Approved Cat Photo", sub: "Classified" },
  { emoji: "🎧", title: "Mystery Playlist", sub: "Lost" },
  { emoji: "📄", title: "Empty Government Document", sub: "Very Official" },
  { emoji: "☕", title: "Emergency Chai Pass", sub: "Priority Access" },
  { emoji: "🎮", title: "Suspicious Gaming Record", sub: "Under Investigation" },
];

export default function ScreenEvidenceBox({ onNext }) {
  const { unlock, awardRandom } = useGame();
  const [opened, setOpened] = useState(false);
  const [item] = useState(() => items[Math.floor(Math.random() * items.length)]);

  return (
    <Card>
      <p className="text-xs text-pink-300 uppercase tracking-widest mb-2 text-center">Case #4729-B</p>
      <h2 className="text-white font-bold text-lg text-center mb-1">Confidential Evidence Box</h2>
      <p className="text-purple-200 text-sm text-center mb-5">We found a secret item.</p>

      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div key="closed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="text-center">
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, -3, 3, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className=""
            >
              <Package size={64} className="text-yellow-400 mx-auto" strokeWidth={1.5} />
            </motion.div>
            <Btn onClick={() => { setOpened(true); unlock("evidence"); awardRandom(); }}>Open Box</Btn>
          </motion.div>
        ) : (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.6, repeat: 2 }}
              className="text-6xl mb-3"
            >{item.emoji}</motion.div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 mb-5">
              <p className="text-white font-bold text-base mb-1">{item.title}</p>
              <span className="inline-block bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 text-xs px-3 py-1 rounded-full">
                Status: {item.sub}
              </span>
            </div>
            <p className="text-purple-300 text-xs mb-5">Evidence logged. Investigation continues.</p>
            <Btn onClick={onNext}>Continue Investigation</Btn>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
