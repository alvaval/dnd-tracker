"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Character } from "@/types/Character";
import { getPartyById, getPartyInfoById } from "@/services/partyService";
import { geistMono, inknutAntiqua } from "@/lib/fonts";

export default function PartyPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [partyName, setPartyName] = useState<string>("");
  const router = useRouter();
  const params = useParams();
  const partyId = params?.party_id;

  useEffect(() => {
    const fetchParty = async () => {
      try {
        if (!partyId) return;
        const partyInfo = await getPartyInfoById(partyId);
        setPartyName(partyInfo?.name || "Unknown Party");
        
        const charactersData = await getPartyById(partyId);
        setCharacters(charactersData);
      } catch (error) {
        console.error("Error fetching party info or characters:", error);
      }
    };

    fetchParty();
  }, [partyId]);

  return (
    <main className="flex flex-col items-center p-8">
      <h1 className={`${inknutAntiqua.className} text-3xl font-bold mb-6`}>
        Party: {partyName}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((char) => (
          <div
            key={char.character_id}
            className={`${geistMono.className} border border-black rounded-lg p-6 bg-[#D3DECD]`}
          >
            <h2
              className={`${inknutAntiqua.className} text-xl font-semibold cursor-pointer hover:underline hover:text-gray-600`}
              onClick={() => router.push(`/characters/${char.character_id}`)}
            >
              {char.name}
            </h2>
            <p className={`mb-2`}>
              (Lvl {char.level} {char.class.name})
            </p>
            <p className="text-sm">
              Race: {char.race.name}{" "}
              {char.subrace?.name ? `(Subrace: ${char.subrace.name})` : ""}
            </p>
            <p className="text-sm">Background: {char.background.name}</p>

            <div className="flex justify-center gap-2 mt-2 pt-2">
              <button className="px-3 py-0 bg-[#F9F7F1] border border-black rounded hover:bg-[#DA8C8C] transition">
                -
              </button>
              <span className="pt-2">
                {char.hp.current}/{char.hp.max}
              </span>
              <button className="px-3 py-0 bg-[#F9F7F1] border border-black rounded hover:bg-[#ACD5A7] transition">
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
