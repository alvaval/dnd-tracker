import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';
import { transformSupabaseCharacter, transformCharacterToSupabase } from '@/utils/characterTransformer';
import { Character } from '@/types/Character';

// Zustand store to manage global character state
const useCharacterStore = create((set) => ({
    characters: [],
    setCharacters: (chars) => set({ characters: chars }),
    updateCharacter: (updatedChar) => set((state) => ({
        characters: state.characters.map((char) => char.character_id === updatedChar.character_id ? updatedChar : char)
    })),
    addCharacter: (newChar) => set((state) => ({
        characters: [...state.characters, newChar]
    })),
}));

// Supabase real-time listener for character updates and inserts
supabase
    .channel('characters')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'characters' }, (payload) => {
        console.log('Character added:', payload);
        const newChar = transformSupabaseCharacter(payload.new);
        useCharacterStore.getState().addCharacter(newChar);
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'characters' }, (payload) => {
        console.log('Character updated:', payload);
        const updatedChar = transformSupabaseCharacter(payload.new);
        useCharacterStore.getState().updateCharacter(updatedChar);
    })
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'characters' }, (payload) => {
        console.log('Character deleted:', payload);
        const deletedCharId = payload.old.character_id;
        const state = useCharacterStore.getState();
        state.setCharacters(state.characters.filter((char) => char.character_id !== deletedCharId));
    })
    .subscribe();

import { CHARACTER_DATA } from '@/utils/data_helpers';

// Helper to manage caching in localStorage
function cacheCharacters(characters) {
    console.log('Caching characters to localStorage', characters);
    localStorage.setItem('characters', JSON.stringify(characters));
    localStorage.setItem('cacheTimestamp', Date.now().toString());
}

function getCachedCharacters() {
    const cached = localStorage.getItem('characters');
    const timestamp = localStorage.getItem('cacheTimestamp');
    if (cached && timestamp && Date.now() - parseInt(timestamp) < 300000) {
        console.log('Fetching characters from cache', JSON.parse(cached));
        return JSON.parse(cached);
    }
    return null;
}

export async function getAllCharacters(forceRefresh = false) {
    if (!forceRefresh) {
        const cachedCharacters = getCachedCharacters();
        if (cachedCharacters) {
            console.log('Using cached character data.');
            useCharacterStore.getState().setCharacters(cachedCharacters);
            return cachedCharacters;
        }
    }

    console.log('Fetching characters from Supabase.');
    const { data, error } = await supabase
        .from('characters')
        .select(CHARACTER_DATA);

    if (error) {
        throw new Error('Error fetching characters: ' + error.message);
    }

    const characters = data.map(transformSupabaseCharacter);
    cacheCharacters(characters);
    useCharacterStore.getState().setCharacters(characters);
    return characters;
}

export async function getCharacterById(id) {
    const state = useCharacterStore.getState();
    let cachedCharacter = state.characters.find((char) => char.character_id === id);

    // If not found in state, try to rehydrate state from localStorage
    if (!cachedCharacter) {
        const cachedCharacters = getCachedCharacters();
        if (cachedCharacters) {
            console.log('Rehydrating state from localStorage.');
            useCharacterStore.getState().setCharacters(cachedCharacters);
            cachedCharacter = cachedCharacters.find((char) => char.character_id === id);
            if (cachedCharacter) {
                console.log('Fetching character from rehydrated state:', cachedCharacter);
                return cachedCharacter;
            }
        }
    }

    // Fetch from Supabase if not found in state or cache
    console.log('Fetching character from Supabase:', id);
    const { data, error } = await supabase
        .from('characters')
        .select(CHARACTER_DATA)
        .eq('character_id', id)
        .single();

    if (error) {
        throw new Error('Error fetching character: ' + error.message);
    }

    const character = transformSupabaseCharacter(data);
    state.updateCharacter(character);
    return character;
}

