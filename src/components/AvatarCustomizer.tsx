"use client";

import React, { useState, useEffect } from "react";
import AvatarCanvas from "./AvatarCanvas";
import { inknutAntiqua } from "@/lib/fonts";

const BACKGROUND_SIZE = 128;
const SPRITE_SIZE = 64; // Each sprite is 64x64 pixels

// Background spritesheet URL
const backgroundSheetURL = "/sprites/backgrounds.png";
const NUM_BACKGROUNDS = 2; // Number of backgrounds in the sheet (128x128 each, placed 1 horizontal row)

// One sprite sheet per species, based on 64x64 grids, one row per element (clothing, hair, skin color, weapons etc.)
const speciesData = {
  human: { spriteSheet: "/sprites/human.png", skinTones: 4, hairstyles: 15, outfits: 9, hats: 7, weapons: 6, facialhair:7},
  elf: { spriteSheet: "/sprites/elf.png", skinTones: 6, hairstyles: 15, outfits: 9, hats: 7, weapons: 6, facialhair:7},
  dwarf: { spriteSheet: "/sprites/dwarf.png", skinTones: 5, hairstyles: 12, outfits: 2, hats: 7, weapons: 6, facialhair:7},
  tiefling: { spriteSheet: "/sprites/tiefling.png", skinTones: 4, hairstyles: 12, outfits: 10, hats: 7, weapons: 6, facialhair: 7},
  halfelf: { spriteSheet: "/sprites/halfelf.png", skinTones: 6, hairstyles: 12, outfits: 10, hats: 7, weapons: 6, facialhair: 7},
  dragonborn: { spriteSheet: "/sprites/dragonborn.png", skinTones: 5, hairstyles: 12, outfits: 2, hats: 7, weapons: 6, facialhair:7},
  gnome: { spriteSheet: "/sprites/gnome.png", skinTones: 4, hairstyles: 12, outfits: 10, hats: 7, weapons: 6, facialhair:7},
  halfling: { spriteSheet: "/sprites/halfling.png", skinTones: 6, hairstyles: 12, outfits: 10, hats: 7, weapons: 6, facialhair:7},
  halforc: { spriteSheet: "/sprites/halforc.png", skinTones: 5, hairstyles: 12, outfits: 2, hats: 7, weapons: 6, facialhair:7},
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
  const [selectedSpecies, setSelectedSpecies] = useState<keyof typeof speciesData>("elf");
  const [skinToneIndex, setSkinToneIndex] = useState(0);
  const [hairIndex, setHairIndex] = useState(0);
  const [outfitIndex, setOutfitIndex] = useState(0);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [weaponIndex, setWeaponIndex] = useState(0);
  const [hatIndex, setHatIndex] = useState(0);
  const [facialHairIndex, setFacialHairIndex] = useState(0);

  const currentSpecies = speciesData[selectedSpecies];

  // Generate coordinates dynamically based on count
  const backgrounds = generateSpriteCoordinates(NUM_BACKGROUNDS, 0, BACKGROUND_SIZE);
  const skinTones = generateSpriteCoordinates(currentSpecies.skinTones, 0, SPRITE_SIZE);
  const outfits = generateSpriteCoordinates(currentSpecies.outfits, 1, SPRITE_SIZE);
  const hairstyles = generateSpriteCoordinates(currentSpecies.hairstyles, 2, SPRITE_SIZE);
  const hats = generateSpriteCoordinates(currentSpecies.hats, 2, SPRITE_SIZE);
  const weapons = generateSpriteCoordinates(currentSpecies.weapons, 1, SPRITE_SIZE);
  const facialhair = generateSpriteCoordinates(currentSpecies.facialhair, 2, SPRITE_SIZE);

  useEffect(() => {
    setSkinToneIndex(0);
    setHairIndex(14);
    setOutfitIndex(0);
    setHatIndex(6);
    setFacialHairIndex(6);
    setWeaponIndex(5);
  }, [selectedSpecies]);

  const cycleIndex = (current: number, array: any[], direction: number) => {
    return (current + direction + array.length) % array.length;
  };

  return (
    <div className={`flex flex-row justify-center gap-4 pt-15 ${inknutAntiqua.className} text-[15px]`}>
      <div className="flex flex-col">
      <AvatarCanvas
        backgroundSheet={backgroundSheetURL}
        characterSheet={currentSpecies.spriteSheet}
        layers={[skinTones[skinToneIndex], hairstyles[hairIndex], outfits[outfitIndex]]}
        backgroundSize={{ width: BACKGROUND_SIZE, height: BACKGROUND_SIZE }}
        characterSize={{ width: SPRITE_SIZE, height: SPRITE_SIZE }}
        backgroundCoords={backgrounds[backgroundIndex]} // Pass selected background
      />
      {/* Species Selection */}
      <div className="flex flex-row flex-wrap gap-4 w-[256px] justify-center pt-5 text-[14px]">
        {Object.keys(speciesData).map((species) => (
          <button className={`border border-black px-2 rounded-sm text-[12px]`} key={species} onClick={() => setSelectedSpecies(species as keyof typeof speciesData)}>
            {species.charAt(0).toUpperCase() + species.slice(1)}
          </button>
        ))}
      </div>
      </div>
        <div className="flex flex-col items-center pt-10 w-50">
      {/* Background Selection */}
      <div className="flex items-center gap-4 mb-2">
        <button className="text-[22px]" onClick={() => setBackgroundIndex((prev) => cycleIndex(prev, backgrounds, -1))}>&lt;</button>
        <span>Background {backgroundIndex + 1}</span>
        <button className="text-[22px]" onClick={() => setBackgroundIndex((prev) => cycleIndex(prev, backgrounds, 1))}>&gt;</button>
      </div>


      {/* Skin Tone Selection */}
      {skinTones.length > 1 && (
        <div className="flex items-center gap-4 mb-2">
          <button className="text-[22px]" onClick={() => setSkinToneIndex((prev) => cycleIndex(prev, skinTones, -1))}>&lt;</button>
          <span>Skin Tone {skinToneIndex + 1}</span>
          <button className="text-[22px]" onClick={() => setSkinToneIndex((prev) => cycleIndex(prev, skinTones, 1))}>&gt;</button>
        </div>
      )}

      {/* Hair Selection */}
      {hairstyles.length > 1 && (
        <div className="flex items-center gap-4 mb-2">
          <button className="text-[22px]" onClick={() => setHairIndex((prev) => cycleIndex(prev, hairstyles, -1))}>&lt;</button>
          <span>Hair {hairIndex + 1}</span>
          <button className="text-[22px]" onClick={() => setHairIndex((prev) => cycleIndex(prev, hairstyles, 1))}>&gt;</button>
        </div>
      )}

      {/* Outfit Selection */}
      {outfits.length > 1 && (
        <div className="flex items-center gap-4 mb-2">
          <button className="text-[22px]" onClick={() => setOutfitIndex((prev) => cycleIndex(prev, outfits, -1))}>&lt;</button>
          <span>Outfit {outfitIndex + 1}</span>
          <button className="text-[22px]" onClick={() => setOutfitIndex((prev) => cycleIndex(prev, outfits, 1))}>&gt;</button>
        </div>
      )}

      {/* Hat Selection */}
      {hats.length > 1 && (
        <div className="flex items-center gap-4 mb-2">
          <button className="text-[22px]" onClick={() => setHatIndex((prev) => cycleIndex(prev, hats, -1))}>&lt;</button>
          <span>Hat {hatIndex + 1}</span>
          <button className="text-[22px]" onClick={() => setHatIndex((prev) => cycleIndex(prev, hats, 1))}>&gt;</button>
        </div>
      )}

      {/* FacialHair Selection */}
      {facialhair.length > 1 && (
        <div className="flex items-center gap-4 mb-2">
          <button className="text-[22px]" onClick={() => setFacialHairIndex((prev) => cycleIndex(prev, facialhair, -1))}>&lt;</button>
          <span>Facial Hair {facialHairIndex + 1}</span>
          <button className="text-[22px]" onClick={() => setFacialHairIndex((prev) => cycleIndex(prev, facialhair, 1))}>&gt;</button>
        </div>
      )}

      {/* Wepaon Selection */}
      {weapons.length > 1 && (
        <div className="flex items-center gap-4 mb-2">
          <button className="text-[22px]" onClick={() => setWeaponIndex((prev) => cycleIndex(prev, weapons, -1))}>&lt;</button>
          <span>Weapon {weaponIndex + 1}</span>
          <button className="text-[22px]" onClick={() => setWeaponIndex((prev) => cycleIndex(prev, weapons, 1))}>&gt;</button>
        </div>
      )}
    </div>
    </div>
  );
};

export default AvatarCustomizer;