"use client";

import React, { useState, useEffect } from "react";
import AvatarCanvas from "./AvatarCanvas";

const BACKGROUND_SIZE = 128;
const SPRITE_SIZE = 64; // Each sprite is 64x64 pixels

// Background spritesheet URL
const backgroundSheetURL = "/sprites/backgrounds.png";
const NUM_BACKGROUNDS = 2; // Number of backgrounds in the sheet (128x128 each, placed 1 horizontal row)

// One sprite sheet per species, based on 64x64 grids, one row per element (clothing, hair, skin color, weapons etc.)
const speciesData = {
  human: { spriteSheet: "/sprites/human.png", skinTones: 4, hairstyles: 12, outfits: 9 },
  elf: { spriteSheet: "/sprites/elf.png", skinTones: 6, hairstyles: 12, outfits: 9 },
  dwarf: { spriteSheet: "/sprites/dwarf.png", skinTones: 5, hairstyles: 12, outfits: 2 },
  tiefling: { spriteSheet: "/sprites/tiefling.png", skinTones: 4, hairstyles: 12, outfits: 10 },
  halfelf: { spriteSheet: "/sprites/halfelf.png", skinTones: 6, hairstyles: 12, outfits: 10 },
  dragonborn: { spriteSheet: "/sprites/dragonborn.png", skinTones: 5, hairstyles: 12, outfits: 2 },
  gnome: { spriteSheet: "/sprites/gnome.png", skinTones: 4, hairstyles: 12, outfits: 10 },
  halfling: { spriteSheet: "/sprites/halfling.png", skinTones: 6, hairstyles: 12, outfits: 10 },
  halforc: { spriteSheet: "/sprites/halforc.png", skinTones: 5, hairstyles: 12, outfits: 2 },
};

// Function to generate sprite coordinates based on row position
const generateSpriteCoordinates = (count: number, row: number, size: number) =>
    Array.from({ length: count }, (_, i) => ({
      x: i * size,
      y: row * size,
      width: size,
      height: size,
}));

const AvatarCustomizer: React.FC = () => {
  const [selectedSpecies, setSelectedSpecies] = useState<keyof typeof speciesData>("human");
  const [skinToneIndex, setSkinToneIndex] = useState(0);
  const [hairIndex, setHairIndex] = useState(0);
  const [outfitIndex, setOutfitIndex] = useState(0);
  const [backgroundIndex, setBackgroundIndex] = useState(0);

  const currentSpecies = speciesData[selectedSpecies];

  // Generate coordinates dynamically based on count
  const backgrounds = generateSpriteCoordinates(NUM_BACKGROUNDS, 0, BACKGROUND_SIZE);
  const skinTones = generateSpriteCoordinates(currentSpecies.skinTones, 0, SPRITE_SIZE);
  const outfits = generateSpriteCoordinates(currentSpecies.outfits, 1, SPRITE_SIZE);
  const hairstyles = generateSpriteCoordinates(currentSpecies.hairstyles, 2, SPRITE_SIZE);

  useEffect(() => {
    setSkinToneIndex(0);
    setHairIndex(0);
    setOutfitIndex(0);
  }, [selectedSpecies]);

  const cycleIndex = (current: number, array: any[], direction: number) => {
    return (current + direction + array.length) % array.length;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <AvatarCanvas
        backgroundSheet={backgroundSheetURL}
        characterSheet={currentSpecies.spriteSheet}
        layers={[skinTones[skinToneIndex], hairstyles[hairIndex], outfits[outfitIndex]]}
        backgroundSize={{ width: BACKGROUND_SIZE, height: BACKGROUND_SIZE }}
        characterSize={{ width: SPRITE_SIZE, height: SPRITE_SIZE }}
        backgroundCoords={backgrounds[backgroundIndex]} // Pass selected background
      />

      {/* Background Selection */}
      <div className="flex items-center gap-4">
        <button onClick={() => setBackgroundIndex((prev) => cycleIndex(prev, backgrounds, -1))}>⬅</button>
        <span>Background {backgroundIndex + 1}</span>
        <button onClick={() => setBackgroundIndex((prev) => cycleIndex(prev, backgrounds, 1))}>➡</button>
      </div>


      {/* Species Selection */}
      <div className="flex gap-4">
        {Object.keys(speciesData).map((species) => (
          <button key={species} onClick={() => setSelectedSpecies(species as keyof typeof speciesData)}>
            {species.charAt(0).toUpperCase() + species.slice(1)}
          </button>
        ))}
      </div>

      {/* Skin Tone Selection */}
      {skinTones.length > 1 && (
        <div className="flex items-center gap-4">
          <button onClick={() => setSkinToneIndex((prev) => cycleIndex(prev, skinTones, -1))}>⬅</button>
          <span>Skin Tone {skinToneIndex + 1}</span>
          <button onClick={() => setSkinToneIndex((prev) => cycleIndex(prev, skinTones, 1))}>➡</button>
        </div>
      )}

      {/* Hair Selection */}
      {hairstyles.length > 1 && (
        <div className="flex items-center gap-4">
          <button onClick={() => setHairIndex((prev) => cycleIndex(prev, hairstyles, -1))}>⬅</button>
          <span>Hair {hairIndex + 1}</span>
          <button onClick={() => setHairIndex((prev) => cycleIndex(prev, hairstyles, 1))}>➡</button>
        </div>
      )}

      {/* Outfit Selection */}
      {outfits.length > 1 && (
        <div className="flex items-center gap-4">
          <button onClick={() => setOutfitIndex((prev) => cycleIndex(prev, outfits, -1))}>⬅</button>
          <span>Outfit {outfitIndex + 1}</span>
          <button onClick={() => setOutfitIndex((prev) => cycleIndex(prev, outfits, 1))}>➡</button>
        </div>
      )}
    </div>
  );
};

export default AvatarCustomizer;