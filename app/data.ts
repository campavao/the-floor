const FLOOR_DATA_CONST = [
  {
    person: "Zoey",
    category: "Laundry",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Rachel",
    category: "Fridge",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Gabe",
    category: "Junk drawer",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Josh",
    category: "Fast food chains",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Ellie",
    category: "Rom Coms",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Zoey",
    category: "Movies",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Andrea",
    category: "Disney characters",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Tanner",
    category: "Superheros",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Layne",
    category: "Taylor Swift Lyrics",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Nolan",
    category: "States",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Nic",
    category: "Kitchen gadgets",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Syd",
    category: "Famous people who died before turning 30",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Pat",
    category: "The Office",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Emma",
    category: "Thanksgiving",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "John",
    category: "Garage",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Rachel",
    category: "Holidays",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Nic",
    category: "Fair foods",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Aimee",
    category: "Chicago tourist stuff",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Devin",
    category: "Pop divas",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "John",
    category: "Sports",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Ellie",
    category: "Books",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Beth",
    category: "Reality tv shows",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Joey",
    category: "MLB Teams",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Nolan",
    category: "Math",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Aimee",
    category: "Airport Codes",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Syd",
    category: "Dogs",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Beth",
    category: "Disney Channel Original Movies",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Josh",
    category: "Brand slogans",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Emma",
    category: "Horses",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Pat",
    category: "City Skylines",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Tanner",
    category: "Video Game Characters",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Andrea",
    category: "Broadway shows",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Frankie",
    category: "Harry Potter characters",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Layne",
    category: "Board games",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Gabe",
    category: "Comedians",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Frankie",
    category: "Amusement Parks",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Devin",
    category: "Spirit Halloween Catalogue",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Joey",
    category: "Pokemon",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
] as const;

// {
//   person: "Courtney",
//   category: "Apps",
//   hasBeenRandomized: true,
//   isStillInTheGame: true,
// },
// {
//   person: "Courtney",
//   category: "Chilis",
//   hasBeenRandomized: false,
//   isStillInTheGame: true,
// },

export type Category =
  | "Pokemon"
  | "Broadway shows"
  | "Disney characters"
  | "Kitchen gadgets"
  | "Junk drawer"
  | "Laundry"
  | "Pop divas"
  | "Chicago tourist stuff"
  | "Board games"
  | "States"
  | "Harry Potter characters"
  | "Spirit Halloween Catalogue"
  | "Superheros"
  | "Video Game Characters"
  | "City Skylines"
  | "Movies"
  | "Books"
  | "Disney Channel Original Movies"
  | "Airport Codes"
  | "Brand slogans"
  | "Taylor Swift Lyrics"
  | "Reality tv shows"
  | "The Office"
  | "Thanksgiving"
  | "Dogs"
  | "Horses"
  | "Rom Coms"
  | "Amusement Parks"
  | "Comedians"
  | "Fair foods"
  | "Famous people who died before turning 30"
  | "Fast food chains"
  | "Fridge"
  | "Garage"
  | "Holidays"
  | "MLB Teams"
  | "Sports"
  | "Chilis"
  | "Math"
  | "Apps";

export interface FloorData {
  person: string;
  category: Category;
  hasBeenRandomized: boolean;
  isStillInTheGame: boolean;
}

export const FLOOR_DATA: FloorData[] =
  FLOOR_DATA_CONST as unknown as FloorData[];

export type FloorPieces = Record<number, FloorData>;

export type ImageExample = {
  name: string;
  image: string;
  alternatives: string[];
};

export type TextExample = {
  name: string;
  text: string;
  alternatives: string[];
};

type CategoryMetadata = {
  name: string;
  folder: string;
  examples: ImageExample[] | TextExample[];
};

const PokemonCategory: CategoryMetadata = {
  name: "Pokemon",
  folder: "pokemon",
  examples: [
    {
      name: "Pikachu",
      image: "pikachu.png",
      alternatives: [],
    },
    {
      name: "Charizard",
      image: "charizard.png",
      alternatives: [],
    },
    {
      name: "Mewtwo",
      image: "mewtwo.png",
      alternatives: [],
    },
    {
      name: "Mew",
      image: "mew.png",
      alternatives: [],
    },
    {
      name: "Blastoise",
      image: "blastoise.png",
      alternatives: [],
    },
    {
      name: "Venusaur",
      image: "venusaur.png",
      alternatives: [],
    },
    {
      name: "Squirtle",
      image: "squirtle.png",
      alternatives: [],
    },
    {
      name: "Bulbasaur",
      image: "bulbasaur.png",
      alternatives: [],
    },
    {
      name: "Charmander",
      image: "charmander.png",
      alternatives: [],
    },
    {
      name: "Eevee",
      image: "eevee.png",
      alternatives: [],
    },
    {
      name: "Jigglypuff",
      image: "jigglypuff.png",
      alternatives: [],
    },
    {
      name: "Raichu",
      image: "raichu.png",
      alternatives: [],
    },
    {
      name: "Pidgey",
      image: "pidgey.png",
      alternatives: [],
    },
    {
      name: "Rattata",
      image: "rattata.png",
      alternatives: [],
    },
    {
      name: "Zubat",
      image: "zubat.png",
      alternatives: [],
    },
    {
      name: "Magikarp",
      image: "magikarp.png",
      alternatives: [],
    },
    {
      name: "Onix",
      image: "onix.png",
      alternatives: [],
    },
    {
      name: "Geodude",
      image: "geodude.png",
      alternatives: [],
    },
    {
      name: "Gastly",
      image: "gastly.png",
      alternatives: [],
    },
    {
      name: "Clefairy",
      image: "clefairy.png",
      alternatives: [],
    },
    {
      name: "Charmeleon",
      image: "charmeleon.png",
      alternatives: [],
    },
    {
      name: "Ivysaur",
      image: "ivysaur.png",
      alternatives: [],
    },
    {
      name: "Wartortle",
      image: "wartortle.png",
      alternatives: [],
    },
    {
      name: "Vaporeon",
      image: "vaporeon.png",
      alternatives: [],
    },
    {
      name: "Jolteon",
      image: "jolteon.png",
      alternatives: [],
    },
    {
      name: "Flareon",
      image: "flareon.png",
      alternatives: [],
    },
    {
      name: "Dragonite",
      image: "dragonite.png",
      alternatives: [],
    },
    {
      name: "Dragonair",
      image: "dragonair.png",
      alternatives: [],
    },
    {
      name: "Dratini",
      image: "dratini.png",
      alternatives: [],
    },
    {
      name: "Vulpix",
      image: "vulpix.png",
      alternatives: [],
    },
    {
      name: "Ponyta",
      image: "ponyta.png",
      alternatives: [],
    },
    {
      name: "Slowpoke",
      image: "slowpoke.png",
      alternatives: [],
    },
    {
      name: "Oddish",
      image: "oddish.png",
      alternatives: [],
    },
    {
      name: "Weedle",
      image: "weedle.png",
      alternatives: [],
    },
    {
      name: "Caterpie",
      image: "caterpie.png",
      alternatives: [],
    },
    {
      name: "Exeggcute",
      image: "exeggcute.png",
      alternatives: [],
    },
    {
      name: "Staryu",
      image: "staryu.png",
      alternatives: [],
    },
    {
      name: "Goldeen",
      image: "goldeen.png",
      alternatives: [],
    },
    {
      name: "Horsea",
      image: "horsea.png",
      alternatives: [],
    },
    {
      name: "Shellder",
      image: "shellder.png",
      alternatives: [],
    },
    {
      name: "Krabby",
      image: "krabby.png",
      alternatives: [],
    },
    {
      name: "Drowzee",
      image: "drowzee.png",
      alternatives: [],
    },
    {
      name: "Koffing",
      image: "koffing.png",
      alternatives: [],
    },
    {
      name: "Grimer",
      image: "grimer.png",
      alternatives: [],
    },
    {
      name: "Paras",
      image: "paras.png",
      alternatives: [],
    },
    {
      name: "Doduo",
      image: "doduo.png",
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
      name: "Voltorb",
      image: "voltorb.png",
      alternatives: [],
    },
    {
      name: "Magnemite",
      image: "magnemite.png",
      alternatives: [],
    },
  ],
};

const BroadwayShowsCategory: CategoryMetadata = {
  name: "Broadway shows",
  folder: "broadway-shows",
  examples: [
    {
      name: "The Lion King",
      image: "the-lion-king.png",
      alternatives: [],
    },
    {
      name: "Aladdin",
      image: "aladdin.jpg",
      alternatives: [],
    },
    {
      name: "Beauty and the Beast",
      image: "beauty-and-the-beast.jpg",
      alternatives: [],
    },
    {
      name: "Frozen",
      image: "frozen.jpg",
      alternatives: [],
    },
    {
      name: "Hamilton",
      image: "hamilton.png",
      alternatives: [],
    },
    {
      name: "Wicked",
      image: "wicked.png",
      alternatives: [],
    },
    {
      name: "Phantom of the Opera",
      image: "phantom-of-the-opera.jpg",
      alternatives: [],
    },
    {
      name: "Les Misérables",
      image: "les-mis.png",
      alternatives: [],
    },
    {
      name: "Cats",
      image: "cats.jpg",
      alternatives: [],
    },
    {
      name: "The Sound of Music",
      image: "the-sound-of-music.jpg",
      alternatives: [],
    },
    {
      name: "Rent",
      image: "rent.png",
      alternatives: [],
    },
    {
      name: "Book of Mormon",
      image: "book-of-mormon.jpg",
      alternatives: [],
    },
    {
      name: "Dear Evan Hansen",
      image: "dear-evan-hansen.jpg",
      alternatives: [],
    },
    {
      name: "Mean Girls",
      image: "mean-girls.jpg",
      alternatives: [],
    },
    {
      name: "Legally Blonde",
      image: "legally-blonde.jpg",
      alternatives: [],
    },
    {
      name: "Shrek",
      image: "shrek.jpg",
      alternatives: [],
    },
    {
      name: "Moulin Rouge",
      image: "moulin-rouge.jpg",
      alternatives: [],
    },
    {
      name: "Hairspray",
      image: "hairspray.jpg",
      alternatives: [],
    },
    {
      name: "Jersey Boys",
      image: "jersey-boys.jpg",
      alternatives: [],
    },
    {
      name: "Six",
      image: "six.jpg",
      alternatives: [],
    },
    {
      name: "Hadestown",
      image: "hadestown.jpg",
      alternatives: [],
    },
    {
      name: "Spring Awakening",
      image: "spring-awakening.jpg",
      alternatives: [],
    },
    {
      name: "Avenue Q",
      image: "avenue-q.jpg",
      alternatives: [],
    },
    {
      name: "Beetlejuice",
      image: "beetlejuice.jpg",
      alternatives: [],
    },
    {
      name: "Matilda",
      image: "matilda.jpg",
      alternatives: [],
    },
    {
      name: "Into the Woods",
      image: "into-the-woods.png",
      alternatives: [],
    },
    {
      name: "Jesus Christ Superstar",
      image: "jesus-christ-superstar.jpg",
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
      name: "Waitress",
      image: "waitress.jpg",
      alternatives: [],
    },
    {
      name: "Kinky Boots",
      image: "kinky-boots.jpg",
      alternatives: [],
    },
    {
      name: "Anastasia",
      image: "anastasia.jpg",
      alternatives: [],
    },
    {
      name: "Heathers",
      image: "heathers.jpg",
      alternatives: [],
    },
    {
      name: "Spamalot",
      image: "spamalot.jpg",
      alternatives: [],
    },
    {
      name: "Fun Home",
      image: "fun-home.jpg",
      alternatives: [],
    },
    {
      name: "Next to Normal",
      image: "next-to-normal.jpg",
      alternatives: [],
    },
    {
      name: "Parade",
      image: "parade.jpg",
      alternatives: [],
    },
    {
      name: "Once",
      image: "once.jpg",
      alternatives: [],
    },
    {
      name: "Company",
      image: "company.jpg",
      alternatives: [],
    },
    {
      name: "Evita",
      image: "evita.jpg",
      alternatives: [],
    },
    {
      name: "Joseph and the Technicolor Dreamcoat",
      image: "joseph-and-the-technicolor-dreamcoat.jpg",
      alternatives: [],
    },
    {
      name: "A Chorus Line",
      image: "a-chorus-line.jpg",
      alternatives: [],
    },
    {
      name: "Fiddler on the Roof",
      image: "fiddler-on-the-roof.jpg",
      alternatives: [],
    },
    {
      name: "My Fair Lady",
      image: "my-fair-lady.jpg",
      alternatives: [],
    },
    {
      name: "Oklahoma!",
      image: "oklahoma.jpg",
      alternatives: [],
    },
    {
      name: "Hello, Dolly!",
      image: "hello-dolly.jpg",
      alternatives: [],
    },
    {
      name: "Oliver!",
      image: "oliver.jpg",
      alternatives: [],
    },
  ],
};

const DisneyCharactersCategory: CategoryMetadata = {
  name: "Disney characters",
  folder: "disney-characters",
  examples: [
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
      name: "Ariel",
      image: "ariel.jpg",
      alternatives: [],
    },
    {
      name: "Belle",
      image: "belle.jpg",
      alternatives: [],
    },
    {
      name: "Cinderella",
      image: "cinderella.jpg",
      alternatives: [],
    },
    {
      name: "Elsa",
      image: "elsa.jpg",
      alternatives: [],
    },
    {
      name: "Anna",
      image: "anna.jpg",
      alternatives: [],
    },
    {
      name: "Snow White",
      image: "snow-white.jpg",
      alternatives: [],
    },
    {
      name: "Jasmine",
      image: "jasmine.jpg",
      alternatives: [],
    },
    {
      name: "Mulan",
      image: "mulan.jpg",
      alternatives: [],
    },
    {
      name: "Pocahontas",
      image: "pocahontas.jpg",
      alternatives: [],
    },
    {
      name: "Rapunzel",
      image: "rapunzel.jpg",
      alternatives: [],
    },
    {
      name: "Tiana",
      image: "tiana.jpg",
      alternatives: [],
    },
    {
      name: "Moana",
      image: "moana.jpg",
      alternatives: [],
    },
    {
      name: "Aurora",
      image: "aurora.jpeg",
      alternatives: [],
    },
    {
      name: "Donald Duck",
      image: "donald-duck.png",
      alternatives: [],
    },
    {
      name: "Goofy",
      image: "goofy.jpg",
      alternatives: [],
    },
    {
      name: "Pluto",
      image: "pluto.png",
      alternatives: [],
    },
    {
      name: "Simba",
      image: "simba.jpg",
      alternatives: [],
    },
    {
      name: "Stitch",
      image: "stitch.jpg",
      alternatives: [],
    },
    {
      name: "Olaf",
      image: "olaf.jpg",
      alternatives: [],
    },
    {
      name: "Genie",
      image: "genie.jpg",
      alternatives: [],
    },
    {
      name: "Aladdin",
      image: "aladdin.jpg",
      alternatives: [],
    },
    {
      name: "Beast",
      image: "beast.jpg",
      alternatives: [],
    },
    {
      name: "Captain Hook",
      image: "captain-hook.jpg",
      alternatives: [],
    },
    {
      name: "Tinker Bell",
      image: "tinker-bell.jpg",
      alternatives: [],
    },
    {
      name: "Peter Pan",
      image: "peter-pan.jpg",
      alternatives: [],
    },
    {
      name: "Timon",
      image: "timon.jpg",
      alternatives: [],
    },
    {
      name: "Pumbaa",
      image: "pumbaa.jpg",
      alternatives: [],
    },
    {
      name: "Scar",
      image: "scar.jpg",
      alternatives: [],
    },
    {
      name: "Mufasa",
      image: "mufasa.jpg",
      alternatives: [],
    },
    {
      name: "Nala",
      image: "nala.jpg",
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
      name: "Jafar",
      image: "jafar.jpg",
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
      name: "Tarzan",
      image: "tarzan.jpg",
      alternatives: [],
    },
    {
      name: "Chip and Dale",
      image: "chip-and-dale.jpg",
      alternatives: [],
    },
    {
      name: "Merida",
      image: "merida.jpg",
      alternatives: [],
    },
    {
      name: "Lilo",
      image: "lilo.jpg",
      alternatives: [],
    },
    {
      name: "Kristoff",
      image: "kristoff.jpg",
      alternatives: [],
    },
    {
      name: "Sven",
      image: "sven.jpg",
      alternatives: [],
    },
    {
      name: "Jane",
      image: "jane.jpg",
      alternatives: [],
    },
    {
      name: "Wendy",
      image: "wendy.jpg",
      alternatives: [],
    },
    {
      name: "Abu",
      image: "abu.jpg",
      alternatives: [],
    },
    {
      name: "Phil",
      image: "phil.jpg",
      alternatives: [],
    },
    {
      name: "Megara",
      image: "megara.jpg",
      alternatives: [],
    },
  ],
};

const KitchenGadgetsCategory: CategoryMetadata = {
  name: "Kitchen gadgets",
  folder: "kitchen-gadgets",
  examples: [
    {
      name: "Microwave",
      image: "microwave.jpg",
      alternatives: [],
    },
    {
      name: "Blender",
      image: "blender.jpg",
      alternatives: [],
    },
    {
      name: "Cutting board",
      image: "cutting-board.jpg",
      alternatives: [],
    },
    {
      name: "Spatula",
      image: "spatula.jpg",
      alternatives: [],
    },
    {
      name: "Can opener",
      image: "can-opener.jpg",
      alternatives: [],
    },
    {
      name: "Bottle opener",
      image: "bottle-opener.jpg",
      alternatives: [],
    },
    {
      name: "Measuring cups",
      image: "measuring-cups.jpg",
      alternatives: [],
    },
    {
      name: "Measuring spoons",
      image: "measuring-spoons.jpg",
      alternatives: [],
    },
    {
      name: "Whisk",
      image: "whisk.jpg",
      alternatives: [],
    },
    {
      name: "Tongs",
      image: "tongs.jpg",
      alternatives: [],
    },
    {
      name: "Oven mitts",
      image: "oven-mitts.jpg",
      alternatives: [],
    },
    {
      name: "Colander",
      image: "colander.jpg",
      alternatives: [],
    },
    {
      name: "Strainer",
      image: "strainer.jpg",
      alternatives: [],
    },
    {
      name: "Baking sheet",
      image: "baking-sheet.jpg",
      alternatives: [],
    },
    {
      name: "Muffin tin",
      image: "muffin-tin.jpg",
      alternatives: [],
    },
    {
      name: "Potato peeler",
      image: "potato-peeler.jpg",
      alternatives: [],
    },
    {
      name: "Pizza cutter",
      image: "pizza-cutter.jpg",
      alternatives: [],
    },
    {
      name: "Ice cream scoop",
      image: "ice-cream-scoop.jpg",
      alternatives: [],
    },
    {
      name: "Funnel",
      image: "funnel.jpg",
      alternatives: [],
    },
    {
      name: "Cast iron pan",
      image: "cast-iron-pan.jpg",
      alternatives: [],
    },
    {
      name: "Food processor",
      image: "food-processor.jpg",
      alternatives: [],
    },
    {
      name: "Stand mixer",
      image: "stand-mixer.jpg",
      alternatives: [],
    },
    {
      name: "Hand mixer",
      image: "hand-mixer.jpg",
      alternatives: [],
    },
    {
      name: "Slow cooker",
      image: "slow-cooker.jpg",
      alternatives: [],
    },
    {
      name: "Rice cooker",
      image: "rice-cooker.jpg",
      alternatives: [],
    },
    {
      name: "Air fryer",
      image: "air-fryer.jpg",
      alternatives: [],
    },
    {
      name: "Toaster oven",
      image: "toaster-oven.jpg",
      alternatives: [],
    },
    {
      name: "French press",
      image: "french-press.jpg",
      alternatives: [],
    },
    {
      name: "Coffee grinder",
      image: "coffee-grinder.jpg",
      alternatives: [],
    },
    {
      name: "Garlic press",
      image: "garlic-press.jpg",
      alternatives: [],
    },
    {
      name: "Kitchen shears",
      image: "kitchen-shears.jpg",
      alternatives: [],
    },
    {
      name: "Rolling pin",
      image: "rolling-pin.jpg",
      alternatives: [],
    },
    {
      name: "Cheese grater",
      image: "cheese-grater.jpg",
      alternatives: [],
    },
    {
      name: "Salad spinner",
      image: "salad-spinner.jpg",
      alternatives: [],
    },
    {
      name: "Digital thermometer",
      image: "digital-thermometer.jpg",
      alternatives: [],
    },
    {
      name: "Pressure cooker",
      image: "pressure-cookier.png",
      alternatives: [],
    },
    {
      name: "Juicer",
      image: "juicer.jpg",
      alternatives: [],
    },
    {
      name: "Immersion blender",
      image: "immersion-blender.jpg",
      alternatives: [],
    },
    {
      name: "Kitchen scale",
      image: "kitchen-scale.jpg",
      alternatives: [],
    },
    {
      name: "Meat tenderizer",
      image: "meat-tenderizer.jpg",
      alternatives: [],
    },
    {
      name: "Mortar and pestle",
      image: "mortar-and-pestle.jpg",
      alternatives: [],
    },
    {
      name: "Pastry brush",
      image: "pastry-brush.jpg",
      alternatives: [],
    },
    {
      name: "Splatter screen",
      image: "splatter-screen.jpg",
      alternatives: [],
    },
    {
      name: "Spice grinder",
      image: "spice-grinder.jpg",
      alternatives: [],
    },
    {
      name: "Mandoline slicer",
      image: "mandoline-slicer.jpg",
      alternatives: [],
    },
    {
      name: "Citrus zester",
      image: "citrus-zester.jpg",
      alternatives: [],
    },
    {
      name: "Egg separator",
      image: "egg-separator.jpg",
      alternatives: [],
    },
  ],
};

const MathCategory: CategoryMetadata = {
  name: "Math",
  folder: "math",
  examples: [
    {
      name: "12",
      text: "7 + 5",
      alternatives: [],
    },
    {
      name: "9",
      text: "18 - 9",
      alternatives: [],
    },
    {
      name: "25",
      text: "16 + 9",
      alternatives: [],
    },
    {
      name: "17",
      text: "39 - 22",
      alternatives: [],
    },
    {
      name: "26",
      text: "12 + 14",
      alternatives: [],
    },
    {
      name: "13",
      text: "30 - 17",
      alternatives: [],
    },
    {
      name: "40",
      text: "22 + 18",
      alternatives: [],
    },
    {
      name: "24",
      text: "57 - 33",
      alternatives: [],
    },
    {
      name: "24",
      text: "68 - 44",
      alternatives: [],
    },
    {
      name: "42",
      text: "6 × 7",
      alternatives: [],
    },
    {
      name: "72",
      text: "8 × 9",
      alternatives: [],
    },
    {
      name: "56",
      text: "7 × 8",
      alternatives: [],
    },
    {
      name: "54",
      text: "9 × 6",
      alternatives: [],
    },
    {
      name: "40",
      text: "8 × 5",
      alternatives: [],
    },
    {
      name: "36",
      text: "9 × 4",
      alternatives: [],
    },
    {
      name: "60",
      text: "5 × 12",
      alternatives: [],
    },
    {
      name: "36",
      text: "12 × 3",
      alternatives: [],
    },
    {
      name: "66",
      text: "6 × 11",
      alternatives: [],
    },
    {
      name: "121",
      text: "11 × 11",
      alternatives: [],
    },
    {
      name: "9",
      text: "45 ÷ 5",
      alternatives: [],
    },
    {
      name: "7",
      text: "56 ÷ 8",
      alternatives: [],
    },
    {
      name: "9",
      text: "81 ÷ 9",
      alternatives: [],
    },
    {
      name: "9",
      text: "90 ÷ 10",
      alternatives: [],
    },
    {
      name: "16",
      text: "64 ÷ 4",
      alternatives: [],
    },
    {
      name: "16",
      text: "48 ÷ 3",
      alternatives: [],
    },
    {
      name: "20",
      text: "120 ÷ 6",
      alternatives: [],
    },
    {
      name: "25",
      text: "50 ÷ 2",
      alternatives: [],
    },
    {
      name: "12",
      text: "84 ÷ 7",
      alternatives: [],
    },
    {
      name: "8",
      text: "96 ÷ 12",
      alternatives: [],
    },
    {
      name: "12",
      text: "144 ÷ 12",
      alternatives: [],
    },
    {
      name: "61",
      text: "25 + 36",
      alternatives: [],
    },
    {
      name: "41",
      text: "14 + 27",
      alternatives: [],
    },
    {
      name: "73",
      text: "41 + 32",
      alternatives: [],
    },
    {
      name: "75",
      text: "28 + 47",
      alternatives: [],
    },
    {
      name: "41",
      text: "15 + 26",
      alternatives: [],
    },
    {
      name: "51",
      text: "34 + 17",
      alternatives: [],
    },
    {
      name: "51",
      text: "23 + 28",
      alternatives: [],
    },
    {
      name: "52",
      text: "33 + 19",
      alternatives: [],
    },
    {
      name: "52",
      text: "100 - 48",
      alternatives: [],
    },
    {
      name: "35",
      text: "63 - 28",
      alternatives: [],
    },
    {
      name: "27",
      text: "72 - 45",
      alternatives: [],
    },
    {
      name: "29",
      text: "58 - 29",
      alternatives: [],
    },
    {
      name: "39",
      text: "95 - 56",
      alternatives: [],
    },
    {
      name: "46",
      text: "70 - 24",
      alternatives: [],
    },
    {
      name: "63",
      text: "82 - 19",
      alternatives: [],
    },
    {
      name: "52",
      text: "4 × 13",
      alternatives: [],
    },
    {
      name: "42",
      text: "3 × 14",
      alternatives: [],
    },
    {
      name: "11",
      text: "132 ÷ 12",
      alternatives: [],
    },
  ],
};

