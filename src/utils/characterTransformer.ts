import { Character } from "@/types/Character";
import { abilityMappings, classMappings, raceMappings, subclassMappings, subraceMappings, alignmentMappings, backgroundMappings } from "@/utils/indexNameMappings";

/**
 * Transforms a character object from database into a Character object.
 */
export function transformSupabaseCharacter(char: any): Character {

    const raceName = raceMappings[char.race] || '';
    const subraceName = subraceMappings[char.subrace] || '';
    const className = classMappings[char.class] || '';
    const subclassName = subclassMappings[char.subclass] || '';
    const alignmentName = alignmentMappings[char.alignment] || '';
    const backgroundName = backgroundMappings[char.background] || '';

    const abilityScores = Object.entries(abilityMappings).reduce((acc, [key, name]) => {
        acc[key] = {
            name: name,
            score: 0,
            baseModifier: 0,
            modifier: 0,
            saving_throw_proficiency: false,
        };
        return acc;
    }, {} as Record<string, { name: string; score: number; baseModifier: number; modifier: number, saving_throw_proficiency: boolean }>);
    
    if (char.character_abilities) {
        char.character_abilities.forEach(a => {
            if (abilityScores[a.abilities.index]) {
                abilityScores[a.abilities.index].score = a.value;
                abilityScores[a.abilities.index].modifier = a.modifier;
                abilityScores[a.abilities.index].baseModifier = a.modifier;
            }
        });
    }

    const savingThrowProficiencies = new Set(
        char.character_saving_throw_proficiencies ? char.character_saving_throw_proficiencies.map(sp => sp.abilities.index) : []
    );
    
    Object.keys(abilityScores).forEach(ability => {
        if (savingThrowProficiencies.has(ability)) {
            abilityScores[ability].saving_throw_proficiency = true;
            abilityScores[ability].modifier += char.proficiency_bonus || 0;
        }
    });

    const skillProficiencies = new Set(
        char.character_skill_proficiencies ? char.character_skill_proficiencies.map(sp => sp.skills.index) : []
    );

    const skillMappings: Record<string, { ability: string; name: string }> = {
        acrobatics: { ability: "dexterity", name: "Acrobatics" },
        animal_handling: { ability: "wisdom", name: "Animal Handling" },
        arcana: { ability: "intelligence", name: "Arcana" },
        athletics: { ability: "strength", name: "Athletics" },
        deception: { ability: "charisma", name: "Deception" },
        history: { ability: "intelligence", name: "History" },
        insight: { ability: "wisdom", name: "Insight" },
        intimidation: { ability: "charisma", name: "Intimidation" },
        investigation: { ability: "intelligence", name: "Investigation" },
        medicine: { ability: "wisdom", name: "Medicine" },
        nature: { ability: "intelligence", name: "Nature" },
        perception: { ability: "wisdom", name: "Perception" },
        performance: { ability: "charisma", name: "Performance" },
        persuasion: { ability: "charisma", name: "Persuasion" },
        religion: { ability: "intelligence", name: "Religion" },
        sleight_of_hand: { ability: "dexterity", name: "Sleight of Hand" },
        stealth: { ability: "dexterity", name: "Stealth" },
        survival: { ability: "wisdom", name: "Survival" },
    };

    const skills = Object.entries(skillMappings).reduce((acc, [skill, { ability, name }]) => {
        const baseModifier = abilityScores[ability]?.modifier || 0;
        const proficiencyBonus = skillProficiencies.has(skill) ? (char.proficiency_bonus || 0) : 0;

        acc[skill] = {
            name: name,
            baseModifier: baseModifier,
            modifier: baseModifier + proficiencyBonus,
            proficiency: skillProficiencies.has(skill),
        };
        return acc;
    }, {} as Record<string, { name: string; baseModifier: number; modifier: number; proficiency: boolean }>);
    
    // const spellsKnown = char.character_spells ? char.character_spells.map(spell => ({
    //     index: spell.spells.index,
    //     name: spell.spells.name,
    //     level: spell.spells.level,
    //     prepared: spell.prepared
    // })) : [];
    
    const spellsKnown = char.character_spells ? char.character_spells.map(spell => spell.spell.index) : [];    // Store only the spell index for now
    const spellsPrepared = char.character_spells ? char.character_spells.filter(spell => spell.prepared).map(spell => spell.spell.index) : []; // Store only the spell index for now
    
    return new Character({
        character_id: char.character_id,
        player_name: char.player_name,
        name: char.name,
        level: char.level,
        xp: char.xp,
        party_id: char.party,
        race: { index: char.race, name: raceName },
        subrace: char.subrace ? { index: char.subrace, name: subraceName } : null,
        class: { index: char.class, name: className },
        subclass: char.subclass ? { index: char.subclass, name: subclassName } : null,
        background: { index: char.background, name: backgroundName },
        alignment: char.alignment ? { index: char.alignment, name: alignmentName } : null,
        abilityScores,
        skills,

        spellcasting: char.abilities ? {
            ability: {
                index: char.abilities.index,
                name: char.abilities.name,
            },
            spell_save_dc: char.spell_save_dc || 0,
            spell_attack_bonus: char.spell_attack_bonus || 0,
            preparedSpells: {
                spells: spellsPrepared,
                max: char.prepared_spells_max || 0,
                current: spellsPrepared.length
            },
            spellsKnown,
            spellSlots: char.character_spell_slots ? char.character_spell_slots.map(slot => ({
                level: slot.level,
                used: slot.amount_used,
                total: slot.amount_max
            })) : []
        } : null,

        hit_dice: char.hit_dice,
        passive_perception: char.passive_perception,
        proficiency_bonus: char.proficiency_bonus,
        armor_class: char.armor_class,
        speed: char.speed,
        hp: {
            current: char.hp_current,
            max: char.hp_max,
            temp: char.hp_temp,
        },
        inspiration: char.inspiration,
        appearance: char.appearance,
        backstory: char.backstory,
        personality: char.personality,
        ideals: char.ideals,
        bonds: char.bonds,
    });
}


