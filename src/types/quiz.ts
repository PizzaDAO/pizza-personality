export interface Question {
  id: number;
  question: string;
  answers: Answer[];
}

export interface Answer {
  text: string;
  scores: {
    entrepreneur: number;
    manager: number;
    technician: number;
  };
}

export interface EmythResult {
  name: string;
  pizzaName: string;
  tagline: string;
  description: string;
  personality: string;
  superpower: string;
  kryptonite: string;
  balanceTip: string;
  traits: string[];
  color: string;
}

export type EmythType = 'entrepreneur' | 'manager' | 'technician';
