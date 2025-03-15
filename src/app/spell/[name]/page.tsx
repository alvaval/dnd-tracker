"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getSpellInfo as fetchSpellInfo } from "../../../utils/api";

export default function SpellPage() {
  const router = useRouter();
  const params = useParams();
  const spellName = decodeURIComponent(params.name as string);
  
  interface SpellInfo {
    name: string;
    level: number;
    school?: { name: string };
    components?: string[];
    range?: string;
    duration?: string;
    casting_time?: string;
    desc?: string[];
    higher_level?: string[];
  }

  const [spellInfo, setSpellInfo] = useState<SpellInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpell = async () => {
      console.log(`Fetching information for spell: ${spellName}`); // Debugging log
      const info = await fetchSpellInfo(spellName);
      if (info) {
        console.log(`Fetched information:`, info); // Debugging log
        setSpellInfo(info);
        setError(null);
      } else {
        setError(`Failed to fetch spell information for ${spellName}`);
      }
    };

    fetchSpell();
  }, [spellName]);

  if (error) {
    return <div className="p-4">{error}</div>;
  }

  if (!spellInfo) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-8">
      <button onClick={() => router.push("/")} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 mb-4">Back</button>
      <h1 className="text-4xl font-bold">{spellInfo.name || "Unknown Spell"}</h1>
      {spellInfo.level !== undefined && <p><strong>Level:</strong> {spellInfo.level}</p>}
      {spellInfo.school && <p><strong>School:</strong> {spellInfo.school.name}</p>}
      {spellInfo.components && spellInfo.components.length > 0 && <p><strong>Components:</strong> {spellInfo.components.join(", ")}</p>}
      {spellInfo.range && <p><strong>Range:</strong> {spellInfo.range}</p>}
      {spellInfo.duration && <p><strong>Duration:</strong> {spellInfo.duration}</p>}
      {spellInfo.casting_time && <p><strong>Casting Time:</strong> {spellInfo.casting_time}</p>}
      {spellInfo.desc && spellInfo.desc.length > 0 && <p><strong>Description:</strong> {spellInfo.desc.join(" ")}</p>}
      {spellInfo.higher_level && spellInfo.higher_level.length > 0 && (
        <p><strong>At Higher Levels:</strong> {spellInfo.higher_level.join(" ")}</p>
      )}
    </div>
  );
}