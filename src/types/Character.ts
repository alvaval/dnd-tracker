export class Character {
  character_id!: string;
  created_at!: string;
  player_name!: string;
  name: string = '';
  level: number = 1;
  xp: number = 0;

  race!: { index: string; name: string };
  subrace?: { index: string; name: string };
  class!: { index: string; name: string };
  subclass?: { index: string; name: string };
  background!: { index: string; name: string };
  alignment?: { index: string; name: string; acronym: string };

  ability!: {
    strength: { name: string; score: number; modifier: number; saving_throw_proficiency: boolean };
    dexterity: { name: string; score: number; modifier: number; saving_throw_proficiency: boolean };
    constitution: { name: string; score: number; modifier: number; saving_throw_proficiency: boolean };
    intelligence: { name: string; score: number; modifier: number; saving_throw_proficiency: boolean };
    wisdom: { name: string; score: number; modifier: number; saving_throw_proficiency: boolean };
    charisma: { name: string; score: number; modifier: number; saving_throw_proficiency: boolean };
  };

  skill!: {
    acrobatics: { name: string; score: number; modifier: number; proficiency: boolean };
    animal_handling: { name: string; score: number; modifier: number; proficiency: boolean };
    arcana: { name: string; score: number; modifier: number; proficiency: boolean };
    athletics: { name: string; score: number; modifier: number; proficiency: boolean };
    deception: { name: string; score: number; modifier: number; proficiency: boolean };
    history: { name: string; score: number; modifier: number; proficiency: boolean };
    insight: { name: string; score: number; modifier: number; proficiency: boolean };
    intimidation: { name: string; score: number; modifier: number; proficiency: boolean };
    investigation: { name: string; score: number; modifier: number; proficiency: boolean };
    medicine: { name: string; score: number; modifier: number; proficiency: boolean };
    nature: { name: string; score: number; modifier: number; proficiency: boolean };
    perception: { name: string; score: number; modifier: number; proficiency: boolean };
    performance: { name: string; score: number; modifier: number; proficiency: boolean };
    persuasion: { name: string; score: number; modifier: number; proficiency: boolean };
    religion: { name: string; score: number; modifier: number; proficiency: boolean };
    sleight_of_hand: { name: string; score: number; modifier: number; proficiency: boolean };
    stealth: { name: string; score: number; modifier: number; proficiency: boolean };  
    survival: { name: string; score: number; modifier: number; proficiency: boolean }
  };

  proficiency_bonus: number = 2;
  armor_class: number = 10;
  speed: number = 30;

  public hp!: {
    current: number;
    max: number;
    temp: number;
  };

  inspiration: number = 0;

  spellcasting?: {
    class: { index: string; name: string };
    ability: { index: string; name: string };
    spellSaveDC: number;
    spellAttackBonus: number;
    spellsKnown: string[];
    spellSlots: { level: number; total: number; used: number }[];
    preparedSpells: {
      spells: string[];
      max: number;
      current: number;
    }
  };

  appearance: string = '';
  backstory: string = '';
  personality: string = '';
  ideals: string = '';
  bonds: string = '';

  constructor(data: Partial<Character>) {
    Object.assign(this, data);
    this.ability = {
      strength: { name: "Strength", score: data.abilities?.strength?.value || 10, modifier: Math.floor((data.abilities?.strength?.value || 10 - 10) / 2) },
      dexterity: { name: "Dexterity", score: data.abilities?.dexterity?.value || 10, modifier: Math.floor((data.abilities?.dexterity?.value || 10 - 10) / 2) },
      constitution: { name: "Constitution", score: data.abilities?.constitution?.value || 10, modifier: Math.floor((data.abilities?.constitution?.value || 10 - 10) / 2) },
      intelligence: { name: "Intelligence", score: data.abilities?.intelligence?.value || 10, modifier: Math.floor((data.abilities?.intelligence?.value || 10 - 10) / 2) },
      wisdom: { name: "Wisdom", score: data.abilities?.wisdom?.value || 10, modifier: Math.floor((data.abilities?.wisdom?.value || 10 - 10) / 2) },
      charisma: { name: "Charisma", score: data.abilities?.charisma?.value || 10, modifier: Math.floor((data.abilities?.charisma?.value || 10 - 10) / 2) }
    };
  }

  levelUp(): void {
    this.level++;
    this.xp = 0; // Reset XP or modify as per leveling rules
    this.proficiency_bonus = Math.floor((this.level - 1) / 4) + 2;
  }

  takeDamage(amount: number): void {
    const effectiveDamage = Math.max(0, amount - this.hp.temp);
    this.hp.temp = Math.max(0, this.hp.temp - amount);
    this.hp.current = Math.max(0, this.hp.current - effectiveDamage);
  }

  heal(amount: number): void {
    this.hp.current = Math.min(this.hp.max, this.hp.current + amount);
  }
}