const JunkDrawerCategory: CategoryMetadata = {
  name: "Junk drawer",
  folder: "junk-drawer",
  examples: [
    {
      name: "Scissors",
      image: "scissors.jpg",
      alternatives: [],
    },
    {
      name: "Pens",
      image: "pens.jpg",
      alternatives: [],
    },
    {
      name: "Pencils",
      image: "pencils.jpg",
      alternatives: [],
    },
    {
      name: "Paper clips",
      image: "paper-clips.jpg",
      alternatives: [],
    },
    {
      name: "AA batteries",
      image: "aa-batteries.jpg",
      alternatives: [],
    },
    {
      name: "AAA batteries",
      image: "aaa-batteries.jpg",
      alternatives: [],
    },
    {
      name: "Old batteries",
      image: "old-batteries.jpg",
      alternatives: [],
    },
    {
      name: "Loose change",
      image: "loose-change.jpg",
      alternatives: [],
    },
    {
      name: "Post-it notes",
      image: "post-it-notes.jpg",
      alternatives: [],
    },
    {
      name: "Thumbtacks",
      image: "thumbtacks.jpg",
      alternatives: [],
    },
    {
      name: "USB cables",
      image: "usb-cables.jpg",
      alternatives: [],
    },
    {
      name: "Broken phone chargers",
      image: "broken-phone-chargers.jpg",
      alternatives: [],
    },
    {
      name: "Random keys",
      image: "random-keys.jpg",
      alternatives: [],
    },
    {
      name: "Adhesive tape",
      image: "adhesive-tape.jpg",
      alternatives: [],
    },
    {
      name: "Glue sticks",
      image: "glue-sticks.jpg",
      alternatives: [],
    },
    {
      name: "Safety pins",
      image: "safety-pins.jpg",
      alternatives: [],
    },
    {
      name: "Binder clips",
      image: "binder-clips.jpg",
      alternatives: [],
    },
    {
      name: "Rubber bands",
      image: "rubber-bands.jpg",
      alternatives: [],
    },
    {
      name: "Small flashlight",
      image: "small-flashlight.jpg",
      alternatives: [],
    },
    {
      name: "Matches",
      image: "matches.jpg",
      alternatives: [],
    },
    {
      name: "Lighters",
      image: "lighters.jpg",
      alternatives: [],
    },
    {
      name: "Screwdriver",
      image: "screwdriver.jpg",
      alternatives: [],
    },
    {
      name: "Bottle opener",
      image: "bottle-opener.jpg",
      alternatives: [],
    },
    {
      name: "Notepad",
      image: "notepad.jpg",
      alternatives: [],
    },
    {
      name: "Keychains",
      image: "keychains.jpg",
      alternatives: [],
    },
    {
      name: "Playing cards",
      image: "playing-cards.jpg",
      alternatives: [],
    },
    {
      name: "Flash drives",
      image: "flash-drives.jpg",
      alternatives: [],
    },
    {
      name: "Chip clips",
      image: "chip-clips.jpg",
      alternatives: [],
    },
    {
      name: "Old gift cards",
      image: "old-gift-cards.jpg",
      alternatives: [],
    },
    {
      name: "Twist ties",
      image: "twist-ties.jpg",
      alternatives: [],
    },
    {
      name: "Plastic utensils",
      image: "plastic-utensils.jpg",
      alternatives: [],
    },
    {
      name: "Clothespins",
      image: "clothespins.jpg",
      alternatives: [],
    },
    {
      name: "Old receipts",
      image: "old-receipts.jpg",
      alternatives: [],
    },
    {
      name: "Expired coupons",
      image: "expired-coupons.jpg",
      alternatives: [],
    },
    {
      name: "Coasters",
      image: "coasters.jpg",
      alternatives: [],
    },
    {
      name: "Old magnets",
      image: "old-magnets.jpg",
      alternatives: [],
    },
    {
      name: "Old sunglasses",
      image: "old-sunglasses.jpg",
      alternatives: [],
    },
    {
      name: "Pocket knife",
      image: "pocket-knife.jpg",
      alternatives: [],
    },
    {
      name: "Coin purse",
      image: "coin-purse.jpg",
      alternatives: [],
    },
    {
      name: "Rubber gloves",
      image: "rubber-gloves.jpg",
      alternatives: [],
    },
    {
      name: "Candle stubs",
      image: "candle-stubs.jpg",
      alternatives: [],
    },
    {
      name: "Sticky tack",
      image: "sticky-tack.jpg",
      alternatives: [],
    },
    {
      name: "Twine",
      image: "twine.jpg",
      alternatives: [],
    },
    {
      name: "Spare buttons",
      image: "spare-buttons.jpg",
      alternatives: [],
    },
    {
      name: "Dried-out markers",
      image: "dried-out-markers.jpg",
      alternatives: [],
    },
    {
      name: "Allen wrenches",
      image: "allen-wrenches.jpg",
      alternatives: [],
    },
    {
      name: "Loose screws",
      image: "loose-screws.jpg",
      alternatives: [],
    },
    {
      name: "Spare fuses",
      image: "spare-fuses.jpg",
      alternatives: [],
    },
    {
      name: "Felt pads",
      image: "felt-pads.jpg",
      alternatives: [],
    },
    {
      name: "Rubber stopper",
      image: "rubber-stopper.jpg",
      alternatives: [],
    },
  ],
};

const LaundryCategory: CategoryMetadata = {
  name: "Laundry",
  folder: "laundry",
  examples: [
    {
      name: "Laundry detergent",
      image: "laundry-detergent.jpg",
      alternatives: [],
    },
    {
      name: "Washing machine",
      image: "washing-machine.jpg",
      alternatives: [],
    },
    {
      name: "Dryer",
      image: "dryer.jpg",
      alternatives: [],
    },
    {
      name: "Laundry basket",
      image: "laundry-basket.jpg",
      alternatives: [],
    },
    {
      name: "Hamper",
      image: "hamper.jpg",
      alternatives: [],
    },
    {
      name: "Dryer sheets",
      image: "dryer-sheets.jpg",
      alternatives: [],
    },
    {
      name: "Fabric softener",
      image: "fabric-softener.jpg",
      alternatives: [],
    },
    {
      name: "Iron",
      image: "iron.jpg",
      alternatives: [],
    },
    {
      name: "Ironing board",
      image: "ironing-board.jpg",
      alternatives: [],
    },
    {
      name: "Bleach",
      image: "bleach.jpg",
      alternatives: [],
    },
    {
      name: "Stain remover",
      image: "stain-remover.jpg",
      alternatives: [],
    },
    {
      name: "Lint roller",
      image: "lint-roller.jpg",
      alternatives: [],
    },
    {
      name: "Clothing hangers",
      image: "clothing-hangers.jpg",
      alternatives: [],
    },
    {
      name: "Detergent pods",
      image: "detergent-pods.jpg",
      alternatives: [],
    },
    {
      name: "Lint trap",
      image: "lint-trap.jpg",
      alternatives: [],
    },
    {
      name: "Clothespins",
      image: "clothespins.jpg",
      alternatives: [],
    },
    {
      name: "Drying rack",
      image: "drying-rack.jpg",
      alternatives: [],
    },
    {
      name: "Wrinkle releaser spray",
      image: "wrinkle-releaser-spray.jpg",
      alternatives: [],
    },
    {
      name: "Delicates bag",
      image: "delicates-bag.jpg",
      alternatives: [],
    },
    {
      name: "Mesh laundry bag",
      image: "mesh-laundry-bag.jpg",
      alternatives: [],
    },
    {
      name: "Steamer",
      image: "steamer.jpg",
      alternatives: [],
    },
    {
      name: "Color catcher sheets",
      image: "color-catcher-sheets.jpg",
      alternatives: [],
    },
    {
      name: "Wool dryer balls",
      image: "wool-dryer-balls.jpg",
      alternatives: [],
    },
    {
      name: "Fabric refresher",
      image: "fabric-refresher.jpg",
      alternatives: [],
    },
    {
      name: "Scent boosters",
      image: "scent-boosters.jpg",
      alternatives: [],
    },
    {
      name: "Dry cleaning bag",
      image: "dry-cleaning-bag.jpg",
      alternatives: [],
    },
    {
      name: "Soaking basin",
      image: "soaking-basin.jpg",
      alternatives: [],
    },
    {
      name: "Hand-wash soap",
      image: "hand-wash-soap.jpg",
      alternatives: [],
    },
    {
      name: "Laundry sanitizer",
      image: "laundry-sanitizer.jpg",
      alternatives: [],
    },
    {
      name: "Spot remover pen",
      image: "spot-remover-pen.jpg",
      alternatives: [],
    },
    {
      name: "Laundry marker",
      image: "laundry-marker.jpg",
      alternatives: [],
    },
    {
      name: "Clothes brush",
      image: "clothes-brush.jpg",
      alternatives: [],
    },
    {
      name: "Laundry scoop",
      image: "laundry-scoop.jpg",
      alternatives: [],
    },
    {
      name: "Folding board",
      image: "folding-board.jpg",
      alternatives: [],
    },
    {
      name: "Static guard",
      image: "static-guard.jpg",
      alternatives: [],
    },
    {
      name: "Laundry basket wheels",
      image: "laundry-basket-wheels.jpg",
      alternatives: [],
    },
    {
      name: "Delicate detergent",
      image: "delicate-detergent.jpg",
      alternatives: [],
    },
    {
      name: "Baby detergent",
      image: "baby-detergent.jpg",
      alternatives: [],
    },
    {
      name: "Down detergent",
      image: "down-detergent.jpg",
      alternatives: [],
    },
    {
      name: "Starch spray",
      image: "starch-spray.jpg",
      alternatives: [],
    },
    {
      name: "Laundry timer",
      image: "laundry-timer.jpg",
      alternatives: [],
    },
    {
      name: "Clothing repair kit",
      image: "clothing-repair-kit.jpg",
      alternatives: [],
    },
    {
      name: "Spare buttons",
      image: "spare-buttons.jpg",
      alternatives: [],
    },
    {
      name: "Detergent measuring cup",
      image: "detergent-measuring-cup.jpg",
      alternatives: [],
    },
    {
      name: "Terry cloth rags",
      image: "terry-cloth-rags.jpg",
      alternatives: [],
    },
    {
      name: "Clothing clips",
      image: "clothing-clips.jpg",
      alternatives: [],
    },
    {
      name: "Clothesline",
      image: "clothesline.jpg",
      alternatives: [],
    },
    {
      name: "Folded towels",
      image: "folded-towels.jpg",
      alternatives: [],
    },
  ],
};

const PopDivasCategory: CategoryMetadata = {
  name: "Pop divas",
  folder: "pop-divas",
  examples: [
    {
      name: "Taylor Swift",
      image: "taylor-swift.jpg",
      alternatives: [],
    },
    {
      name: "Beyoncé",
      image: "beyonce.jpg",
      alternatives: [],
    },
    {
      name: "Ariana Grande",
      image: "ariana-grande.jpg",
      alternatives: [],
    },
    {
      name: "Rihanna",
      image: "rihanna.jpg",
      alternatives: [],
    },
    {
      name: "Lady Gaga",
      image: "lady-gaga.jpg",
      alternatives: [],
    },
    {
      name: "Katy Perry",
      image: "katy-perry.jpg",
      alternatives: [],
    },
    {
      name: "Miley Cyrus",
      image: "miley-cyrus.jpg",
      alternatives: [],
    },
    {
      name: "Selena Gomez",
      image: "selena-gomez.jpg",
      alternatives: [],
    },
    {
      name: "Adele",
      image: "adele.jpg",
      alternatives: [],
    },
    {
      name: "Billie Eilish",
      image: "billie-eilish.jpg",
      alternatives: [],
    },
    {
      name: "Olivia Rodrigo",
      image: "olivia-rodrigo.jpg",
      alternatives: [],
    },
    {
      name: "Doja Cat",
      image: "doja-cat.jpg",
      alternatives: [],
    },
    {
      name: "Dua Lipa",
      image: "dua-lipa.jpg",
      alternatives: [],
    },
    {
      name: "Nicki Minaj",
      image: "nicki-minaj.jpg",
      alternatives: [],
    },
    {
      name: "Lizzo",
      image: "lizzo.jpg",
      alternatives: [],
    },
    {
      name: "Madonna",
      image: "madonna.jpg",
      alternatives: [],
    },
    {
      name: "Mariah Carey",
      image: "mariah-carey.jpg",
      alternatives: [],
    },
    {
      name: "Whitney Houston",
      image: "whitney-houston.jpg",
      alternatives: [],
    },
    {
      name: "Britney Spears",
      image: "britney-spears.jpg",
      alternatives: [],
    },
    {
      name: "Christina Aguilera",
      image: "christina-aguilera.jpg",
      alternatives: [],
    },
    {
      name: "Celine Dion",
      image: "celine-dion.jpg",
      alternatives: [],
    },
    {
      name: "Jennifer Lopez",
      image: "jennifer-lopez.jpg",
      alternatives: [],
    },
    {
      name: "Shakira",
      image: "shakira.jpg",
      alternatives: [],
    },
    {
      name: "Pink",
      image: "pink.jpg",
      alternatives: [],
    },
    {
      name: "Halsey",
      image: "halsey.jpg",
      alternatives: [],
    },
    {
      name: "Kesha",
      image: "kesha.jpg",
      alternatives: [],
    },
    {
      name: "Demi Lovato",
      image: "demi-lovato.jpg",
      alternatives: [],
    },
    {
      name: "Camila Cabello",
      image: "camila-cabello.jpg",
      alternatives: [],
    },
    {
      name: "Avril Lavigne",
      image: "avril-lavigne.jpg",
      alternatives: [],
    },
    {
      name: "Sia",
      image: "sia.jpg",
      alternatives: [],
    },
    {
      name: "Alicia Keys",
      image: "alicia-keys.jpg",
      alternatives: [],
    },
    {
      name: "Janet Jackson",
      image: "janet-jackson.jpg",
      alternatives: [],
    },
    {
      name: "Fergie",
      image: "fergie.jpg",
      alternatives: [],
    },
    {
      name: "Ellie Goulding",
      image: "ellie-goulding.jpg",
      alternatives: [],
    },
    {
      name: "Hayley Williams",
      image: "hayley-williams.jpg",
      alternatives: [],
    },
    {
      name: "Florence Welch",
      image: "florence-welch.jpg",
      alternatives: [],
    },
    {
      name: "Janelle Monáe",
      image: "janelle-monae.jpg",
      alternatives: [],
    },
    {
      name: "Charli XCX",
      image: "charli-xcx.jpg",
      alternatives: [],
    },
    {
      name: "Grimes",
      image: "grimes.jpg",
      alternatives: [],
    },
    {
      name: "Chloe Bailey",
      image: "chloe-bailey.jpg",
      alternatives: [],
    },
    {
      name: "Jessie J",
      image: "jessie-j.jpg",
      alternatives: [],
    },
    {
      name: "Kylie Minogue",
      image: "kylie-minogue.jpg",
      alternatives: [],
    },
    {
      name: "Ashanti",
      image: "ashanti.jpg",
      alternatives: [],
    },
    {
      name: "Bonnie Tyler",
      image: "bonnie-tyler.jpg",
      alternatives: [],
    },
    {
      name: "Tinashe",
      image: "tinashe.jpg",
      alternatives: [],
    },
    {
      name: "Tove Lo",
      image: "tove-lo.jpg",
      alternatives: [],
    },
    {
      name: "Rosalía",
      image: "rosalia.jpg",
      alternatives: [],
    },
    {
      name: "Chappell Roan",
      image: "chappell-roan.jpg",
      alternatives: [],
    },
    {
      name: "Normani",
      image: "normani.jpg",
      alternatives: [],
    },
  ],
};

const ChicagoTouristStuffCategory: CategoryMetadata = {
  name: "Chicago tourist stuff",
  folder: "chicago-tourist-stuff",
  examples: [
    {
      name: "Cloud Gate (The Bean)",
      image: "cloud-gate-the-bean.jpg",
      alternatives: [],
    },
    {
      name: "Navy Pier",
      image: "navy-pier.jpg",
      alternatives: [],
    },
    {
      name: "Millennium Park",
      image: "millennium-park.jpg",
      alternatives: [],
    },
    {
      name: "Wrigley Field",
      image: "wrigley-field.jpg",
      alternatives: [],
    },
    {
      name: "The Magnificent Mile",
      image: "the-magnificent-mile.jpg",
      alternatives: [],
    },
    {
      name: "Shedd Aquarium",
      image: "shedd-aquarium.jpg",
      alternatives: [],
    },
    {
      name: "Field Museum",
      image: "field-museum.jpg",
      alternatives: [],
    },
    {
      name: "Art Institute of Chicago",
      image: "art-institute-of-chicago.jpg",
      alternatives: [],
    },
    {
      name: "Chicago Riverwalk",
      image: "chicago-riverwalk.jpg",
      alternatives: [],
    },
    {
      name: "Buckingham Fountain",
      image: "buckingham-fountain.jpg",
      alternatives: [],
    },
    {
      name: "Chicago Water Tower",
      image: "chicago-water-tower.jpg",
      alternatives: [],
    },
    {
      name: "Soldier Field",
      image: "soldier-field.jpg",
      alternatives: [],
    },
    {
      name: "Museum of Science and Industry",
      image: "museum-of-science-and-industry.jpg",
      alternatives: [],
    },
    {
      name: "Adler Planetarium",
      image: "adler-planetarium.jpg",
      alternatives: [],
    },
    {
      name: "Lincoln Park Zoo",
      image: "lincoln-park-zoo.jpg",
      alternatives: [],
    },
    {
      name: "Grant Park",
      image: "grant-park.jpg",
      alternatives: [],
    },
    {
      name: "Chicago Theatre",
      image: "chicago-theatre.jpg",
      alternatives: [],
    },
    {
      name: "Architectural Boat Tour",
      image: "architectural-boat-tour.jpg",
      alternatives: [],
    },
    {
      name: "Maggie Daley Park",
      image: "maggie-daley-park.jpg",
      alternatives: [],
    },
    {
      name: "360 Chicago",
      image: "360-chicago.jpg",
      alternatives: [],
    },
    {
      name: "Chicago Cultural Center",
      image: "chicago-cultural-center.jpg",
      alternatives: [],
    },
    {
      name: "Chicago History Museum",
      image: "chicago-history-museum.jpg",
      alternatives: [],
    },
    {
      name: "Second City",
      image: "second-city.jpg",
      alternatives: [],
    },
    {
      name: "Blue Man Group",
      image: "blue-man-group.png",
      alternatives: [],
    },
    {
      name: "Portillo's",
      image: "portillos.jpg",
      alternatives: [],
    },
    {
      name: "Garrett Popcorn",
      image: "garrett-popcorn.jpg",
      alternatives: [],
    },
    {
      name: "Gino's East",
      image: "ginos-east.jpg",
      alternatives: [],
    },
    {
      name: "Billy Goat Tavern",
      image: "billy-goat-tavern.jpg",
      alternatives: [],
    },
    {
      name: "Chicago Hot Dog stands",
      image: "chicago-hot-dog-stands.jpg",
      alternatives: [],
    },
    {
      name: "Ferris wheel at Navy Pier",
      image: "ferris-wheel-at-navy-pier.jpg",
      alternatives: [],
    },
    {
      name: "Brookfield Zoo",
      image: "brookfield-zoo.jpg",
      alternatives: [],
    },
    {
      name: "Chicago Botanic Garden",
      image: "chicago-botanic-garden.jpg",
      alternatives: [],
    },
    {
      name: "Chicago Lakefront Trail",
      image: "chicago-lakefront-trail.jpg",
      alternatives: [],
    },
    {
      name: "The 606 Trail",
      image: "the-606-trail.jpg",
      alternatives: [],
    },
    {
      name: "ChinaTown Square",
      image: "chinatown-square.jpg",
      alternatives: [],
    },
    {
      name: "Maxwell Street Market",
      image: "maxwell-street-market.jpg",
      alternatives: [],
    },
    {
      name: "Promontory Point",
      image: "promontory-point.jpg",
      alternatives: [],
    },
    {
      name: "Calder's Flamingo",
      image: "calders-flamingo.jpg",
      alternatives: [],
    },
    {
      name: "The Green Mill",
      image: "the-green-mill.jpg",
      alternatives: [],
    },
    {
      name: "Divvy bikes",
      image: "divvy-bikes.jpg",
      alternatives: [],
    },
    {
      name: "Metra Electric line",
      image: "metra-electric-line.png",
      alternatives: [],
    },
    {
      name: "Chicago Pedway",
      image: "chicago-pedway.jpg",
      alternatives: [],
    },
    {
      name: "Garfield Park Conservatory",
      image: "garfield-park-conservatory.jpg",
      alternatives: [],
    },
    {
      name: "The Robey rooftop",
      image: "the-robey-rooftop.jpg",
      alternatives: [],
    },
    {
      name: "The Violet Hour",
      image: "the-violet-hour.jpg",
      alternatives: [],
    },
    {
      name: "Andersonville Clark St.",
      image: "andersonville-clark-st.jpg",
      alternatives: [],
    },
    {
      name: "Chicago Pizza Museum (former)",
      image: "chicago-pizza-museum-former.jpg",
      alternatives: [],
    },
    {
      name: "Shakespeare Theater Navy Pier",
      image: "shakespeare-theater-navy-pier.jpg",
      alternatives: [],
    },
  ],
};

