import { supabase } from "@/lib/supabaseClient";
import { Character } from "@/types/Character";

/**
 * Fetch all characters from the database.
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
        console.error("Error fetching characters:", error.message);
        throw new Error("Failed to fetch characters");
    }

    return data || [];
}

/**
 * Fetch a single character by ID.
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
        .maybeSingle(); // Prevents JSON error if no character exists

    if (error) {
        console.error("Error fetching character:", error.message);
        throw new Error("Failed to fetch character");
    }

    return data;
}

/**
 * Increase or decrease the character's current HP.
 * @param characterId - ID of the character
 * @param amount - Amount to increase or decrease (negative for decrease)
 */
export async function updateCharacterHP(characterId: string, amount: number): Promise<Character | null> {
    console.log(`Updating hp_current for character ${characterId} by ${amount}...`);

    // Fetch the current hp
    const { data: character, error: fetchError } = await supabase
        .from("characters")
        .select("hp_current, hp_max")
        .eq("character_id", characterId)
        .maybeSingle();

    if (fetchError || !character) {
        console.error("Error fetching character:", fetchError?.message || "Character not found.");
        throw new Error("Failed to fetch character's HP");
    }

    // Calculate new HP within valid bounds
    const newHP = Math.max(0, Math.min(character.hp_current + amount, character.hp_max));

    // Update the database with new HP value
    const { error: updateError } = await supabase
        .from("characters")
        .update({ hp_current: newHP })
        .eq("character_id", characterId);

    if (updateError) {
        console.error("Error updating HP:", updateError.message);
        throw new Error("Failed to update character HP");
    }

    // Re-fetch full character data to ensure all fields are updated
    const { data: updatedCharacter, error: refetchError } = await supabase
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
        .maybeSingle();

    if (refetchError || !updatedCharacter) {
        console.error("Error refetching character:", refetchError?.message || "Character not found.");
        throw new Error("Failed to fetch updated character");
    }

    console.log("Updated character HP:", updatedCharacter);
    return updatedCharacter;
}
