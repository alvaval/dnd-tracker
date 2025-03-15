"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Character } from "./Character";

const initialCharacters = [
  new Character(
    "Arthos",
    "Human",
    "Fighter",
    "Champion",
    1,
    0,
    "Soldier",
    "Lawful Good",
    "Player1",
    { strength: 16, dexterity: 12, constitution: 14, intelligence: 10, wisdom: 10, charisma: 8 },
    2,
    16,
    2,
    30,
    { current: 30, max: 30, temp: 0 },
    "1d10",
    { success: 0, failure: 0 },
    {
      acrobatics: 2, animalHandling: 2, arcana: 2, athletics: 4, deception: 0, history: 1,
      insight: 2, intimidation: 2, investigation: 1, medicine: 2, nature: 1, perception: 2,
      performance: 0, persuasion: 0, religion: 1, sleightOfHand: 0, stealth: 2, survival: 2
    },
    12,
    0,
    { strength: 4, dexterity: 2, constitution: 2, intelligence: 0, wisdom: 0, charisma: 0 },
    ["Sword", "Shield"],
    [{ name: "Longsword", attackBonus: 5, damage: "1d8+3" }],
    ["Second Wind", "Action Surge"],
    {
      class: "Bard",
      ability: "Charisma",
      spellSaveDC: 12,
      spellAttackBonus: 4,
      spellsKnown: ["Dissonant Whispers", "Vicious Mockery"],
      spellSlots: [{ level: 1, total: 2, used: 0 }]
    },
    "Brave and honorable",
    "Protect the weak",
    "Loyal to the kingdom",
    "Prideful",
    "A seasoned warrior",
    "Knights of the Realm",
    "Royal signet ring"
  )
];

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const router = useRouter();

  useEffect(() => {
    setCharacters(initialCharacters);
    localStorage.setItem("characters", JSON.stringify(initialCharacters));
  }, []);

  const updateHP = (index: number, amount: number) => {
    setCharacters((prev) => {
      const newChars = [...prev];
      newChars[index].updateHP(amount);
      return newChars;
    });
  };

  const updateSpellSlots = (index: number, level: number, amount: number) => {
    setCharacters((prev) => {
      const newChars = [...prev];
      newChars[index].updateSpellSlots(level, amount);
      return newChars;
    });
  };

  const addItemToInventory = (index: number, item: string) => {
    if (!item) return;
    setCharacters((prev) => {
      const newChars = [...prev];
      newChars[index].addItemToInventory(item);
      return newChars;
    });
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-sans">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">D&D Campaign Tracker</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {characters.map((char, index) => (
            <div key={char.name} className="border rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold cursor-pointer hover:underline" onClick={() => router.push(`/character/${char.name}`)}>
                {char.name} (Lvl {char.level} {char.classType})
              </h2>
              <p>Race: {char.race}</p>
              <p>HP: {char.hitPoints.current} / {char.hitPoints.max}</p>
              <p>Spell Slots (Level 1): {char.spellcasting.spellSlots.find(s => s.level === 1)?.used || 0} / {char.spellcasting.spellSlots.find(s => s.level === 1)?.total || 0}</p>
              <p>Inventory: {char.inventory.join(", ")}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => updateHP(index, -1)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">- HP</button>
                <button onClick={() => updateHP(index, 1)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">+ HP</button>
                <button onClick={() => updateSpellSlots(index, 1, -1)} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700">- Spell Slot</button>
                <button onClick={() => updateSpellSlots(index, 1, 1)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">+ Spell Slot</button>
              </div>
              <div className="mt-2">
                <input id={`item-${index}`} type="text" placeholder="Add item" className="p-2 border rounded" />
                <button
                  onClick={() => {
                    const item = (document.getElementById(`item-${index}`) as HTMLInputElement).value;
                    addItemToInventory(index, item);
                    (document.getElementById(`item-${index}`) as HTMLInputElement).value = ''; // Clear input after adding item
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 ml-2"
                >
                  Add Item
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
