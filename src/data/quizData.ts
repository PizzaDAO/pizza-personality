import { Question, EmythResult, EmythType } from '../types/quiz';

export const questions: Question[] = [
  {
    id: 1,
    question: "Your pizzeria just received a significant investment. What's your first instinct?",
    answers: [
      {
        text: "Open a second location - this is our chance to build an empire",
        scores: { entrepreneur: 3, manager: 0, technician: 1 }
      },
      {
        text: "Create a budget and strategic plan for sustainable growth",
        scores: { entrepreneur: 0, manager: 3, technician: 1 }
      },
      {
        text: "Upgrade the kitchen equipment and perfect our recipes",
        scores: { entrepreneur: 1, manager: 1, technician: 3 }
      },
      {
        text: "Research what successful pizzerias have done with similar investments",
        scores: { entrepreneur: 1, manager: 2, technician: 2 }
      }
    ]
  },
  {
    id: 2,
    question: "A new pizza shop opens across the street from your pizzeria. How do you react?",
    answers: [
      {
        text: "Competition is opportunity - time to differentiate and innovate",
        scores: { entrepreneur: 3, manager: 1, technician: 0 }
      },
      {
        text: "Analyze their operations and optimize our processes to stay competitive",
        scores: { entrepreneur: 0, manager: 3, technician: 1 }
      },
      {
        text: "Focus on making our pizza even better - quality always wins",
        scores: { entrepreneur: 0, manager: 1, technician: 3 }
      },
      {
        text: "See if there's a way to collaborate instead of compete",
        scores: { entrepreneur: 2, manager: 2, technician: 1 }
      }
    ]
  },
  {
    id: 3,
    question: "You're opening a new pizzeria. What excites you most?",
    answers: [
      {
        text: "The vision of building something that could change the industry",
        scores: { entrepreneur: 3, manager: 0, technician: 1 }
      },
      {
        text: "Designing the operations, hiring processes, and workflows",
        scores: { entrepreneur: 0, manager: 3, technician: 1 }
      },
      {
        text: "Crafting the perfect menu and getting the recipes just right",
        scores: { entrepreneur: 0, manager: 0, technician: 3 }
      },
      {
        text: "Creating a space where the community can gather",
        scores: { entrepreneur: 2, manager: 1, technician: 2 }
      }
    ]
  },
  {
    id: 4,
    question: "One of your customers is dissatisfied with their order. Your response?",
    answers: [
      {
        text: "Turn this into a loyalty moment - surprise them with something extra",
        scores: { entrepreneur: 3, manager: 1, technician: 0 }
      },
      {
        text: "Follow the customer service protocol and document the feedback",
        scores: { entrepreneur: 1, manager: 3, technician: 0 }
      },
      {
        text: "Personally remake their order until it's perfect",
        scores: { entrepreneur: 0, manager: 0, technician: 3 }
      },
      {
        text: "Listen carefully to understand what went wrong and fix the root cause",
        scores: { entrepreneur: 1, manager: 2, technician: 2 }
      }
    ]
  },
  {
    id: 5,
    question: "How do you prefer to spend your time at the pizzeria?",
    answers: [
      {
        text: "Dreaming up new concepts, partnerships, and growth opportunities",
        scores: { entrepreneur: 3, manager: 0, technician: 0 }
      },
      {
        text: "Organizing schedules, tracking inventory, and improving systems",
        scores: { entrepreneur: 0, manager: 3, technician: 0 }
      },
      {
        text: "In the kitchen making pizzas and perfecting techniques",
        scores: { entrepreneur: 0, manager: 0, technician: 3 }
      },
      {
        text: "A mix of everything depending on what's needed that day",
        scores: { entrepreneur: 1, manager: 1, technician: 1 }
      }
    ]
  },
  {
    id: 6,
    question: "Your pizzeria becomes wildly successful. What's your next move?",
    answers: [
      {
        text: "Franchise it globally - this could be the next big thing",
        scores: { entrepreneur: 3, manager: 1, technician: 0 }
      },
      {
        text: "Document every process so we can scale without losing quality",
        scores: { entrepreneur: 1, manager: 3, technician: 0 }
      },
      {
        text: "Keep perfecting the craft - there's always room to improve",
        scores: { entrepreneur: 0, manager: 0, technician: 3 }
      },
      {
        text: "Train apprentices who share my passion for great pizza",
        scores: { entrepreneur: 1, manager: 1, technician: 2 }
      }
    ]
  },
  {
    id: 7,
    question: "What do you enjoy helping others with most?",
    answers: [
      {
        text: "Seeing the bigger picture and identifying new opportunities",
        scores: { entrepreneur: 3, manager: 0, technician: 1 }
      },
      {
        text: "Getting organized and creating systems that work",
        scores: { entrepreneur: 0, manager: 3, technician: 1 }
      },
      {
        text: "Teaching hands-on skills and sharing technical knowledge",
        scores: { entrepreneur: 0, manager: 1, technician: 3 }
      },
      {
        text: "Whatever they need most in the moment",
        scores: { entrepreneur: 1, manager: 1, technician: 1 }
      }
    ]
  },
  {
    id: 8,
    question: "It's a slow Tuesday night at the pizzeria. What do you do?",
    answers: [
      {
        text: "Brainstorm a marketing campaign or event to bring in more customers",
        scores: { entrepreneur: 3, manager: 1, technician: 0 }
      },
      {
        text: "Catch up on inventory counts, scheduling, and paperwork",
        scores: { entrepreneur: 0, manager: 3, technician: 0 }
      },
      {
        text: "Experiment with new dough recipes or topping combinations",
        scores: { entrepreneur: 0, manager: 0, technician: 3 }
      },
      {
        text: "Chat with the regulars and build relationships with customers",
        scores: { entrepreneur: 2, manager: 1, technician: 1 }
      }
    ]
  }
];

