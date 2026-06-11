import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card, { Btn } from "../ui";
import { useGame } from "../GameState";
import { RotateCcw, Zap } from "lucide-react";

const cardEmojis = ["🍕", "🍔", "🍟", "🌮", "🍜", "☕", "🍰", "🍪", "🎂", "🍓", "🍌", "🍎"];

export default function ScreenMemoryGame({ onNext }) {
  const { awardRandom, unlock } = useGame();
  const [phase, setPhase] = useState("start");
  const [difficulty, setDifficulty] = useState(0); // 0 = 4 pairs (8 cards), 1 = 6 pairs (12 cards)
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState(new Set());
  const [matched, setMatched] = useState(new Set());
  const [firstCard, setFirstCard] = useState(null);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [totalPairs, setTotalPairs] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(0);

  const initializeGame = (diff) => {
    setDifficulty(diff);
    const pairCount = diff === 0 ? 4 : 6;
    setTotalPairs(pairCount);
    const gameCards = [];
    for (let i = 0; i < pairCount; i++) {
      gameCards.push(cardEmojis[i], cardEmojis[i]);
    }
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped(new Set());
    setMatched(new Set());
    setFirstCard(null);
    setMoves(0);
    setMatchedPairs(0);
    setPhase("playing");
    setGameStarted(true);
    setTimer(0);
  };

  useEffect(() => {
    if (!gameStarted || phase !== "playing") return;
    const timer = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, [gameStarted, phase]);

  const handleCardClick = (index) => {
    if (flipped.has(index) || matched.has(index) || firstCard === index) return;

    const newFlipped = new Set(flipped);
    newFlipped.add(index);
    setFlipped(newFlipped);

    if (firstCard === null) {
      setFirstCard(index);
    } else {
      const newMoves = moves + 1;
      setMoves(newMoves);

      if (cards[firstCard] === cards[index]) {
        const newMatched = new Set(matched);
        newMatched.add(firstCard);
        newMatched.add(index);
        setMatched(newMatched);
        const newPairs = matchedPairs + 1;
        setMatchedPairs(newPairs);

        if (newPairs === totalPairs) {
          setTimeout(() => {
            setPhase("won");
            unlock("memory_game");
            awardRandom();
          }, 600);
        }

        setFirstCard(null);
        setFlipped(new Set());
      } else {
        setTimeout(() => {
          setFlipped(new Set());
          setFirstCard(null);
        }, 800);
      }
    }
  };

  return (
    <Card>
      <p className="text-xs text-pink-300 uppercase tracking-widest mb-2 text-center">Memory Game</p>

      <AnimatePresence mode="wait">
        {phase === "start" && (
          <motion.div key="start" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 2 }}
              className="flex justify-center mb-4">
              <RotateCcw size={48} className="text-purple-400" strokeWidth={1.5} />
            </motion.div>
            <h2 className="text-white font-bold text-lg text-center mb-2">Memory Challenge</h2>
            <p className="text-purple-200 text-sm text-center mb-4">
              Match all the pairs! Remember where each card is.
            </p>

            <div className="space-y-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => initializeGame(0)}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold text-sm">
                Easy (4 Pairs)
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => initializeGame(1)}
                className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold text-sm">
                Hard (6 Pairs)
              </motion.button>
            </div>
          </motion.div>
        )}

        {phase === "playing" && cards.length > 0 && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between mb-4">
              <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-2 text-center flex-1 mr-2">
                <p className="text-white/60 text-xs">Moves</p>
                <p className="text-purple-300 font-bold text-lg">{moves}</p>
              </div>
              <div className="bg-pink-500/20 border border-pink-400/30 rounded-lg p-2 text-center flex-1 mr-2">
                <p className="text-white/60 text-xs">Matched</p>
                <p className="text-pink-300 font-bold text-lg">{matchedPairs}/{totalPairs}</p>
              </div>
              <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-2 text-center flex-1">
                <p className="text-white/60 text-xs">Time</p>
                <p className="text-blue-300 font-bold text-lg">{timer}s</p>
              </div>
            </div>

            <div className={`grid gap-2 mb-4 ${difficulty === 0 ? "grid-cols-4" : "grid-cols-4"}`}>
              {cards.map((emoji, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleCardClick(index)}
                  whileTap={{ scale: 0.95 }}
                  className={`aspect-square rounded-xl font-bold text-2xl transition-all duration-200 ${
                    matched.has(index)
                      ? "bg-green-500/30 border-2 border-green-400/60"
                      : flipped.has(index) || firstCard === index
                      ? "bg-purple-500/40 border-2 border-purple-400/60"
                      : "bg-gradient-to-br from-pink-500/40 to-purple-500/40 border-2 border-pink-400/60 hover:border-purple-400"
                  }`}>
                  <motion.div
                    initial={{ rotateY: 180 }}
                    animate={{ rotateY: flipped.has(index) || matched.has(index) ? 0 : 180 }}
                    transition={{ duration: 0.3 }}
                    style={{ perspective: 1000 }}>
                    {(flipped.has(index) || matched.has(index)) ? emoji : "?"}
                  </motion.div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "won" && (
          <motion.div key="won" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 18 }} className="text-center">
            <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.6, repeat: 2 }} className="flex justify-center mb-4">
              <Zap size={48} className="text-yellow-400" strokeWidth={1.5} />
            </motion.div>
            <p className="text-green-400 font-bold text-2xl mb-2">You Won!</p>
            <p className="text-white text-base mb-1">Moves: <span className="text-pink-300 font-bold">{moves}</span></p>
            <p className="text-purple-200 text-sm mb-4">Time: <span className="text-blue-300 font-bold">{timer}</span>s</p>

            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-2xl p-3 mb-4">
              {moves <= 10 && difficulty === 0 && <p className="text-green-400 font-semibold text-sm">🧠 Perfect Memory!</p>}
              {moves <= 15 && difficulty === 1 && <p className="text-green-400 font-semibold text-sm">🏆 Expert Player!</p>}
              {moves > 10 && moves <= 16 && difficulty === 0 && <p className="text-blue-400 font-semibold text-sm">👍 Good job!</p>}
              {moves > 16 && <p className="text-orange-300 font-semibold text-sm">😅 Getting there!</p>}
            </div>

            <Btn onClick={onNext}>Continue Investigation</Btn>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
