export interface Question {
  id: number;
  question: string;
  answers: Answer[];
}

export interface Answer {
  text: string;
  scores: {
    entrepreneur: number;
    organizer: number;
    technician: number;
  };
}

export interface PizzaResult {
  pizzaName: string;
  emythType: string;
  tagline: string;
  description: string;
  personality: string;
  superpower: string;
  kryptonite: string;
  balanceTip: string;
  traits: string[];
  color: string;
  image: string;
}

export type EmythType = 'entrepreneur' | 'organizer' | 'technician';
export type PizzaType = 'hawaiian' | 'cheese' | 'margherita' | 'pepperoni' | 'bbqChicken' | 'quattroFormaggi' | 'supreme';
