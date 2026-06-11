import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card, { Btn } from "../ui";
import { useGame } from "../GameState";
import { Zap, Brain, TrendingUp } from "lucide-react";

function generateProblem(level) {
  const difficulties = {
    easy: { max: 12, op: ["+", "-"] },
    medium: { max: 25, op: ["+", "-", "*"] },
    hard: { max: 50, op: ["+", "-", "*", "/"] },
  };

  const diff = difficulties[level];
  const num1 = Math.floor(Math.random() * diff.max) + 1;
  const num2 = Math.floor(Math.random() * diff.max) + 1;
  const op = diff.op[Math.floor(Math.random() * diff.op.length)];

  let answer;
  if (op === "+") answer = num1 + num2;
  else if (op === "-") answer = num1 - num2;
  else if (op === "*") answer = num1 * num2;
  else answer = Math.round((num1 / num2) * 100) / 100;

  return {
    problem: `${num1} ${op} ${num2}`,
    answer: op === "/" ? answer : Math.floor(answer),
    display: op === "/" ? answer.toFixed(2) : answer,
  };
}

export default function ScreenMathChallenge({ onNext }) {
  const { awardRandom, unlock } = useGame();
  const [phase, setPhase] = useState("start");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [problemCount, setProblemCount] = useState(0);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [feedback, setFeedback] = useState("");
  const [level, setLevel] = useState("easy");

  useEffect(() => {
    if (phase === "playing" && !currentProblem) {
      setCurrentProblem(generateProblem(level));
    }
  }, [phase, currentProblem, level]);

  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, phase]);

  const handleTimeout = () => {
    setFeedback("⏰ Time's up! Next question...");
    setStreak(0);
    setTimeout(() => nextProblem(), 1500);
  };

  const submitAnswer = () => {
    const userNum = parseFloat(userAnswer);
    if (isNaN(userNum)) {
      setFeedback("Enter a valid number!");
      return;
    }

    const isCorrect = userNum === currentProblem.answer;

    if (isCorrect) {
      const points = Math.max(10 - (30 - timeLeft), 1);
      const newStreak = streak + 1;
      setScore(score + points);
      setStreak(newStreak);
      setFeedback(`✅ Correct! +${points} points`);

      if (newStreak > 0 && newStreak % 5 === 0) {
        setLevel(newStreak > 10 ? "hard" : "medium");
      }
    } else {
      setFeedback(`❌ Wrong! Answer was ${currentProblem.display}`);
      setStreak(0);
    }

    setTimeout(() => nextProblem(), 1500);
  };

  const nextProblem = () => {
    setCurrentProblem(generateProblem(level));
    setUserAnswer("");
    setTimeLeft(30);
    setFeedback("");
    setProblemCount(problemCount + 1);

    if (problemCount >= 10) {
      setPhase("finished");
      unlock("math_game");
      awardRandom();
    }
  };

  return (
    <Card>
      <p className="text-xs text-pink-300 uppercase tracking-widest mb-2 text-center">Brain Game</p>

      <AnimatePresence mode="wait">
        {phase === "start" && (
          <motion.div key="start" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 2 }}
              className="flex justify-center mb-4">
              <Brain size={48} className="text-purple-400" strokeWidth={1.5} />
            </motion.div>
            <h2 className="text-white font-bold text-lg text-center mb-2">Math Challenge</h2>
            <p className="text-purple-200 text-sm text-center mb-2">
              30 seconds per problem. 10 problems total.
            </p>
            <p className="text-pink-300 text-xs text-center mb-5">
              Faster you answer, more points you get! Build a streak for bonus difficulty!
            </p>
            <Btn onClick={() => { setPhase("playing"); setProblemCount(0); }}>Start Challenge</Btn>
          </motion.div>
        )}

        {phase === "playing" && currentProblem && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Header Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-2 text-center">
                <p className="text-white/60 text-xs">Score</p>
                <p className="text-purple-300 font-bold text-lg">{score}</p>
              </div>
              <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-2 text-center">
                <p className="text-white/60 text-xs">Streak</p>
                <p className="text-red-300 font-bold text-lg">{streak}</p>
              </div>
              <div className={`rounded-lg p-2 text-center border ${timeLeft <= 5 ? "bg-red-500/20 border-red-400/30" : "bg-green-500/20 border-green-400/30"}`}>
                <p className="text-white/60 text-xs">Time</p>
                <p className={`font-bold text-lg ${timeLeft <= 5 ? "text-red-300 animate-pulse" : "text-green-300"}`}>
                  {timeLeft}s
                </p>
              </div>
            </div>

            {/* Problem */}
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-400/30 rounded-2xl p-6 mb-4 text-center">
              <p className="text-white/60 text-sm mb-2">Problem {problemCount + 1}/10</p>
              <p className="text-white font-bold text-5xl font-mono mb-2">{currentProblem.problem}</p>
              <p className="text-purple-300 text-xs">= ?</p>
            </motion.div>

            {feedback && (
              <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className={`rounded-lg p-2 mb-3 text-center ${feedback.includes("✅") ? "bg-green-500/10 border border-green-400/30" : "bg-red-500/10 border border-red-400/30"}`}>
                <p className={`text-sm font-semibold ${feedback.includes("✅") ? "text-green-300" : "text-red-300"}`}>
                  {feedback}
                </p>
              </motion.div>
            )}

            <div className="flex gap-2 mb-3">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
                placeholder="Your answer..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white placeholder-white/30 text-sm outline-none focus:border-purple-400/60"
                autoFocus
              />
              <motion.button whileTap={{ scale: 0.95 }} onClick={submitAnswer}
                className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold text-sm">
                Submit
              </motion.button>
            </div>

            {level === "medium" && (
              <p className="text-yellow-300 text-xs text-center">🔥 Medium difficulty unlocked!</p>
            )}
            {level === "hard" && (
              <p className="text-red-300 text-xs text-center">🔥🔥 Hard difficulty unlocked!</p>
            )}
          </motion.div>
        )}

        {phase === "finished" && (
          <motion.div key="finished" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 18 }} className="text-center">
            <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.6, repeat: 2 }} className="flex justify-center mb-4">
              <Zap size={48} className="text-yellow-400" strokeWidth={1.5} />
            </motion.div>
            <p className="text-green-400 font-bold text-2xl mb-2">Challenge Complete!</p>
            <p className="text-white text-xl mb-1">Final Score: <span className="text-pink-300 font-bold text-3xl">{score}</span></p>
            <p className="text-purple-200 text-sm mb-4">
              Best Streak: <span className="text-yellow-300 font-bold">{streak}</span>
            </p>

            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-2xl p-3 mb-4">
              {score >= 120 && <p className="text-green-400 font-semibold text-sm">🧠 Genius Mathematician!</p>}
              {score >= 90 && score < 120 && <p className="text-blue-400 font-semibold text-sm">👍 Impressive performance!</p>}
              {score >= 60 && score < 90 && <p className="text-purple-300 font-semibold text-sm">😌 Not bad! Practice more?</p>}
              {score < 60 && <p className="text-orange-300 font-semibold text-sm">😅 Math is hard, huh?</p>}
            </div>

            <Btn onClick={onNext}>Continue Investigation</Btn>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
