"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Character } from "@/types/Character";
import { getAllCharacters, updateCharacterHP } from "@/services/characterService";

export default function CharacterOverview() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const data = await getAllCharacters();
        setCharacters(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCharacters();
  }, []);

  async function handleHPChange(characterId: string, amount: number) {
    try {
      const updatedCharacter = await updateCharacterHP(characterId, amount);
      if (!updatedCharacter) return; // Ensure null is never added to the state

      setCharacters((prev) =>
        prev.map((char) => (char.character_id === characterId ? updatedCharacter : char))
      );
    } catch (error) {
      console.error("Error updating HP:", error);
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-sans">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">D&D Campaign Tracker</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {characters.map((char) => (
            <div key={char.character_id} className="border rounded-lg shadow-md p-4">
              <h2
                className="text-xl font-semibold cursor-pointer hover:underline"
                onClick={() => router.push(`/character/${char.character_id}`)}
              >
                {char.name} (Lvl {char.level} {char.classes?.name})
              </h2>
              <p>Race: {char.races?.name} {char.subraces?.name ? `(Subrace: ${char.subraces.name})` : ""}</p>
              <p>Background: {char.backgrounds?.name}</p>
              <p>Alignment: {char.alignments?.name} ({char.alignments?.acronym})</p>
              <p>HP: {char.hp_current} / {char.hp_max}</p>

              {/* HP Modification Buttons */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleHPChange(char.character_id, -1)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                >
                  - HP
                </button>
                <button
                  onClick={() => handleHPChange(char.character_id, 1)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                >
                  + HP
                </button>
              </div>

              {/* Spell Slot Buttons (Disabled) */}
              <div className="flex gap-2 mt-2 opacity-50 cursor-not-allowed">
                <button className="px-4 py-2 bg-purple-500 text-white rounded" disabled>
                  - Spell Slot
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded" disabled>
                  + Spell Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
