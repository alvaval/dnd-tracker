export class Character {
  constructor(
    public name: string,
    public race: string,
    public classType: string,
    public subclass: string,
    public level: number,
    public xp: number,
    public background: string,
    public alignment: string,
    public playerName: string,
    public abilityScores: {
      strength: number;
      dexterity: number;
      constitution: number;
      intelligence: number;
      wisdom: number;
      charisma: number;
    },
    public proficiencyBonus: number,
    public armorClass: number,
    public initiative: number,
    public speed: number,
    public hitPoints: {
      current: number;
      max: number;
      temp: number;
    },
    public hitDice: string,
    public deathSaves: { success: number; failure: number },
    public skills: {
      acrobatics: number;
      animalHandling: number;
      arcana: number;
      athletics: number;
      deception: number;
      history: number;
      insight: number;
      intimidation: number;
      investigation: number;
      medicine: number;
      nature: number;
      perception: number;
      performance: number;
      persuasion: number;
      religion: number;
      sleightOfHand: number;
      stealth: number;
      survival: number;
    },
    public passivePerception: number,
    public inspiration: number,
    public savingThrows: {
      strength: number;
      dexterity: number;
      constitution: number;
      intelligence: number;
      wisdom: number;
      charisma: number;
    },
    public inventory: string[],
    public weapons: { name: string; attackBonus: number; damage: string }[],
    public featuresAndTraits: string[],
    public spellcasting: {
      class: string;
      ability: string;
      spellSaveDC: number;
      spellAttackBonus: number;
      spellsKnown: string[];
      spellSlots: { level: number; total: number; used: number }[];
    },
    public personalityTraits: string,
    public ideals: string,
    public bonds: string,
    public flaws: string,
    public backstory: string,
    public alliesOrganizations: string,
    public treasure: string
  ) {}

  updateHP(amount: number) {
    this.hitPoints.current = Math.max(0, Math.min(this.hitPoints.current + amount, this.hitPoints.max));
  }

  updateSpellSlots(level: number, amount: number) {
    const slot = this.spellcasting.spellSlots.find((s) => s.level === level);
    if (slot) {
      slot.used = Math.max(0, Math.min(slot.used + amount, slot.total));
    }
  }

  addItemToInventory(item: string) {
    this.inventory.push(item);
  }
}