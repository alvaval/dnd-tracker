import React from "react";
import { Character } from "@/types/Character";

interface CharacterCardProps {
  character: Character;
  onBack: () => void;
}

export default function CharacterCard({ character, onBack }: CharacterCardProps) {
  return (
    <div className="p-8 bg-gray-800 text-white rounded-lg shadow-md">
      <button 
        onClick={onBack} 
        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 mb-4 transition"
      >
        Back
      </button>
      <h1 className="text-4xl font-bold mb-4">{character.name}</h1>

      <div className="text-gray-400">
        <p>Race: {character.races?.name} {character.subraces?.name ? `(Subrace: ${character.subraces.name})` : ""}</p>
        <p>Class: {character.classes?.name} {character.subclasses?.name ? `(Subclass: ${character.subclasses.name})` : ""}</p>
        <p>Level: {character.level}</p>
        <p>XP: {character.xp}</p>
        <p>Background: {character.backgrounds?.name}</p>
        <p>Alignment: {character.alignments?.name} ({character.alignments?.acronym})</p>
        <p>Player: {character.player_name}</p>
      </div>

      <h2 className="text-2xl font-semibold mt-4">Abilities</h2>
      <div className="grid grid-cols-2 gap-4">
        <p>STR: {character.strength}</p>
        <p>DEX: {character.dexterity}</p>
        <p>CON: {character.constitution}</p>
        <p>INT: {character.intelligence}</p>
        <p>WIS: {character.wisdom}</p>
        <p>CHA: {character.charisma}</p>
      </div>

      <h2 className="text-2xl font-semibold mt-4">Combat Stats</h2>
      <p>Armor Class: {character.armor_class}</p>
      <p>Speed: {character.speed} ft</p>
      <p>HP: {character.hp_current} / {character.hp_max}</p>
    </div>
  );
}
