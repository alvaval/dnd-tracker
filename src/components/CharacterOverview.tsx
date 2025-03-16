"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Character } from "@/types/Character";
import { getAllCharacters } from "@/services/characterService";

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
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
