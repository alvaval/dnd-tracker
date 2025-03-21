export class Background {
  index!: string;
  name!: string;
  starting_proficiencies?: { name: string }[];
  starting_equipment?: { equipment: { name: string }, quantity: number }[];
  starting_equipment_options?: { choose: number, type: string, from: { option_set_type: string, equipment_category: { name: string } } }[];
  feature?: { name: string, desc: string[] };

  constructor(data: Partial<Background>) {
    Object.assign(this, data);
  }
}