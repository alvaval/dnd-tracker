export class Spell {
    name: string = '';
    level: number = 1;
    school?: { name: string };
    components?: string[];
    range?: string;
    duration?: string;
    casting_time?: string;
    desc?: string[];
    higher_level?: string[];
  
    constructor(data: Partial<Spell>) {
      Object.assign(this, data);
    }
  }