const AppsCategory: CategoryMetadata = {
  name: "Apps",
  folder: "apps",
  examples: [
    {
      name: "Instagram",
      image: "instagram.png",
      alternatives: [],
    },
    {
      name: "Facebook",
      image: "facebook.png",
      alternatives: [],
    },
    {
      name: "YouTube",
      image: "youtube.png",
      alternatives: [],
    },
    {
      name: "TikTok",
      image: "tiktok.png",
      alternatives: [],
    },
    {
      name: "Snapchat",
      image: "snapchat.png",
      alternatives: [],
    },
    {
      name: "Twitter",
      image: "twitter.png",
      alternatives: [],
    },
    {
      name: "WhatsApp",
      image: "whatsapp.png",
      alternatives: [],
    },
    {
      name: "Netflix",
      image: "netflix.png",
      alternatives: [],
    },
    {
      name: "Spotify",
      image: "spotify.png",
      alternatives: [],
    },
    {
      name: "Amazon",
      image: "amazon.png",
      alternatives: [],
    },
    {
      name: "Gmail",
      image: "gmail.png",
      alternatives: [],
    },
    {
      name: "Google Maps",
      image: "google-maps.png",
      alternatives: [],
    },
    {
      name: "Uber",
      image: "uber.png",
      alternatives: [],
    },
    {
      name: "Venmo",
      image: "venmo.png",
      alternatives: [],
    },
    {
      name: "PayPal",
      image: "paypal.png",
      alternatives: [],
    },
    {
      name: "Zoom",
      image: "zoom.png",
      alternatives: [],
    },
    {
      name: "DoorDash",
      image: "doordash.png",
      alternatives: [],
    },
    {
      name: "Grubhub",
      image: "grubhub.png",
      alternatives: [],
    },
    {
      name: "Instacart",
      image: "instacart.png",
      alternatives: [],
    },
    {
      name: "Cash App",
      image: "cash-app.png",
      alternatives: [],
    },
    {
      name: "Reddit",
      image: "reddit.png",
      alternatives: [],
    },
    {
      name: "Pinterest",
      image: "pinterest.png",
      alternatives: [],
    },
    {
      name: "LinkedIn",
      image: "linkedin.png",
      alternatives: [],
    },
    {
      name: "Discord",
      image: "discord.png",
      alternatives: [],
    },
    {
      name: "Twitch",
      image: "twitch.png",
      alternatives: [],
    },
    {
      name: "Apple Maps",
      image: "apple-maps.png",
      alternatives: [],
    },
    {
      name: "Messenger",
      image: "messenger.png",
      alternatives: [],
    },
    {
      name: "Prime Video",
      image: "prime-video.jpg",
      alternatives: [],
    },
    {
      name: "Target",
      image: "target.png",
      alternatives: [],
    },
    {
      name: "Walmart",
      image: "walmart.png",
      alternatives: [],
    },
    {
      name: "ESPN",
      image: "espn.png",
      alternatives: [],
    },
    {
      name: "Disney",
      image: "disney.jpg",
      alternatives: [],
    },
    {
      name: "Kindle",
      image: "kindle.png",
      alternatives: [],
    },
    {
      name: "Shazam",
      image: "shazam.png",
      alternatives: [],
    },
    {
      name: "Roku",
      image: "roku.png",
      alternatives: [],
    },
    {
      name: "Slack",
      image: "slack.png",
      alternatives: [],
    },
    {
      name: "Microsoft Teams",
      image: "microsoft-teams.png",
      alternatives: [],
    },
    {
      name: "Robinhood",
      image: "robinhood.png",
      alternatives: [],
    },
    {
      name: "Fidelity",
      image: "fidelity.png",
      alternatives: [],
    },
    {
      name: "Southwest",
      image: "southwest.png",
      alternatives: [],
    },
    {
      name: "United Airlines",
      image: "united-airlines.png",
      alternatives: [],
    },
    {
      name: "Strava",
      image: "strava.png",
      alternatives: [],
    },
    {
      name: "Trello",
      image: "trello.png",
      alternatives: [],
    },
    {
      name: "Pandora",
      image: "pandora.png",
      alternatives: [],
    },
    {
      name: "Notion",
      image: "notion.png",
      alternatives: [],
    },
    {
      name: "Telegram",
      image: "telegram.png",
      alternatives: [],
    },
    {
      name: "Signal",
      image: "signal.png",
      alternatives: [],
    },
    {
      name: "WeChat",
      image: "wechat.png",
      alternatives: [],
    },
    {
      name: "Partiful",
      image: "partiful.png",
      alternatives: [],
    },
  ],
};

const BoardGamesCategory: CategoryMetadata = {
  name: "Board games",
  folder: "board-games",
  examples: [
    {
      name: "Monopoly",
      image: "monopoly.jpg",
      alternatives: [],
    },
    {
      name: "Scrabble",
      image: "scrabble.jpg",
      alternatives: [],
    },
    {
      name: "Chess",
      image: "chess.jpg",
      alternatives: [],
    },
    {
      name: "Clue",
      image: "clue.jpg",
      alternatives: [],
    },
    {
      name: "The Game of Life",
      image: "the-game-of-life.jpg",
      alternatives: [],
    },
    {
      name: "Battleship",
      image: "battleship.jpg",
      alternatives: [],
    },
    {
      name: "Connect Four",
      image: "connect-four.jpg",
      alternatives: [],
    },
    {
      name: "Operation",
      image: "operation.jpg",
      alternatives: [],
    },
    {
      name: "Sorry",
      image: "sorry.jpg",
      alternatives: [],
    },
    {
      name: "Risk",
      image: "risk.jpg",
      alternatives: [],
    },
    {
      name: "Trivial Pursuit",
      image: "trivial-pursuit.jpg",
      alternatives: [],
    },
    {
      name: "Pictionary",
      image: "pictionary.jpg",
      alternatives: [],
    },
    {
      name: "Taboo",
      image: "taboo.jpg",
      alternatives: [],
    },
    {
      name: "Scattergories",
      image: "scattergories.jpg",
      alternatives: [],
    },
    {
      name: "Twister",
      image: "twister.jpg",
      alternatives: [],
    },
    {
      name: "Yahtzee",
      image: "yahtzee.jpg",
      alternatives: [],
    },
    {
      name: "Candy Land",
      image: "candy-land.jpg",
      alternatives: [],
    },
    {
      name: "Chutes and Ladders",
      image: "chutes-and-ladders.jpg",
      alternatives: [],
    },
    {
      name: "Hungry Hungry Hippos",
      image: "hungry-hungry-hippos.jpg",
      alternatives: [],
    },
    {
      name: "Mouse Trap",
      image: "mouse-trap.jpg",
      alternatives: [],
    },
    {
      name: "Guess Who",
      image: "guess-who.jpg",
      alternatives: [],
    },
    {
      name: "Cards Against Humanity",
      image: "cards-against-humanity.jpg",
      alternatives: [],
    },
    {
      name: "Catan",
      image: "catan.jpg",
      alternatives: [],
    },
    {
      name: "Ticket to Ride",
      image: "ticket-to-ride.jpg",
      alternatives: [],
    },
    {
      name: "Pandemic",
      image: "pandemic.jpg",
      alternatives: [],
    },
    {
      name: "Apples to Apples",
      image: "apples-to-apples.jpg",
      alternatives: [],
    },
    {
      name: "Bananagrams",
      image: "bananagrams.jpg",
      alternatives: [],
    },
    {
      name: "Blokus",
      image: "blokus.jpg",
      alternatives: [],
    },
    {
      name: "Wingspan",
      image: "wingspan.jpg",
      alternatives: [],
    },
    {
      name: "Carcassonne",
      image: "carcassonne.jpg",
      alternatives: [],
    },
    {
      name: "Dominion",
      image: "dominion.jpg",
      alternatives: [],
    },
    {
      name: "Secret Hitler",
      image: "secret-hitler.jpg",
      alternatives: [],
    },
    {
      name: "Stratego",
      image: "stratego.jpg",
      alternatives: [],
    },
    {
      name: "Othello",
      image: "othello.jpg",
      alternatives: [],
    },
    {
      name: "Backgammon",
      image: "backgammon.jpg",
      alternatives: [],
    },
    {
      name: "Trouble",
      image: "trouble.jpg",
      alternatives: [],
    },
    {
      name: "Fluxx",
      image: "fluxx.jpg",
      alternatives: [],
    },
    {
      name: "Forbidden Island",
      image: "forbidden-island.jpg",
      alternatives: [],
    },
    {
      name: "7 Wonders",
      image: "7-wonders.jpg",
      alternatives: [],
    },
    {
      name: "Azul",
      image: "azul.jpg",
      alternatives: [],
    },
    {
      name: "Five Tribes",
      image: "five-tribes.jpg",
      alternatives: [],
    },
    {
      name: "Villainous",
      image: "villainous.jpg",
      alternatives: [],
    },
    {
      name: "Wavelength",
      image: "wavelength.jpg",
      alternatives: [],
    },
    {
      name: "Hues and Clues",
      image: "hues-and-clues.jpg",
      alternatives: [],
    },
    {
      name: "Labyrinth",
      image: "labyrinth.jpg",
      alternatives: [],
    },
    {
      name: "Aggravation",
      image: "aggravation.jpg",
      alternatives: [],
    },
    {
      name: "Gloomhaven",
      image: "gloomhaven.jpg",
      alternatives: [],
    },
    {
      name: "Spirit Island",
      image: "spirit-island.jpg",
      alternatives: [],
    },
    {
      name: "Shadows Over Camelot",
      image: "shadows-over-camelot.jpg",
      alternatives: [],
    },
    {
      name: "Decrypto",
      image: "decrypto.jpg",
      alternatives: [],
    },
    {
      name: "Arkham Horror",
      image: "arkham-horror.jpg",
      alternatives: [],
    },
  ],
};

const StatesCategory: CategoryMetadata = {
  name: "States",
  folder: "states",
  examples: [
    { name: "California", image: "california.jpg", alternatives: [] },
    { name: "Texas", image: "texas.jpg", alternatives: [] },
    { name: "New York", image: "new-york.jpg", alternatives: [] },
    { name: "Florida", image: "florida.jpg", alternatives: [] },
    { name: "Illinois", image: "illinois.jpg", alternatives: [] },
    { name: "Pennsylvania", image: "pennsylvania.jpg", alternatives: [] },
    { name: "Ohio", image: "ohio.png", alternatives: [] },
    { name: "Michigan", image: "michigan.jpg", alternatives: [] },
    { name: "Georgia", image: "georgia.jpg", alternatives: [] },
    { name: "North Carolina", image: "north-carolina.jpg", alternatives: [] },
    { name: "New Jersey", image: "new-jersey.jpg", alternatives: [] },
    { name: "Virginia", image: "virginia.jpg", alternatives: [] },
    { name: "Washington", image: "washington.jpg", alternatives: [] },
    { name: "Massachusetts", image: "massachusetts.png", alternatives: [] },
    { name: "Tennessee", image: "tennessee.png", alternatives: [] },
    { name: "Arizona", image: "arizona.jpg", alternatives: [] },
    { name: "Indiana", image: "indiana.jpg", alternatives: [] },
    { name: "Missouri", image: "missouri.jpg", alternatives: [] },
    { name: "Maryland", image: "maryland.jpg", alternatives: [] },
    { name: "Wisconsin", image: "wisconsin.jpg", alternatives: [] },
    { name: "Colorado", image: "colorado.jpg", alternatives: [] },
    { name: "Minnesota", image: "minnesota.jpg", alternatives: [] },
    { name: "Louisiana", image: "louisiana.jpg", alternatives: [] },
    { name: "Alabama", image: "alabama.jpg", alternatives: [] },
    { name: "Kentucky", image: "kentucky.png", alternatives: [] },
    { name: "Oregon", image: "oregon.jpg", alternatives: [] },
    { name: "Oklahoma", image: "oklahoma.jpg", alternatives: [] },
    { name: "Connecticut", image: "connecticut.jpg", alternatives: [] },
    { name: "Iowa", image: "iowa.jpg", alternatives: [] },
    { name: "Arkansas", image: "arkansas.jpg", alternatives: [] },
    { name: "Mississippi", image: "mississippi.jpg", alternatives: [] },
    { name: "Kansas", image: "kansas.jpg", alternatives: [] },
    { name: "Utah", image: "utah.jpg", alternatives: [] },
    { name: "Nevada", image: "nevada.png", alternatives: [] },
    { name: "New Mexico", image: "new-mexico.jpg", alternatives: [] },
    { name: "West Virginia", image: "west-virginia.jpg", alternatives: [] },
    { name: "Nebraska", image: "nebraska.jpg", alternatives: [] },
    { name: "Idaho", image: "idaho.jpg", alternatives: [] },
    { name: "Maine", image: "maine.jpg", alternatives: [] },
    { name: "Montana", image: "montana.jpg", alternatives: [] },
    { name: "Alaska", image: "alaska.jpg", alternatives: [] },
    { name: "South Dakota", image: "south-dakota.jpg", alternatives: [] },
    { name: "North Dakota", image: "north-dakota.jpg", alternatives: [] },
    { name: "Vermont", image: "vermont.jpg", alternatives: [] },
    { name: "Rhode Island", image: "rhode-island.jpg", alternatives: [] },
    { name: "Delaware", image: "delaware.jpg", alternatives: [] },
  ],
};

const HarryPotterCharactersCategory: CategoryMetadata = {
  name: "Harry Potter characters",
  folder: "harry-potter-characters",
  examples: [
    { name: "Harry Potter", image: "harry-potter.jpg", alternatives: [] },
    {
      name: "Hermione Granger",
      image: "hermione-granger.jpg",
      alternatives: [],
    },
    { name: "Ron Weasley", image: "ron-weasley.jpg", alternatives: [] },
    {
      name: "Albus Dumbledore",
      image: "albus-dumbledore.jpg",
      alternatives: [],
    },
    { name: "Lord Voldemort", image: "lord-voldemort.jpg", alternatives: [] },
    { name: "Severus Snape", image: "severus-snape.jpg", alternatives: [] },
    { name: "Rubeus Hagrid", image: "rubeus-hagrid.png", alternatives: [] },
    { name: "Draco Malfoy", image: "draco-malfoy.jpg", alternatives: [] },
    {
      name: "Minerva McGonagall",
      image: "minerva-mcgonagall.jpg",
      alternatives: [],
    },
    { name: "Sirius Black", image: "sirius-black.jpg", alternatives: [] },
    { name: "Remus Lupin", image: "remus-lupin.jpg", alternatives: [] },
    {
      name: "Bellatrix Lestrange",
      image: "bellatrix-lestrange.jpg",
      alternatives: [],
    },
    {
      name: "Dolores Umbridge",
      image: "dolores-umbridge.jpg",
      alternatives: [],
    },
    { name: "Luna Lovegood", image: "luna-lovegood.jpg", alternatives: [] },
    {
      name: "Neville Longbottom",
      image: "neville-longbottom.jpg",
      alternatives: [],
    },
    { name: "Ginny Weasley", image: "ginny-weasley.jpg", alternatives: [] },
    { name: "Dobby", image: "dobby.jpg", alternatives: [] },
    { name: "Lucius Malfoy", image: "lucius-malfoy.jpg", alternatives: [] },
    { name: "Molly Weasley", image: "molly-weasley.jpg", alternatives: [] },
    { name: "Arthur Weasley", image: "arthur-weasley.jpg", alternatives: [] },
    { name: "Fred Weasley", image: "fred-weasley.jpg", alternatives: [] },
    { name: "George Weasley", image: "george-weasley.jpg", alternatives: [] },
    { name: "Cedric Diggory", image: "cedric-diggory.jpg", alternatives: [] },
    { name: "Cho Chang", image: "cho-chang.jpg", alternatives: [] },
    {
      name: "Gilderoy Lockhart",
      image: "gilderoy-lockhart.jpg",
      alternatives: [],
    },
    {
      name: "Peter Pettigrew",
      image: "peter-pettigrew.jpg",
      alternatives: [],
    },
    { name: "Rita Skeeter", image: "rita-skeeter.jpg", alternatives: [] },
    {
      name: "Sybil Trelawney",
      image: "sybil-trelawney.jpg",
      alternatives: [],
    },
    { name: "Viktor Krum", image: "viktor-krum.jpg", alternatives: [] },
    {
      name: "Nymphadora Tonks",
      image: "nymphadora-tonks.jpg",
      alternatives: [],
    },
    {
      name: "Kingsley Shacklebolt",
      image: "kingsley-shacklebolt.jpg",
      alternatives: [],
    },
    { name: "Alastor Moody", image: "alastor-moody.jpg", alternatives: [] },
    { name: "Percy Weasley", image: "percy-weasley.jpg", alternatives: [] },
    { name: "Bill Weasley", image: "bill-weasley.jpg", alternatives: [] },
    {
      name: "Charlie Weasley",
      image: "charlie-weasley.jpg",
      alternatives: [],
    },
    { name: "Lavender Brown", image: "lavender-brown.jpg", alternatives: [] },
    {
      name: "Seamus Finnigan",
      image: "seamus-finnigan.jpg",
      alternatives: [],
    },
    { name: "Dean Thomas", image: "dean-thomas.jpg", alternatives: [] },
    {
      name: "Narcissa Malfoy",
      image: "narcissa-malfoy.jpg",
      alternatives: [],
    },
    {
      name: "Barty Crouch Jr.",
      image: "barty-crouch-jr.png",
      alternatives: [],
    },
    {
      name: "Cornelius Fudge",
      image: "cornelius-fudge.jpg",
      alternatives: [],
    },
    {
      name: "Horace Slughorn",
      image: "horace-slughorn.jpg",
      alternatives: [],
    },
    { name: "Argus Filch", image: "argus-filch.jpg", alternatives: [] },
    { name: "Kreacher", image: "kreacher.jpg", alternatives: [] },
    { name: "Padma Patil", image: "padma-patil.jpg", alternatives: [] },
    { name: "Parvati Patil", image: "parvati-patil.jpg", alternatives: [] },
    { name: "Igor Karkaroff", image: "igor-karkaroff.jpg", alternatives: [] },
    {
      name: "Fenrir Greyback",
      image: "fenrir-greyback.jpg",
      alternatives: [],
    },
    { name: "Pomona Sprout", image: "pomona-sprout.jpg", alternatives: [] },
  ],
};

const SpiritHalloweenCatalogueCategory: CategoryMetadata = {
  name: "Spirit Halloween Catalogue",
  folder: "spirit-halloween-catalogue",
  examples: [
    { name: "Batman", image: "batman.jpg", alternatives: [] },
    { name: "Cat costume", image: "cat-costume.jpg", alternatives: [] },
    { name: "Cheerleader", image: "cheerleader.jpg", alternatives: [] },
    { name: "Chucky", image: "chucky.jpg", alternatives: [] },
    { name: "Beetlejuice", image: "beetlejuice.jpg", alternatives: [] },
    { name: "Angel", image: "angel.jpg", alternatives: [] },
    { name: "Astronaut", image: "astronaut.jpg", alternatives: [] },
    { name: "Banana suit", image: "banana-suit.jpg", alternatives: [] },
  ],
};

const SuperherosCategory: CategoryMetadata = {
  name: "Superheros",
  folder: "superheros",
  examples: [
    {
      name: "Superman",
      image: "superman.jpg",
      alternatives: [],
    },
    {
      name: "Batman",
      image: "batman.jpg",
      alternatives: [],
    },
    {
      name: "Spider-Man",
      image: "spider-man.jpg",
      alternatives: [],
    },
    {
      name: "Iron Man",
      image: "iron-man.jpg",
      alternatives: [],
    },
    {
      name: "Captain America",
      image: "captain-america.jpg",
      alternatives: [],
    },
    {
      name: "Wonder Woman",
      image: "wonder-woman.jpg",
      alternatives: [],
    },
    {
      name: "Hulk",
      image: "hulk.jpg",
      alternatives: [],
    },
    {
      name: "Thor",
      image: "thor.jpg",
      alternatives: [],
    },
    {
      name: "Black Widow",
      image: "black-widow.jpg",
      alternatives: [],
    },
    {
      name: "Wolverine",
      image: "wolverine.jpg",
      alternatives: [],
    },
    {
      name: "The Flash",
      image: "the-flash.jpg",
      alternatives: [],
    },
    {
      name: "Deadpool",
      image: "deadpool.png",
      alternatives: [],
    },
    {
      name: "Black Panther",
      image: "black-panther.jpg",
      alternatives: [],
    },
    {
      name: "Doctor Strange",
      image: "doctor-strange.jpg",
      alternatives: [],
    },
    {
      name: "Aquaman",
      image: "aquaman.jpg",
      alternatives: [],
    },
    {
      name: "Green Lantern",
      image: "green-lantern.jpg",
      alternatives: [],
    },
    {
      name: "Captain Marvel",
      image: "captain-marvel.jpg",
      alternatives: [],
    },
    {
      name: "Ant-Man",
      image: "ant-man.jpg",
      alternatives: [],
    },
    {
      name: "Hawkeye",
      image: "hawkeye.jpg",
      alternatives: [],
    },
    {
      name: "Scarlet Witch",
      image: "scarlet-witch.jpg",
      alternatives: [],
    },
    {
      name: "Vision",
      image: "vision.jpg",
      alternatives: [],
    },
    {
      name: "Star-Lord",
      image: "star-lord.jpg",
      alternatives: [],
    },
    {
      name: "Gamora",
      image: "gamora.jpg",
      alternatives: [],
    },
    {
      name: "Groot",
      image: "groot.jpg",
      alternatives: [],
    },
    {
      name: "Rocket Raccoon",
      image: "rocket-raccoon.jpg",
      alternatives: [],
    },
    {
      name: "Drax",
      image: "drax.jpg",
      alternatives: [],
    },
    {
      name: "The Wasp",
      image: "the-wasp.jpg",
      alternatives: [],
    },
    {
      name: "Shazam",
      image: "shazam.jpg",
      alternatives: [],
    },
    {
      name: "Green Arrow",
      image: "green-arrow.jpg",
      alternatives: [],
    },
    {
      name: "Supergirl",
      image: "supergirl.jpg",
      alternatives: [],
    },
    {
      name: "Batgirl",
      image: "batgirl.jpg",
      alternatives: [],
    },
    {
      name: "Robin",
      image: "robin.jpg",
      alternatives: [],
    },
    {
      name: "Cyclops",
      image: "cyclops.jpg",
      alternatives: [],
    },
    {
      name: "Jean Grey",
      image: "jean-grey.jpg",
      alternatives: [],
    },
    {
      name: "Storm",
      image: "storm.jpg",
      alternatives: [],
    },
    {
      name: "Professor X",
      image: "professor-x.jpg",
      alternatives: [],
    },
    {
      name: "Rogue",
      image: "rogue.jpg",
      alternatives: [],
    },
    {
      name: "Gambit",
      image: "gambit.jpg",
      alternatives: [],
    },
    {
      name: "Beast Boy",
      image: "beast-boy.jpg",
      alternatives: [],
    },
    {
      name: "Raven",
      image: "raven.jpg",
      alternatives: [],
    },
    {
      name: "Starfire",
      image: "starfire.png",
      alternatives: [],
    },
    {
      name: "Daredevil",
      image: "daredevil.jpg",
      alternatives: [],
    },
    {
      name: "Cyborg",
      image: "cyborg.jpg",
      alternatives: [],
    },
    {
      name: "Nightwing",
      image: "nightwing.jpg",
      alternatives: [],
    },
    {
      name: "The Thing",
      image: "the-thing.jpg",
      alternatives: [],
    },
    {
      name: "Mr. Fantastic",
      image: "mr-fantastic.jpg",
      alternatives: [],
    },
    {
      name: "Invisible Woman",
      image: "invisible-woman.jpg",
      alternatives: [],
    },
    {
      name: "Human Torch",
      image: "human-torch.jpg",
      alternatives: [],
    },
    {
      name: "Silver Surfer",
      image: "silver-surfer.jpg",
      alternatives: [],
    },
    {
      name: "Martian Manhunter",
      image: "martian-manhunter.jpg",
      alternatives: [],
    },
  ],
};

