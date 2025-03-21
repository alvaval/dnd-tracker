"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getRaceInfo as fetchRaceInfo, getTraitInfo as fetchTraitInfo, getSubraces, getSubraceInfo } from "@/utils/api";
import Tooltip from "@/components/Tooltip";

export default function RacePage() {
  const router = useRouter();
  const params = useParams();
  const raceName = decodeURIComponent(params.name as string);
  
  interface RaceInfo {
    name: string;
    speed: number;
    ability_bonuses?: { ability_score: { name: string }, bonus: number }[];
    alignment?: string;
    age?: string;
    size?: string;
    size_description?: string;
    languages?: { name: string }[];
    traits?: { index: string, name: string }[];
    subraces?: { index: string, name: string }[];
  }

  interface TraitInfo {
    name: string;
    desc: string[];
  }

  interface SubraceInfo {
    index: string;
    name: string;
    desc: string;
    ability_bonuses?: { ability_score: { name: string }, bonus: number }[];
    starting_proficiencies?: { name: string }[];
    languages?: { name: string }[];
    racial_traits?: { name: string }[];
  }

  const [raceInfo, setRaceInfo] = useState<RaceInfo | null>(null);
  const [subraces, setSubraces] = useState<SubraceInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [traitInfo, setTraitInfo] = useState<{ [key: string]: TraitInfo | null }>({});

  useEffect(() => {
    const fetchRace = async () => {
      console.log(`Fetching information for race: ${raceName}`); // Debugging log
      const info = await fetchRaceInfo(raceName);
      if (info) {
        console.log(`Fetched information:`, info); // Debugging log
        setRaceInfo(info);
        setError(null);
      } else {
        setError(`Failed to fetch race information for ${raceName}`);
      }
    };

    const fetchSubraces = async () => {
      const subraceList = await getSubraces(raceName);
      const subraceInfoPromises = subraceList.map(async (subrace) => {
        const info = await getSubraceInfo(subrace.index);
        return info;
      });
      const subraceInfoResults = await Promise.all(subraceInfoPromises);
      setSubraces(subraceInfoResults);
    };

    fetchRace();
    fetchSubraces();
  }, [raceName]);

  const handleTraitHover = async (traitIndex: string) => {
    if (!traitInfo[traitIndex]) {
      const info = await fetchTraitInfo(traitIndex);
      setTraitInfo(prev => ({ ...prev, [traitIndex]: info }));
    }
  };

  if (error) {
    return <div className="p-4">{error}</div>;
  }

  if (!raceInfo) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-8">
      <button onClick={() => router.push("/")} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 mb-4">Back</button>
      <h1 className="text-4xl font-bold">{raceInfo.name || "Unknown Race"}</h1>
      {raceInfo.speed !== undefined && <p><strong>Speed:</strong> {raceInfo.speed} ft.</p>}
      {raceInfo.ability_bonuses && raceInfo.ability_bonuses.length > 0 && (
        <p><strong>Ability Bonuses:</strong> {raceInfo.ability_bonuses.map(bonus => `${bonus.ability_score?.name || "Unknown"} +${bonus.bonus}`).join(", ")}</p>
      )}
      {raceInfo.alignment && <p><strong>Alignment:</strong> {raceInfo.alignment}</p>}
      {raceInfo.age && <p><strong>Age:</strong> {raceInfo.age}</p>}
      {raceInfo.size && <p><strong>Size:</strong> {raceInfo.size}</p>}
      {raceInfo.size_description && <p><strong>Size Description:</strong> {raceInfo.size_description}</p>}
      {raceInfo.languages && raceInfo.languages.length > 0 && (
        <div>
          <strong>Languages:</strong>
          <ul>
            {raceInfo.languages.map((language, index) => (
              <li key={index}>{language.name}</li>
            ))}
          </ul>
        </div>
      )}
      {raceInfo.traits && raceInfo.traits.length > 0 && (
        <div>
          <strong>Traits:</strong>
          <ul className="space-y-1">
            {raceInfo.traits.map((trait) => (
              <li key={trait.index} className="block">
                <Tooltip
                  content={
                    traitInfo[trait.index]?.desc.join(" ") || "Loading..."
                  }
                >
                  <span
                    className="text-blue-500 cursor-pointer hover:underline"
                    onClick={() =>
                      router.push(`/trait/${encodeURIComponent(trait.index)}`)
                    }
                    onMouseEnter={() => handleTraitHover(trait.index)}
                  >
                    {trait.name}
                  </span>
                </Tooltip>
              </li>
            ))}
          </ul>
        </div>
      )}
      {subraces.length > 0 && (
        <div>
          <strong>Subraces:</strong>
          {subraces.map((subrace) => (
            <div key={subrace.index} className="mt-4">
              <h2 className="text-2xl font-semibold">{subrace.name}</h2>
              <p>{subrace.desc}</p>
              {subrace.ability_bonuses && subrace.ability_bonuses.length > 0 && (
                <p><strong>Ability Bonuses:</strong> {subrace.ability_bonuses.map(bonus => `${bonus.ability_score?.name || "Unknown"} +${bonus.bonus}`).join(", ")}</p>
              )}
              {subrace.starting_proficiencies && subrace.starting_proficiencies.length > 0 && (
                <p><strong>Starting Proficiencies:</strong> {subrace.starting_proficiencies.map(proficiency => proficiency.name).join(", ")}</p>
              )}
              {subrace.languages && subrace.languages.length > 0 && (
                <p><strong>Languages:</strong> {subrace.languages.map(language => language.name).join(", ")}</p>
              )}
              {subrace.racial_traits && subrace.racial_traits.length > 0 && (
                <p><strong>Racial Traits:</strong> {subrace.racial_traits.map(trait => trait.name).join(", ")}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
