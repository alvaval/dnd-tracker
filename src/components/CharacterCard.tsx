import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Character } from "@/types/Character";
import Tooltip from "@/components/Tooltip";
import { getSpellInfo as fetchSpellInfo } from "@/utils/api";

interface CharacterCardProps {
  character: Character;
  onBack: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, onBack }) => {
  const router = useRouter();
  const [spellInfo, setSpellInfo] = useState<{ [key: string]: { name: string; desc: string } | null }>({});

  useEffect(() => {
    const fetchAllSpellInfo = async () => {
      if (character.spellcasting) {
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

  const handleRaceClick = () => {
    router.push(`/race/${encodeURIComponent(character.race.index)}`);
  };

  return (
    <div className="p-8 bg-gray-800 text-white rounded-lg shadow-md">
      <button onClick={onBack} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 mb-4 transition">
        Back
      </button>
      <h1 className="text-4xl font-bold mb-4">{character.name}</h1>

      <div className="text-gray-400">
        <p>Race: <span onClick={handleRaceClick} className="text-blue-500 cursor-pointer hover:underline">{character.race.name}</span></p>
        <p>Class: {character.class.name} ({character.subclass.name})</p>
        <p>Level: {character.level}</p>
        <p>XP: {character.xp}</p>
        <p>Background: {character.background.name}</p>
        <p>Alignment: {character.alignment.name}</p>
        <p>Player: {character.playerName}</p>
      </div>

      <h2 className="text-2xl font-semibold mt-4">Abilities</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(character.abilityScores).map(([key, ability]) => (
          <p key={key}>{ability.name}: {ability.score} ({ability.modifier >= 0 ? `+${ability.modifier}` : ability.modifier})</p>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mt-4">Spellcasting</h2>
      <p>Spellcasting Class: {character.class.name}</p>
      <p>Spell Save DC: {character.spellcasting.spellSaveDC}</p>
      <p>Spell Attack Bonus: {character.spellcasting.spellAttackBonus}</p>
      <p>Spells Known:</p>
      {character.spellcasting.spellsKnown.map(spell => (
        <Tooltip key={spell} content={spellInfo[spell]?.desc || "Loading..."}>
          <p className="inline-block mr-2 cursor-pointer text-blue-400 hover:underline" onClick={() => router.push(`/spell/${encodeURIComponent(spell)}`)}>
            {spell}
          </p>
        </Tooltip>
      ))}
      {character.spellcasting.spellSlots.map(slot => (
        <p key={slot.level}>Spell Slots (Level {slot.level}): {slot.used} / {slot.total}</p>
      ))}
    </div>
  );
};

export default CharacterCard;
