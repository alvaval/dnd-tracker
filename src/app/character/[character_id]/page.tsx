"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Character } from "../../../types/Character";
import { getCharacterById } from "@/services/characterService";
import CharacterCard from "@/components/CharacterCard";

export default function CharacterPage() {
  const router = useRouter();
  const params = useParams();
  const characterId = decodeURIComponent(params.character_id as string);
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const data = await getCharacterById(characterId);
        setCharacter(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCharacter();
  }, [characterId]);

  if (!character) {
    return <div className="p-4">Character not found.</div>;
  }

  return <CharacterCard character={character} onBack={() => router.push("/")} />;
}
