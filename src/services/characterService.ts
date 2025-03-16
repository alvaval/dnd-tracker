import { supabase } from "@/lib/supabaseClient";
import { Character } from "@/types/Character";

/**
 * Fetch all characters from the database.
 * Used in CharacterOverview.tsx.
 */
export async function getAllCharacters(): Promise<Character[]> {
    console.log("Fetching all characters from Supabase...");
    const { data, error } = await supabase
        .from("characters")
        .select(`
          character_id, created_at, player_name, name, level, xp,
          races (name), 
          subraces (name),
          classes (name),
          subclasses (name),
          backgrounds (name),
          alignments (name, acronym),
          strength, dexterity, constitution, intelligence, wisdom, charisma,
          proficiency_bonus, armor_class, speed, hp_max, hp_current, hp_temp,
          inspiration, prepared_spells_max, prepared_spells_current,
          appearance, backstory, personality, ideals, bonds
        `);

    if (error) {
        console.error("Error fetching characters:", error.message, error.details, error.hint);
        throw new Error("Failed to fetch characters");
    }

    console.log("Fetched characters:", data);
    return data || [];
}

/**
 * Fetch a single character by ID.
 * Used in page.tsx.
 */
export async function getCharacterById(characterId: string): Promise<Character | null> {
    console.log(`Fetching character with ID: ${characterId} from Supabase...`);
    const { data, error } = await supabase
        .from("characters")
        .select(`
          character_id, created_at, player_name, name, level, xp,
          races (name), 
          subraces (name),
          classes (name),
          subclasses (name),
          backgrounds (name),
          alignments (name, acronym),
          strength, dexterity, constitution, intelligence, wisdom, charisma,
          proficiency_bonus, armor_class, speed, hp_max, hp_current, hp_temp,
          inspiration, prepared_spells_max, prepared_spells_current,
          appearance, backstory, personality, ideals, bonds
        `)
        .eq("character_id", characterId)
        .single();

    if (error) {
        console.error("Error fetching character:", error.message, error.details, error.hint);
        throw new Error("Failed to fetch character");
    }

    console.log("Fetched character:", data);
    return data;
}
