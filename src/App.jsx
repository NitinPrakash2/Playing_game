import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Particles from "./Particles";
import ProgressBar from "./ProgressBar";
import { GameProvider } from "./GameState";
import AchievementPopup from "./AchievementPopup";

import ScreenNameEntry from "./screens/ScreenNameEntry";
import Screen1 from "./screens/Screen1";
import Screen2 from "./screens/Screen2";
import Screen3 from "./screens/Screen3";
import Screen4 from "./screens/Screen4";
import ScreenSuspectProfile from "./screens/ScreenSuspectProfile";
import ScreenLieDetector from "./screens/ScreenLieDetector";
import ScreenMindReader from "./screens/ScreenMindReader";
import Screen5 from "./screens/Screen5";
import Screen6 from "./screens/Screen6";
import Screen7 from "./screens/Screen7";
import ScreenConstellation from "./screens/ScreenConstellation";
import ScreenCertificate from "./screens/ScreenCertificate";
import ScreenFinal from "./screens/ScreenFinal";

const screens = [
  ScreenNameEntry,      // 0  — Name entry
  Screen1,              // 1  — Welcome
  Screen2,              // 1  — Reply speed (Q1)
  Screen3,              // 2  — Personality scan results
  ScreenSuspectProfile, // 3  — Build suspect profile (3-step rapid picks)
  Screen4,              // 4  — Akdu rumour
  ScreenLieDetector,    // 5  — Lie detector with live graph
  Screen5,              // 6  — Hobby question
  Screen6,              // 7  — Memory test
  ScreenMindReader,     // 8  — Mind reader machine
  Screen7,              // 9  — Secret file terminal
  ScreenConstellation,  // 10 — Personality constellation
  ScreenCertificate,    // 11 — Official certificate
  ScreenFinal,          // 12 — Final report
];

function AppInner() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const Screen = screens[step];
  const isFinal = step === screens.length - 1;

  const handleNext = (data) => {
    if (data !== undefined) setAnswers((p) => ({ ...p, [step]: data }));
    setStep((s) => s + 1);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-br from-[#1a0533] via-[#2d1050] to-[#0f0a2e] flex flex-col items-center justify-center px-4 py-6 relative overflow-hidden">
      <Particles />
      <AchievementPopup />
      <div className="relative z-10 w-full max-w-sm">
        {step > 0 && !isFinal && <ProgressBar step={step} />}
        <AnimatePresence mode="wait">
          <Screen key={step} onNext={handleNext} answers={answers} />
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppInner />
    </GameProvider>
  );
}
