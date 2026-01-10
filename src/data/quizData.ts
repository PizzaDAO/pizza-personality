import { Question, PizzaResult, PizzaType } from '../types/quiz';

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

export const pizzaResults: Record<PizzaType, PizzaResult> = {
  // Pure Types
  hawaiian: {
    pizzaName: "Hawaiian Pizza",
    emythType: "The Dreamer",
    tagline: "Bold, controversial, and unafraid to mix things up - just like pineapple on pizza.",
    description: "You see possibilities everywhere and aren't afraid to try something new!",
    personality: "You're the dreamer of the pizzeria - always asking 'What if we tried something completely different?' You're energized by new ideas, future possibilities, and the thrill of creating something that's never been done before. Like Hawaiian pizza, you're not afraid to be controversial if it means bringing something fresh and exciting to the table.",
    superpower: "Turning wild ideas into reality through sheer imagination and enthusiasm.",
    kryptonite: "Sometimes the daily grind of running the ovens loses its appeal once the excitement fades.",
    balanceTip: "Team up with someone who loves systems and someone who loves the craft to bring your big ideas to life.",
    traits: ["Visionary", "Risk-Taking", "Future-Focused", "Bold", "Unconventional"],
    color: "#FFD700",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop"
  },
  cheese: {
    pizzaName: "Cheese Pizza",
    emythType: "The Manager",
    tagline: "The foundation everything else is built on - reliable, essential, and universally trusted.",
    description: "You bring order to chaos and make sure everything runs like a well-oiled pizza oven!",
    personality: "You're the backbone of the pizzeria - the one who makes sure the dough is prepped, the schedule is set, and the kitchen runs smoothly. You're energized by systems, processes, and knowing that things will work tomorrow exactly as they did today. Like cheese pizza, you're the reliable foundation that makes everything else possible.",
    superpower: "Creating systems that keep the pizzeria running smoothly day after day.",
    kryptonite: "Sometimes sticking to the tried-and-true means missing out on the next big flavor.",
    balanceTip: "Let the dreamers push you to try new recipes, and let the craftspeople remind you that not everything can be systematized.",
    traits: ["Organized", "Systematic", "Reliable", "Foundational", "Consistent"],
    color: "#4682B4",
    image: "/cheese-pizza.jpg"
  },
  margherita: {
    pizzaName: "Margherita Pizza",
    emythType: "The Pizzaiolo",
    tagline: "Simple ingredients, masterful execution - the craft speaks for itself.",
    description: "You're all about the craft - getting your hands in the dough and making pizza magic!",
    personality: "You're the artisan of the pizzeria - the one who knows that a perfect pizza comes from perfect technique. You're energized by the present moment, the satisfaction of a job well done, and the mastery of your craft. Like a perfect Margherita, you know that excellence comes from mastering the fundamentals and putting quality above all else.",
    superpower: "Making exceptional pizza through skill, dedication, and attention to detail.",
    kryptonite: "Sometimes it's hard to let others touch your dough, and you might get lost perfecting one pie while orders pile up.",
    balanceTip: "Let the dreamers remind you of the bigger picture, and let the managers help you work smarter, not just harder.",
    traits: ["Skilled", "Detail-Oriented", "Artisan", "Quality-Driven", "Hands-On"],
    color: "#FF6347",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=400&fit=crop"
  },
  // Blend Types
  pepperoni: {
    pizzaName: "Pepperoni Pizza",
    emythType: "The Franchise Builder",
    tagline: "America's favorite - you know how to scale a great idea into something everyone loves.",
    description: "You dream big AND build the systems to make it happen - the best of both worlds!",
    personality: "You're the franchise builder of the pizzeria world. You have the vision to see opportunities and the organizational skills to capture them. You dream of pizza empires but also understand the importance of systems and processes that make consistency possible. Like pepperoni pizza, you've figured out how to take something great and make it excellent at scale.",
    superpower: "Scaling great recipes into operations that can feed the whole neighborhood.",
    kryptonite: "Sometimes caught between dreaming up the next big thing and perfecting the current menu.",
    balanceTip: "Don't forget to get your hands in the dough sometimes - staying connected to the craft keeps your vision grounded.",
    traits: ["Strategic", "Scalable", "Popular", "Ambitious", "Organized"],
    color: "#E85D04",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=400&fit=crop"
  },
  bbqChicken: {
    pizzaName: "BBQ Chicken Pizza",
    emythType: "The Inventor",
    tagline: "Innovation meets craft - you create bold new flavors with exceptional skill.",
    description: "You have wild ideas AND the skills to make them delicious - the creative genius!",
    personality: "You're the inventor of the pizzeria - someone with bold ideas AND the skills to bring them to life. You're the one experimenting with new flavor combinations at midnight, driven by both creativity and craftsmanship. Like BBQ Chicken pizza, you're not afraid to break the traditional rules - but you do it with genuine skill and taste.",
    superpower: "Creating innovative new pizzas that nobody's ever tasted before.",
    kryptonite: "You might resist sharing your secret recipes or letting others help scale your creations.",
    balanceTip: "Partner with the managers to help share your creations with more hungry customers.",
    traits: ["Innovative", "Skilled", "Creative", "Self-Reliant", "Original"],
    color: "#9D4EDD",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop"
  },
  quattroFormaggi: {
    pizzaName: "Quattro Formaggi",
    emythType: "The Master Operator",
    tagline: "Four cheeses in perfect harmony - you master complexity through careful orchestration.",
    description: "You blend deep expertise with smooth operations - the pizzeria runs like clockwork under your watch!",
    personality: "You're the master operator of the pizzeria - someone with deep pizza-making skills AND the ability to run a tight ship. You're the head chef who keeps the kitchen organized, the veteran who trains new staff while maintaining quality. Like Quattro Formaggi, you understand that excellence comes from carefully balancing multiple elements in perfect harmony.",
    superpower: "Running a smooth operation while maintaining the highest quality standards.",
    kryptonite: "Sometimes so focused on perfecting operations that you might miss opportunities for something completely new.",
    balanceTip: "Let the dreamers challenge you to think bigger and try something totally different once in a while.",
    traits: ["Expert", "Systematic", "Precise", "Reliable", "Harmonious"],
    color: "#2D6A4F",
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=400&fit=crop"
  },
  supreme: {
    pizzaName: "Supreme Pizza",
    emythType: "The Full Pie",
    tagline: "A little bit of everything - you adapt to whatever the pizzeria needs.",
    description: "You can dream, organize, AND make great pizza - the complete package!",
    personality: "You're the Supreme of the pizzeria world - a rare blend of dreamer, manager, and pizzaiolo. You can envision new concepts, build systems to support them, AND do the hands-on work to make incredible pizza. Like a Supreme pizza, you bring variety and completeness to any situation. Your versatility is your greatest topping.",
    superpower: "Adapting to any situation and filling whatever role the pizzeria needs most.",
    kryptonite: "With so many toppings, you might spread yourself too thin or struggle to pick just one specialty.",
    balanceTip: "Know when to lean into your dreamer, manager, or pizzaiolo side based on what the moment calls for.",
    traits: ["Versatile", "Balanced", "Adaptive", "Well-Rounded", "Complete"],
    color: "#7B2CBF",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=400&fit=crop"
  }
};

export const pizzaColors = {
  hawaiian: "#FFD700",
  cheese: "#4682B4",
  margherita: "#FF6347"
};
