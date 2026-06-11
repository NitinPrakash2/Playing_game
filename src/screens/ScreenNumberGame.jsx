import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card, { Btn } from "../ui";
import { useGame } from "../GameState";
import { Flame, Snowflake, Target } from "lucide-react";

export default function ScreenNumberGuessingGame({ onNext }) {
  const { awardRandom, unlock } = useGame();
  const [phase, setPhase] = useState("start");
  const [secretNumber] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [guessHistory, setGuessHistory] = useState([]);
  const [temperature, setTemperature] = useState("");

  const calculateTemperature = (num1, num2) => {
    const diff = Math.abs(num1 - num2);
    if (diff === 0) return "EXACT MATCH!";
    if (diff <= 2) return "🔥 BURNING HOT";
    if (diff <= 5) return "🌡️ Very Hot";
    if (diff <= 10) return "🔥 Hot";
    if (diff <= 20) return "🌤️ Warm";
    if (diff <= 35) return "☀️ Lukewarm";
    if (diff <= 50) return "❄️ Cold";
    return "🧊 Freezing";
  };

  const makeGuess = () => {
    const num = parseInt(guess);
    if (!guess || isNaN(num) || num < 1 || num > 100) {
      setFeedback("Please enter a number between 1 and 100!");
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setGuessHistory([...guessHistory, num]);

    if (num === secretNumber) {
      setPhase("won");
      unlock("number_game");
      awardRandom();
    } else {
      const temp = calculateTemperature(num, secretNumber);
      setTemperature(temp);
      
      if (num < secretNumber) {
        setFeedback("📈 Too low! Think bigger...");
      } else {
        setFeedback("📉 Too high! Go lower...");
      }
    }

    setGuess("");
  };

  return (
    <Card>
      <p className="text-xs text-pink-300 uppercase tracking-widest mb-2 text-center">Game Time</p>

      <AnimatePresence mode="wait">
        {phase === "start" && (
          <motion.div key="start" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}
              className="flex justify-center mb-4">
              <Target size={48} className="text-purple-400" strokeWidth={1.5} />
            </motion.div>
            <h2 className="text-white font-bold text-lg text-center mb-2">Number Guessing Game</h2>
            <p className="text-purple-200 text-sm text-center mb-4">
              I am thinking of a number between 1 and 100.<br />
              Can you guess it? I will tell you if you are hot or cold!
            </p>
            <p className="text-pink-300 text-xs text-center mb-5 font-semibold">
              Less attempts = More bragging rights!
            </p>
            <Btn onClick={() => setPhase("playing")}>Start Guessing</Btn>
          </motion.div>
        )}

        {phase === "playing" && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-2xl p-4 mb-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-white/60 text-xs">Attempts</p>
                  <p className="text-pink-300 font-bold text-2xl">{attempts}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-xs">Guesses So Far</p>
                  <p className="text-purple-300 font-mono text-sm">{guessHistory.join(", ")}</p>
                </div>
              </div>

              {temperature && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="bg-black/30 rounded-lg p-2 text-center">
                  <p className={`font-bold text-lg ${temperature.includes("EXACT") ? "text-green-400" : temperature.includes("BURNING") ? "text-red-400" : "text-blue-400"}`}>
                    {temperature}
                  </p>
                </motion.div>
              )}
            </div>

            {feedback && (
              <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-2 mb-3 text-center">
                <p className="text-yellow-300 text-sm">{feedback}</p>
              </motion.div>
            )}

            <div className="flex gap-2 mb-3">
              <input
                type="number"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && makeGuess()}
                placeholder="Enter your guess..."
                min="1"
                max="100"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white placeholder-white/30 text-sm outline-none focus:border-purple-400/60"
              />
              <motion.button whileTap={{ scale: 0.95 }} onClick={makeGuess}
                className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold text-sm">
                Guess
              </motion.button>
            </div>

            {attempts >= 10 && attempts < 15 && (
              <p className="text-orange-300 text-xs text-center mb-2">
                Hint: {secretNumber % 2 === 0 ? "Even number" : "Odd number"}
              </p>
            )}
          </motion.div>
        )}

        {phase === "won" && (
          <motion.div key="won" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 18 }} className="text-center">
            <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.6, repeat: 2 }} className="flex justify-center mb-4">
              <Flame size={48} className="text-yellow-400" strokeWidth={1.5} />
            </motion.div>
            <p className="text-green-400 font-bold text-2xl mb-2">🎉 You Won!</p>
            <p className="text-white text-lg mb-1">Secret number was: <span className="text-pink-300 font-bold text-2xl">{secretNumber}</span></p>
            <p className="text-purple-200 text-sm mb-4">
              You guessed it in <span className="text-yellow-300 font-bold">{attempts}</span> attempt{attempts !== 1 ? "s" : ""}!
            </p>

            <div className="bg-gradient-to-r from-yellow-500/10 to-pink-500/10 border border-yellow-400/30 rounded-2xl p-3 mb-4">
              {attempts <= 5 && <p className="text-green-400 font-semibold text-sm">🏆 Genius Level! Amazing intuition!</p>}
              {attempts > 5 && attempts <= 8 && <p className="text-blue-400 font-semibold text-sm">👍 Great job! Pretty accurate!</p>}
              {attempts > 8 && attempts <= 12 && <p className="text-purple-300 font-semibold text-sm">😌 Not bad! Got there eventually.</p>}
              {attempts > 12 && <p className="text-orange-300 font-semibold text-sm">😅 Well... persistence is key!</p>}
            </div>

            <Btn onClick={onNext}>Continue Investigation</Btn>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
