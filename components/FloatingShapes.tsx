"use client";
import { motion, Variants } from "framer-motion";
import { useMemo } from "react";

const FloatingShapes = () => {
  const shapes = [
    { id: 1, className: "w-80 h-80 bg-white/10 rounded-full" },
    { id: 2, className: "w-24 h-24 border-8 border-white/10 rounded-full" },
    { id: 3, className: "w-40 h-40 bg-white/10 rounded-full" },
    { id: 4, className: "w-60 h-60 border-8 border-white/10 rounded-full" },
    { id: 5, className: "w-60 h-60 border-8 border-white/10 rounded-full" },
  ];

  // Precompute random positions for consistency
  const shapePositions = useMemo(
    () =>
      shapes.map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      })),
    [shapes.length]
  );

  const floatAnimation: Variants = {
    initial: { y: 0, x: 0 },
    animate: { y: [0, -20, 0], x: [0, 20, 0] },
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {shapes.map((shape, index) => (
        <motion.div
          key={shape.id}
          className={`${shape.className} absolute z-0`}
          variants={floatAnimation}
          initial="initial"
          animate="animate"
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          style={shapePositions[index]}
        />
      ))}
    </div>
  );
};

export default FloatingShapes;
