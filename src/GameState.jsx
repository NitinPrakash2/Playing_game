import { createContext, useContext, useState, useCallback } from "react";

const GameCtx = createContext(null);

export const ACHIEVEMENTS = [
  { id: "start",       icon: "🏆", title: "Started Investigation",    desc: "Welcome to the investigation." },
  { id: "q1",          icon: "🏆", title: "Question Answered",        desc: "First response recorded." },
  { id: "scan",        icon: "🔬", title: "Scan Survived",            desc: "Personality scan complete." },
  { id: "captcha",     icon: "🤖", title: "CAPTCHA Defeated",         desc: "Subject not found. As expected." },
  { id: "download",    icon: "💾", title: "Access Denied Expert",     desc: "Denied twice. Respect." },
  { id: "evidence",    icon: "📦", title: "Evidence Collected",       desc: "Secret box opened successfully." },
  { id: "witness",     icon: "🎤", title: "Witness Interviewed",      desc: "Statement recorded. Useless." },
  { id: "prediction",  icon: "🔮", title: "Fate Accepted",            desc: "Future analyzed. Mostly guessed." },
  { id: "luck",        icon: "🍀", title: "Luck Analyzed",            desc: "Government luck report filed." },
  { id: "mindreader",  icon: "🧠", title: "Mind Read",                desc: "Thoughts: still classified." },
  { id: "secretfile",  icon: "🔒", title: "Opened Secret File",       desc: "PRIYA.EXE accessed." },
  { id: "constellation",icon: "⭐","title": "Constellation Built",    desc: "Personality mapped to stars." },
  { id: "certificate", icon: "🎖️", title: "Certificate Claimed",     desc: "Officially a verified human." },
  { id: "survived",    icon: "😌", title: "Still Here Somehow",       desc: "Investigation survived." },
];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export function GameProvider({ children }) {
  const [unlocked, setUnlocked] = useState([]);
  const [score, setScore] = useState({ curiosity: 0, patience: 0, mystery: 0, skill: 0 });
  const [queue, setQueue] = useState([]);

  const unlock = useCallback((id) => {
    setUnlocked((prev) => {
      if (prev.find((a) => a.id === id)) return prev;
      const a = ACHIEVEMENTS.find((x) => x.id === id);
      if (!a) return prev;
      setQueue((q) => [...q, a]);
      return [...prev, a];
    });
  }, []);

  const addScore = useCallback((type, pts) => {
    setScore((s) => ({ ...s, [type]: s[type] + pts }));
  }, []);

  const awardRandom = useCallback(() => {
    setScore((s) => ({
      curiosity:  s.curiosity  + rand(5, 20),
      patience:   s.patience   + rand(5, 20),
      mystery:    s.mystery    + rand(5, 20),
      skill:      s.skill      + rand(5, 20),
    }));
  }, []);

  const dismissFirst = useCallback(() => {
    setQueue((q) => q.slice(1));
  }, []);

  return (
    <GameCtx.Provider value={{ unlocked, score, queue, unlock, addScore, awardRandom, dismissFirst }}>
      {children}
    </GameCtx.Provider>
  );
}

const defaultCtx = {
  unlocked: [],
  score: { curiosity: 0, patience: 0, mystery: 0, skill: 0 },
  queue: [],
  unlock: () => {},
  addScore: () => {},
  awardRandom: () => {},
  dismissFirst: () => {},
};

export function useGame() {
  return useContext(GameCtx) ?? defaultCtx;
}