const VideoGameCharactersCategory: CategoryMetadata = {
  name: "Video Game Characters",
  folder: "video-game-characters",
  examples: [
    {
      name: "Mario",
      image: "mario.png",
      alternatives: [],
    },
    {
      name: "Pikachu",
      image: "pikachu.png",
      alternatives: [],
    },
    {
      name: "Link",
      image: "link.png",
      alternatives: [],
    },
    {
      name: "Sonic the Hedgehog",
      image: "sonic-the-hedgehog.jpg",
      alternatives: [],
    },
    {
      name: "Pac-Man",
      image: "pac-man.png",
      alternatives: [],
    },
    {
      name: "Donkey Kong",
      image: "donkey-kong.jpg",
      alternatives: [],
    },
    {
      name: "Luigi",
      image: "luigi.png",
      alternatives: [],
    },
    {
      name: "Princess Peach",
      image: "princess-peach.jpg",
      alternatives: [],
    },
    {
      name: "Bowser",
      image: "bowser.jpg",
      alternatives: [],
    },
    {
      name: "Yoshi",
      image: "yoshi.jpg",
      alternatives: [],
    },
    {
      name: "Princess Zelda",
      image: "princess-zelda.jpg",
      alternatives: [],
    },
    {
      name: "Zelda",
      image: "zelda.jpg",
      alternatives: [],
    },
    {
      name: "Ganondorf",
      image: "ganondorf.jpg",
      alternatives: [],
    },
    {
      name: "Cloud Strife",
      image: "cloud-strife.jpg",
      alternatives: [],
    },
    {
      name: "Master Chief",
      image: "master-chief.png",
      alternatives: [],
    },
    {
      name: "Lara Croft",
      image: "lara-croft.png",
      alternatives: [],
    },
    {
      name: "Solid Snake",
      image: "solid-snake.png",
      alternatives: [],
    },
    {
      name: "Kratos",
      image: "kratos.jpg",
      alternatives: [],
    },
    {
      name: "Nathan Drake",
      image: "nathan-drake.jpg",
      alternatives: [],
    },
    {
      name: "Charizard",
      image: "charizard.jpg",
      alternatives: [],
    },
    {
      name: "Steve",
      image: "steve.jpg",
      alternatives: [],
    },
    {
      name: "Crash Bandicoot",
      image: "crash-bandicoot.jpg",
      alternatives: [],
    },
    {
      name: "Spyro the Dragon",
      image: "spyro-the-dragon.jpg",
      alternatives: [],
    },
    {
      name: "Tails",
      image: "tails.png",
      alternatives: [],
    },
    {
      name: "Knuckles",
      image: "knuckles.jpg",
      alternatives: [],
    },
    {
      name: "Samus Aran",
      image: "samus-aran.jpg",
      alternatives: [],
    },
    {
      name: "Kirby",
      image: "kirby.png",
      alternatives: [],
    },
    {
      name: "Mega Man",
      image: "mega-man.jpg",
      alternatives: [],
    },
    {
      name: "Ryu",
      image: "ryu.jpg",
      alternatives: [],
    },
    {
      name: "Ken Masters",
      image: "ken-masters.png",
      alternatives: [],
    },
    {
      name: "Chun-Li",
      image: "chun-li.jpg",
      alternatives: [],
    },
    {
      name: "Sephiroth",
      image: "sephiroth.jpg",
      alternatives: [],
    },
    {
      name: "Scorpion",
      image: "scorpion.jpg",
      alternatives: [],
    },
    {
      name: "Sub-Zero",
      image: "sub-zero.jpg",
      alternatives: [],
    },
    {
      name: "Ellie",
      image: "ellie.jpg",
      alternatives: [],
    },
    {
      name: "Joel Miller",
      image: "joel-miller.png",
      alternatives: [],
    },
    {
      name: "Geralt of Rivia",
      image: "geralt-of-rivia.jpg",
      alternatives: [],
    },
    {
      name: "Arthur Morgan",
      image: "arthur-morgan.jpg",
      alternatives: [],
    },
    {
      name: "Joker",
      image: "joker.jpg",
      alternatives: [],
    },
    {
      name: "Tracer",
      image: "tracer.jpg",
      alternatives: [],
    },
    {
      name: "Doom Slayer",
      image: "doom-slayer.jpg",
      alternatives: [],
    },
    {
      name: "Gordon Freeman",
      image: "gordon-freeman.jpg",
      alternatives: [],
    },
    {
      name: "Sora",
      image: "sora.jpg",
      alternatives: [],
    },
    {
      name: "Rayman",
      image: "rayman.jpg",
      alternatives: [],
    },
    {
      name: "Dr. Eggman",
      image: "dr-eggman.png",
      alternatives: [],
    },
    {
      name: "Jill Valentine",
      image: "jill-valentine.jpg",
      alternatives: [],
    },
    {
      name: "Leon S. Kennedy",
      image: "leon-s-kennedy.jpg",
      alternatives: [],
    },
    {
      name: "Ezio Auditore",
      image: "ezio-auditore.jpg",
      alternatives: [],
    },
    {
      name: "Altaïr Ibn-La'Ahad",
      image: "altaïr-ibn-laahad.jpg",
      alternatives: [],
    },
    {
      name: "Agent 47",
      image: "agent-47.jpg",
      alternatives: [],
    },
  ],
};

const CitySkylinesCategory: CategoryMetadata = {
  name: "City Skylines",
  folder: "city-skylines",
  examples: [
    {
      name: "New York City",
      image: "new-york-city.jpg",
      alternatives: [],
    },
    {
      name: "London",
      image: "london.jpg",
      alternatives: [],
    },
    {
      name: "Paris",
      image: "paris.jpg",
      alternatives: [],
    },
    {
      name: "Tokyo",
      image: "tokyo.jpg",
      alternatives: [],
    },
    {
      name: "Los Angeles",
      image: "los-angeles.jpg",
      alternatives: [],
    },
    {
      name: "Chicago",
      image: "chicago.jpg",
      alternatives: [],
    },
    {
      name: "San Francisco",
      image: "san-francisco.jpg",
      alternatives: [],
    },
    {
      name: "Las Vegas",
      image: "las-vegas.jpg",
      alternatives: [],
    },
    {
      name: "Miami",
      image: "miami.jpg",
      alternatives: [],
    },
    {
      name: "Dubai",
      image: "dubai.jpg",
      alternatives: [],
    },
    {
      name: "Hong Kong",
      image: "hong-kong.jpg",
      alternatives: [],
    },
    {
      name: "Shanghai",
      image: "shanghai.jpg",
      alternatives: [],
    },
    {
      name: "Singapore",
      image: "singapore.jpg",
      alternatives: [],
    },
    {
      name: "Sydney",
      image: "sydney.jpg",
      alternatives: [],
    },
    {
      name: "Toronto",
      image: "toronto.jpg",
      alternatives: [],
    },
    {
      name: "Seoul",
      image: "seoul.jpg",
      alternatives: [],
    },
    {
      name: "Moscow",
      image: "moscow.jpg",
      alternatives: [],
    },
    {
      name: "Istanbul",
      image: "istanbul.jpg",
      alternatives: [],
    },
    {
      name: "Rio de Janeiro",
      image: "rio-de-janeiro.jpg",
      alternatives: [],
    },
    {
      name: "Bangkok",
      image: "bangkok.jpg",
      alternatives: [],
    },
    {
      name: "Beijing",
      image: "beijing.jpg",
      alternatives: [],
    },
    {
      name: "Mumbai",
      image: "mumbai.jpg",
      alternatives: [],
    },
    {
      name: "Berlin",
      image: "berlin.jpg",
      alternatives: [],
    },
    {
      name: "Rome",
      image: "rome.jpg",
      alternatives: [],
    },
    {
      name: "Barcelona",
      image: "barcelona.jpg",
      alternatives: [],
    },
    {
      name: "Madrid",
      image: "madrid.jpg",
      alternatives: [],
    },
    {
      name: "Boston",
      image: "boston.jpg",
      alternatives: [],
    },
    {
      name: "Philadelphia",
      image: "philadelphia.jpg",
      alternatives: [],
    },
    {
      name: "Dallas",
      image: "dallas.jpg",
      alternatives: [],
    },
    {
      name: "Houston",
      image: "houston.jpg",
      alternatives: [],
    },
    {
      name: "Atlanta",
      image: "atlanta.jpg",
      alternatives: [],
    },
    {
      name: "Seattle",
      image: "seattle.jpg",
      alternatives: [],
    },
    {
      name: "Vancouver",
      image: "vancouver.jpg",
      alternatives: [],
    },
    {
      name: "Melbourne",
      image: "melbourne.jpg",
      alternatives: [],
    },
    {
      name: "Taipei",
      image: "taipei.jpg",
      alternatives: [],
    },
    {
      name: "Athens",
      image: "athens.jpg",
      alternatives: [],
    },
    {
      name: "Cairo",
      image: "cairo.jpg",
      alternatives: [],
    },
    {
      name: "Mexico City",
      image: "mexico-city.jpg",
      alternatives: [],
    },
    {
      name: "Sao Paulo",
      image: "sao-paulo.jpg",
      alternatives: [],
    },
    {
      name: "Kuala Lumpur",
      image: "kuala-lumpur.jpg",
      alternatives: [],
    },
    {
      name: "Frankfurt",
      image: "frankfurt.jpg",
      alternatives: [],
    },
    {
      name: "Osaka",
      image: "osaka.jpg",
      alternatives: [],
    },
    {
      name: "Jakarta",
      image: "jakarta.jpg",
      alternatives: [],
    },
    {
      name: "Manila",
      image: "manila.jpg",
      alternatives: [],
    },
    {
      name: "Buenos Aires",
      image: "buenos-aires.jpg",
      alternatives: [],
    },
    {
      name: "Santiago",
      image: "santiago.jpg",
      alternatives: [],
    },
    {
      name: "Bogota",
      image: "bogota.jpg",
      alternatives: [],
    },
    {
      name: "Delhi",
      image: "delhi.jpg",
      alternatives: [],
    },
    {
      name: "Johannesburg",
      image: "johannesburg.jpg",
      alternatives: [],
    },
    {
      name: "Panama City",
      image: "panama-city.jpg",
      alternatives: [],
    },
  ],
};

const MoviesCategory: CategoryMetadata = {
  name: "Movies",
  folder: "movies",
  examples: [
    {
      name: "Star Wars: A New Hope",
      image: "star-wars-a-new-hope.jpg",
      alternatives: [],
    },
    {
      name: "The Empire Strikes Back",
      image: "the-empire-strikes-back.jpg",
      alternatives: [],
    },
    {
      name: "Titanic",
      image: "titanic.jpg",
      alternatives: [],
    },
    {
      name: "The Dark Knight",
      image: "the-dark-knight.jpg",
      alternatives: [],
    },
    {
      name: "The Lord of the Rings: The Fellowship of the Ring",
      image: "the-lord-of-the-rings-the-fellowship-of-the-ring.jpg",
      alternatives: [],
    },
    {
      name: "The Lord of the Rings: The Return of the King",
      image: "the-lord-of-the-rings-the-return-of-the-king.jpg",
      alternatives: [],
    },
    {
      name: "Avengers: Endgame",
      image: "avengers-endgame.jpg",
      alternatives: [],
    },
    {
      name: "The Avengers (2012)",
      image: "the-avengers-2012.jpg",
      alternatives: [],
    },
    {
      name: "Iron Man",
      image: "iron-man.jpg",
      alternatives: [],
    },
    {
      name: "Black Panther",
      image: "black-panther.jpg",
      alternatives: [],
    },
    {
      name: "Spider-Man (2002)",
      image: "spider-man-2002.jpg",
      alternatives: [],
    },
    {
      name: "Harry Potter and the Sorcerer's Stone",
      image: "harry-potter-and-the-sorcerers-stone.jpg",
      alternatives: [],
    },
    {
      name: "The Lion King (1994)",
      image: "the-lion-king-1994.jpg",
      alternatives: [],
    },
    {
      name: "Toy Story",
      image: "toy-story.jpg",
      alternatives: [],
    },
    {
      name: "Finding Nemo",
      image: "finding-nemo.jpg",
      alternatives: [],
    },
    {
      name: "Frozen",
      image: "frozen.jpg",
      alternatives: [],
    },
    {
      name: "Shrek",
      image: "shrek.jpg",
      alternatives: [],
    },
    {
      name: "Jurassic Park",
      image: "jurassic-park.jpg",
      alternatives: [],
    },
    {
      name: "The Matrix",
      image: "the-matrix.jpg",
      alternatives: [],
    },
    {
      name: "Forrest Gump",
      image: "forrest-gump.jpg",
      alternatives: [],
    },
    {
      name: "Pirates of the Caribbean: The Curse of the Black Pearl",
      image: "pirates-of-the-caribbean-the-curse-of-the-black-pearl.jpg",
      alternatives: [],
    },
    {
      name: "The Godfather",
      image: "the-godfather.jpg",
      alternatives: [],
    },
    {
      name: "The Shawshank Redemption",
      image: "the-shawshank-redemption.jpg",
      alternatives: [],
    },
    {
      name: "The Shining",
      image: "the-shining.jpg",
      alternatives: [],
    },
    {
      name: "The Exorcist",
      image: "the-exorcist.jpg",
      alternatives: [],
    },
    {
      name: "Psycho",
      image: "psycho.jpg",
      alternatives: [],
    },
    {
      name: "Jaws",
      image: "jaws.jpg",
      alternatives: [],
    },
    {
      name: "E.T. the Extra-Terrestrial",
      image: "et-the-extra-terrestrial.jpg",
      alternatives: [],
    },
    {
      name: "Back to the Future",
      image: "back-to-the-future.jpg",
      alternatives: [],
    },
    {
      name: "Ghostbusters",
      image: "ghostbusters.jpg",
      alternatives: [],
    },
    {
      name: "Indiana Jones: Raiders of the Lost Ark",
      image: "indiana-jones-raiders-of-the-lost-ark.jpg",
      alternatives: [],
    },
    {
      name: "Terminator 2: Judgment Day",
      image: "terminator-2-judgment-day.jpg",
      alternatives: [],
    },
    {
      name: "Alien",
      image: "alien.jpg",
      alternatives: [],
    },
    {
      name: "Top Gun",
      image: "top-gun.jpg",
      alternatives: [],
    },
    {
      name: "The Breakfast Club",
      image: "the-breakfast-club.jpg",
      alternatives: [],
    },
    {
      name: "Home Alone",
      image: "home-alone.jpg",
      alternatives: [],
    },
    {
      name: "Rocky",
      image: "rocky.jpg",
      alternatives: [],
    },
    {
      name: "The Wizard of Oz",
      image: "the-wizard-of-oz.jpg",
      alternatives: [],
    },
    {
      name: "Casablanca",
      image: "casablanca.jpg",
      alternatives: [],
    },
    {
      name: "Gone With the Wind",
      image: "gone-with-the-wind.jpg",
      alternatives: [],
    },
    {
      name: "The Sound of Music",
      image: "the-sound-of-music.jpg",
      alternatives: [],
    },
    {
      name: "Despicable Me",
      image: "despicable-me.jpg",
      alternatives: [],
    },
    {
      name: "Spirited Away",
      image: "spirited-away.jpg",
      alternatives: [],
    },
    {
      name: "Avatar",
      image: "avatar.jpg",
      alternatives: [],
    },
    {
      name: "Superman (1978)",
      image: "superman-1978.jpg",
      alternatives: [],
    },
    {
      name: "It (2017)",
      image: "it-2017.jpg",
      alternatives: [],
    },
    {
      name: "Halloween (1978)",
      image: "halloween-1978.jpg",
      alternatives: [],
    },
    {
      name: "Joker (2019)",
      image: "joker-2019.jpg",
      alternatives: [],
    },
    {
      name: "Barbie (2023)",
      image: "barbie-2023.jpg",
      alternatives: [],
    },
    {
      name: "Oppenheimer (2023)",
      image: "oppenheimer-2023.jpg",
      alternatives: [],
    },
    {
      name: "Frozen II",
      image: "frozen-ii.jpg",
      alternatives: [],
    },
  ],
};

const BooksCategory: CategoryMetadata = {
  name: "Books",
  folder: "books",
  examples: [
    {
      name: "Harry Potter and the Sorcerer's Stone",
      image: "harry-potter-and-the-sorcerers-stone.jpg",
      alternatives: [],
    },
    {
      name: "The Great Gatsby",
      image: "the-great-gatsby.jpg",
      alternatives: [],
    },
    {
      name: "1984",
      image: "1984.jpg",
      alternatives: [],
    },
    {
      name: "To Kill a Mockingbird",
      image: "to-kill-a-mockingbird.jpg",
      alternatives: [],
    },
    {
      name: "The Catcher in the Rye",
      image: "the-catcher-in-the-rye.jpg",
      alternatives: [],
    },
    {
      name: "The Lord of the Rings",
      image: "the-lord-of-the-rings.jpg",
      alternatives: [],
    },
    {
      name: "The Hobbit",
      image: "the-hobbit.jpg",
      alternatives: [],
    },
    {
      name: "The Hunger Games",
      image: "the-hunger-games.jpg",
      alternatives: [],
    },
    {
      name: "Twilight",
      image: "twilight.jpg",
      alternatives: [],
    },
    {
      name: "The Da Vinci Code",
      image: "the-da-vinci-code.jpg",
      alternatives: [],
    },
    {
      name: "A Game of Thrones",
      image: "a-game-of-thrones.jpg",
      alternatives: [],
    },
    {
      name: "The Chronicles of Narnia",
      image: "the-chronicles-of-narnia.jpg",
      alternatives: [],
    },
    {
      name: "The Lion the Witch and the Wardrobe",
      image: "the-lion-the-witch-and-the-wardrobe.jpg",
      alternatives: [],
    },
    {
      name: "Pride and Prejudice",
      image: "pride-and-prejudice.jpg",
      alternatives: [],
    },
    {
      name: "Animal Farm",
      image: "animal-farm.jpg",
      alternatives: [],
    },
    {
      name: "The Lord of the Flies",
      image: "the-lord-of-the-flies.jpg",
      alternatives: [],
    },
    {
      name: "Fahrenheit 451",
      image: "fahrenheit-451.jpg",
      alternatives: [],
    },
    {
      name: "The Outsiders",
      image: "the-outsiders.jpg",
      alternatives: [],
    },
    {
      name: "The Giver",
      image: "the-giver.jpg",
      alternatives: [],
    },
    {
      name: "The Handmaid's Tale",
      image: "the-handmaids-tale.jpg",
      alternatives: [],
    },
    {
      name: "The Shining",
      image: "the-shining.jpg",
      alternatives: [],
    },
    {
      name: "It",
      image: "it.jpg",
      alternatives: [],
    },
    {
      name: "The Hitchhiker's Guide to the Galaxy",
      image: "the-hitchhikers-guide-to-the-galaxy.jpg",
      alternatives: [],
    },
    {
      name: "Dune",
      image: "dune.jpg",
      alternatives: [],
    },
    {
      name: "Dracula",
      image: "dracula.jpg",
      alternatives: [],
    },
    {
      name: "Frankenstein",
      image: "frankenstein.jpg",
      alternatives: [],
    },
    {
      name: "The Silence of the Lambs",
      image: "the-silence-of-the-lambs.jpg",
      alternatives: [],
    },
    {
      name: "The Girl with the Dragon Tattoo",
      image: "the-girl-with-the-dragon-tattoo.jpg",
      alternatives: [],
    },
    {
      name: "The Fault in Our Stars",
      image: "the-fault-in-our-stars.jpg",
      alternatives: [],
    },
    {
      name: "Life of Pi",
      image: "life-of-pi.jpg",
      alternatives: [],
    },
    {
      name: "The Alchemist",
      image: "the-alchemist.jpg",
      alternatives: [],
    },
    {
      name: "Jane Eyre",
      image: "jane-eyre.jpg",
      alternatives: [],
    },
    {
      name: "Wuthering Heights",
      image: "wuthering-heights.jpg",
      alternatives: [],
    },
    {
      name: "The Color Purple",
      image: "the-color-purple.jpg",
      alternatives: [],
    },
    {
      name: "The Adventures of Huckleberry Finn",
      image: "the-adventures-of-huckleberry-finn.jpg",
      alternatives: [],
    },
    {
      name: "Moby-Dick",
      image: "moby-dick.jpg",
      alternatives: [],
    },
    {
      name: "The Odyssey",
      image: "the-odyssey.jpg",
      alternatives: [],
    },
    {
      name: "The Iliad",
      image: "the-iliad.jpg",
      alternatives: [],
    },
    {
      name: "War and Peace",
      image: "war-and-peace.jpg",
      alternatives: [],
    },
    {
      name: "The Old Man and the Sea",
      image: "the-old-man-and-the-sea.jpg",
      alternatives: [],
    },
    {
      name: "The Little Prince",
      image: "the-little-prince.jpg",
      alternatives: [],
    },
    {
      name: "Brave New World",
      image: "brave-new-world.jpg",
      alternatives: [],
    },
    {
      name: "The Kite Runner",
      image: "the-kite-runner.jpg",
      alternatives: [],
    },
    {
      name: "The Book Thief",
      image: "the-book-thief.jpg",
      alternatives: [],
    },
    {
      name: "Charlotte's Web",
      image: "charlottes-web.jpg",
      alternatives: [],
    },
    {
      name: "Green Eggs and Ham",
      image: "green-eggs-and-ham.jpg",
      alternatives: [],
    },
    {
      name: "The Cat in the Hat",
      image: "the-cat-in-the-hat.jpg",
      alternatives: [],
    },
    {
      name: "The Very Hungry Caterpillar",
      image: "the-very-hungry-caterpillar.jpg",
      alternatives: [],
    },
    {
      name: "Where the Wild Things Are",
      image: "where-the-wild-things-are.jpg",
      alternatives: [],
    },
  ],
};

const DisneyChannelOriginalMoviesCategory: CategoryMetadata = {
  name: "Disney Channel Original Movies",
  folder: "disney-channel-original-movies",
  examples: [
    {
      name: "High School Musical",
      image: "high-school-musical.jpg",
      alternatives: [],
    },
    {
      name: "High School Musical 2",
      image: "high-school-musical-2.jpg",
      alternatives: [],
    },
    {
      name: "High School Musical 3: Senior Year",
      image: "high-school-musical-3-senior-year.jpg",
      alternatives: [],
    },
    {
      name: "Camp Rock",
      image: "camp-rock.jpg",
      alternatives: [],
    },
    {
      name: "Camp Rock 2: The Final Jam",
      image: "camp-rock-2-the-final-jam.jpg",
      alternatives: [],
    },
    {
      name: "The Cheetah Girls",
      image: "the-cheetah-girls.jpg",
      alternatives: [],
    },
    {
      name: "The Cheetah Girls 2",
      image: "the-cheetah-girls-2.jpg",
      alternatives: [],
    },
    {
      name: "Halloweentown",
      image: "halloweentown.jpg",
      alternatives: [],
    },
    {
      name: "Descendants",
      image: "descendants.jpg",
      alternatives: [],
    },
    {
      name: "Descendants 2",
      image: "descendants-2.jpg",
      alternatives: [],
    },
    {
      name: "Descendants 3",
      image: "descendants-3.jpg",
      alternatives: [],
    },
    {
      name: "Twitches",
      image: "twitches.jpg",
      alternatives: [],
    },
    {
      name: "Twitches Too",
      image: "twitches-too.jpg",
      alternatives: [],
    },
    {
      name: "Lemonade Mouth",
      image: "lemonade-mouth.jpg",
      alternatives: [],
    },
    {
      name: "Teen Beach Movie",
      image: "teen-beach-movie.jpg",
      alternatives: [],
    },
    {
      name: "Teen Beach 2",
      image: "teen-beach-2.jpg",
      alternatives: [],
    },
    {
      name: "The Cheetah Girls: One World",
      image: "the-cheetah-girls-one-world.jpg",
      alternatives: [],
    },
    {
      name: "Halloweentown II: Kalabar's Revenge",
      image: "halloweentown-ii-kalabars-revenge.jpg",
      alternatives: [],
    },
    {
      name: "Halloweentown High",
      image: "halloweentown-high.jpg",
      alternatives: [],
    },
    {
      name: "Return to Halloweentown",
      image: "return-to-halloweentown.jpg",
      alternatives: [],
    },
    {
      name: "Zenon: Girl of the 21st Century",
      image: "zenon-girl-of-the-21st-century.jpg",
      alternatives: [],
    },
    {
      name: "Zenon: The Zequel",
      image: "zenon-the-zequel.jpg",
      alternatives: [],
    },
    {
      name: "Zenon: Z3",
      image: "zenon-z3.jpg",
      alternatives: [],
    },
    {
      name: "Smart House",
      image: "smart-house.jpg",
      alternatives: [],
    },
    {
      name: "Johnny Tsunami",
      image: "johnny-tsunami.jpg",
      alternatives: [],
    },
    {
      name: "Cadet Kelly",
      image: "cadet-kelly.jpg",
      alternatives: [],
    },
    {
      name: "The Luck of the Irish",
      image: "the-luck-of-the-irish.jpg",
      alternatives: [],
    },
    {
      name: "The Proud Family Movie",
      image: "the-proud-family-movie.jpg",
      alternatives: [],
    },
    {
      name: "Kim Possible Movie: So the Drama",
      image: "kim-possible-movie-so-the-drama.jpg",
      alternatives: [],
    },
    {
      name: "Princess Protection Program",
      image: "princess-protection-program.jpg",
      alternatives: [],
    },
    {
      name: "Let It Shine",
      image: "let-it-shine.jpg",
      alternatives: [],
    },
    {
      name: "Jump In!",
      image: "jump-in.jpg",
      alternatives: [],
    },
    {
      name: "Minutemen",
      image: "minutemen.jpg",
      alternatives: [],
    },
    {
      name: "Geek Charming",
      image: "geek-charming.jpg",
      alternatives: [],
    },
    {
      name: "Radio Rebel",
      image: "radio-rebel.jpg",
      alternatives: [],
    },
    {
      name: "Zapped",
      image: "zapped.jpg",
      alternatives: [],
    },
    {
      name: "How to Build a Better Boy",
      image: "how-to-build-a-better-boy.jpg",
      alternatives: [],
    },
    {
      name: "Girl vs. Monster",
      image: "girl-vs-monster.jpg",
      alternatives: [],
    },
    {
      name: "Invisible Sister",
      image: "invisible-sister.jpg",
      alternatives: [],
    },
    {
      name: "Johnny Kapahala: Back on Board",
      image: "johnny-kapahala-back-on-board.jpg",
      alternatives: [],
    },
    {
      name: "Eddie's Million Dollar Cook-Off",
      image: "eddies-million-dollar-cook-off.jpg",
      alternatives: [],
    },
    {
      name: "The Thirteenth Year",
      image: "the-thirteenth-year.jpg",
      alternatives: [],
    },
    {
      name: "The Color of Friendship",
      image: "the-color-of-friendship.jpg",
      alternatives: [],
    },
    {
      name: "Pixel Perfect",
      image: "pixel-perfect.jpg",
      alternatives: [],
    },
    {
      name: "Stuck in the Suburbs",
      image: "stuck-in-the-suburbs.jpg",
      alternatives: [],
    },
    {
      name: "Wendy Wu: Homecoming Warrior",
      image: "wendy-wu-homecoming-warrior.jpg",
      alternatives: [],
    },
    {
      name: "Read It and Weep",
      image: "read-it-and-weep.jpg",
      alternatives: [],
    },
    {
      name: "Gotta Kick It Up!",
      image: "gotta-kick-it-up.jpg",
      alternatives: [],
    },
    {
      name: "Dadnapped",
      image: "dadnapped.jpg",
      alternatives: [],
    },
  ],
};

