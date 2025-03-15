"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Character } from "../../Character";
import Tooltip from "../../../components/Tooltip";
import { getSpellInfo as fetchSpellInfo } from "../../../utils/api";

export default function CharacterPage() {
  const router = useRouter();
  const params = useParams();
  const characterName = decodeURIComponent(params.name as string);
  const [character, setCharacter] = useState<Character | null>(null);
  const [spellInfo, setSpellInfo] = useState<{ [key: string]: { name: string; desc: string } | null }>({});

  useEffect(() => {
    const storedCharacters = JSON.parse(localStorage.getItem("characters") || "[]");
    const foundCharacter = storedCharacters.find((char: Character) => char.name === characterName);
    setCharacter(foundCharacter || null);
  }, [characterName]);

  useEffect(() => {
    const fetchAllSpellInfo = async () => {
      if (character) {
        const spells = character.spellcasting.spellsKnown;
        const spellInfoPromises = spells.map(async (spell) => {
          const info = await fetchSpellInfo(spell);
          return { spell, info };
        });
        const spellInfoResults = await Promise.all(spellInfoPromises);
        const newSpellInfo = spellInfoResults.reduce((acc, { spell, info }) => {
          acc[spell] = info;
          return acc;
        }, {} as { [key: string]: { name: string; desc: string } | null });
        setSpellInfo(newSpellInfo);
      }
    };

    fetchAllSpellInfo();
  }, [character]);

  if (!character) {
    return <div className="p-4">Character not found.</div>;
  }

  const handleSpellClick = (spellName: string) => {
    router.push(`/spell/${encodeURIComponent(spellName)}`);
  };

  return (
    <div className="p-8">
      <button onClick={() => router.push("/")} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 mb-4">Back</button>
      <h1 className="text-4xl font-bold">{character.name}</h1>
      <p>Race: {character.race}</p>
      <p>Class: {character.classType} ({character.subclass})</p>
      <p>Level: {character.level}</p>
      <p>XP: {character.xp}</p>
      <p>Background: {character.background}</p>
      <p>Alignment: {character.alignment}</p>
      <p>Player: {character.playerName}</p>
      
      <h2 className="text-2xl font-semibold mt-4">Abilities</h2>
      <p>Strength: {character.abilityScores.strength}</p>
      <p>Dexterity: {character.abilityScores.dexterity}</p>
      <p>Constitution: {character.abilityScores.constitution}</p>
      <p>Intelligence: {character.abilityScores.intelligence}</p>
      <p>Wisdom: {character.abilityScores.wisdom}</p>
      <p>Charisma: {character.abilityScores.charisma}</p>

      <h2 className="text-2xl font-semibold mt-4">Combat Stats</h2>
      <p>Armor Class: {character.armorClass}</p>
      <p>Initiative: {character.initiative}</p>
      <p>Speed: {character.speed} ft</p>
      <p>HP: {character.hitPoints.current} / {character.hitPoints.max}</p>
      <p>Temporary HP: {character.hitPoints.temp}</p>
      <p>Hit Dice: {character.hitDice}</p>

      <h2 className="text-2xl font-semibold mt-4">Skills</h2>
      {Object.entries(character.skills).map(([skill, value]) => (
        <p key={skill}>{skill.charAt(0).toUpperCase() + skill.slice(1)}: {value}</p>
      ))}

      <h2 className="text-2xl font-semibold mt-4">Spellcasting</h2>
      <p>Spellcasting Class: {character.spellcasting.class}</p>
      <p>Spell Save DC: {character.spellcasting.spellSaveDC}</p>
      <p>Spell Attack Bonus: {character.spellcasting.spellAttackBonus}</p>
      <p>Spells Known:</p>
      {character.spellcasting.spellsKnown.map(spell => (
        <Tooltip key={spell} content={spellInfo[spell]?.desc || "Loading..."}>
          <p className="inline-block mr-2 cursor-pointer" onClick={() => handleSpellClick(spell)}>{spell}</p>
        </Tooltip>
      ))}
      {character.spellcasting.spellSlots.map(slot => (
        <p key={slot.level}>Spell Slots (Level {slot.level}): {slot.used} / {slot.total}</p>
      ))}

      <h2 className="text-2xl font-semibold mt-4">Inventory</h2>
      <p>{character.inventory.join(", ")}</p>

      <h2 className="text-2xl font-semibold mt-4">Features & Traits</h2>
      <p>{character.featuresAndTraits.join(", ")}</p>

      <h2 className="text-2xl font-semibold mt-4">Personality</h2>
      <p>Personality Traits: {character.personalityTraits}</p>
      <p>Ideals: {character.ideals}</p>
      <p>Bonds: {character.bonds}</p>
      <p>Flaws: {character.flaws}</p>
    </div>
  );
}
