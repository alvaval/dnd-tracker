import { Character } from "@/types/Character";

export function transformSupabaseCharacter(char: any): Character {
    const abilityScores: Record<string, number> = {};
    
    if (char.character_abilities) {
        char.character_abilities.forEach(a => {
            abilityScores[a.abilities.index] = a.modifier;
        });
    }
    
    const skillProficiencies: Record<string, boolean> = {};
    if (char.character_skill_proficiencies) {
        char.character_skill_proficiencies.forEach(sp => {
            skillProficiencies[sp.skills.index] = true;
        });
    }
    
    const spellsKnown = char.character_spells ? char.character_spells.map(spell => ({
        index: spell.spells.index,
        name: spell.spells.name,
        level: spell.spells.level,
        prepared: spell.prepared
    })) : [];
    
    return new Character({
        character_id: char.character_id,
        created_at: char.created_at,
        player_name: char.player_name,
        name: char.name,
        level: char.level,
        xp: char.xp,
        race: char.races ? { index: char.races.index, name: char.races.name } : null,
        subrace: char.subraces ? { index: char.subraces.index, name: char.subraces.name } : null,
        class: char.classes ? { index: char.classes.index, name: char.classes.name } : null,
        subclass: char.subclasses ? { index: char.subclasses.index, name: char.subclasses.name } : null,
        background: char.backgrounds ? { index: char.backgrounds.index, name: char.backgrounds.name } : null,
        alignment: char.alignments ? { index: char.alignments.index, name: char.alignments.name, acronym: char.alignments.acronym } : null,
        abilityScores,
        skillProficiencies,
        spellcasting: char.abilities ? {
            ability: {
                index: char.abilities.index,
                name: char.abilities.name,
            },
            spell_save_dc: char.spell_save_dc,
            spell_attack_bonus: char.spell_attack_bonus,
            prepared_spells_max: char.prepared_spells_max,
            prepared_spells_current: char.prepared_spells_current,
            spellsKnown
        } : null,

        hit_dice: char.hit_dice,
        passive_perception: char.passive_perception,
        proficiency_bonus: char.proficiency_bonus,
        armor_class: char.armor_class,
        speed: char.speed,

        hp: {
            current: char.hp_current,
            max: char.hp_max,
            temp: char.hp_temp,},

        inspiration: char.inspiration,

        appearance: char.appearance,
        backstory: char.backstory,
        personality: char.personality,
        ideals: char.ideals,
        bonds: char.bonds,
    });
}