const AirportCodesCategory: CategoryMetadata = {
  name: "Airport Codes",
  folder: "airport-codes",
  examples: [
    {
      name: "John F. Kennedy International Airport",
      text: "JFK",
      alternatives: ["John F. Kennedy International Airport"],
    },
    {
      name: "Los Angeles International Airport",
      text: "LAX",
      alternatives: ["Los Angeles International Airport"],
    },
    {
      name: "Hartsfield–Jackson Atlanta International Airport",
      text: "ATL",
      alternatives: ["Hartsfield–Jackson Atlanta International Airport"],
    },
    {
      name: "O'Hare International Airport",
      text: "ORD",
      alternatives: ["O'Hare International Airport"],
    },
    {
      name: "Dallas/Fort Worth International Airport",
      text: "DFW",
      alternatives: ["Dallas/Fort Worth International Airport"],
    },
    {
      name: "Denver International Airport",
      text: "DEN",
      alternatives: ["Denver International Airport"],
    },
    {
      name: "Orlando International Airport",
      text: "MCO",
      alternatives: ["Orlando International Airport"],
    },
    {
      name: "Harry Reid International Airport (Las Vegas)",
      text: "LAS",
      alternatives: ["Harry Reid International Airport (Las Vegas)"],
    },
    {
      name: "Charlotte Douglas International Airport",
      text: "CLT",
      alternatives: ["Charlotte Douglas International Airport"],
    },
    {
      name: "Miami International Airport",
      text: "MIA",
      alternatives: ["Miami International Airport"],
    },
    {
      name: "Seattle–Tacoma International Airport",
      text: "SEA",
      alternatives: ["Seattle–Tacoma International Airport"],
    },
    {
      name: "San Francisco International Airport",
      text: "SFO",
      alternatives: ["San Francisco International Airport"],
    },
    {
      name: "Newark Liberty International Airport",
      text: "EWR",
      alternatives: ["Newark Liberty International Airport"],
    },
    {
      name: "Phoenix Sky Harbor International Airport",
      text: "PHX",
      alternatives: ["Phoenix Sky Harbor International Airport"],
    },
    {
      name: "George Bush Intercontinental Airport (Houston)",
      text: "IAH",
      alternatives: ["George Bush Intercontinental Airport (Houston)"],
    },
    {
      name: "Logan International Airport (Boston)",
      text: "BOS",
      alternatives: ["Logan International Airport (Boston)"],
    },
    {
      name: "Fort Lauderdale–Hollywood International Airport",
      text: "FLL",
      alternatives: ["Fort Lauderdale–Hollywood International Airport"],
    },
    {
      name: "Minneapolis–Saint Paul International Airport",
      text: "MSP",
      alternatives: ["Minneapolis–Saint Paul International Airport"],
    },
    {
      name: "LaGuardia Airport",
      text: "LGA",
      alternatives: ["LaGuardia Airport"],
    },
    {
      name: "Baltimore/Washington International Airport",
      text: "BWI",
      alternatives: ["Baltimore/Washington International Airport"],
    },
    {
      name: "Tampa International Airport",
      text: "TPA",
      alternatives: ["Tampa International Airport"],
    },
    {
      name: "Portland International Airport",
      text: "PDX",
      alternatives: ["Portland International Airport"],
    },
    {
      name: "Detroit Metropolitan Wayne County Airport",
      text: "DTW",
      alternatives: ["Detroit Metropolitan Wayne County Airport"],
    },
    {
      name: "San Diego International Airport",
      text: "SAN",
      alternatives: ["San Diego International Airport"],
    },
    {
      name: "Salt Lake City International Airport",
      text: "SLC",
      alternatives: ["Salt Lake City International Airport"],
    },
    {
      name: "Philadelphia International Airport",
      text: "PHL",
      alternatives: ["Philadelphia International Airport"],
    },
    {
      name: "Austin–Bergstrom International Airport",
      text: "AUS",
      alternatives: ["Austin–Bergstrom International Airport"],
    },
    {
      name: "Washington Dulles International Airport",
      text: "IAD",
      alternatives: ["Washington Dulles International Airport"],
    },
    {
      name: "Chicago Midway International Airport",
      text: "MDW",
      alternatives: ["Chicago Midway International Airport"],
    },
    {
      name: "Nashville International Airport",
      text: "BNA",
      alternatives: ["Nashville International Airport"],
    },
    {
      name: "Raleigh–Durham International Airport",
      text: "RDU",
      alternatives: ["Raleigh–Durham International Airport"],
    },
    {
      name: "San Jose International Airport",
      text: "SJC",
      alternatives: ["San Jose International Airport"],
    },
    {
      name: "Sacramento International Airport",
      text: "SMF",
      alternatives: ["Sacramento International Airport"],
    },
    {
      name: "St. Louis Lambert International Airport",
      text: "STL",
      alternatives: ["St. Louis Lambert International Airport"],
    },
    {
      name: "Milwaukee Mitchell International Airport",
      text: "MKE",
      alternatives: ["Milwaukee Mitchell International Airport"],
    },
    {
      name: "Louis Armstrong New Orleans International Airport",
      text: "MSY",
      alternatives: ["Louis Armstrong New Orleans International Airport"],
    },
    {
      name: "John Glenn Columbus International Airport",
      text: "CMH",
      alternatives: ["John Glenn Columbus International Airport"],
    },
    {
      name: "Palm Beach International Airport",
      text: "PBI",
      alternatives: ["Palm Beach International Airport"],
    },
    {
      name: "Reno–Tahoe International Airport",
      text: "RNO",
      alternatives: ["Reno–Tahoe International Airport"],
    },
    {
      name: "Bradley International Airport (Hartford)",
      text: "BDL",
      alternatives: ["Bradley International Airport (Hartford)"],
    },
    {
      name: "Indianapolis International Airport",
      text: "IND",
      alternatives: ["Indianapolis International Airport"],
    },
    {
      name: "Will Rogers World Airport (Oklahoma City)",
      text: "OKC",
      alternatives: ["Will Rogers World Airport (Oklahoma City)"],
    },
    {
      name: "San Antonio International Airport",
      text: "SAT",
      alternatives: ["San Antonio International Airport"],
    },
    {
      name: "Louisville Muhammad Ali International Airport",
      text: "SDF",
      alternatives: ["Louisville Muhammad Ali International Airport"],
    },
    {
      name: "Buffalo Niagara International Airport",
      text: "BUF",
      alternatives: ["Buffalo Niagara International Airport"],
    },
    {
      name: "Norfolk International Airport",
      text: "ORF",
      alternatives: ["Norfolk International Airport"],
    },
    {
      name: "Birmingham–Shuttlesworth International Airport",
      text: "BHM",
      alternatives: ["Birmingham–Shuttlesworth International Airport"],
    },
    {
      name: "Omaha Eppley Airfield",
      text: "OMA",
      alternatives: ["Omaha Eppley Airfield"],
    },
    {
      name: "Dayton International Airport",
      text: "DAY",
      alternatives: ["Dayton International Airport"],
    },
  ],
};

const BrandSlogansCategory: CategoryMetadata = {
  name: "Brand slogans",
  folder: "brand-slogans",
  examples: [
    {
      name: "Nike",
      text: "Just Do It",
      alternatives: ["Nike"],
    },
    {
      name: "McDonald's",
      text: "I'm Lovin' It",
      alternatives: ["McDonald's"],
    },
    {
      name: "Apple",
      text: "Think Different",
      alternatives: ["Apple"],
    },
    {
      name: "Coca-Cola",
      text: "Taste the Feeling",
      alternatives: ["Coca-Cola"],
    },
    {
      name: "M&M's",
      text: "Melts in Your Mouth Not in Your Hands",
      alternatives: ["M&M's"],
    },
    {
      name: "L'Oréal",
      text: "Because You're Worth It",
      alternatives: ["L'Oréal"],
    },
    {
      name: "Maybelline",
      text: "Maybe She's Born With It Maybe It's _______",
      alternatives: ["Maybelline"],
    },
    {
      name: "Subway",
      text: "Eat Fresh",
      alternatives: ["Subway"],
    },
    {
      name: "Red Bull",
      text: "It Gives You Wings",
      alternatives: ["Red Bull"],
    },
    {
      name: "Snickers",
      text: "You're Not You When You're Hungry",
      alternatives: ["Snickers"],
    },
    {
      name: "Kit Kat",
      text: "Have a Break Have a ________",
      alternatives: ["Kit Kat"],
    },
    {
      name: "KFC",
      text: "Finger Lickin' Good",
      alternatives: ["KFC"],
    },
    {
      name: "Target",
      text: "Expect More Pay Less",
      alternatives: ["Target"],
    },
    {
      name: "State Farm",
      text: "Like a Good Neighbor ________ Is There",
      alternatives: ["State Farm"],
    },
    {
      name: "Folgers",
      text: "The Best Part of Wakin' Up Is ________ in Your Cup",
      alternatives: ["Folgers"],
    },
    {
      name: "Gatorade",
      text: "Is It in You?",
      alternatives: ["Gatorade"],
    },
    {
      name: "Burger King",
      text: "Have It Your Way",
      alternatives: ["Burger King"],
    },
    {
      name: "Gillette",
      text: "The Best a Man Can Get",
      alternatives: ["Gillette"],
    },
    {
      name: "Bounty",
      text: "The Quicker Picker Upper",
      alternatives: ["Bounty"],
    },
    {
      name: "Walmart",
      text: "Save Money Live Better",
      alternatives: ["Walmart"],
    },
    {
      name: "Capital One",
      text: "What's in Your Wallet?",
      alternatives: ["Capital One"],
    },
    {
      name: "Taco Bell",
      text: "Think Outside the Bun",
      alternatives: ["Taco Bell"],
    },
    {
      name: "Verizon",
      text: "Can You Hear Me Now?",
      alternatives: ["Verizon"],
    },
    {
      name: "Lay's",
      text: "Betcha Can't Eat Just One",
      alternatives: ["Lay's"],
    },
    {
      name: "Dunkin'",
      text: "America Runs on ________",
      alternatives: ["Dunkin'"],
    },
    {
      name: "Visa",
      text: "Everywhere You Want to Be",
      alternatives: ["Visa"],
    },
    {
      name: "Sprite",
      text: "Obey Your Thirst",
      alternatives: ["Sprite"],
    },
    {
      name: "Goldfish",
      text: "The Snack That Smiles Back",
      alternatives: ["Goldfish"],
    },
    {
      name: "Dairy Queen",
      text: "Hot Eats Cool Treats",
      alternatives: ["Dairy Queen"],
    },
    {
      name: "Energizer",
      text: "It Keeps Going and Going…",
      alternatives: ["Energizer"],
    },
    {
      name: "BMW",
      text: "The Ultimate Driving Machine",
      alternatives: ["BMW"],
    },
    {
      name: "Budweiser",
      text: "The King of Beers",
      alternatives: ["Budweiser"],
    },
    {
      name: "US Marine Corps",
      text: "The Few The Proud The Marines",
      alternatives: ["US Marine Corps"],
    },
    {
      name: "American Express",
      text: "Don't Leave Home Without It",
      alternatives: ["American Express"],
    },
    {
      name: "PlayStation",
      text: "Live in Your World Play in Ours",
      alternatives: ["PlayStation"],
    },
    {
      name: "Adidas",
      text: "Impossible Is Nothing",
      alternatives: ["Adidas"],
    },
    {
      name: "Mazda",
      text: "Zoom Zoom",
      alternatives: ["Mazda"],
    },
    {
      name: "Papa John's",
      text: "Better Ingredients Better Pizza",
      alternatives: ["Papa John's"],
    },
    {
      name: "Lexus",
      text: "The Relentless Pursuit of Perfection",
      alternatives: ["Lexus"],
    },
    {
      name: "Volkswagen",
      text: "Think Small",
      alternatives: ["Volkswagen"],
    },
    {
      name: "Panasonic",
      text: "Ideas for Life",
      alternatives: ["Panasonic"],
    },
    {
      name: "Avis",
      text: "We Try Harder",
      alternatives: ["Avis"],
    },
    {
      name: "Facebook",
      text: "Move Fast and Break Things",
      alternatives: ["Facebook"],
    },
    {
      name: "EA Games",
      text: "Challenge Everything",
      alternatives: ["EA Games"],
    },
    {
      name: "Yellow Pages",
      text: "Let Your Fingers Do the Walking",
      alternatives: ["Yellow Pages"],
    },
    {
      name: "GE",
      text: "Imagination at Work",
      alternatives: ["GE"],
    },
    {
      name: "Nokia",
      text: "Connecting People",
      alternatives: ["Nokia"],
    },
    {
      name: "Snapple",
      text: "Made From the Best Stuff on Earth",
      alternatives: ["Snapple"],
    },
  ],
};

const TaylorSwiftLyricsCategory: CategoryMetadata = {
  name: "Taylor Swift Lyrics",
  folder: "taylor-swift-lyrics",
  examples: [
    {
      name: "22",
      text: "I don't know about you but I'm feeling _____",
      alternatives: ["22"],
    },
    {
      name: "off",
      text: "Shake it _____",
      alternatives: ["Shake It Off"],
    },
    {
      name: "yes",
      text: "It's a love story, baby just say _____",
      alternatives: ["Love Story"],
    },
    {
      name: "belong",
      text: "Think I know where you _____, think I know it's with me",
      alternatives: ["You Belong With Me"],
    },
    {
      name: "hipsters",
      text: "It feels like a perfect night to dress up like _____",
      alternatives: ["22"],
    },
    {
      name: "back",
      text: "We are never ever getting _____ together",
      alternatives: ["We Are Never Ever Getting Back Together"],
    },
    {
      name: "real",
      text: "This love is difficult but it's _____",
      alternatives: ["Love Story"],
    },
    {
      name: "daydream",
      text: "Darling I'm a nightmare dressed like a _____",
      alternatives: ["Blank Space"],
    },
    {
      name: "confused",
      text: "We're happy, free, ______, and lonely at the same time",
      alternatives: ["22"],
    },
    {
      name: "bad",
      text: "Cause baby now we've got _____ blood",
      alternatives: ["Bad Blood"],
    },
    {
      name: "party",
      text: "See the lights, see the ______, the ball gowns",
      alternatives: ["Love Story"],
    },
    {
      name: "style",
      text: "We never go out of _____",
      alternatives: ["Style"],
    },
    {
      name: "space",
      text: "I've got a blank _____ baby and I'll write your name",
      alternatives: ["Blank Space"],
    },
    {
      name: "problem",
      text: "It's me, hi, I'm the ______, it's me",
      alternatives: ["Anti-Hero"],
    },
    {
      name: "bullet",
      text: "Band-Aids don't fix _____ holes",
      alternatives: ["Bad Blood"],
    },
    {
      name: "well",
      text: "I remember it all too _____",
      alternatives: ["All Too Well"],
    },
    {
      name: "things",
      text: "I could show you incredible _____",
      alternatives: ["Blank Space"],
    },
    {
      name: "trouble",
      text: "I knew you were _____ when you walked in",
      alternatives: ["I Knew You Were Trouble"],
    },
    {
      name: "letter",
      text: "You were Romeo, I was a scarlet _____",
      alternatives: ["Love Story"],
    },
    {
      name: "James Dean",
      text: "You got that ______ _____ daydream look in your eye",
      alternatives: ["Style"],
    },
    {
      name: "alone",
      text: "Romeo, save me, I've been feeling so _____",
      alternatives: ["Love Story"],
    },
    {
      name: "dead-end",
      text: "Loving him is like driving a new Maserati down a _______ street",
      alternatives: ["Red"],
    },
    {
      name: "promise",
      text: "You call me up again just to break me like a _____",
      alternatives: ["All Too Well"],
    },
    {
      name: "sunset",
      text: "Say you'll remember me standing in a nice dress staring at the _____ babe",
      alternatives: ["Wildest Dreams"],
    },
    {
      name: "needed",
      text: "And I forget about you long enough to forget why I _____ to",
      alternatives: ["All Too Well"],
    },
    {
      name: "New York",
      text: "Welcome to ______, it's been waiting for you",
      alternatives: ["Welcome to New York"],
    },
    {
      name: "disposition",
      text: "Oh, your sweet _____ and my wide-eyed gaze",
      alternatives: ["All Too Well"],
    },
    {
      name: "firework",
      text: "I'm captivated by you, baby, like a _____ show",
      alternatives: ["Sparks Fly"],
    },
    {
      name: "fearless",
      text: "You take my hand and drag me headfirst, _____",
      alternatives: ["Fearless"],
    },
    {
      name: "smile",
      text: "Cause I see sparks fly whenever you _____",
      alternatives: ["Sparks Fly"],
    },
    {
      name: "else",
      text: "Please don't be in love with someone _____",
      alternatives: ["Enchanted"],
    },
    {
      name: "crashed",
      text: "Long live the walls we _____ through",
      alternatives: ["Long Live"],
    },
    {
      name: "changed",
      text: "All I know since yesterday is everything has _____",
      alternatives: ["Everything Has Changed"],
    },
    {
      name: "cafe",
      text: "On a Wednesday in a ______, I watched it begin again",
      alternatives: ["Begin Again"],
    },
    {
      name: "Hello",
      text: "'Cause all I know is we said, ______ And your eyes look like coming home",
      alternatives: ["Everything Has Changed"],
    },
    {
      name: "sad",
      text: "I'm shining like fireworks over your _____ empty town",
      alternatives: ["Dear John"],
    },
    {
      name: "best friend",
      text: "Say my name and everything just stops; I don't want you like a ____ _____",
      alternatives: ["Dress"],
    },
    {
      name: "you",
      text: "Can I go where _____ go?",
      alternatives: ["Lover"],
    },
    {
      name: "ricochet",
      text: "Look at how my tears ______",
      alternatives: ["my tears ricochet"],
    },
    {
      name: "New Year's Day",
      text: "I want your midnights, but I'll be cleanin' up bottles with you on ____ ____ ____",
      alternatives: ["New Year's Day"],
    },
    {
      name: "ours",
      text: "People throw rocks at things that shine but they can't take what's _____",
      alternatives: ["Ours"],
    },
    {
      name: "crowded",
      text: "Now, I'm standin' alone in a ______ room and we're not speakin'",
      alternatives: ["The Story of Us"],
    },
    {
      name: "home",
      text: "You can feel it on the way _____",
      alternatives: ["You Are In Love"],
    },
    {
      name: "lyin'",
      text: "I'm a crumpled up piece of paper _____ here",
      alternatives: ["All Too Well (10 Minute Version)"],
    },
    {
      name: "narcissist",
      text: "I never trust a _______, but they love me",
      alternatives: ["I Did Something Bad"],
    },
    {
      name: "lovers",
      text: "I'll get older, but your ______ stay my age",
      alternatives: ["All Too Well (10 Minute Version)"],
    },
    {
      name: "archer",
      text: "I've been the ______, I've been the prey",
      alternatives: ["The Archer"],
    },
    {
      name: "streets",
      text: "I'm walking fast through the traffic lights, busy _____ and busy lives",
      alternatives: ["State of Grace"],
    },
    {
      name: "cannonball",
      text: "You come around and the armor falls, Pierce the room like a ________",
      alternatives: ["State of Grace"],
    },
    {
      name: "sleepless",
      text: "Two headlights shine through the _______ night and I will get you, get you alone",
      alternatives: ["Treacherous"],
    },
  ],
};

const RealityTvShowsCategory: CategoryMetadata = {
  name: "Reality tv shows",
  folder: "reality-tv-shows",
  examples: [
    { name: "Survivor", image: "survivor.jpg", alternatives: [] },
    { name: "The Bachelor", image: "the-bachelor.jpg", alternatives: [] },
    { name: "American Idol", image: "american-idol.jpg", alternatives: [] },
    { name: "The Voice", image: "the-voice.jpg", alternatives: [] },
    { name: "Big Brother", image: "big-brother.jpg", alternatives: [] },
    {
      name: "The Bachelorette",
      image: "the-bachelorette.jpg",
      alternatives: [],
    },
    {
      name: "Keeping Up with the Kardashians",
      image: "keeping-up-with-the-kardashians.jpg",
      alternatives: [],
    },
    {
      name: "The Real Housewives of Beverly Hills",
      image: "the-real-housewives-of-beverly-hills.jpg",
      alternatives: [],
    },
    {
      name: "The Real Housewives of New York City",
      image: "the-real-housewives-of-new-york-city.jpg",
      alternatives: [],
    },
    {
      name: "RuPaul's Drag Race",
      image: "rupauls-drag-race.jpg",
      alternatives: [],
    },
    {
      name: "The Amazing Race",
      image: "the-amazing-race.jpg",
      alternatives: [],
    },
    { name: "Top Chef", image: "top-chef.jpg", alternatives: [] },
    { name: "MasterChef", image: "masterchef.jpg", alternatives: [] },
    { name: "Hell's Kitchen", image: "hells-kitchen.jpg", alternatives: [] },
    {
      name: "The Great British Bake Off",
      image: "the-great-british-bake-off.jpg",
      alternatives: [],
    },
    { name: "Love Island", image: "love-island.jpg", alternatives: [] },
    { name: "Queer Eye", image: "queer-eye.jpg", alternatives: [] },
    { name: "Jersey Shore", image: "jersey-shore.jpg", alternatives: [] },
    { name: "Shark Tank", image: "shark-tank.jpg", alternatives: [] },
    { name: "Project Runway", image: "project-runway.jpg", alternatives: [] },
    { name: "Dance Moms", image: "dance-moms.jpg", alternatives: [] },
    {
      name: "So You Think You Can Dance",
      image: "so-you-think-you-can-dance.jpg",
      alternatives: [],
    },
    {
      name: "America's Next Top Model",
      image: "americas-next-top-model.jpg",
      alternatives: [],
    },
    { name: "The Real World", image: "the-real-world.jpg", alternatives: [] },
    {
      name: "Married at First Sight",
      image: "married-at-first-sight.jpg",
      alternatives: [],
    },
    { name: "The Circle", image: "the-circle.jpg", alternatives: [] },
    {
      name: "Too Hot to Handle",
      image: "too-hot-to-handle.jpg",
      alternatives: [],
    },
    { name: "Love Is Blind", image: "love-is-blind.jpg", alternatives: [] },
    {
      name: "Vanderpump Rules",
      image: "vanderpump-rules.jpg",
      alternatives: [],
    },
    {
      name: "Dancing with the Stars",
      image: "dancing-with-the-stars.jpg",
      alternatives: [],
    },
    { name: "Catfish", image: "catfish.jpg", alternatives: [] },
    {
      name: "Undercover Boss",
      image: "undercover-boss.jpg",
      alternatives: [],
    },
    {
      name: "Kitchen Nightmares",
      image: "kitchen-nightmares.jpg",
      alternatives: [],
    },
    { name: "Fear Factor", image: "fear-factor.jpg", alternatives: [] },
    { name: "Wife Swap", image: "wife-swap.jpg", alternatives: [] },
    { name: "Bar Rescue", image: "bar-rescue.jpg", alternatives: [] },
    { name: "Pawn Stars", image: "pawn-stars.jpg", alternatives: [] },
    { name: "Storage Wars", image: "storage-wars.jpg", alternatives: [] },
    {
      name: "The Simple Life",
      image: "the-simple-life.jpg",
      alternatives: [],
    },
    { name: "The Osbournes", image: "the-osbournes.jpg", alternatives: [] },
    { name: "The Hills", image: "the-hills.jpg", alternatives: [] },
    { name: "Laguna Beach", image: "laguna-beach.jpg", alternatives: [] },
    {
      name: "My Super Sweet 16",
      image: "my-super-sweet-16.jpg",
      alternatives: [],
    },
    {
      name: "Deadliest Catch",
      image: "deadliest-catch.jpg",
      alternatives: [],
    },
    { name: "Ink Master", image: "ink-master.jpg", alternatives: [] },
    { name: "Below Deck", image: "below-deck.jpg", alternatives: [] },
  ],
};