/**
 * Transforms a Character object into a format suitable for Supabase insertion.
 */
export function transformCharacterToSupabase(char: Character): any {
    const abilityScores = Object.entries(abilityMappings).map(([key, name]) => {
        return {
            index: key,
            name: name,
            value: char.abilityScores[key]?.score || 0,
            modifier: char.abilityScores[key]?.modifier || 0,
            saving_throw_proficiency: char.abilityScores[key]?.saving_throw_proficiency || false,
        };
    });

    const characterData = {
        character_id: char.character_id || null,
        player_name: char.player_name || '',
        name: char.name || '',
        level: char.level || 1,
        xp: char.xp || 0,
        proficiency_bonus: char.proficiency_bonus || 2,
        armor_class: char.armor_class || 10,
        speed: char.speed || 30,
        hp_max: char.hp?.max || 0,
        hp_current: char.hp?.current || 0,
        hp_temp: char.hp?.temp || 0,
        inspiration: char.inspiration || 0,
        appearance: char.appearance || '',
        backstory: char.backstory || '',
        personality: char.personality || '',
        ideals: char.ideals || '',
        bonds: char.bonds || '',
        race: char.race?.index || '',
        subrace: char.subrace?.index || null,
        class: char.class?.index || '',
        subclass: char.subclass?.index || null,
        background: char.background?.index || '',
        alignment: char.alignment?.index || '',
    };

    const characterAbilities = abilityScores.map((ability) => ({
        character_id: char.character_id || '',
        value: ability.value,
        modifier: ability.modifier,
        saving_throw_proficiency: ability.saving_throw_proficiency,
        ability: ability.index,
    }));

    return { characterData, characterAbilities };
}
