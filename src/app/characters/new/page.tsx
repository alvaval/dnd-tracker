"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Define TypeScript interfaces for character and abilities
interface Abilities {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
}

interface Character {
  name: string;
  race: string;
  subrace: string;
  class: string;
  subclass: string;
  background: string;
  abilities: Abilities;
}

// Options for each selectable category
const raceOptions = ["Human", "Elf", "Dwarf"];
const subraceOptions: Record<string, string[]> = {
  Human: ["Variant Human"],
  Elf: ["High Elf", "Wood Elf", "Dark Elf (Drow)"],
  Dwarf: ["Hill Dwarf", "Mountain Dwarf"],
};
const classOptions = ["Fighter", "Wizard", "Rogue"];
const subclassOptions: Record<string, string[]> = {
  Fighter: ["Champion", "Battle Master", "Eldritch Knight"],
  Wizard: ["School of Evocation", "School of Illusion", "School of Necromancy"],
  Rogue: ["Thief", "Assassin", "Arcane Trickster"],
};
const backgroundOptions = ["Soldier", "Noble", "Criminal", "Sage"];

// Point-buy cost mapping for ability scores 8 through 15
const costMap: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

export default function NewCharacterPage() {
  const router = useRouter();
  const steps = ["General Info", "Race", "Subrace", "Class", "Subclass", "Abilities", "Background"];
  
  // State for active step index and character data
  const [activePage, setActivePage] = useState(0);
  const [character, setCharacter] = useState<Character>({
    name: "",
    race: "",
    subrace: "",
    class: "",
    subclass: "",
    background: "",
    abilities: { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 },
  });
  
  // State for modal dialog selection
  type StepKey = "race" | "subrace" | "class" | "subclass" | "background";
  const [selectedOption, setSelectedOption] = useState<{ step: StepKey; value: string } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Calculate total points spent on abilities (for point-buy tracking)
  const pointsSpent = Object.values(character.abilities).reduce((sum, score) => sum + costMap[score], 0);
  
  // Handle selecting an option (opens confirmation modal)
  const handleSelectOption = (step: StepKey, value: string) => {
    setSelectedOption({ step, value });
    setModalOpen(true);
  };
  
  // Confirm selection in modal (save to character state)
  const confirmSelection = () => {
    if (!selectedOption) return;
    const { step, value } = selectedOption;
    setCharacter(prev => {
      // If selecting a new race, reset subrace; if selecting a new class, reset subclass
      if (step === "race") {
        return { ...prev, race: value, subrace: "" };
      }
      if (step === "class") {
        return { ...prev, class: value, subclass: "" };
      }
      // Otherwise, just set the chosen value for the corresponding step
      return { ...prev, [step]: value };
    });
    setModalOpen(false);
    setSelectedOption(null);
  };
  
  // Cancel selection in modal (do not save)
  const cancelSelection = () => {
    setModalOpen(false);
    setSelectedOption(null);
  };
  
  // Ability score increment/decrement handlers
  const incrementAbility = (ability: keyof Abilities) => {
    setCharacter(prev => {
      const currentScore = prev.abilities[ability];
      if (currentScore >= 15) return prev; // cannot exceed 15
      const newScore = currentScore + 1;
      // Calculate point cost difference for this increment
      const costDiff = costMap[newScore] - costMap[currentScore];
      const currentTotal = Object.values(prev.abilities).reduce((sum, score) => sum + costMap[score], 0);
      if (currentTotal + costDiff > 27) {
        return prev; // do nothing if it would exceed 27 points
      }
      return {
        ...prev,
        abilities: { ...prev.abilities, [ability]: newScore }
      };
    });
  };
  
  const decrementAbility = (ability: keyof Abilities) => {
    setCharacter(prev => {
      const currentScore = prev.abilities[ability];
      if (currentScore <= 8) return prev; // cannot go below 8
      const newScore = currentScore - 1;
      return {
        ...prev,
        abilities: { ...prev.abilities, [ability]: newScore }
      };
    });
  };
  
  // Final submission of character
  const handleSubmit = () => {
    console.log("Created character:", character);
    router.push("/party");
  };
  
  return (
    <div className="flex flex-col md:flex-row">
      {/* Main content area */}
      <div className="flex-1 p-4">
        {/* Step navigation buttons */}
        <div className="mb-4 flex flex-wrap gap-2">
          {steps.map((stepName, index) => (
            <button
              key={index}
              onClick={() => setActivePage(index)}
              className={`px-4 py-2 rounded ${
                activePage === index ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {stepName}
            </button>
          ))}
        </div>
        
        {/* Step 0: General Info */}
        {activePage === 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">General Info</h2>
            <label className="block font-medium mb-1" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={character.name}
              onChange={(e) => setCharacter(prev => ({ ...prev, name: e.target.value }))}
              className="border rounded px-3 py-2 w-full"
              placeholder="Character Name"
            />
          </div>
        )}
        
        {/* Step 1: Race */}
        {activePage === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Select Race</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {raceOptions.map(race => (
                <button
                  key={race}
                  onClick={() => handleSelectOption("race", race)}
                  className="border rounded px-3 py-2 text-left hover:bg-blue-50"
                >
                  {race}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Step 2: Subrace */}
        {activePage === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Select Subrace</h2>
            {!character.race ? (
              <p className="text-gray-700">Please select a race first.</p>
            ) : subraceOptions[character.race] && subraceOptions[character.race].length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {subraceOptions[character.race].map(subrace => (
                  <button
                    key={subrace}
                    onClick={() => handleSelectOption("subrace", subrace)}
                    className="border rounded px-3 py-2 text-left hover:bg-blue-50"
                  >
                    {subrace}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-700">No subrace available for <strong>{character.race}</strong>.</p>
            )}
          </div>
        )}
        
        {/* Step 3: Class */}
        {activePage === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Select Class</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {classOptions.map(cls => (
                <button
                  key={cls}
                  onClick={() => handleSelectOption("class", cls)}
                  className="border rounded px-3 py-2 text-left hover:bg-blue-50"
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Step 4: Subclass */}
        {activePage === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Select Subclass</h2>
            {!character.class ? (
              <p className="text-gray-700">Please select a class first.</p>
            ) : subclassOptions[character.class] && subclassOptions[character.class].length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {subclassOptions[character.class].map(subcls => (
                  <button
                    key={subcls}
                    onClick={() => handleSelectOption("subclass", subcls)}
                    className="border rounded px-3 py-2 text-left hover:bg-blue-50"
                  >
                    {subcls}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-700">No subclass available for <strong>{character.class}</strong>.</p>
            )}
          </div>
        )}
        
        {/* Step 5: Abilities */}
        {activePage === 5 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Abilities</h2>
            <p className="mb-4 text-gray-700">
              Distribute your 27 points among the abilities (scores range from 8 to 15).
            </p>
            {/* Ability score controls */}
            <div className="space-y-3">
              {Object.entries(character.abilities).map(([ability, score]) => {
                const scoreNum = score; // numeric value of score
                const nextCostDiff = scoreNum < 15 ? costMap[scoreNum + 1] - costMap[scoreNum] : 0;
                const cannotIncrease = scoreNum >= 15 || pointsSpent + nextCostDiff > 27;
                return (
                  <div key={ability} className="flex items-center justify-between">
                    <span className="w-20 font-medium">{ability}</span>
                    <div className="flex items-center">
                      <button
                        onClick={() => decrementAbility(ability as keyof Abilities)}
                        disabled={scoreNum <= 8}
                        className="px-2 py-1 bg-gray-300 rounded-l disabled:opacity-50"
                      >
                        −
                      </button>
                      <span className="px-3 w-8 text-center">{scoreNum}</span>
                      <button
                        onClick={() => incrementAbility(ability as keyof Abilities)}
                        disabled={cannotIncrease}
                        className="px-2 py-1 bg-gray-300 rounded-r disabled:opacity-50"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Display points spent out of 27 */}
            <p className="mt-3 text-gray-800">
              <strong>Points Spent:</strong> {pointsSpent} / 27
            </p>
          </div>
        )}
        
        {/* Step 6: Background */}
        {activePage === 6 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Select Background</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {backgroundOptions.map(bg => (
                <button
                  key={bg}
                  onClick={() => handleSelectOption("background", bg)}
                  className="border rounded px-3 py-2 text-left hover:bg-blue-50"
                >
                  {bg}
                </button>
              ))}
            </div>
            {/* Submit button to finalize character creation */}
            <button
              onClick={handleSubmit}
              className="mt-6 px-4 py-2 bg-green-600 text-white font-semibold rounded"
            >
              Create Character
            </button>
          </div>
        )}
      </div>
      
      {/* Sidebar summary */}
      <aside className="md:w-1/3 p-4 bg-gray-100">
        <h2 className="text-xl font-semibold mb-3">Summary</h2>
        <div className="space-y-1 text-gray-800">
          <p><strong>Name:</strong> {character.name || "-"}</p>
          <p><strong>Race:</strong> {character.race || "-"}</p>
          <p><strong>Subrace:</strong> {character.subrace || "-"}</p>
          <p><strong>Class:</strong> {character.class || "-"}</p>
          <p><strong>Subclass:</strong> {character.subclass || "-"}</p>
          <p><strong>Background:</strong> {character.background || "-"}</p>
        </div>
        <div className="mt-4 text-gray-800">
          <h3 className="text-lg font-medium mb-2">Ability Scores</h3>
          <ul className="space-y-1">
            {Object.entries(character.abilities).map(([ability, score]) => (
              <li key={ability}>
                <strong>{ability}:</strong> {score}
              </li>
            ))}
          </ul>
        </div>
      </aside>
      
      {/* Confirmation Modal */}
      {modalOpen && selectedOption && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">Confirm Selection</h3>
            <p className="mb-6">
              Choose <strong>{selectedOption.value}</strong> as your{" "}
              {selectedOption.step.charAt(0).toUpperCase() + selectedOption.step.slice(1)}?
            </p>
            <div className="flex justify-end space-x-3">
              <button onClick={cancelSelection} className="px-4 py-2 bg-gray-500 text-white rounded">
                Cancel
              </button>
              <button onClick={confirmSelection} className="px-4 py-2 bg-blue-600 text-white rounded">
                Choose
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
