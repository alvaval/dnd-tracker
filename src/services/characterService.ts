import { Character } from "@/types/Character";
import { supabase } from "@/lib/supabaseClient";
import { transformSupabaseCharacter } from "@/utils/characterTransformer";

const CHARACTER_DATA = `
          character_id, player_name, name, level, xp,
          armor_class, spell_save_dc, spell_attack_bonus, hit_dice, passive_perception,
          proficiency_bonus, speed, hp_max, hp_current, hp_temp,
          inspiration, prepared_spells_max,
          appearance, backstory, personality, ideals, bonds,
          races!inner (index, name), 
          subraces!inner (index, name),
          classes!inner (index, name),
          subclasses!inner (index, name),
          backgrounds!inner (index, name),
          alignments!inner (index, name, acronym),
          character_abilities!inner (
            abilities!inner (index, name),
            value, modifier
          ),
          character_skill_proficiencies!inner (
            skills!inner (index, name)
          ),
          character_spell_slots!inner ( level, amount_max, amount_used ),
          character_spells!inner ( spells!inner ( index, name, level ), prepared),
          abilities!inner (index, name)
        `

export async function getAllCharacters(): Promise<Character[]> {
    console.log("Fetching all characters from Supabase...");
    const { data, error } = await supabase
        .from("characters")
        .select(CHARACTER_DATA);

    if (error) {
        console.error("Error fetching characters:", error.message);
        throw new Error("Failed to fetch characters from Supabase.");
    }

    const formattedData: Character[] = data.map(transformSupabaseCharacter);

    return formattedData;
}
export async function getCharactersById(characterIds: string | string[]): Promise<Character | Character[] | null> {
    console.log(`Fetching character(s) by ID(s): ${characterIds} from Supabase...`);

    // Ensure characterIds is always an array
    const idsArray = Array.isArray(characterIds) ? characterIds : [characterIds];

    const { data, error } = await supabase
        .from("characters")
        .select(CHARACTER_DATA)
        .in("character_id", idsArray);

    if (error) {
        console.error("Error fetching character(s) by ID:", error.message);
        return null;
    }

    const transformedCharacters = data.map(transformSupabaseCharacter);

    console.log(transformedCharacters)

    // If only one ID was passed, return a single character object
    return Array.isArray(characterIds) && characterIds.length > 1 ? transformedCharacters : transformedCharacters[0];
}
