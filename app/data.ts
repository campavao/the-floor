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
];

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

export type Category = (typeof CATEGORIES)[number];

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

export const CATEGORY_METADATA: Record<
  Category,
  {
    name: string;
    folder: string;
    examples: {
      name: string;
      image: string;
      alternatives: string[];
    }[];
  }
> = {
  Pokemon: {
    name: "Pokemon",
    folder: "pokemon",
    examples: [
      {
        name: "Blastoise",
        image: "blastoise.png",
        alternatives: [],
      },
      {
        name: "Bulbasaur",
        image: "bulbasaur.png",
        alternatives: [],
      },
      {
        name: "Caterpie",
        image: "caterpie.png",
        alternatives: [],
      },
      {
        name: "Charizard",
        image: "charizard.png",
        alternatives: [],
      },
      {
        name: "Charmander",
        image: "charmander.png",
        alternatives: [],
      },
      {
        name: "Charmeleon",
        image: "charmeleon.png",
        alternatives: [],
      },
      {
        name: "Clefairy",
        image: "clefairy.png",
        alternatives: [],
      },
      {
        name: "Doduo",
        image: "doduo.png",
        alternatives: [],
      },
      {
        name: "Dragonair",
        image: "dragonair.png",
        alternatives: [],
      },
      {
        name: "Dragonite",
        image: "dragonite.png",
        alternatives: [],
      },
      {
        name: "Dratini",
        image: "dratini.png",
        alternatives: [],
      },
      {
        name: "Drowzee",
        image: "drowzee.png",
        alternatives: [],
      },
      {
        name: "Eevee",
        image: "eevee.png",
        alternatives: [],
      },
      {
        name: "Exeggcute",
        image: "exeggcute.png",
        alternatives: [],
      },
      {
        name: "Flareon",
        image: "flareon.png",
        alternatives: [],
      },
      {
        name: "Gastly",
        image: "gastly.png",
        alternatives: [],
      },
      {
        name: "Geodude",
        image: "geodude.png",
        alternatives: [],
      },
      {
        name: "Goldeen",
        image: "goldeen.png",
        alternatives: [],
      },
      {
        name: "Grimer",
        image: "grimer.png",
        alternatives: [],
      },
      {
        name: "Horsea",
        image: "horsea.png",
        alternatives: [],
      },
      {
        name: "Ivysaur",
        image: "ivysaur.png",
        alternatives: [],
      },
      {
        name: "Jigglypuff",
        image: "jigglypuff.png",
        alternatives: [],
      },
      {
        name: "Jolteon",
        image: "jolteon.png",
        alternatives: [],
      },
      {
        name: "Koffing",
        image: "koffing.png",
        alternatives: [],
      },
      {
        name: "Krabby",
        image: "krabby.png",
        alternatives: [],
      },
      {
        name: "Magikarp",
        image: "magikarp.png",
        alternatives: [],
      },
      {
        name: "Magnemite",
        image: "magnemite.png",
        alternatives: [],
      },
      {
        name: "Mew",
        image: "mew.png",
        alternatives: [],
      },
      {
        name: "Mewtwo",
        image: "mewtwo.png",
        alternatives: [],
      },
      {
        name: "Oddish",
        image: "oddish.png",
        alternatives: [],
      },
      {
        name: "Onix",
        image: "onix.png",
        alternatives: [],
      },
      {
        name: "Paras",
        image: "paras.png",
        alternatives: [],
      },
      {
        name: "Pidgey",
        image: "pidgey.png",
        alternatives: [],
      },
      {
        name: "Pikachu",
        image: "pikachu.png",
        alternatives: [],
      },
      {
        name: "Ponyta",
        image: "ponyta.png",
        alternatives: [],
      },
      {
        name: "Raichu",
        image: "raichu.png",
        alternatives: [],
      },
      {
        name: "Rattata",
        image: "rattata.png",
        alternatives: [],
      },
      {
        name: "Rhyhorn",
        image: "rhyhorn.png",
        alternatives: [],
      },
      {
        name: "Sandshrew",
        image: "sandshrew.png",
        alternatives: [],
      },
      {
        name: "Shellder",
        image: "shellder.png",
        alternatives: [],
      },
      {
        name: "Slowpoke",
        image: "slowpoke.png",
        alternatives: [],
      },
      {
        name: "Squirtle",
        image: "squirtle.png",
        alternatives: [],
      },
      {
        name: "Staryu",
        image: "staryu.png",
        alternatives: [],
      },
      {
        name: "Vaporeon",
        image: "vaporeon.png",
        alternatives: [],
      },
      {
        name: "Venusaur",
        image: "venusaur.png",
        alternatives: [],
      },
      {
        name: "Voltorb",
        image: "voltorb.png",
        alternatives: [],
      },
      {
        name: "Vulpix",
        image: "vulpix.png",
        alternatives: [],
      },
      {
        name: "Wartortle",
        image: "wartortle.png",
        alternatives: [],
      },
      {
        name: "Weedle",
        image: "weedle.png",
        alternatives: [],
      },
      {
        name: "Zubat",
        image: "zubat.png",
        alternatives: [],
      },
    ],
  },
  "Broadway shows": {
    name: "Broadway shows",
    folder: "broadway-shows",
    examples: [
      {
        name: "A Chorus Line",
        image: "a-chorus-line.jpg",
        alternatives: [],
      },
      {
        name: "Aladdin",
        image: "aladdin.jpg",
        alternatives: [],
      },
      {
        name: "Anastasia",
        image: "anastasia.jpg",
        alternatives: [],
      },
      {
        name: "Avenue Q",
        image: "avenue-q.jpg",
        alternatives: [],
      },
      {
        name: "Beauty and the Beast",
        image: "beauty-and-the-beast.jpg",
        alternatives: [],
      },
      {
        name: "Beetlejuice",
        image: "beetlejuice.jpg",
        alternatives: [],
      },
      {
        name: "Book of Mormon",
        image: "book-of-mormon.jpg",
        alternatives: [],
      },
      {
        name: "Cats",
        image: "cats.jpg",
        alternatives: [],
      },
      {
        name: "Company",
        image: "company.jpg",
        alternatives: [],
      },
      {
        name: "Dear Evan Hansen",
        image: "dear-evan-hansen.jpg",
        alternatives: [],
      },
      {
        name: "Evita",
        image: "evita.jpg",
        alternatives: [],
      },
      {
        name: "Fiddler on the Roof",
        image: "fiddler-on-the-roof.jpg",
        alternatives: [],
      },
      {
        name: "Frozen",
        image: "frozen.jpg",
        alternatives: [],
      },
      {
        name: "Fun Home",
        image: "fun-home.jpg",
        alternatives: [],
      },
      {
        name: "Hadestown",
        image: "hadestown.jpg",
        alternatives: [],
      },
      {
        name: "Hairspray",
        image: "hairspray.jpg",
        alternatives: [],
      },
      {
        name: "Hamilton",
        image: "hamilton.png",
        alternatives: [],
      },
      {
        name: "Heathers",
        image: "heathers.jpg",
        alternatives: [],
      },
      {
        name: "Hello, Dolly!",
        image: "hello-dolly.jpg",
        alternatives: [],
      },
      {
        name: "Into the Woods",
        image: "into-the-woods.png",
        alternatives: [],
      },
      {
        name: "Jersey Boys",
        image: "jersey-boys.jpg",
        alternatives: [],
      },
      {
        name: "Jesus Christ Superstar",
        image: "jesus-christ-superstar.jpg",
        alternatives: [],
      },
      {
        name: "Joseph and the Technicolor Dreamcoat",
        image: "joseph-and-the-technicolor-dreamcoat.jpg",
        alternatives: [],
      },
      {
        name: "Kinky Boots",
        image: "kinky-boots.jpg",
        alternatives: [],
      },
      {
        name: "Legally Blonde",
        image: "legally-blonde.jpg",
        alternatives: [],
      },
      {
        name: "Les Misérables",
        image: "les-mis.png",
        alternatives: [],
      },
      {
        name: "Matilda",
        image: "matilda.jpg",
        alternatives: [],
      },
      {
        name: "Mean Girls",
        image: "mean-girls.jpg",
        alternatives: [],
      },
      {
        name: "Moulin Rouge",
        image: "moulin-rouge.jpg",
        alternatives: [],
      },
      {
        name: "My Fair Lady",
        image: "my-fair-lady.jpg",
        alternatives: [],
      },
      {
        name: "Next to Normal",
        image: "next-to-normal.jpg",
        alternatives: [],
      },
      {
        name: "Oklahoma!",
        image: "oklahoma.jpg",
        alternatives: [],
      },
      {
        name: "Oliver!",
        image: "oliver.jpg",
        alternatives: [],
      },
      {
        name: "Once",
        image: "once.jpg",
        alternatives: [],
      },
      {
        name: "Parade",
        image: "parade.jpg",
        alternatives: [],
      },
      {
        name: "Phantom of the Opera",
        image: "phantom-of-the-opera.jpg",
        alternatives: [],
      },
      {
        name: "Rent",
        image: "rent.png",
        alternatives: [],
      },
      {
        name: "Shrek",
        image: "shrek.jpg",
        alternatives: [],
      },
      {
        name: "Six",
        image: "six.jpg",
        alternatives: [],
      },
      {
        name: "Spamalot",
        image: "spamalot.jpg",
        alternatives: [],
      },
      {
        name: "Spring Awakening",
        image: "spring-awakening.jpg",
        alternatives: [],
      },
      {
        name: "Sweeney Todd",
        image: "sweeney-todd.jpg",
        alternatives: [],
      },
      {
        name: "The Color Purple",
        image: "the-color-purple.jpg",
        alternatives: [],
      },
      {
        name: "The Lion King",
        image: "the-lion-king.png",
        alternatives: [],
      },
      {
        name: "The Sound of Music",
        image: "the-sound-of-music.jpg",
        alternatives: [],
      },
      {
        name: "Waitress",
        image: "waitress.jpg",
        alternatives: [],
      },
      {
        name: "Wicked",
        image: "wicked.png",
        alternatives: [],
      },
    ],
  },
  "Disney characters": {
    name: "Disney characters",
    folder: "disney-characters",
    examples: [
      {
        name: "Abu",
        image: "abu.jpg",
        alternatives: [],
      },
      {
        name: "Aladdin",
        image: "aladdin.jpg",
        alternatives: [],
      },
      {
        name: "Anna",
        image: "anna.jpg",
        alternatives: [],
      },
      {
        name: "Ariel",
        image: "ariel.jpg",
        alternatives: [],
      },
      {
        name: "Aurora",
        image: "aurora.jpeg",
        alternatives: [],
      },
      {
        name: "Beast",
        image: "beast.jpg",
        alternatives: [],
      },
      {
        name: "Belle",
        image: "belle.jpg",
        alternatives: [],
      },
      {
        name: "Captain Hook",
        image: "captain-hook.jpg",
        alternatives: [],
      },
      {
        name: "Chip and Dale",
        image: "chip-and-dale.jpg",
        alternatives: [],
      },
      {
        name: "Cinderella",
        image: "cinderella.jpg",
        alternatives: [],
      },
      {
        name: "Donald Duck",
        image: "donald-duck.png",
        alternatives: [],
      },
      {
        name: "Elsa",
        image: "elsa.jpg",
        alternatives: [],
      },
      {
        name: "Fairy Godmother",
        image: "fairy-godmother.jpg",
        alternatives: [],
      },
      {
        name: "Gaston",
        image: "gaston.jpg",
        alternatives: [],
      },
      {
        name: "Genie",
        image: "genie.jpg",
        alternatives: [],
      },
      {
        name: "Goofy",
        image: "goofy.jpg",
        alternatives: [],
      },
      {
        name: "Hades",
        image: "hades.jpg",
        alternatives: [],
      },
      {
        name: "Hercules",
        image: "hercules.jpg",
        alternatives: [],
      },
      {
        name: "Jafar",
        image: "jafar.jpg",
        alternatives: [],
      },
      {
        name: "Jane",
        image: "jane.jpg",
        alternatives: [],
      },
      {
        name: "Jasmine",
        image: "jasmine.jpg",
        alternatives: [],
      },
      {
        name: "Kristoff",
        image: "kristoff.jpg",
        alternatives: [],
      },
      {
        name: "Lilo",
        image: "lilo.jpg",
        alternatives: [],
      },
      {
        name: "Megara",
        image: "megara.jpg",
        alternatives: [],
      },
      {
        name: "Merida",
        image: "merida.jpg",
        alternatives: [],
      },
      {
        name: "Mickey Mouse",
        image: "mickey-mouse.jpg",
        alternatives: [],
      },
      {
        name: "Minnie Mouse",
        image: "minnie-mouse.jpg",
        alternatives: [],
      },
      {
        name: "Moana",
        image: "moana.jpg",
        alternatives: [],
      },
      {
        name: "Mufasa",
        image: "mufasa.jpg",
        alternatives: [],
      },
      {
        name: "Mulan",
        image: "mulan.jpg",
        alternatives: [],
      },
      {
        name: "Nala",
        image: "nala.jpg",
        alternatives: [],
      },
      {
        name: "Olaf",
        image: "olaf.jpg",
        alternatives: [],
      },
      {
        name: "Peter Pan",
        image: "peter-pan.jpg",
        alternatives: [],
      },
      {
        name: "Phil",
        image: "phil.jpg",
        alternatives: [],
      },
      {
        name: "Pluto",
        image: "pluto.png",
        alternatives: [],
      },
      {
        name: "Pocahontas",
        image: "pocahontas.jpg",
        alternatives: [],
      },
      {
        name: "Pumbaa",
        image: "pumbaa.jpg",
        alternatives: [],
      },
      {
        name: "Rapunzel",
        image: "rapunzel.jpg",
        alternatives: [],
      },
      {
        name: "Scar",
        image: "scar.jpg",
        alternatives: [],
      },
      {
        name: "Simba",
        image: "simba.jpg",
        alternatives: [],
      },
      {
        name: "Snow White",
        image: "snow-white.jpg",
        alternatives: [],
      },
      {
        name: "Stitch",
        image: "stitch.jpg",
        alternatives: [],
      },
      {
        name: "Sven",
        image: "sven.jpg",
        alternatives: [],
      },
      {
        name: "Tarzan",
        image: "tarzan.jpg",
        alternatives: [],
      },
      {
        name: "Tiana",
        image: "tiana.jpg",
        alternatives: [],
      },
      {
        name: "Timon",
        image: "timon.jpg",
        alternatives: [],
      },
      {
        name: "Tinker Bell",
        image: "tinker-bell.jpg",
        alternatives: [],
      },
      {
        name: "Wendy",
        image: "wendy.jpg",
        alternatives: [],
      },
    ],
  },
};
