import { Character } from "@/types/Character";
import { supabase } from "@/lib/supabaseClient";
import { transformSupabaseCharacter } from "@/utils/characterTransformer";

export async function getAllCharacters(): Promise<Character[]> {
    console.log("Fetching all characters from Supabase...");
    const { data, error } = await supabase
        .from("characters")
        .select(`
          character_id, created_at, player_name, name, level, xp,
          spell_save_dc, spell_attack_bonus, hit_dice, passive_perception,
          proficiency_bonus, armor_class, speed, hp_max, hp_current, hp_temp,
          inspiration, prepared_spells_max, prepared_spells_current,
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
          character_spell_slots!inner ( level, amount_max, amount_current ),
          character_spells!inner ( spells!inner ( index, name, level ), prepared),
          abilities!inner (index, name)
        `);

    if (error) {
        console.error("Error fetching characters:", error.message);
        throw new Error("Failed to fetch characters");
    }

    console.log(data);

    const formattedData: Character[] = data.map(transformSupabaseCharacter);

    console.log(formattedData);
    return formattedData;
}
