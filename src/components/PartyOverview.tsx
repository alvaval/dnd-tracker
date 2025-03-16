"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Character } from "@/types/Character";
import { getAllCharacters, updateCharacterHP } from "@/services/characterService";

export default function PartyOverview() {
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
      if (!updatedCharacter) return;

      setCharacters((prev) =>
        prev.map((char) => (char.character_id === characterId ? updatedCharacter : char))
      );
    } catch (error) {
      console.error("Error updating HP:", error);
    }
  }

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-6">D&D Campaign Tracker</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((char) => (
          <div key={char.character_id} className="border border-gray-700 rounded-lg shadow-md p-6 bg-gray-800 text-white">
            <h2 
              className="text-xl font-semibold cursor-pointer hover:underline hover:text-yellow-400"
              onClick={() => router.push(`/character/${char.character_id}`)}
            >
              {char.name} (Lvl {char.level} {char.classes?.name})
            </h2>
            <p className="text-sm text-gray-400">Race: {char.races?.name} {char.subraces?.name ? `(Subrace: ${char.subraces.name})` : ""}</p>
            <p className="text-sm text-gray-400">Background: {char.backgrounds?.name}</p>
            <p className="text-sm text-gray-400">HP: {char.hp_current} / {char.hp_max}</p>

            <div className="flex gap-2 mt-2">
              <button 
                onClick={() => handleHPChange(char.character_id, -1)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                - HP
              </button>
              <button 
                onClick={() => handleHPChange(char.character_id, 1)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                + HP
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