const TheOfficeCategory: CategoryMetadata = {
  name: "The Office",
  folder: "the-office",
  examples: [
    { name: "Michael Scott", image: "michael-scott.jpg", alternatives: [] },
    { name: "Dwight Schrute", image: "dwight-schrute.jpg", alternatives: [] },
    { name: "Jim Halpert", image: "jim-halpert.jpg", alternatives: [] },
    { name: "Pam Beesly", image: "pam-beesly.jpg", alternatives: [] },
    { name: "Angela Martin", image: "angela-martin.jpg", alternatives: [] },
    { name: "Kevin Malone", image: "kevin-malone.jpg", alternatives: [] },
    { name: "Oscar Martinez", image: "oscar-martinez.jpg", alternatives: [] },
    { name: "Stanley Hudson", image: "stanley-hudson.jpg", alternatives: [] },
    { name: "Phyllis Vance", image: "phyllis-vance.jpg", alternatives: [] },
    { name: "Ryan Howard", image: "ryan-howard.jpg", alternatives: [] },
    { name: "Kelly Kapoor", image: "kelly-kapoor.jpg", alternatives: [] },
    { name: "Creed Bratton", image: "creed-bratton.jpg", alternatives: [] },
    {
      name: "Meredith Palmer",
      image: "meredith-palmer.jpg",
      alternatives: [],
    },
    {
      name: "Toby Flenderson",
      image: "toby-flenderson.jpg",
      alternatives: [],
    },
    { name: "Darryl Philbin", image: "darryl-philbin.jpg", alternatives: [] },
    { name: "Andy Bernard", image: "andy-bernard.jpg", alternatives: [] },
    { name: "Erin Hannon", image: "erin-hannon.jpg", alternatives: [] },
    { name: "Jan Levinson", image: "jan-levinson.jpg", alternatives: [] },
    { name: "David Wallace", image: "david-wallace.jpg", alternatives: [] },
    { name: "Holly Flax", image: "holly-flax.jpg", alternatives: [] },
    { name: "Roy Anderson", image: "roy-anderson.jpg", alternatives: [] },
    { name: "Gabe Lewis", image: "gabe-lewis.jpg", alternatives: [] },
    { name: "Clark Green", image: "clark-green.jpg", alternatives: [] },
    { name: "Pete Miller", image: "pete-miller.jpg", alternatives: [] },
    { name: "Nellie Bertram", image: "nellie-bertram.jpg", alternatives: [] },
    {
      name: "Deangelo Vickers",
      image: "deangelo-vickers.jpg",
      alternatives: [],
    },
    {
      name: "Robert California",
      image: "robert-california.jpg",
      alternatives: [],
    },
    {
      name: "Karen Filippelli",
      image: "karen-filippelli.jpg",
      alternatives: [],
    },
    { name: "Jo Bennett", image: "jo-bennett.jpg", alternatives: [] },
    { name: "Todd Packer", image: "todd-packer.jpg", alternatives: [] },
    { name: "Charles Miner", image: "charles-miner.jpg", alternatives: [] },
    { name: "Mose Schrute", image: "mose-schrute.jpg", alternatives: [] },
    { name: "Hank Tate", image: "hank-tate.jpg", alternatives: [] },
    { name: "Josh Porter", image: "josh-porter.jpg", alternatives: [] },
    { name: "Kathy Simms", image: "kathy-simms.jpg", alternatives: [] },
    { name: "Helene Beesly", image: "helene-beesly.jpg", alternatives: [] },
    { name: "Bob Vance", image: "bob-vance.jpg", alternatives: [] },
    { name: "Ben Franklin", image: "ben-franklin.jpg", alternatives: [] },
    {
      name: "Senator Robert Lipton",
      image: "senator-robert-lipton.jpg",
      alternatives: [],
    },
    { name: "Val Johnson", image: "val-johnson.jpg", alternatives: [] },
    { name: "Donna Newton", image: "donna-newton.jpg", alternatives: [] },
    {
      name: "AJ (Holly's boyfriend)",
      image: "aj-hollys-boyfriend.jpg",
      alternatives: [],
    },
    {
      name: "Sasha Flenderson",
      image: "sasha-flenderson.jpg",
      alternatives: [],
    },
    {
      name: "Esther Bruegger",
      image: "esther-bruegger.jpg",
      alternatives: [],
    },
    { name: "Trevor Bortmen", image: "trevor-bortmen.jpg", alternatives: [] },
    { name: "Isabel Poreba", image: "isabel-poreba.jpg", alternatives: [] },
    {
      name: "Jessica (Andy's girlfriend)",
      image: "jessica-andys-girlfriend.jpg",
      alternatives: [],
    },
  ],
};

const ThanksgivingCategory: CategoryMetadata = {
  name: "Thanksgiving",
  folder: "thanksgiving",
  examples: [
    { name: "Turkey", image: "turkey.jpg", alternatives: [] },
    { name: "Stuffing", image: "stuffing.jpg", alternatives: [] },
    {
      name: "Mashed Potatoes",
      image: "mashed-potatoes.jpg",
      alternatives: [],
    },
    { name: "Gravy", image: "gravy.jpg", alternatives: [] },
    {
      name: "Cranberry Sauce",
      image: "cranberry-sauce.jpg",
      alternatives: [],
    },
    {
      name: "Green Bean Casserole",
      image: "green-bean-casserole.jpg",
      alternatives: [],
    },
    { name: "Mac and Cheese", image: "mac-and-cheese.jpg", alternatives: [] },
    { name: "Pumpkin Pie", image: "pumpkin-pie.jpg", alternatives: [] },
    { name: "Apple Pie", image: "apple-pie.jpg", alternatives: [] },
    {
      name: "Sweet Potato Casserole",
      image: "sweet-potato-casserole.jpg",
      alternatives: [],
    },
    { name: "Cornbread", image: "cornbread.jpg", alternatives: [] },
    {
      name: "Roasted Vegetables",
      image: "roasted-vegetables.jpg",
      alternatives: [],
    },
    { name: "Dinner Rolls", image: "dinner-rolls.jpg", alternatives: [] },
    { name: "Turkey Carving", image: "turkey-carving.jpg", alternatives: [] },
    { name: "Friendsgiving", image: "friendsgiving.jpg", alternatives: [] },
    { name: "Family", image: "family.jpg", alternatives: [] },
    {
      name: "Watching Football",
      image: "watching-football.jpg",
      alternatives: [],
    },
    {
      name: "Macy's Thanksgiving Day Parade",
      image: "macys-thanksgiving-day-parade.jpg",
      alternatives: [],
    },
    {
      name: "Black Friday Shopping",
      image: "black-friday-shopping.jpg",
      alternatives: [],
    },
    { name: "Leftovers", image: "leftovers.jpg", alternatives: [] },
    { name: "Kid's Table", image: "kids-table.jpg", alternatives: [] },
    { name: "Cornucopia", image: "cornucopia.jpg", alternatives: [] },
    { name: "Tablecloth", image: "tablecloth.jpg", alternatives: [] },
    {
      name: "Wishbone Tradition",
      image: "wishbone-tradition.jpg",
      alternatives: [],
    },
    {
      name: "Post-Dinner Nap",
      image: "post-dinner-nap.jpg",
      alternatives: [],
    },
    { name: "Board Games", image: "board-games.jpg", alternatives: [] },
    {
      name: "Watching Holiday Movies",
      image: "watching-holiday-movies.jpg",
      alternatives: [],
    },
    { name: "Baked Ham", image: "baked-ham.jpg", alternatives: [] },
    {
      name: "Brussels Sprouts",
      image: "brussels-sprouts.jpg",
      alternatives: [],
    },
    { name: "Pecan Pie", image: "pecan-pie.jpg", alternatives: [] },
    { name: "Autumn Candles", image: "autumn-candles.jpg", alternatives: [] },
    { name: "Cider", image: "cider.jpg", alternatives: [] },
    {
      name: "Seasonal Cocktails",
      image: "seasonal-cocktails.jpg",
      alternatives: [],
    },
    { name: "Traveling", image: "traveling.jpg", alternatives: [] },
    {
      name: "Checking the Turkey",
      image: "checking-the-turkey.jpg",
      alternatives: [],
    },
    { name: "Kitchen", image: "kitchen.jpg", alternatives: [] },
    {
      name: "Turkey Trot Races",
      image: "turkey-trot-races.jpg",
      alternatives: [],
    },
    { name: "Fireplace Time", image: "fireplace-time.jpg", alternatives: [] },
    { name: "Fall Wreaths", image: "fall-wreaths.jpg", alternatives: [] },
    { name: "Stuffing Balls", image: "stuffing-balls.jpg", alternatives: [] },
    {
      name: "Maple-Glazed Carrots",
      image: "maple-glazed-carrots.jpg",
      alternatives: [],
    },
    {
      name: "Butternut Squash Soup",
      image: "butternut-squash-soup.jpg",
      alternatives: [],
    },
    {
      name: "Charcuterie Boards",
      image: "charcuterie-boards.jpg",
      alternatives: [],
    },
    { name: "Deviled Eggs", image: "deviled-eggs.jpg", alternatives: [] },
  ],
};

const DogsCategory: CategoryMetadata = {
  name: "Dogs",
  folder: "dogs",
  examples: [
    {
      name: "Labrador Retriever",
      image: "labrador-retriever.jpg",
      alternatives: [],
    },
    {
      name: "Golden Retriever",
      image: "golden-retriever.jpg",
      alternatives: [],
    },
    {
      name: "German Shepherd",
      image: "german-shepherd.jpg",
      alternatives: [],
    },
    { name: "French Bulldog", image: "french-bulldog.jpg", alternatives: [] },
    { name: "Poodle", image: "poodle.jpg", alternatives: [] },
    { name: "Bulldog", image: "bulldog.jpg", alternatives: [] },
    { name: "Beagle", image: "beagle.jpg", alternatives: [] },
    { name: "Rottweiler", image: "rottweiler.jpg", alternatives: [] },
    {
      name: "Yorkshire Terrier",
      image: "yorkshire-terrier.jpg",
      alternatives: [],
    },
    { name: "Dachshund", image: "dachshund.jpg", alternatives: [] },
    { name: "Boxer", image: "boxer.jpg", alternatives: [] },
    { name: "Siberian Husky", image: "siberian-husky.jpg", alternatives: [] },
    {
      name: "Australian Shepherd",
      image: "australian-shepherd.jpg",
      alternatives: [],
    },
    { name: "Shih Tzu", image: "shih-tzu.jpg", alternatives: [] },
    {
      name: "Doberman Pinscher",
      image: "doberman-pinscher.jpg",
      alternatives: [],
    },
    { name: "Great Dane", image: "great-dane.jpg", alternatives: [] },
    {
      name: "Pembroke Welsh Corgi",
      image: "pembroke-welsh-corgi.jpg",
      alternatives: [],
    },
    {
      name: "Miniature Schnauzer",
      image: "miniature-schnauzer.jpg",
      alternatives: [],
    },
    { name: "Havanese", image: "havanese.jpg", alternatives: [] },
    {
      name: "Bernese Mountain Dog",
      image: "bernese-mountain-dog.jpg",
      alternatives: [],
    },
    {
      name: "Cavalier King Charles Spaniel",
      image: "cavalier-king-charles-spaniel.jpg",
      alternatives: [],
    },
    {
      name: "Shetland Sheepdog",
      image: "shetland-sheepdog.jpg",
      alternatives: [],
    },
    { name: "Boston Terrier", image: "boston-terrier.jpg", alternatives: [] },
    { name: "Pomeranian", image: "pomeranian.jpg", alternatives: [] },
    { name: "Border Collie", image: "border-collie.jpg", alternatives: [] },
    { name: "Bichon Frise", image: "bichon-frise.jpg", alternatives: [] },
    { name: "Shiba Inu", image: "shiba-inu.jpg", alternatives: [] },
    { name: "Maltese", image: "maltese.jpg", alternatives: [] },
    { name: "Cocker Spaniel", image: "cocker-spaniel.jpg", alternatives: [] },
    { name: "Chihuahua", image: "chihuahua.jpg", alternatives: [] },
    {
      name: "English Springer Spaniel",
      image: "english-springer-spaniel.jpg",
      alternatives: [],
    },
    { name: "Goldendoodle", image: "goldendoodle.jpg", alternatives: [] },
    { name: "Vizsla", image: "vizsla.jpg", alternatives: [] },
    { name: "Cane Corso", image: "cane-corso.jpg", alternatives: [] },
    { name: "Newfoundland", image: "newfoundland.jpg", alternatives: [] },
    { name: "Weimaraner", image: "weimaraner.jpg", alternatives: [] },
    { name: "Akita", image: "akita.jpg", alternatives: [] },
    { name: "Samoyed", image: "samoyed.jpg", alternatives: [] },
    { name: "Irish Setter", image: "irish-setter.jpg", alternatives: [] },
    { name: "Greyhound", image: "greyhound.jpg", alternatives: [] },
    { name: "Whippet", image: "whippet.jpg", alternatives: [] },
    {
      name: "Australian Cattle Dog",
      image: "australian-cattle-dog.jpg",
      alternatives: [],
    },
    { name: "Bloodhound", image: "bloodhound.jpg", alternatives: [] },
    {
      name: "Alaskan Malamute",
      image: "alaskan-malamute.jpg",
      alternatives: [],
    },
    { name: "Saint Bernard", image: "saint-bernard.jpg", alternatives: [] },
    {
      name: "Portuguese Water Dog",
      image: "portuguese-water-dog.jpg",
      alternatives: [],
    },
    {
      name: "Italian Greyhound",
      image: "italian-greyhound.jpg",
      alternatives: [],
    },
    {
      name: "Rhodesian Ridgeback",
      image: "rhodesian-ridgeback.jpg",
      alternatives: [],
    },
    {
      name: "American Eskimo Dog",
      image: "american-eskimo-dog.jpg",
      alternatives: [],
    },
  ],
};

const HorsesCategory: CategoryMetadata = {
  name: "Horses",
  folder: "horses",
  examples: [
    { name: "Appaloosa", image: "appaloosa.jpg", alternatives: [] },
    { name: "Saddles", image: "saddles.jpg", alternatives: [] },
    { name: "Reins", image: "reins.jpg", alternatives: [] },
    { name: "Paint Horse", image: "paint-horse.jpg", alternatives: [] },
    { name: "Mustang", image: "mustang.jpg", alternatives: [] },
    { name: "Clydesdale", image: "clydesdale.jpg", alternatives: [] },
    { name: "Friesian", image: "friesian.jpg", alternatives: [] },
    { name: "Cowboy", image: "cowboy.jpg", alternatives: [] },
    { name: "Blanket", image: "blanket.jpg", alternatives: [] },
    { name: "Horse Racing", image: "horse-racing.jpg", alternatives: [] },
    { name: "Show Jumping", image: "show-jumping.jpg", alternatives: [] },
    { name: "Dressage", image: "dressage.jpg", alternatives: [] },
    { name: "Barrel Racing", image: "barrel-racing.jpg", alternatives: [] },
    { name: "Rodeo Riding", image: "rodeo-riding.jpg", alternatives: [] },
    { name: "Trail Riding", image: "trail-riding.jpg", alternatives: [] },
    {
      name: "Horseback Riding Lessons",
      image: "horseback-riding-lessons.jpg",
      alternatives: [],
    },
    { name: "Stirrups", image: "stirrups.jpg", alternatives: [] },
    { name: "Bridles", image: "bridles.jpg", alternatives: [] },
    { name: "Horseshoes", image: "horseshoes.jpg", alternatives: [] },
    { name: "Horse Grooming", image: "horse-grooming.jpg", alternatives: [] },
    { name: "Hoof Picks", image: "hoof-picks.jpg", alternatives: [] },
    { name: "Stables", image: "stables.jpeg", alternatives: [] },
    { name: "Barns", image: "barns.jpg", alternatives: [] },
    { name: "Horse Trailers", image: "horse-trailers.jpg", alternatives: [] },
    { name: "Horse Feed", image: "horse-feed.jpg", alternatives: [] },
    { name: "Hay Bales", image: "hay-bales.png", alternatives: [] },
    { name: "Pastures", image: "pastures.jpg", alternatives: [] },
    { name: "Riding Helmets", image: "riding-helmets.jpg", alternatives: [] },
    { name: "Saddle Pads", image: "saddle-pads.jpg", alternatives: [] },
    { name: "Bit", image: "bit.jpg", alternatives: [] },
    { name: "Mane Braiding", image: "mane-braiding.jpg", alternatives: [] },
    { name: "Hoof", image: "hoof.png", alternatives: [] },
    { name: "Foal", image: "foal.jpg", alternatives: [] },
    { name: "Spirit", image: "spirit.jpeg", alternatives: [] },
    { name: "Maximus", image: "maximus.jpg", alternatives: [] },
    { name: "Bullseye", image: "bullseye.png", alternatives: [] },
    {
      name: "Bojack Horseman",
      image: "bojack-horseman.jpg",
      alternatives: [],
    },
    { name: "Pegasus", image: "pegasus.jpg", alternatives: [] },
    { name: "My Little Pony", image: "my-little-pony.jpg", alternatives: [] },
    { name: "Unicorn", image: "unicorn.jpeg", alternatives: [] },
    { name: "Percheron", image: "percheron.jpg", alternatives: [] },
    {
      name: "Miniature Horse",
      image: "miniature-horse.jpg",
      alternatives: [],
    },
    {
      name: "Mounted Police Horses",
      image: "mounted-police-horses.jpg",
      alternatives: [],
    },
    {
      name: "Carriage Horses",
      image: "carriage-horses.jpg",
      alternatives: [],
    },
    { name: "Statue", image: "statue.jpg", alternatives: [] },
    { name: "Equine Vets", image: "equine-vets.jpg", alternatives: [] },
    { name: "Blinker", image: "blinker.png", alternatives: [] },
  ],
};

const RomComsCategory: CategoryMetadata = {
  name: "Rom Coms",
  folder: "rom-coms",
  examples: [
    {
      name: "When Harry Met Sally",
      image: "when-harry-met-sally.jpg",
      alternatives: [],
    },
    { name: "Pretty Woman", image: "pretty-woman.jpg", alternatives: [] },
    {
      name: "The Princess Bride",
      image: "the-princess-bride.jpg",
      alternatives: [],
    },
    {
      name: "Sleepless in Seattle",
      image: "sleepless-in-seattle.jpg",
      alternatives: [],
    },
    {
      name: "You've Got Mail",
      image: "youve-got-mail.jpg",
      alternatives: [],
    },
    { name: "Notting Hill", image: "notting-hill.jpg", alternatives: [] },
    {
      name: "10 Things I Hate About You",
      image: "10-things-i-hate-about-you.jpg",
      alternatives: [],
    },
    { name: "Love Actually", image: "love-actually.jpg", alternatives: [] },
    {
      name: "Bridget Jones's Diary",
      image: "bridget-joness-diary.jpg",
      alternatives: [],
    },
    {
      name: "My Big Fat Greek Wedding",
      image: "my-big-fat-greek-wedding.jpg",
      alternatives: [],
    },
    {
      name: "How to Lose a Guy in 10 Days",
      image: "how-to-lose-a-guy-in-10-days.jpg",
      alternatives: [],
    },
    { name: "13 Going on 30", image: "13-going-on-30.jpg", alternatives: [] },
    { name: "The Proposal", image: "the-proposal.jpg", alternatives: [] },
    { name: "Clueless", image: "clueless.jpg", alternatives: [] },
    { name: "Legally Blonde", image: "legally-blonde.jpg", alternatives: [] },
    { name: "50 First Dates", image: "50-first-dates.jpg", alternatives: [] },
    {
      name: "Forgetting Sarah Marshall",
      image: "forgetting-sarah-marshall.jpg",
      alternatives: [],
    },
    {
      name: "The Wedding Singer",
      image: "the-wedding-singer.jpg",
      alternatives: [],
    },
    { name: "Mamma Mia!", image: "mamma-mia.jpg", alternatives: [] },
    { name: "Pretty in Pink", image: "pretty-in-pink.jpg", alternatives: [] },
    {
      name: "Sixteen Candles",
      image: "sixteen-candles.jpg",
      alternatives: [],
    },
    { name: "Roman Holiday", image: "roman-holiday.jpg", alternatives: [] },
    {
      name: "Breakfast at Tiffany's",
      image: "breakfast-at-tiffanys.jpg",
      alternatives: [],
    },
    {
      name: "While You Were Sleeping",
      image: "while-you-were-sleeping.jpg",
      alternatives: [],
    },
    {
      name: "Four Weddings and a Funeral",
      image: "four-weddings-and-a-funeral.jpg",
      alternatives: [],
    },
    { name: "Hitch", image: "hitch.jpg", alternatives: [] },
    { name: "Jerry Maguire", image: "jerry-maguire.jpg", alternatives: [] },
    {
      name: "Shakespeare in Love",
      image: "shakespeare-in-love.jpg",
      alternatives: [],
    },
    { name: "The Holiday", image: "the-holiday.jpg", alternatives: [] },
    {
      name: "Silver Linings Playbook",
      image: "silver-linings-playbook.jpg",
      alternatives: [],
    },
    { name: "La La Land", image: "la-la-land.jpg", alternatives: [] },
    { name: "About Time", image: "about-time.jpg", alternatives: [] },
    {
      name: "Crazy Rich Asians",
      image: "crazy-rich-asians.jpg",
      alternatives: [],
    },
    {
      name: "To All the Boys I've Loved Before",
      image: "to-all-the-boys-ive-loved-before.jpg",
      alternatives: [],
    },
    { name: "The Big Sick", image: "the-big-sick.jpg", alternatives: [] },
    {
      name: "Always Be My Maybe",
      image: "always-be-my-maybe.jpg",
      alternatives: [],
    },
    { name: "Set It Up", image: "set-it-up.jpg", alternatives: [] },
    {
      name: "Music and Lyrics",
      image: "music-and-lyrics.jpg",
      alternatives: [],
    },
    {
      name: "The American President",
      image: "the-american-president.jpg",
      alternatives: [],
    },
    { name: "Moonstruck", image: "moonstruck.jpg", alternatives: [] },
    { name: "Splash", image: "splash.jpg", alternatives: [] },
    {
      name: "The Decoy Bride",
      image: "the-decoy-bride.jpg",
      alternatives: [],
    },
    {
      name: "Nappily Ever After",
      image: "nappily-ever-after.jpg",
      alternatives: [],
    },
    { name: "The Half of It", image: "the-half-of-it.jpg", alternatives: [] },
  ],
};

const AmusementParksCategory: CategoryMetadata = {
  name: "Amusement Parks",
  folder: "amusement-parks",
  examples: [
    {
      name: "Roller Coaster",
      image: "roller-coaster.jpg",
      alternatives: [],
    },
    {
      name: "Ferris Wheel",
      image: "ferris-wheel.jpg",
      alternatives: [],
    },
    {
      name: "Carousel",
      image: "carousel.jpg",
      alternatives: [],
    },
    {
      name: "Arcade Games",
      image: "arcade-games.jpg",
      alternatives: [],
    },
    {
      name: "Bumper Cars",
      image: "bumper-cars.jpg",
      alternatives: [],
    },
    {
      name: "Cotton Candy",
      image: "cotton-candy.jpg",
      alternatives: [],
    },
    {
      name: "Funnel Cake",
      image: "funnel-cake.jpg",
      alternatives: [],
    },
    {
      name: "Hot Dogs",
      image: "hot-dogs.jpg",
      alternatives: [],
    },
    {
      name: "Ice Cream",
      image: "ice-cream.jpg",
      alternatives: [],
    },
    {
      name: "Popcorn",
      image: "popcorn.jpg",
      alternatives: [],
    },
    {
      name: "Pretzels",
      image: "pretzels.jpg",
      alternatives: [],
    },
    {
      name: "Churros",
      image: "churros.jpg",
      alternatives: [],
    },
    {
      name: "Fireworks Show",
      image: "fireworks-show.jpg",
      alternatives: [],
    },
    {
      name: "Character Meet And Greets",
      image: "character-meet-and-greets.jpg",
      alternatives: [],
    },
    {
      name: "Gift Shop",
      image: "gift-shop.jpg",
      alternatives: [],
    },
    {
      name: "Stuffed Animals",
      image: "stuffed-animals.jpg",
      alternatives: [],
    },
    {
      name: "Log Flume",
      image: "log-flume.jpg",
      alternatives: [],
    },
    {
      name: "Drop Tower",
      image: "drop-tower.jpg",
      alternatives: [],
    },
    {
      name: "Swing Ride",
      image: "swing-ride.jpg",
      alternatives: [],
    },
    {
      name: "Tea Cups",
      image: "tea-cups.jpg",
      alternatives: [],
    },
    {
      name: "Train Ride",
      image: "train-ride.JPG",
      alternatives: [],
    },
    {
      name: "Water Slide",
      image: "water-slide.jpg",
      alternatives: [],
    },
    {
      name: "Haunted House",
      image: "haunted-house.jpg",
      alternatives: [],
    },
    {
      name: "Mini Golf",
      image: "mini-golf.jpg",
      alternatives: [],
    },
    {
      name: "Go Karts",
      image: "go-karts.jpg",
      alternatives: [],
    },
    {
      name: "Bumper Boats",
      image: "bumper-boats.jpg",
      alternatives: [],
    },
    {
      name: "Parades",
      image: "parades.jpg",
      alternatives: [],
    },
    {
      name: "Food Vendors",
      image: "food-vendors.jpg",
      alternatives: [],
    },
    {
      name: "Soda Fountain",
      image: "soda-fountain.jpg",
      alternatives: [],
    },
    {
      name: "Lemonade Stand",
      image: "lemonade-stand.jpg",
      alternatives: [],
    },
    {
      name: "Turkey Legs",
      image: "turkey-legs.jpg",
      alternatives: [],
    },
    {
      name: "Lines",
      image: "lines.jpg",
      alternatives: [],
    },
    {
      name: "Lockers",
      image: "lockers.jpg",
      alternatives: [],
    },
    {
      name: "Park Maps",
      image: "park-maps.jpg",
      alternatives: [],
    },
    {
      name: "Park Mascots",
      image: "park-mascots.jpg",
      alternatives: [],
    },
    {
      name: "Petting Zoo",
      image: "petting-zoo.jpg",
      alternatives: [],
    },
    {
      name: "Funhouse Mirrors",
      image: "funhouse-mirrors.jpg",
      alternatives: [],
    },
    {
      name: "Ride Operators",
      image: "ride-operators.jpg",
      alternatives: [],
    },
    {
      name: "Security Guards",
      image: "security-guards.jpg",
      alternatives: [],
    },
    {
      name: "Caterpillar",
      image: "caterpillar.jpg",
      alternatives: [],
    },
    {
      name: "4d Theater",
      image: "4d-theater.jpg",
      alternatives: [],
    },
    {
      name: "Hayride",
      image: "hayride.jpg",
      alternatives: [],
    },
    {
      name: "Maintenance Crew",
      image: "maintenance-crew.jpg",
      alternatives: [],
    },
  ],
};

