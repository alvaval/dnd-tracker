// export const CHARACTER_DATA = `
//           character_id, player_name, name, level, xp,
//           spell_save_dc, spell_attack_bonus, hit_dice, passive_perception,
//           proficiency_bonus, armor_class, speed, hp_max, hp_current, hp_temp,
//           inspiration, prepared_spells_max,
//           appearance, backstory, personality, ideals, bonds,
//           races!inner (index, name), 
//           subraces!inner (index, name),
//           classes!inner (index, name),
//           subclasses!inner (index, name),
//           backgrounds!inner (index, name),
//           alignments!inner (index, name, acronym),
//           character_abilities!inner (
//             abilities!inner (index, name),
//             value, modifier
//           ),
//           character_skill_proficiencies!inner (
//             skills!inner (index, name)
//           ),
//           character_spell_slots!inner ( level, amount_max, amount_used ),
//           character_spells!inner ( spells!inner ( index, name, level ), prepared),
//           abilities!inner (index, name)
//         `

export const CHARACTER_DATA = `
          character_id, player_name, name, level, xp,
          spell_save_dc, spell_attack_bonus, hit_dice, passive_perception,
          proficiency_bonus, armor_class, speed, hp_max, hp_current, hp_temp,
          inspiration, prepared_spells_max,
          appearance, backstory, personality, ideals, bonds,
          race,
          subrace,
          class,
          subclass,
          background,
          alignment,
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