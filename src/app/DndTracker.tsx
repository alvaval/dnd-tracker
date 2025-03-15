"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Character } from "./Character";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCharacters = async () => {
      console.log('Fetching characters from Supabase...');
      const { data, error } = await supabase
        .from("characters")
        .select('character_id, created_at, player_name, name, race_id, subrace_id, class_id, subclass_id, background_id, alignment_id, level, xp, strength, dexterity, constitution, intelligence, wisdom, charisma, proficiency_bonus, armor_class, speed, hp_max, hp_current, hp_temp, inspiration, prepared_spells_max, prepared_spells_current, appearance, backstory, personality, ideals, bonds');

      if (error) {
        console.error('Error fetching characters:', error.message, error.details, error.hint);
      } else {
        console.log('Fetched characters:', data);
        setCharacters(data);
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
              <h2 className="text-xl font-semibold cursor-pointer hover:underline" onClick={() => router.push(`/character/${char.character_id}`)}>
                {char.name} (Lvl {char.level} {char.class_id})
              </h2>
              <p>Race: {char.race_id}</p>
              <p>HP: {char.hp_current} / {char.hp_max}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}