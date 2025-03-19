"use client";

import React, { useEffect, useRef } from "react";

type AvatarCanvasProps = {
  backgroundSheet: string;
  characterSheet: string;
  layers: { x: number; y: number; width: number; height: number }[];
  backgroundSize: { width: number; height: number };
  characterSize: { width: number; height: number };
  backgroundCoords: { x: number; y: number; width: number; height: number };
};

const SCALE = 2; // Scale factor to double the resolution

const AvatarCanvas: React.FC<AvatarCanvasProps> = ({
  backgroundSheet,
  characterSheet,
  layers,
  backgroundSize,
  characterSize,
  backgroundCoords,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const backgroundImg = new Image();
    const characterImg = new Image();

    backgroundImg.src = backgroundSheet;
    characterImg.src = characterSheet;

    backgroundImg.onload = () => {
      // ✅ Adjust canvas size for scaling
      canvas.width = backgroundSize.width * SCALE;
      canvas.height = backgroundSize.height * SCALE;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false; // Prevent blurring of pixel art

      // ✅ Draw scaled background
      ctx.drawImage(
        backgroundImg,
        backgroundCoords.x,
        backgroundCoords.y,
        backgroundCoords.width,
        backgroundCoords.height,
        0,
        0,
        backgroundSize.width * SCALE,
        backgroundSize.height * SCALE
      );

      characterImg.onload = () => {
        layers.forEach(({ x, y, width, height }) => {
          // ✅ Draw character centered with scaling
          const characterX = ((backgroundSize.width - characterSize.width) / 2) * SCALE;
          const characterY = ((backgroundSize.height - characterSize.height) / 2) * SCALE;

          ctx.drawImage(
            characterImg,
            x,
            y,
            width,
            height,
            characterX,
            characterY,
            characterSize.width * SCALE,
            characterSize.height * SCALE
          );
        });
      };
    };
  }, [backgroundSheet, characterSheet, layers, backgroundCoords]);

  return <canvas ref={canvasRef} style={{ width: backgroundSize.width * SCALE, height: backgroundSize.height * SCALE }} />;
};

export default AvatarCanvas;