const ComediansCategory: CategoryMetadata = {
  name: "Comedians",
  folder: "comedians",
  examples: [
    {
      name: "Jerry Seinfeld",
      image: "jerry-seinfeld.jpg",
      alternatives: [],
    },
    {
      name: "Chris Rock",
      image: "chris-rock.jpg",
      alternatives: [],
    },
    {
      name: "Dave Chappelle",
      image: "dave-chappelle.jpg",
      alternatives: [],
    },
    {
      name: "Kevin Hart",
      image: "kevin-hart.jpg",
      alternatives: [],
    },
    {
      name: "Ellen Degeneres",
      image: "ellen-degeneres.jpg",
      alternatives: [],
    },
    {
      name: "Conan O'Brien",
      image: "conan-obrien.jpg",
      alternatives: [],
    },
    {
      name: "Jimmy Fallon",
      image: "jimmy-fallon.jpg",
      alternatives: [],
    },
    {
      name: "Jimmy Kimmel",
      image: "jimmy-kimmel.jpg",
      alternatives: [],
    },
    {
      name: "Stephen Colbert",
      image: "stephen-colbert.jpg",
      alternatives: [],
    },
    {
      name: "John Oliver",
      image: "john-oliver.jpg",
      alternatives: [],
    },
    {
      name: "Trevor Noah",
      image: "trevor-noah.jpg",
      alternatives: [],
    },
    {
      name: "Seth Meyers",
      image: "seth-meyers.jpg",
      alternatives: [],
    },
    {
      name: "Jay Leno",
      image: "jay-leno.jpg",
      alternatives: [],
    },
    {
      name: "Steve Martin",
      image: "steve-martin.jpg",
      alternatives: [],
    },
    {
      name: "Tina Fey",
      image: "tina-fey.jpg",
      alternatives: [],
    },
    {
      name: "Amy Poehler",
      image: "amy-poehler.jpg",
      alternatives: [],
    },
    {
      name: "John Mulaney",
      image: "john-mulaney.jpg",
      alternatives: [],
    },
    {
      name: "Bo Burnham",
      image: "bo-burnham.jpg",
      alternatives: [],
    },
    {
      name: "Jim Gaffigan",
      image: "jim-gaffigan.jpg",
      alternatives: [],
    },
    {
      name: "Patton Oswalt",
      image: "patton-oswalt.jpg",
      alternatives: [],
    },
    {
      name: "Bill Hader",
      image: "bill-hader.jpg",
      alternatives: [],
    },
    {
      name: "Jordan Peele",
      image: "jordan-peele.jpg",
      alternatives: [],
    },
    {
      name: "Keegan Michael Key",
      image: "keegan-michael-key.jpg",
      alternatives: [],
    },
    {
      name: "Kenan Thompson",
      image: "kenan-thompson.jpg",
      alternatives: [],
    },
    {
      name: "Kristen Wiig",
      image: "kristen-wiig.jpg",
      alternatives: [],
    },
    {
      name: "Melissa Mccarthy",
      image: "melissa-mccarthy.jpg",
      alternatives: [],
    },
    {
      name: "Kate Mckinnon",
      image: "kate-mckinnon.jpg",
      alternatives: [],
    },
    {
      name: "Ali Wong",
      image: "ali-wong.jpg",
      alternatives: [],
    },
    {
      name: "Iliza Shlesinger",
      image: "iliza-shlesinger.jpg",
      alternatives: [],
    },
    {
      name: "Gabriel Iglesias",
      image: "gabriel-iglesias.jpg",
      alternatives: [],
    },
    {
      name: "Hasan Minhaj",
      image: "hasan-minhaj.jpg",
      alternatives: [],
    },
    {
      name: "Nate Bargatze",
      image: "nate-bargatze.jpg",
      alternatives: [],
    },
    {
      name: "Taylor Tomlinson",
      image: "taylor-tomlinson.jpg",
      alternatives: [],
    },
    {
      name: "Nicole Byer",
      image: "nicole-byer.jpg",
      alternatives: [],
    },
    {
      name: "Bowen Yang",
      image: "bowen-yang.jpg",
      alternatives: [],
    },
    {
      name: "Fortune Feimster",
      image: "fortune-feimster.jpg",
      alternatives: [],
    },
    {
      name: "Fred Armisen",
      image: "fred-armisen.jpg",
      alternatives: [],
    },
    {
      name: "Martin Short",
      image: "martin-short.jpg",
      alternatives: [],
    },
    {
      name: "Mike Birbiglia",
      image: "mike-birbiglia.jpg",
      alternatives: [],
    },
    {
      name: "Marc Maron",
      image: "marc-maron.jpg",
      alternatives: [],
    },
    {
      name: "Brian Regan",
      image: "brian-regan.jpg",
      alternatives: [],
    },
    {
      name: "Demetri Martin",
      image: "demetri-martin.jpg",
      alternatives: [],
    },
    {
      name: "Russell Peters",
      image: "russell-peters.jpg",
      alternatives: [],
    },
    {
      name: "Ronny Chieng",
      image: "ronny-chieng.jpg",
      alternatives: [],
    },
    {
      name: "Phoebe Robinson",
      image: "phoebe-robinson.jpg",
      alternatives: [],
    },
    {
      name: "Katherine Ryan",
      image: "katherine-ryan.jpg",
      alternatives: [],
    },
    {
      name: "Maria Bamford",
      image: "maria-bamford.jpg",
      alternatives: [],
    },
    {
      name: "Brian Posehn",
      image: "brian-posehn.jpg",
      alternatives: [],
    },
    {
      name: "Tig Notaro",
      image: "tig-notaro.jpg",
      alternatives: [],
    },
    {
      name: "Reggie Watts",
      image: "reggie-watts.jpg",
      alternatives: [],
    },
  ],
};

const FairFoodsCategory: CategoryMetadata = {
  name: "Fair foods",
  folder: "fair-foods",
  examples: [
    {
      name: "Corn Dog",
      image: "corn-dog.jpg",
      alternatives: [],
    },
    {
      name: "Funnel Cake",
      image: "funnel-cake.jpg",
      alternatives: [],
    },
    {
      name: "Cotton Candy",
      image: "cotton-candy.jpg",
      alternatives: [],
    },
    {
      name: "Caramel Apples",
      image: "caramel-apples.jpg",
      alternatives: [],
    },
    {
      name: "Elephant Ear",
      image: "elephant-ear.jpg",
      alternatives: [],
    },
    {
      name: "Fried Oreos",
      image: "fried-oreos.jpg",
      alternatives: [],
    },
    {
      name: "Fried Twinkies",
      image: "fried-twinkies.jpg",
      alternatives: [],
    },
    {
      name: "Fried Snickers",
      image: "fried-snickers.jpg",
      alternatives: [],
    },
    {
      name: "Fried Pickles",
      image: "fried-pickles.jpg",
      alternatives: [],
    },
    {
      name: "Fried Cheese Curds",
      image: "fried-cheese-curds.jpg",
      alternatives: [],
    },
    {
      name: "Kettle Corn",
      image: "kettle-corn.jpg",
      alternatives: [],
    },
    {
      name: "Popcorn",
      image: "popcorn.jpg",
      alternatives: [],
    },
    {
      name: "Soft Serve Ice Cream",
      image: "soft-serve-ice-cream.jpg",
      alternatives: [],
    },
    {
      name: "Snow Cone",
      image: "snow-cone.jpg",
      alternatives: [],
    },
    {
      name: "Lemonade Shake Up",
      image: "lemonade-shake-up.jpg",
      alternatives: [],
    },
    {
      name: "Giant Pretzel",
      image: "giant-pretzel.jpg",
      alternatives: [],
    },
    {
      name: "Pretzel Bites",
      image: "pretzel-bites.jpg",
      alternatives: [],
    },
    {
      name: "Mozzarella Sticks",
      image: "mozzarella-sticks.jpg",
      alternatives: [],
    },
    {
      name: "Curly Fries",
      image: "curly-fries.jpg",
      alternatives: [],
    },
    {
      name: "Buffalo Wings",
      image: "buffalo-wings.jpg",
      alternatives: [],
    },
    {
      name: "Italian Sausage Sandwich",
      image: "italian-sausage-sandwich.jpg",
      alternatives: [],
    },
    {
      name: "Gyro",
      image: "gyro.jpg",
      alternatives: [],
    },
    {
      name: "Turkey Leg",
      image: "turkey-leg.jpg",
      alternatives: [],
    },
    {
      name: "Loaded Nachos",
      image: "loaded-nachos.jpg",
      alternatives: [],
    },
    {
      name: "Mini Donuts",
      image: "mini-donuts.jpg",
      alternatives: [],
    },
    {
      name: "Waffle Stick",
      image: "waffle-stick.jpg",
      alternatives: [],
    },
    {
      name: "Walking Taco",
      image: "walking-taco.jpg",
      alternatives: [],
    },
    {
      name: "Churros",
      image: "churros.jpg",
      alternatives: [],
    },
    {
      name: "Corn On The Cob",
      image: "corn-on-the-cob.jpg",
      alternatives: [],
    },
    {
      name: "Baked Potato",
      image: "baked-potato.jpg",
      alternatives: [],
    },
    {
      name: "Blooming Onion",
      image: "blooming-onion.jpg",
      alternatives: [],
    },
    {
      name: "Pickle On A Stick",
      image: "pickle-on-a-stick.jpg",
      alternatives: [],
    },
    {
      name: "Sausage On A Stick",
      image: "sausage-on-a-stick.jpg",
      alternatives: [],
    },
    {
      name: "Smoked Brisket Sandwich",
      image: "smoked-brisket-sandwich.jpg",
      alternatives: [],
    },
    {
      name: "Fried Ice Cream",
      image: "fried-ice-cream.jpg",
      alternatives: [],
    },
    {
      name: "Fried Mushrooms",
      image: "fried-mushrooms.jpg",
      alternatives: [],
    },
    {
      name: "Fried Green Tomatoes",
      image: "fried-green-tomatoes.jpg",
      alternatives: [],
    },
    {
      name: "Fried Jalape±o Slices",
      image: "fried-jalape±o-slices.jpg",
      alternatives: [],
    },
    {
      name: "Fried Mac And Cheese",
      image: "fried-mac-and-cheese.jpg",
      alternatives: [],
    },
    {
      name: "Fried Pbj",
      image: "fried-pbj.jpg",
      alternatives: [],
    },
    {
      name: "Fried Coconut Shrimp",
      image: "fried-coconut-shrimp.jpg",
      alternatives: [],
    },
    {
      name: "Fried Banana",
      image: "fried-banana.jpg",
      alternatives: [],
    },
    {
      name: "Deep Fried Pie",
      image: "deep-fried-pie.jpg",
      alternatives: [],
    },
    {
      name: "Deep Fried Brownie",
      image: "deep-fried-brownie.jpg",
      alternatives: [],
    },
    {
      name: "Fried Avocado",
      image: "fried-avocado.jpg",
      alternatives: [],
    },
    {
      name: "Fried Cookie Dough",
      image: "fried-cookie-dough.jpg",
      alternatives: [],
    },
    {
      name: "Chocolate Dipped Bacon",
      image: "chocolate-dipped-bacon.jpg",
      alternatives: [],
    },
  ],
};

const FamousPeopleWhoDiedBeforeTurning30Category: CategoryMetadata = {
  name: "Famous people who died before turning 30",
  folder: "famous-people-under-30",
  examples: [
    {
      name: "Kurt Cobain",
      image: "kurt-cobain.jpg",
      alternatives: [],
    },
    {
      name: "Tupac Shakur",
      image: "tupac-shakur.jpg",
      alternatives: [],
    },
    {
      name: "James Dean",
      image: "james-dean.jpg",
      alternatives: [],
    },
    {
      name: "Jimi Hendrix",
      image: "jimi-hendrix.jpg",
      alternatives: [],
    },
    {
      name: "Janis Joplin",
      image: "janis-joplin.jpg",
      alternatives: [],
    },
    {
      name: "Jim Morrison",
      image: "jim-morrison.jpg",
      alternatives: [],
    },
    {
      name: "The Notorious Big",
      image: "the-notorious-big.jpg",
      alternatives: [],
    },
    {
      name: "Aaliyah",
      image: "aaliyah.jpg",
      alternatives: [],
    },
    {
      name: "Amy Winehouse",
      image: "amy-winehouse.jpg",
      alternatives: [],
    },
    {
      name: "Avicii",
      image: "avicii.jpg",
      alternatives: [],
    },
    {
      name: "Juice Wrld",
      image: "juice-wrld.jpg",
      alternatives: [],
    },
    {
      name: "Lil Peep",
      image: "lil-peep.jpg",
      alternatives: [],
    },
    {
      name: "Xxxtentacion",
      image: "xxxtentacion.jpg",
      alternatives: [],
    },
    {
      name: "River Phoenix",
      image: "river-phoenix.jpg",
      alternatives: [],
    },
    {
      name: "Brandon Lee",
      image: "brandon-lee.jpg",
      alternatives: [],
    },
    {
      name: "Anne Frank",
      image: "anne-frank.jpg",
      alternatives: [],
    },
    {
      name: "Joan Of Arc",
      image: "joan-of-arc.jpg",
      alternatives: [],
    },
    {
      name: "Tutankhamun",
      image: "tutankhamun.jpg",
      alternatives: [],
    },
    {
      name: "Buddy Holly",
      image: "buddy-holly.jpg",
      alternatives: [],
    },
    {
      name: "Ritchie Valens",
      image: "ritchie-valens.jpg",
      alternatives: [],
    },
    {
      name: "Otis Redding",
      image: "otis-redding.jpg",
      alternatives: [],
    },
    {
      name: "Hank Williams",
      image: "hank-williams.jpg",
      alternatives: [],
    },
    {
      name: "Sid Vicious",
      image: "sid-vicious.jpg",
      alternatives: [],
    },
    {
      name: "Brian Jones",
      image: "brian-jones.jpg",
      alternatives: [],
    },
    {
      name: "Stuart Sutcliffe",
      image: "stuart-sutcliffe.jpg",
      alternatives: [],
    },
    {
      name: "Robert Johnson",
      image: "robert-johnson.jpg",
      alternatives: [],
    },
    {
      name: "Anton Yelchin",
      image: "anton-yelchin.jpg",
      alternatives: [],
    },
    {
      name: "Christina Grimmie",
      image: "christina-grimmie.jpg",
      alternatives: [],
    },
    {
      name: "Gia Carangi",
      image: "gia-carangi.jpg",
      alternatives: [],
    },
    {
      name: "Jean Harlow",
      image: "jean-harlow.jpg",
      alternatives: [],
    },
    {
      name: "Jonathan Brandis",
      image: "jonathan-brandis.jpg",
      alternatives: [],
    },
    {
      name: "Heather Orourke",
      image: "heather-orourke.jpg",
      alternatives: [],
    },
    {
      name: "Bobby Fuller",
      image: "bobby-fuller.jpg",
      alternatives: [],
    },
    {
      name: "Nick Drake",
      image: "nick-drake.jpg",
      alternatives: [],
    },
    {
      name: "Peaches Geldof",
      image: "peaches-geldof.jpg",
      alternatives: [],
    },
    {
      name: "Leslie Harvey",
      image: "leslie-harvey.jpg",
      alternatives: [],
    },
    {
      name: "Lil Snupe",
      image: "lil-snupe.jpg",
      alternatives: [],
    },
    {
      name: "Pocahontas",
      image: "pocahontas.jpg",
      alternatives: [],
    },
    {
      name: "John Keats",
      image: "john-keats.jpg",
      alternatives: [],
    },
    {
      name: "Percy Bysshe Shelley",
      image: "percy-bysshe-shelley.jpg",
      alternatives: [],
    },
    {
      name: "Stephen Foster",
      image: "stephen-foster.jpg",
      alternatives: [],
    },
    {
      name: "Henry Moseley",
      image: "henry-moseley.jpg",
      alternatives: [],
    },
    {
      name: "Lady Jane Grey",
      image: "lady-jane-grey.jpg",
      alternatives: [],
    },
    {
      name: "Princess Charlotte Of Wales",
      image: "princess-charlotte-of-wales.jpg",
      alternatives: [],
    },
    {
      name: "David Rizzio",
      image: "david-rizzio.jpg",
      alternatives: [],
    },
    {
      name: "Edward Vi",
      image: "edward-vi.jpg",
      alternatives: [],
    },
    {
      name: "├⌐variste Galois",
      image: "├⌐variste-galois.jpg",
      alternatives: [],
    },
  ],
};

const FastFoodChainsCategory: CategoryMetadata = {
  name: "Fast food chains",
  folder: "fast-food-chains",
  examples: [
    {
      name: "Mcdonalds",
      image: "mcdonalds.jpg",
      alternatives: [],
    },
    {
      name: "Burger King",
      image: "burger-king.jpg",
      alternatives: [],
    },
    {
      name: "Taco Bell",
      image: "taco-bell.jpg",
      alternatives: [],
    },
    {
      name: "Kfc",
      image: "kfc.jpg",
      alternatives: [],
    },
    {
      name: "Subway",
      image: "subway.jpg",
      alternatives: [],
    },
    {
      name: "Pizza Hut",
      image: "pizza-hut.jpg",
      alternatives: [],
    },
    {
      name: "Dominos",
      image: "dominos.jpg",
      alternatives: [],
    },
    {
      name: "Wendys",
      image: "wendys.jpg",
      alternatives: [],
    },
    {
      name: "Chick Fil A",
      image: "chick-fil-a.jpg",
      alternatives: [],
    },
    {
      name: "Chipotle",
      image: "chipotle.jpg",
      alternatives: [],
    },
    {
      name: "Dairy Queen",
      image: "dairy-queen.jpg",
      alternatives: [],
    },
    {
      name: "Sonic",
      image: "sonic.jpg",
      alternatives: [],
    },
    {
      name: "Arbys",
      image: "arbys.jpg",
      alternatives: [],
    },
    {
      name: "Popeyes",
      image: "popeyes.jpg",
      alternatives: [],
    },
    {
      name: "Panda Express",
      image: "panda-express.jpg",
      alternatives: [],
    },
    {
      name: "Papa Johns",
      image: "papa-johns.jpg",
      alternatives: [],
    },
    {
      name: "Jimmy Johns",
      image: "jimmy-johns.jpg",
      alternatives: [],
    },
    {
      name: "Jersey Mikes",
      image: "jersey-mikes.jpg",
      alternatives: [],
    },
    {
      name: "Wingstop",
      image: "wingstop.jpg",
      alternatives: [],
    },
    {
      name: "Shake Shack",
      image: "shake-shack.jpg",
      alternatives: [],
    },
    {
      name: "In N Out",
      image: "in-n-out.jpg",
      alternatives: [],
    },
    {
      name: "White Castle",
      image: "white-castle.jpg",
      alternatives: [],
    },
    {
      name: "Jack In The Box",
      image: "jack-in-the-box.jpg",
      alternatives: [],
    },
    {
      name: "Hardees",
      image: "hardees.jpg",
      alternatives: [],
    },
    {
      name: "Red Robin",
      image: "red-robin.jpg",
      alternatives: [],
    },
    {
      name: "Smashburger",
      image: "smashburger.jpg",
      alternatives: [],
    },
    {
      name: "Potbelly",
      image: "potbelly.jpg",
      alternatives: [],
    },
    {
      name: "Cava",
      image: "cava.jpg",
      alternatives: [],
    },
    {
      name: "Blaze Pizza",
      image: "blaze-pizza.jpg",
      alternatives: [],
    },
    {
      name: "Culvers",
      image: "culvers.jpg",
      alternatives: [],
    },
    {
      name: "El Pollo Loco",
      image: "el-pollo-loco.jpg",
      alternatives: [],
    },
    {
      name: "Boston Market",
      image: "boston-market.jpg",
      alternatives: [],
    },
    {
      name: "Noodles Company",
      image: "noodles-company.jpg",
      alternatives: [],
    },
    {
      name: "Einstein Bros Bagels",
      image: "einstein-bros-bagels.jpg",
      alternatives: [],
    },
    {
      name: "Bojangles",
      image: "bojangles.jpg",
      alternatives: [],
    },
    {
      name: "Whataburger",
      image: "whataburger.jpg",
      alternatives: [],
    },
    {
      name: "Torchys Tacos",
      image: "torchys-tacos.jpg",
      alternatives: [],
    },
  ],
};

