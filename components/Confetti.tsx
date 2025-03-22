"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";

const ConfettiOnLoad = () => {
  useEffect(() => {
    // Trigger confetti when the component mounts
    confetti({
      particleCount: 200,
      spread: 120,
      origin: { y: 0.5 },
    });
  }, []);

  return null; // No visible UI, just the effect
};

export default ConfettiOnLoad;
