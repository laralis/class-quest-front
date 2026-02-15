"use client";

import { useEffect, useState, useRef } from "react";
import { Timer } from "@phosphor-icons/react";

interface QuestionTimerProps {
  timeLimit: number | null;
  onTimeUp?: () => void;
}

export function QuestionTimer({ timeLimit, onTimeUp }: QuestionTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit || 0);
  const hasCalledTimeUp = useRef(false);

  useEffect(() => {
    if (!timeLimit || timeLimit === 0) return;

    if (timeRemaining <= 0) {
      if (!hasCalledTimeUp.current && onTimeUp) {
        hasCalledTimeUp.current = true;
        onTimeUp();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, onTimeUp, timeLimit]);

  const percentage = timeLimit ? (timeRemaining / timeLimit) * 100 : 0;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const getTextColor = () => {
    if (timeRemaining === 0) return "text-red-600";
    if (percentage > 50) return "text-green-600";
    if (percentage > 25) return "text-yellow-600";
    return "text-red-600";
  };

  const getBgColor = () => {
    if (timeRemaining === 0) return "bg-red-50 border-red-300";
    if (percentage > 50) return "bg-green-50 border-green-300";
    if (percentage > 25) return "bg-yellow-50 border-yellow-300";
    return "bg-red-50 border-red-300";
  };

  if (!timeLimit || timeLimit === 0) return null;

  return (
    <div
      className={`flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-lg border ${getBgColor()} transition-colors`}
    >
      <Timer
        size={16}
        weight="bold"
        className={`md:w-[18px] md:h-[18px] ${getTextColor()} ${timeRemaining <= 10 && timeRemaining > 0 ? "animate-pulse" : ""}`}
      />
      <span
        className={`text-sm md:text-base font-mono font-bold ${getTextColor()} tabular-nums`}
      >
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
}