const exampleCharacter = new Character({
    character_id: "001",
    created_at: new Date().toISOString(),
    player_name: "Alva",
    name: "Thornak the Strong",
    level: 5,
    xp: 1200,
  
    race: { index: "human", name: "Human" },
    class: { index: "barbarian", name: "Barbarian" },
    background: { index: "soldier", name: "Soldier" },
    alignment: { index: "lg", name: "Lawful Good", acronym: "LG" },
  
    abilityScores: {
      strength: { name: "Strength", score: 18, baseModifier: 4, modifier: 6, saving_throw_proficiency: true },
      dexterity: { name: "Dexterity", score: 14, baseModifier: 2, modifier: 2, saving_throw_proficiency: false },
      constitution: { name: "Constitution", score: 16, baseModifier: 3, modifier: 3, saving_throw_proficiency: true },
      intelligence: { name: "Intelligence", score: 10, baseModifier: 0, modifier: 0, saving_throw_proficiency: false },
      wisdom: { name: "Wisdom", score: 12, baseModifier: 1, modifier: 1, saving_throw_proficiency: false },
      charisma: { name: "Charisma", score: 8, baseModifier: -1, modifier: -1, saving_throw_proficiency: false },
    },
  
    skills: {
      acrobatics: { name: "Acrobatics", baseModifier: 2, modifier: 2, proficiency: false },
      animal_handling: { name: "Animal Handling", baseModifier: 1, modifier: 1, proficiency: true },
      arcana: { name: "Arcana", baseModifier: 0, modifier: 0, proficiency: false },
      athletics: { name: "Athletics", baseModifier: 6, modifier: 6, proficiency: true },
      deception: { name: "Deception", baseModifier: -1, modifier: -1, proficiency: false },
      history: { name: "History", baseModifier: 0, modifier: 0, proficiency: false },
      insight: { name: "Insight", baseModifier: 1, modifier: 1, proficiency: false },
      intimidation: { name: "Intimidation", baseModifier: -1, modifier: -1, proficiency: true },
      investigation: { name: "Investigation", baseModifier: 0, modifier: 0, proficiency: false },
      medicine: { name: "Medicine", baseModifier: 1, modifier: 1, proficiency: false },
      nature: { name: "Nature", baseModifier: 0, modifier: 0, proficiency: false },
      perception: { name: "Perception", baseModifier: 1, modifier: 1, proficiency: true },
      performance: { name: "Performance", baseModifier: -1, modifier: -1, proficiency: false },
      persuasion: { name: "Persuasion", baseModifier: -1, modifier: -1, proficiency: false },
      religion: { name: "Religion", baseModifier: 0, modifier: 0, proficiency: false },
      sleight_of_hand: { name: "Sleight of Hand", baseModifier: 2, modifier: 2, proficiency: false },
      stealth: { name: "Stealth", baseModifier: 2, modifier: 2, proficiency: false },
      survival: { name: "Survival", baseModifier: 3, modifier: 3, proficiency: true },
    },
  
    proficiency_bonus: 3,
    armor_class: 15,
    speed: 30,
  
    hp: {
      current: 45,
      max: 45,
      temp: 0,
    },
  
    inspiration: 1,
  
    appearance: "A towering, muscular warrior with wild black hair and piercing green eyes.",
    backstory: "Thornak grew up in a brutal, unforgiving tribe. He honed his strength to protect his kin and earned his title through sheer force and indomitable spirit.",
    personality: "Brash and fearless, with a protective heart hidden beneath a rough exterior.",
    ideals: "Strength above all. Protect the weak and uphold honour.",
    bonds: "Owes his life to a wise elder who taught him to control his rage.",
  });
  
  console.log(exampleCharacter);  

export async function addTestCharacter() {
    const newCharacter = transformCharacterToSupabase(exampleCharacter);
    const { data, error } = await supabase
        .from('characters')
        .insert([newCharacter]);

    if (error) {
        console.error('Error adding character:', error.message);
    } else {
        console.log('Character added successfully:', data);
    }
}

addTestCharacter();