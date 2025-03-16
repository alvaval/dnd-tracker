export interface Character {
  character_id: string;
  created_at: string;
  player_name: string;
  name: string;
  level: number;
  xp: number;

  // Foreign key IDs (for reference)
  race_id: number;
  subrace_id?: number;
  class_id: number;
  subclass_id?: number;
  background_id: number;
  alignment_id: number;

  // Related table objects (nested results from Supabase)
  races?: { name: string };
  subraces?: { name: string };
  classes?: { name: string };
  subclasses?: { name: string };
  backgrounds?: { name: string };
  alignments?: { name: string; acronym: string };

  // Attributes
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  proficiency_bonus: number;
  armor_class: number;
  speed: number;
  hp_max: number;
  hp_current: number;
  hp_temp: number;
  inspiration: number;
  prepared_spells_max: number;
  prepared_spells_current: number;

  // Character description
  appearance: string;
  backstory: string;
  personality: string;
  ideals: string;
  bonds: string;
}
