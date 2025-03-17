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

  abilityScores!: {
    strength: { name: string; score: number; baseModifier: number; modifier: number; saving_throw_proficiency: boolean };
    dexterity: { name: string; score: number; baseModifier: number; modifier: number; saving_throw_proficiency: boolean };
    constitution: { name: string; score: number; baseModifier: number; modifier: number; saving_throw_proficiency: boolean };
    intelligence: { name: string; score: number; baseModifier: number; modifier: number; saving_throw_proficiency: boolean };
    wisdom: { name: string; score: number; baseModifier: number; modifier: number; saving_throw_proficiency: boolean };
    charisma: { name: string; score: number; baseModifier: number; modifier: number; saving_throw_proficiency: boolean };
  };

  skills!: {
    acrobatics: { name: string; baseModifier: number; modifier: number; proficiency: boolean };
    animal_handling: { name: string; baseModifier: number; modifier: number; proficiency: boolean };
    arcana: { name: string; baseModifier: number; modifier: number; proficiency: boolean };
    athletics: { name: string; baseModifier: number; modifier: number; proficiency: boolean };
    deception: { name: string; baseModifier: number; modifier: number; proficiency: boolean };
    history: { name: string; baseModifier: number; modifier: number; proficiency: boolean };
    insight: { name: string; baseModifier: number; modifier: number; proficiency: boolean };
    intimidation: { name: string; baseModifier: number; modifier: number; proficiency: boolean };
    investigation: { name: string; baseModifier: number; modifier: number; proficiency: boolean };
    medicine: { name: string; baseModifier: number; modifier: number; proficiency: boolean };
    nature: { name: string; baseModifier: number; modifier: number; proficiency: boolean };
    perception: { name: string; baseModifier: number; modifier: number; proficiency: boolean };
    performance: { name: string; baseModifier: number; modifier: number; proficiency: boolean };
    persuasion: { name: string; baseModifier: number; modifier: number; proficiency: boolean };
    religion: { name: string; baseModifier: number; modifier: number; proficiency: boolean };
    sleight_of_hand: { name: string; baseModifier: number; modifier: number; proficiency: boolean };
    stealth: { name: string; baseModifier: number; modifier: number; proficiency: boolean };  
    survival: { name: string; baseModifier: number; modifier: number; proficiency: boolean }
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
    spellSlots: { level: number; used: number; total: number }[];
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