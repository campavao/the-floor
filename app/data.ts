export interface FloorData {
  person: string;
  category: Category;
  hasBeenRandomized: boolean;
  isStillInTheGame: boolean;
}

export const FLOOR_DATA: FloorData[] = [
  {
    person: "Layne",
    category: "Pop divas",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Layne",
    category: "Chicago neighborhoods",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Nolan",
    category: "Chicago tourist stuff",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Nolan",
    category: "Comedians",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Andrea",
    category: "Kitchen gadgets",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Andrea",
    category: "Junk drawer",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Courtney",
    category: "Laundry",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Courtney",
    category: "New England establishments",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Josh",
    category: "UMass Amherst",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Josh",
    category: "Board games",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Rachel",
    category: "Video games",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Rachel",
    category: "Pokemon",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Beth",
    category: "Broadway shows",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Beth",
    category: "Spirit Halloween Catalogue",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Tanner",
    category: "Thanksgiving",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Tanner",
    category: "Reality TV shows",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Devin",
    category: "Superheros",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Devin",
    category: "Fair foods",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Gabe",
    category: "Apps",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Gabe",
    category: "States",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Ellie",
    category: "Sports",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Ellie",
    category: "Disney characters",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Zoey",
    category: "Sauces",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Zoey",
    category: "Cafe drinks",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Emma",
    category: "Brand slogans",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Emma",
    category: "Taylor Swift Lyrics",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Aimee",
    category: "Animals sounds",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Aimee",
    category: "Chicago sounds",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "John",
    category: "Math",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "John",
    category: "Fast food chains",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Nic",
    category: "Closet",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
  {
    person: "Nic",
    category: "Fridge",
    hasBeenRandomized: false,
    isStillInTheGame: true,
  },
].sort(() => Math.random() - 0.5);

export type FloorPieces = Record<number, FloorData>;

const CATEGORIES = [
  "Pop divas",
  "Chicago neighborhoods",
  "Chicago tourist stuff",
  "Comedians",
  "Kitchen gadgets",
  "Junk drawer",
  "Laundry",
  "New England establishments",
  "UMass Amherst",
  "Board games",
  "Video games",
  "Pokemon",
  "Broadway shows",
  "Spirit Halloween Catalogue",
  "Thanksgiving",
  "Reality TV shows",
  "Superheros",
  "Fair foods",
  "Apps",
  "States",
  "Sports",
  "Disney characters",
  "Sauces",
  "Cafe drinks",
  "Brand slogans",
  "Taylor Swift Lyrics",
  "Animals sounds",
  "Chicago sounds",
  "Math",
  "Fast food chains",
  "Closet",
  "Fridge",
  "Garage",
  "Camping",
  "Shoe brands",
];

type Category = (typeof CATEGORIES)[number];

// Specific data for my party
const GUESTS = [
  "Layne",
  "Nolan",
  "Andrea",
  "Courtney",
  "Josh",
  "Rachel",
  "Beth",
  "Tanner",
  "Devin",
  "Gabe",
  "Ellie",
  "Zoey",
  "Emma",
  "Aimee",
  "John",
  "Nic",
];