const FridgeCategory: CategoryMetadata = {
  name: "Fridge",
  folder: "fridge",
  examples: [
    {
      name: "Milk",
      image: "milk.jpg",
      alternatives: [],
    },
    {
      name: "Eggs",
      image: "eggs.jpg",
      alternatives: [],
    },
    {
      name: "Cheddar Cheese",
      image: "cheddar-cheese.jpg",
      alternatives: [],
    },
    {
      name: "Mozzarella",
      image: "mozzarella.jpg",
      alternatives: [],
    },
    {
      name: "Cream Cheese",
      image: "cream-cheese.jpg",
      alternatives: [],
    },
    {
      name: "Stick Of Butter",
      image: "stick-of-butter.jpg",
      alternatives: [],
    },
    {
      name: "Yogurt",
      image: "yogurt.jpg",
      alternatives: [],
    },
    {
      name: "Orange Juice",
      image: "orange-juice.jpg",
      alternatives: [],
    },
    {
      name: "Apple Juice",
      image: "apple-juice.jpg",
      alternatives: [],
    },
    {
      name: "Soda",
      image: "soda.jpg",
      alternatives: [],
    },
    {
      name: "Beer",
      image: "beer.jpg",
      alternatives: [],
    },
    {
      name: "White Wine",
      image: "white-wine.jpg",
      alternatives: [],
    },
    {
      name: "Bottled Water",
      image: "bottled-water.jpg",
      alternatives: [],
    },
    {
      name: "Ketchup",
      image: "ketchup.jpg",
      alternatives: [],
    },
    {
      name: "Mustard",
      image: "mustard.jpg",
      alternatives: [],
    },
    {
      name: "Bottle Of Mayonnaise",
      image: "bottle-of-mayonnaise.jpg",
      alternatives: [],
    },
    {
      name: "Hot Sauce",
      image: "hot-sauce.jpg",
      alternatives: [],
    },
    {
      name: "Salsa",
      image: "salsa.jpg",
      alternatives: [],
    },
    {
      name: "Guacamole",
      image: "guacamole.jpg",
      alternatives: [],
    },
    {
      name: "Hummus",
      image: "hummus.jpg",
      alternatives: [],
    },
    {
      name: "Salad Dressing",
      image: "salad-dressing.jpg",
      alternatives: [],
    },
    {
      name: "Sour Cream",
      image: "sour-cream.jpg",
      alternatives: [],
    },
    {
      name: "Pickles",
      image: "pickles.jpg",
      alternatives: [],
    },
    {
      name: "Bacon",
      image: "bacon.jpg",
      alternatives: [],
    },
    {
      name: "Ham",
      image: "ham.jpg",
      alternatives: [],
    },
    {
      name: "Turkey Slices",
      image: "turkey-slices.jpg",
      alternatives: [],
    },
    {
      name: "Lettuce",
      image: "lettuce.jpg",
      alternatives: [],
    },
    {
      name: "Spinach",
      image: "spinach.jpg",
      alternatives: [],
    },
    {
      name: "Carrots",
      image: "carrots.jpg",
      alternatives: [],
    },
    {
      name: "Celery",
      image: "celery.jpg",
      alternatives: [],
    },
    {
      name: "Broccoli",
      image: "broccoli.jpg",
      alternatives: [],
    },
    {
      name: "Grapes",
      image: "grapes.jpg",
      alternatives: [],
    },
    {
      name: "Strawberries",
      image: "strawberries.jpg",
      alternatives: [],
    },
    {
      name: "Blueberries",
      image: "blueberries.jpg",
      alternatives: [],
    },
    {
      name: "Applesauce Cup",
      image: "applesauce-cup.jpg",
      alternatives: [],
    },
    {
      name: "Fruit Cup",
      image: "fruit-cup.jpg",
      alternatives: [],
    },
    {
      name: "Tortillas",
      image: "tortillas.jpg",
      alternatives: [],
    },
    {
      name: "Waffles",
      image: "waffles.jpg",
      alternatives: [],
    },
    {
      name: "Hash Browns",
      image: "hash-browns.jpg",
      alternatives: [],
    },
    {
      name: "Marinara Sauce",
      image: "marinara-sauce.jpg",
      alternatives: [],
    },
    {
      name: "Pesto",
      image: "pesto.jpg",
      alternatives: [],
    },
    {
      name: "Iced Tea",
      image: "iced-tea.jpg",
      alternatives: [],
    },
    {
      name: "Cold Brew Coffee",
      image: "cold-brew-coffee.jpg",
      alternatives: [],
    },
    {
      name: "Protein Shake",
      image: "protein-shake.jpg",
      alternatives: [],
    },
    {
      name: "Brita",
      image: "brita.jpg",
      alternatives: [],
    },
    {
      name: "Fresh Herbs",
      image: "fresh-herbs.jpg",
      alternatives: [],
    },
    {
      name: "Miso Paste",
      image: "miso-paste.jpg",
      alternatives: [],
    },
    {
      name: "Tofu",
      image: "tofu.jpg",
      alternatives: [],
    },
    {
      name: "Butter Chicken Sauce",
      image: "butter-chicken-sauce.jpg",
      alternatives: [],
    },
  ],
};

const GarageCategory: CategoryMetadata = {
  name: "Garage",
  folder: "garage",
  examples: [
    {
      name: "Hammer",
      image: "hammer.jpg",
      alternatives: [],
    },
    {
      name: "Screwdriver",
      image: "screwdriver.jpg",
      alternatives: [],
    },
    {
      name: "Power Drill",
      image: "power-drill.jpg",
      alternatives: [],
    },
    {
      name: "Cordless Drill",
      image: "cordless-drill.jpg",
      alternatives: [],
    },
    {
      name: "Wrench",
      image: "wrench.jpg",
      alternatives: [],
    },
    {
      name: "Saw",
      image: "saw.jpg",
      alternatives: [],
    },
    {
      name: "Nail",
      image: "nail.jpg",
      alternatives: [],
    },
    {
      name: "Screws",
      image: "screws.jpg",
      alternatives: [],
    },
    {
      name: "Toolbox",
      image: "toolbox.jpg",
      alternatives: [],
    },
    {
      name: "Extension Cord",
      image: "extension-cord.jpg",
      alternatives: [],
    },
    {
      name: "Work Gloves",
      image: "work-gloves.jpg",
      alternatives: [],
    },
    {
      name: "Workbench",
      image: "workbench.jpg",
      alternatives: [],
    },
    {
      name: "Socket Set",
      image: "socket-set.jpg",
      alternatives: [],
    },
    {
      name: "Drill Bits",
      image: "drill-bits.jpg",
      alternatives: [],
    },
    {
      name: "Paintbrush",
      image: "paintbrush.jpg",
      alternatives: [],
    },
    {
      name: "Paint Roller",
      image: "paint-roller.jpg",
      alternatives: [],
    },
    {
      name: "Paint Can",
      image: "paint-can.jpg",
      alternatives: [],
    },
    {
      name: "Shovel",
      image: "shovel.jpg",
      alternatives: [],
    },
    {
      name: "Rake",
      image: "rake.jpg",
      alternatives: [],
    },
    {
      name: "Lawn Mower",
      image: "lawn-mower.jpg",
      alternatives: [],
    },
    {
      name: "Garden Hose",
      image: "garden-hose.jpg",
      alternatives: [],
    },
    {
      name: "Bicycle",
      image: "bicycle.jpg",
      alternatives: [],
    },
    {
      name: "Bike Helmet",
      image: "bike-helmet.jpg",
      alternatives: [],
    },
    {
      name: "Cooler",
      image: "cooler.jpg",
      alternatives: [],
    },
    {
      name: "Folding Chair",
      image: "folding-chair.jpg",
      alternatives: [],
    },
    {
      name: "Luggage",
      image: "luggage.jpg",
      alternatives: [],
    },
    {
      name: "Roller Skates",
      image: "roller-skates.jpg",
      alternatives: [],
    },
    {
      name: "Sports Equipment",
      image: "sports-equipment.jpg",
      alternatives: [],
    },
    {
      name: "Step Ladder",
      image: "step-ladder.jpg",
      alternatives: [],
    },
    {
      name: "Tarp",
      image: "tarp.jpg",
      alternatives: [],
    },
    {
      name: "Air Pump",
      image: "air-pump.jpg",
      alternatives: [],
    },
    {
      name: "Jumper Cables",
      image: "jumper-cables.jpg",
      alternatives: [],
    },
    {
      name: "Motor Oil",
      image: "motor-oil.jpg",
      alternatives: [],
    },
    {
      name: "Antifreeze",
      image: "antifreeze.jpg",
      alternatives: [],
    },
    {
      name: "Car Jack",
      image: "car-jack.jpg",
      alternatives: [],
    },
    {
      name: "Spare Tire",
      image: "spare-tire.jpg",
      alternatives: [],
    },
    {
      name: "Wd 40",
      image: "wd-40.jpg",
      alternatives: [],
    },
    {
      name: "Home Depot Bucket",
      image: "home-depot-bucket.jpg",
      alternatives: [],
    },
    {
      name: "Ratchet Straps",
      image: "ratchet-straps.jpg",
      alternatives: [],
    },
    {
      name: "Leaf Blower",
      image: "leaf-blower.jpg",
      alternatives: [],
    },
    {
      name: "Weed Whacker",
      image: "weed-whacker.jpg",
      alternatives: [],
    },
    {
      name: "Snow Shovel",
      image: "snow-shovel.jpg",
      alternatives: [],
    },
    {
      name: "Camp Stove",
      image: "camp-stove.jpg",
      alternatives: [],
    },
    {
      name: "Chainsaw",
      image: "chainsaw.jpg",
      alternatives: [],
    },
    {
      name: "Hedge Trimmer",
      image: "hedge-trimmer.jpg",
      alternatives: [],
    },
    {
      name: "Shop Vac",
      image: "shop-vac.jpg",
      alternatives: [],
    },
  ],
};

const HolidaysCategory: CategoryMetadata = {
  name: "Holidays",
  folder: "holidays",
  examples: [
    {
      name: "Christmas",
      image: "christmas.jpg",
      alternatives: [],
    },
    {
      name: "Thanksgiving",
      image: "thanksgiving.jpg",
      alternatives: [],
    },
    {
      name: "Halloween",
      image: "halloween.jpg",
      alternatives: [],
    },
    {
      name: "New Years Eve",
      image: "new-years-eve.jpg",
      alternatives: [],
    },
    {
      name: "Independence Day",
      image: "independence-day.jpg",
      alternatives: [],
    },
    {
      name: "Easter",
      image: "easter.jpg",
      alternatives: [],
    },
    {
      name: "Valentines Day",
      image: "valentines-day.jpg",
      alternatives: [],
    },
    {
      name: "St Patricks Day",
      image: "st-patricks-day.jpg",
      alternatives: [],
    },
    {
      name: "Mothers Day",
      image: "mothers-day.jpg",
      alternatives: [],
    },
    {
      name: "Fathers Day",
      image: "fathers-day.jpg",
      alternatives: [],
    },
    {
      name: "Memorial Day",
      image: "memorial-day.jpg",
      alternatives: [],
    },
    {
      name: "Labor Day",
      image: "labor-day.jpg",
      alternatives: [],
    },
    {
      name: "Veterans Day",
      image: "veterans-day.jpg",
      alternatives: [],
    },
    {
      name: "Martin Luther King Jr Day",
      image: "martin-luther-king-jr-day.jpg",
      alternatives: [],
    },
    {
      name: "Hanukkah",
      image: "hanukkah.jpg",
      alternatives: [],
    },
    {
      name: "Ramadan",
      image: "ramadan.jpg",
      alternatives: [],
    },
    {
      name: "Diwali",
      image: "diwali.jpg",
      alternatives: [],
    },
    {
      name: "Lunar New Year",
      image: "lunar-new-year.jpg",
      alternatives: [],
    },
    {
      name: "Cinco De Mayo",
      image: "cinco-de-mayo.jpg",
      alternatives: [],
    },
    {
      name: "Mardi Gras",
      image: "mardi-gras.jpg",
      alternatives: [],
    },
    {
      name: "Pride Day",
      image: "pride-day.jpg",
      alternatives: [],
    },
    {
      name: "Groundhog Day",
      image: "groundhog-day.jpg",
      alternatives: [],
    },
    {
      name: "Earth Day",
      image: "earth-day.jpg",
      alternatives: [],
    },
    {
      name: "Day Of The Dead",
      image: "day-of-the-dead.jpg",
      alternatives: [],
    },
    {
      name: "Kwanzaa",
      image: "kwanzaa.jpg",
      alternatives: [],
    },
    {
      name: "Passover",
      image: "passover.jpg",
      alternatives: [],
    },
    {
      name: "Rosh Hashanah",
      image: "rosh-hashanah.jpg",
      alternatives: [],
    },
    {
      name: "Yom Kippur",
      image: "yom-kippur.jpg",
      alternatives: [],
    },
    {
      name: "Eid Al Fitr",
      image: "eid-al-fitr.jpg",
      alternatives: [],
    },
    {
      name: "Good Friday",
      image: "good-friday.jpg",
      alternatives: [],
    },
    {
      name: "Columbus Day Indigenous Peoples Day",
      image: "columbus-day-indigenous-peoples-day.jpg",
      alternatives: [],
    },
    {
      name: "Canada Day",
      image: "canada-day.jpg",
      alternatives: [],
    },
    {
      name: "Bastille Day",
      image: "bastille-day.jpg",
      alternatives: [],
    },
    {
      name: "Oktoberfest",
      image: "oktoberfest.jpg",
      alternatives: [],
    },
    {
      name: "Mid Autumn Festival",
      image: "mid-autumn-festival.jpg",
      alternatives: [],
    },
    {
      name: "Pi Day",
      image: "pi-day.jpg",
      alternatives: [],
    },
    {
      name: "Arbor Day",
      image: "arbor-day.jpg",
      alternatives: [],
    },
  ],
};

const MlbTeamsCategory: CategoryMetadata = {
  name: "MLB Teams",
  folder: "mlb-teams",
  examples: [
    {
      name: "New York Yankees",
      image: "new-york-yankees.jpg",
      alternatives: [],
    },
    {
      name: "Boston Red Sox",
      image: "boston-red-sox.jpg",
      alternatives: [],
    },
    {
      name: "Los Angeles Dodgers",
      image: "los-angeles-dodgers.jpg",
      alternatives: [],
    },
    {
      name: "Chicago Cubs",
      image: "chicago-cubs.jpg",
      alternatives: [],
    },
    {
      name: "San Francisco Giants",
      image: "san-francisco-giants.jpg",
      alternatives: [],
    },
    {
      name: "St Louis Cardinals",
      image: "st-louis-cardinals.png",
      alternatives: [],
    },
    {
      name: "Atlanta Braves",
      image: "atlanta-braves.png",
      alternatives: [],
    },
    {
      name: "Houston Astros",
      image: "houston-astros.png",
      alternatives: [],
    },
    {
      name: "New York Mets",
      image: "new-york-mets.png",
      alternatives: [],
    },
    {
      name: "Philadelphia Phillies",
      image: "philadelphia-phillies.jpg",
      alternatives: [],
    },
    {
      name: "Chicago White Sox",
      image: "chicago-white-sox.png",
      alternatives: [],
    },
    {
      name: "Detroit Tigers",
      image: "detroit-tigers.png",
      alternatives: [],
    },
    {
      name: "Cincinnati Reds",
      image: "cincinnati-reds.jpg",
      alternatives: [],
    },
    {
      name: "Cleveland Guardians",
      image: "cleveland-guardians.jpg",
      alternatives: [],
    },
    {
      name: "Minnesota Twins",
      image: "minnesota-twins.jpg",
      alternatives: [],
    },
    {
      name: "Kansas City Royals",
      image: "kansas-city-royals.png",
      alternatives: [],
    },
    {
      name: "Baltimore Orioles",
      image: "baltimore-orioles.png",
      alternatives: [],
    },
    {
      name: "Texas Rangers",
      image: "texas-rangers.png",
      alternatives: [],
    },
    {
      name: "Seattle Mariners",
      image: "seattle-mariners.jpg",
      alternatives: [],
    },
    {
      name: "Toronto Blue Jays",
      image: "toronto-blue-jays.jpg",
      alternatives: [],
    },
    {
      name: "Oakland Athletics",
      image: "oakland-athletics.png",
      alternatives: [],
    },
    {
      name: "Milwaukee Brewers",
      image: "milwaukee-brewers.png",
      alternatives: [],
    },
    {
      name: "San Diego Padres",
      image: "san-diego-padres.jpg",
      alternatives: [],
    },
    {
      name: "Colorado Rockies",
      image: "colorado-rockies.png",
      alternatives: [],
    },
    {
      name: "Arizona Diamondbacks",
      image: "arizona-diamondbacks.png",
      alternatives: [],
    },
    {
      name: "Tampa Bay Rays",
      image: "tampa-bay-rays.png",
      alternatives: [],
    },
    {
      name: "Miami Marlins",
      image: "miami-marlins.png",
      alternatives: [],
    },
    {
      name: "Los Angeles Angels",
      image: "los-angeles-angels.png",
      alternatives: [],
    },
    {
      name: "Pittsburgh Pirates",
      image: "pittsburgh-pirates.png",
      alternatives: [],
    },
    {
      name: "Washington Nationals",
      image: "washington-nationals.jpg",
      alternatives: [],
    },
    {
      name: "Brooklyn Dodgers",
      image: "brooklyn-dodgers.png",
      alternatives: [],
    },
    {
      name: "New York Giants",
      image: "new-york-giants.png",
      alternatives: [],
    },
    {
      name: "Montreal Expos",
      image: "montreal-expos.jpg",
      alternatives: [],
    },
    {
      name: "St Louis Browns",
      image: "st-louis-browns.png",
      alternatives: [],
    },
    {
      name: "Philadelphia Athletics",
      image: "philadelphia-athletics.png",
      alternatives: [],
    },
    {
      name: "Kansas City Athletics",
      image: "kansas-city-athletics.png",
      alternatives: [],
    },
    {
      name: "Milwaukee Braves",
      image: "milwaukee-braves.png",
      alternatives: [],
    },
    {
      name: "Boston Braves",
      image: "boston-braves.png",
      alternatives: [],
    },
    {
      name: "Cleveland Naps",
      image: "cleveland-naps.jpg",
      alternatives: [],
    },
    {
      name: "Seattle Pilots",
      image: "seattle-pilots.jpg",
      alternatives: [],
    },
    {
      name: "Pittsburgh Rebels",
      image: "pittsburgh-rebels.jpg",
      alternatives: [],
    },
    {
      name: "Washington Senators",
      image: "washington-senators.png",
      alternatives: [],
    },
  ],
};

const SportsCategory: CategoryMetadata = {
  name: "Sports",
  folder: "sports",
  examples: [
    {
      name: "Football",
      image: "football.jpg",
      alternatives: [],
    },
    {
      name: "Basketball",
      image: "basketball.jpg",
      alternatives: [],
    },
    {
      name: "Baseball",
      image: "baseball.jpg",
      alternatives: [],
    },
    {
      name: "Soccer",
      image: "soccer.jpg",
      alternatives: [],
    },
    {
      name: "Tennis",
      image: "tennis.jpg",
      alternatives: [],
    },
    {
      name: "Golf",
      image: "golf.jpg",
      alternatives: [],
    },
    {
      name: "Hockey",
      image: "hockey.jpg",
      alternatives: [],
    },
    {
      name: "Swimming",
      image: "swimming.jpg",
      alternatives: [],
    },
    {
      name: "Volleyball",
      image: "volleyball.jpg",
      alternatives: [],
    },
    {
      name: "Boxing",
      image: "boxing.jpg",
      alternatives: [],
    },
    {
      name: "Auto Racing",
      image: "auto-racing.jpg",
      alternatives: [],
    },
    {
      name: "Cycling",
      image: "cycling.jpg",
      alternatives: [],
    },
    {
      name: "Marathon",
      image: "marathon.jpg",
      alternatives: [],
    },
    {
      name: "Skiing",
      image: "skiing.jpg",
      alternatives: [],
    },
    {
      name: "Snowboarding",
      image: "snowboarding.jpg",
      alternatives: [],
    },
    {
      name: "Surfing",
      image: "surfing.jpg",
      alternatives: [],
    },
    {
      name: "Skateboarding",
      image: "skateboarding.jpg",
      alternatives: [],
    },
    {
      name: "Gymnastics",
      image: "gymnastics.jpg",
      alternatives: [],
    },
    {
      name: "Track And Field",
      image: "track-and-field.jpg",
      alternatives: [],
    },
    {
      name: "Softball",
      image: "softball.jpg",
      alternatives: [],
    },
    {
      name: "Bowling",
      image: "bowling.jpeg",
      alternatives: [],
    },
    {
      name: "Table Tennis",
      image: "table-tennis.jpg",
      alternatives: [],
    },
    {
      name: "Badminton",
      image: "badminton.jpg",
      alternatives: [],
    },
    {
      name: "Cricket",
      image: "cricket.jpg",
      alternatives: [],
    },
    {
      name: "Rugby",
      image: "rugby.jpg",
      alternatives: [],
    },
    {
      name: "Lacrosse",
      image: "lacrosse.jpg",
      alternatives: [],
    },
    {
      name: "Field Hockey",
      image: "field-hockey.jpg",
      alternatives: [],
    },
    {
      name: "Cheerleading",
      image: "cheerleading.jpg",
      alternatives: [],
    },
    {
      name: "Climbing",
      image: "climbing.jpg",
      alternatives: [],
    },
    {
      name: "Rowing",
      image: "rowing.jpg",
      alternatives: [],
    },
    {
      name: "Triathlon",
      image: "triathlon.jpg",
      alternatives: [],
    },
    {
      name: "Ultimate Frisbee",
      image: "ultimate-frisbee.jpg",
      alternatives: [],
    },
    {
      name: "Pickleball",
      image: "pickleball.jpg",
      alternatives: [],
    },
    {
      name: "Water Polo",
      image: "water-polo.jpg",
      alternatives: [],
    },
    {
      name: "Horse Racing",
      image: "horse-racing.jpg",
      alternatives: [],
    },
    {
      name: "Mma",
      image: "mma.jpg",
      alternatives: [],
    },
    {
      name: "Wrestling",
      image: "wrestling.jpg",
      alternatives: [],
    },
    {
      name: "Powerlifting",
      image: "powerlifting.jpg",
      alternatives: [],
    },
    {
      name: "Bodybuilding",
      image: "bodybuilding.jpg",
      alternatives: [],
    },
    {
      name: "Darts",
      image: "darts.jpg",
      alternatives: [],
    },
    {
      name: "Billiards",
      image: "billiards.jpg",
      alternatives: [],
    },
    {
      name: "Disc Golf",
      image: "disc-golf.jpg",
      alternatives: [],
    },
    {
      name: "Dodgeball",
      image: "dodgeball.jpg",
      alternatives: [],
    },
    {
      name: "Kickball",
      image: "kickball.jpg",
      alternatives: [],
    },
    {
      name: "Handball",
      image: "handball.jpg",
      alternatives: [],
    },
    {
      name: "Archery",
      image: "archery.jpg",
      alternatives: [],
    },
    {
      name: "Broomball",
      image: "broomball.jpg",
      alternatives: [],
    },
    {
      name: "Curling",
      image: "curling.jpg",
      alternatives: [],
    },
    {
      name: "Fencing",
      image: "fencing.jpg",
      alternatives: [],
    },
    {
      name: "Polo",
      image: "polo.jpg",
      alternatives: [],
    },
  ],
};

const ChilisCategory: CategoryMetadata = {
  name: "Chilis",
  folder: "chilis",
  examples: [],
};

export const CATEGORY_METADATA: Record<Category, CategoryMetadata> = {
  Pokemon: PokemonCategory,
  "Broadway shows": BroadwayShowsCategory,
  "Disney characters": DisneyCharactersCategory,
  "Kitchen gadgets": KitchenGadgetsCategory,
  "Junk drawer": JunkDrawerCategory,
  Laundry: LaundryCategory,
  "Pop divas": PopDivasCategory,
  "Chicago tourist stuff": ChicagoTouristStuffCategory,
  Apps: AppsCategory,
  "Board games": BoardGamesCategory,
  States: StatesCategory,
  "Harry Potter characters": HarryPotterCharactersCategory,
  "Spirit Halloween Catalogue": SpiritHalloweenCatalogueCategory,
  Superheros: SuperherosCategory,
  "Video Game Characters": VideoGameCharactersCategory,
  "City Skylines": CitySkylinesCategory,
  Movies: MoviesCategory,
  Books: BooksCategory,
  "Disney Channel Original Movies": DisneyChannelOriginalMoviesCategory,
  "Airport Codes": AirportCodesCategory,
  "Brand slogans": BrandSlogansCategory,
  "Taylor Swift Lyrics": TaylorSwiftLyricsCategory,
  "Reality tv shows": RealityTvShowsCategory,
  "The Office": TheOfficeCategory,
  Thanksgiving: ThanksgivingCategory,
  Dogs: DogsCategory,
  Horses: HorsesCategory,
  "Rom Coms": RomComsCategory,
  "Amusement Parks": AmusementParksCategory,
  Comedians: ComediansCategory,
  "Fair foods": FairFoodsCategory,
  "Famous people who died before turning 30":
    FamousPeopleWhoDiedBeforeTurning30Category,
  "Fast food chains": FastFoodChainsCategory,
  Fridge: FridgeCategory,
  Garage: GarageCategory,
  Holidays: HolidaysCategory,
  "MLB Teams": MlbTeamsCategory,
  Sports: SportsCategory,
  Chilis: ChilisCategory,
  Math: MathCategory,
};

// DEBUG SPECIFIC DATA
export const DEBUG_FLOOR_DATA: FloorData[] = [
  {
    person: "Aimee",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Aimee",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Andrea",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Andrea",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Beth",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Beth",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  // {
  //   person: "Courtney",
  //   category: "Apps",
  //   hasBeenRandomized: true,
  //   isStillInTheGame: true,
  // },
  // {
  //   person: "Courtney",
  //   category: "Chilis",
  //   hasBeenRandomized: false,
  //   isStillInTheGame: true,
  // },
  {
    person: "Devin",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Devin",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Ellie",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Ellie",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Emma",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Emma",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Frankie",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Frankie",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Gabe",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Gabe",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Joey",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Joey",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "John",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "John",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Josh",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Josh",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Layne",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Layne",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Nic",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Nic",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Nolan",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Nolan",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Pat",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Pat",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Rachel",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Rachel",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Syd",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Syd",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Tanner",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Tanner",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Zoey",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
  {
    person: "Zoey",
    category: "Apps",
    hasBeenRandomized: true,
    isStillInTheGame: true,
  },
] as const;