export const emythResults: Record<EmythType, EmythResult> = {
  entrepreneur: {
    name: "The Entrepreneur",
    pizzaName: "The Trailblazer Truffle",
    tagline: "Your vision for what could be is as bold and distinctive as truffle on pizza.",
    description: "You're a visionary who sees opportunities where others see obstacles!",
    personality: "You embody the Entrepreneur archetype - the visionary who sees opportunities where others see obstacles. You are the one asking 'What if?' and 'Why not?' You're energized by the future, by possibilities, and by the thrill of creating something that has never existed before. In the web3 world, you're the one imagining how blockchain can reshape entire industries. You see a pizza DAO not just as a community, but as the future of decentralized food systems.",
    superpower: "Turning vision into reality through sheer force of imagination and will.",
    kryptonite: "Following through on the details once the excitement fades.",
    balanceTip: "Partner with Managers to systematize your vision and Technicians to build it.",
    traits: ["Visionary", "Risk-Taking", "Future-Focused", "Opportunity-Seeking", "Change Catalyst"],
    color: "#FFD700"
  },
  manager: {
    name: "The Manager",
    pizzaName: "The Supreme Standard",
    tagline: "Like a perfectly portioned supreme pizza, you bring order and consistency to everything you touch.",
    description: "You're a systematic organizer who creates order from chaos!",
    personality: "You embody the Manager archetype - the systematic organizer who creates order from chaos. You are the one asking 'How can we do this consistently?' and 'What systems do we need?' You're energized by predictability, by well-oiled processes, and by knowing that things will work tomorrow exactly as they did today. In the web3 world, you're the one building governance frameworks, creating documentation, and ensuring the DAO can function even when key people are unavailable.",
    superpower: "Creating systems that scale and last.",
    kryptonite: "Resistance to change and over-reliance on proven methods.",
    balanceTip: "Let Entrepreneurs push you outside your comfort zone and Technicians remind you that not everything can be systematized.",
    traits: ["Organized", "Systematic", "Reliable", "Process-Driven", "Stability-Focused"],
    color: "#4682B4"
  },
  technician: {
    name: "The Technician",
    pizzaName: "The Neapolitan Craftsman",
    tagline: "Like a master pizzaiolo with their wood-fired oven, your craft is your calling.",
    description: "You're a skilled doer who takes pride in the work itself!",
    personality: "You embody the Technician archetype - the skilled doer who takes pride in the work itself. You are the one saying 'I can do this better than anyone' and 'Let me show you how it's done.' You're energized by the present moment, by the satisfaction of a job well done, and by the mastery of your craft. In the web3 world, you're the developer shipping code at 3am because you found an elegant solution. You're the artist who can't release an NFT until every pixel is perfect.",
    superpower: "Exceptional craftsmanship and deep expertise.",
    kryptonite: "Difficulty delegating and getting stuck in the weeds.",
    balanceTip: "Let Entrepreneurs remind you of the bigger picture and Managers help you work smarter, not just harder.",
    traits: ["Skilled", "Detail-Oriented", "Present-Focused", "Quality-Driven", "Hands-On"],
    color: "#FF6347"
  }
};

export const emythColors: Record<EmythType, string> = {
  entrepreneur: "#FFD700",
  manager: "#4682B4",
  technician: "#FF6347"
};
