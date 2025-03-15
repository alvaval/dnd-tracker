"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Character } from "../../Character";
import { supabase } from "@/lib/supabaseClient";

export default function CharacterPage() {
  const router = useRouter();
  const params = useParams();
  const characterId = decodeURIComponent(params.character_id as string);
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      console.log('Fetching character from Supabase...');
      const { data, error } = await supabase
        .from("characters")
        .select('*')
        .eq('character_id', characterId)
        .single();

      if (error) {
        console.error('Error fetching character:', error.message, error.details, error.hint);
      } else {
        console.log('Fetched character:', data);
        setCharacter(data);
      }
    };

    fetchCharacter();
  }, [characterId]);

  if (!character) {
    return <div className="p-4">Character not found.</div>;
  }

  return (
    <div className="p-8">
      <button onClick={() => router.push("/")} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 mb-4">Back</button>
      <h1 className="text-4xl font-bold">{character.name}</h1>
      <p>Race: {character.race_id} (Subrace: {character.subrace_id})</p>
      <p>Class: {character.class_id} (Subclass: {character.subclass_id})</p>
      <p>Level: {character.level}</p>
      <p>XP: {character.xp}</p>
      <p>Background: {character.background_id}</p>
      <p>Alignment: {character.alignment_id}</p>
      <p>Player: {character.player_name}</p>
      
      <h2 className="text-2xl font-semibold mt-4">Abilities</h2>
      <p>Strength: {character.strength}</p>
      <p>Dexterity: {character.dexterity}</p>
      <p>Constitution: {character.constitution}</p>
      <p>Intelligence: {character.intelligence}</p>
      <p>Wisdom: {character.wisdom}</p>
      <p>Charisma: {character.charisma}</p>

      <h2 className="text-2xl font-semibold mt-4">Combat Stats</h2>
      <p>Proficiency Bonus: {character.proficiency_bonus}</p>
      <p>Armor Class: {character.armor_class}</p>
      <p>Speed: {character.speed} ft</p>
      <p>HP: {character.hp_current} / {character.hp_max}</p>
      <p>Temporary HP: {character.hp_temp}</p>

      <h2 className="text-2xl font-semibold mt-4">Personality</h2>
      <p>Personality Traits: {character.personality}</p>
      <p>Ideals: {character.ideals}</p>
      <p>Bonds: {character.bonds}</p>
    </div>
  );
}
