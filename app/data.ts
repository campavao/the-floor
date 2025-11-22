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

export const CATEGORY_METADATA: Record<Category, CategoryMetadata> = {
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
  "Kitchen gadgets": {
    name: "Kitchen gadgets",
    folder: "kitchen-gadgets",
    examples: [
      {
        name: "Air fryer",
        image: "air-fryer.jpg",
        alternatives: [],
      },
      {
        name: "Baking sheet",
        image: "baking-sheet.jpg",
        alternatives: [],
      },
      {
        name: "Blender",
        image: "blender.jpg",
        alternatives: [],
      },
      {
        name: "Bottle opener",
        image: "bottle-opener.jpg",
        alternatives: [],
      },
      {
        name: "Can opener",
        image: "can-opener.jpg",
        alternatives: [],
      },
      {
        name: "Cast iron pan",
        image: "cast-iron-pan.jpg",
        alternatives: [],
      },
      {
        name: "Cheese grater",
        image: "cheese-grater.jpg",
        alternatives: [],
      },
      {
        name: "Citrus zester",
        image: "citrus-zester.jpg",
        alternatives: [],
      },
      {
        name: "Coffee grinder",
        image: "coffee-grinder.jpg",
        alternatives: [],
      },
      {
        name: "Colander",
        image: "colander.jpg",
        alternatives: [],
      },
      {
        name: "Cutting board",
        image: "cutting-board.jpg",
        alternatives: [],
      },
      {
        name: "Digital thermometer",
        image: "digital-thermometer.jpg",
        alternatives: [],
      },
      {
        name: "Egg separator",
        image: "egg-separator.jpg",
        alternatives: [],
      },
      {
        name: "Food processor",
        image: "food-processor.jpg",
        alternatives: [],
      },
      {
        name: "French press",
        image: "french-press.jpg",
        alternatives: [],
      },
      {
        name: "Funnel",
        image: "funnel.jpg",
        alternatives: [],
      },
      {
        name: "Garlic press",
        image: "garlic-press.jpg",
        alternatives: [],
      },
      {
        name: "Hand mixer",
        image: "hand-mixer.jpg",
        alternatives: [],
      },
      {
        name: "Ice cream scoop",
        image: "ice-cream-scoop.jpg",
        alternatives: [],
      },
      {
        name: "Immersion blender",
        image: "immersion-blender.jpg",
        alternatives: [],
      },
      {
        name: "Juicer",
        image: "juicer.jpg",
        alternatives: [],
      },
      {
        name: "Kitchen scale",
        image: "kitchen-scale.jpg",
        alternatives: [],
      },
      {
        name: "Kitchen shears",
        image: "kitchen-shears.jpg",
        alternatives: [],
      },
      {
        name: "Mandoline slicer",
        image: "mandoline-slicer.jpg",
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
        name: "Meat tenderizer",
        image: "meat-tenderizer.jpg",
        alternatives: [],
      },
      {
        name: "Microwave",
        image: "microwave.jpg",
        alternatives: [],
      },
      {
        name: "Mortar and pestle",
        image: "mortar-and-pestle.jpg",
        alternatives: [],
      },
      {
        name: "Muffin tin",
        image: "muffin-tin.jpg",
        alternatives: [],
      },
      {
        name: "Oven mitts",
        image: "oven-mitts.jpg",
        alternatives: [],
      },
      {
        name: "Pastry brush",
        image: "pastry-brush.jpg",
        alternatives: [],
      },
      {
        name: "Pizza cutter",
        image: "pizza-cutter.jpg",
        alternatives: [],
      },
      {
        name: "Potato peeler",
        image: "potato-peeler.jpg",
        alternatives: [],
      },
      {
        name: "Pressure cooker",
        image: "pressure-cookier.png",
        alternatives: [],
      },
      {
        name: "Rice cooker",
        image: "rice-cooker.jpg",
        alternatives: [],
      },
      {
        name: "Rolling pin",
        image: "rolling-pin.jpg",
        alternatives: [],
      },
      {
        name: "Salad spinner",
        image: "salad-spinner.jpg",
        alternatives: [],
      },
      {
        name: "Slow cooker",
        image: "slow-cooker.jpg",
        alternatives: [],
      },
      {
        name: "Spatula",
        image: "spatula.jpg",
        alternatives: [],
      },
      {
        name: "Spice grinder",
        image: "spice-grinder.jpg",
        alternatives: [],
      },
      {
        name: "Splatter screen",
        image: "splatter-screen.jpg",
        alternatives: [],
      },
      {
        name: "Stand mixer",
        image: "stand-mixer.jpg",
        alternatives: [],
      },
      {
        name: "Strainer",
        image: "strainer.jpg",
        alternatives: [],
      },
      {
        name: "Toaster oven",
        image: "toaster-oven.jpg",
        alternatives: [],
      },
      {
        name: "Tongs",
        image: "tongs.jpg",
        alternatives: [],
      },
      {
        name: "Whisk",
        image: "whisk.jpg",
        alternatives: [],
      },
    ],
  },
  "Junk drawer": {
    name: "Junk drawer",
    folder: "junk-drawer",
    examples: [
      {
        name: "Rubber bands",
        image: "rubber-bands.jpg",
        alternatives: [],
      },
      {
        name: "Scissors",
        image: "scissors.jpg",
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
        name: "Paper clips",
        image: "paper-clips.jpg",
        alternatives: [],
      },
      {
        name: "Dried-out markers",
        image: "dried-out-markers.jpg",
        alternatives: [],
      },
      {
        name: "Broken phone chargers",
        image: "broken-phone-chargers.jpg",
        alternatives: [],
      },
      {
        name: "USB cables",
        image: "usb-cables.jpg",
        alternatives: [],
      },
      {
        name: "Random keys",
        image: "random-keys.jpg",
        alternatives: [],
      },
      {
        name: "Binder clips",
        image: "binder-clips.jpg",
        alternatives: [],
      },
      {
        name: "Safety pins",
        image: "safety-pins.jpg",
        alternatives: [],
      },
      {
        name: "Glue sticks",
        image: "glue-sticks.jpg",
        alternatives: [],
      },
      {
        name: "Adhesive tape",
        image: "adhesive-tape.jpg",
        alternatives: [],
      },
      {
        name: "Spare buttons",
        image: "spare-buttons.jpg",
        alternatives: [],
      },
      {
        name: "Twine",
        image: "twine.jpg",
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
        name: "Allen wrenches",
        image: "allen-wrenches.jpg",
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
        name: "Sticky tack",
        image: "sticky-tack.jpg",
        alternatives: [],
      },
      {
        name: "Old gift cards",
        image: "old-gift-cards.jpg",
        alternatives: [],
      },
      {
        name: "Candle stubs",
        image: "candle-stubs.jpg",
        alternatives: [],
      },
      {
        name: "Rubber gloves",
        image: "rubber-gloves.jpg",
        alternatives: [],
      },
      {
        name: "Felt pads",
        image: "felt-pads.jpg",
        alternatives: [],
      },
      {
        name: "Coin purse",
        image: "coin-purse.jpg",
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
        name: "Clothespins",
        image: "clothespins.jpg",
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
        name: "Old sunglasses",
        image: "old-sunglasses.jpg",
        alternatives: [],
      },
      {
        name: "Chip clips",
        image: "chip-clips.jpg",
        alternatives: [],
      },
      {
        name: "Pocket knife",
        image: "pocket-knife.jpg",
        alternatives: [],
      },
      {
        name: "Flash drives",
        image: "flash-drives.jpg",
        alternatives: [],
      },
      {
        name: "Playing cards",
        image: "playing-cards.jpg",
        alternatives: [],
      },
      {
        name: "Bottle opener",
        image: "bottle-opener.jpg",
        alternatives: [],
      },
      {
        name: "Old magnets",
        image: "old-magnets.jpg",
        alternatives: [],
      },
      {
        name: "Rubber stopper",
        image: "rubber-stopper.jpg",
        alternatives: [],
      },
      {
        name: "Keychains",
        image: "keychains.jpg",
        alternatives: [],
      },
      {
        name: "Notepad",
        image: "notepad.jpg",
        alternatives: [],
      },
      {
        name: "Coasters",
        image: "coasters.jpg",
        alternatives: [],
      },
    ],
  },
  Laundry: {
    name: "Laundry",
    folder: "laundry",
    examples: [
      {
        name: "Laundry detergent",
        image: "laundry-detergent.jpg",
        alternatives: [],
      },
      {
        name: "Fabric softener",
        image: "fabric-softener.jpg",
        alternatives: [],
      },
      {
        name: "Dryer sheets",
        image: "dryer-sheets.jpg",
        alternatives: [],
      },
      {
        name: "Stain remover",
        image: "stain-remover.jpg",
        alternatives: [],
      },
      {
        name: "Delicates bag",
        image: "delicates-bag.jpg",
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
        name: "Folded towels",
        image: "folded-towels.jpg",
        alternatives: [],
      },
      {
        name: "Clothesline",
        image: "clothesline.jpg",
        alternatives: [],
      },
      {
        name: "Clothespins",
        image: "clothespins.jpg",
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
        name: "Wrinkle releaser spray",
        image: "wrinkle-releaser-spray.jpg",
        alternatives: [],
      },
      {
        name: "Bleach",
        image: "bleach.jpg",
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
        name: "Dry cleaning bag",
        image: "dry-cleaning-bag.jpg",
        alternatives: [],
      },
      {
        name: "Lint roller",
        image: "lint-roller.jpg",
        alternatives: [],
      },
      {
        name: "Lint trap",
        image: "lint-trap.jpg",
        alternatives: [],
      },
      {
        name: "Mesh laundry bag",
        image: "mesh-laundry-bag.jpg",
        alternatives: [],
      },
      {
        name: "Soaking basin",
        image: "soaking-basin.jpg",
        alternatives: [],
      },
      {
        name: "Detergent pods",
        image: "detergent-pods.jpg",
        alternatives: [],
      },
      {
        name: "Laundry sanitizer",
        image: "laundry-sanitizer.jpg",
        alternatives: [],
      },
      {
        name: "Pre-treatment spray",
        image: "pre-treatment-spray.jpg",
        alternatives: [],
      },
      {
        name: "Fabric refresher",
        image: "fabric-refresher.jpg",
        alternatives: [],
      },
      {
        name: "Hand-wash soap",
        image: "hand-wash-soap.jpg",
        alternatives: [],
      },
      {
        name: "Drying rack",
        image: "drying-rack.jpg",
        alternatives: [],
      },
      {
        name: "Steamer",
        image: "steamer.jpg",
        alternatives: [],
      },
      {
        name: "Clothing hangers",
        image: "clothing-hangers.jpg",
        alternatives: [],
      },
      {
        name: "Scent boosters",
        image: "scent-boosters.jpg",
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
        name: "Spot remover pen",
        image: "spot-remover-pen.jpg",
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
    ],
  },
  "Pop divas": {
    name: "Pop divas",
    folder: "pop-divas",
    examples: [
      {
        name: "Adele",
        image: "adele.jpg",
        alternatives: [],
      },
      {
        name: "Alicia Keys",
        image: "alicia-keys.jpg",
        alternatives: [],
      },
      {
        name: "Ariana Grande",
        image: "ariana-grande.jpg",
        alternatives: [],
      },
      {
        name: "Ashanti",
        image: "ashanti.jpg",
        alternatives: [],
      },
      {
        name: "Avril Lavigne",
        image: "avril-lavigne.jpg",
        alternatives: [],
      },
      {
        name: "Beyoncé",
        image: "beyonce.jpg",
        alternatives: [],
      },
      {
        name: "Billie Eilish",
        image: "billie-eilish.jpg",
        alternatives: [],
      },
      {
        name: "Bonnie Tyler",
        image: "bonnie-tyler.jpg",
        alternatives: [],
      },
      {
        name: "Britney Spears",
        image: "britney-spears.jpg",
        alternatives: [],
      },
      {
        name: "Camila Cabello",
        image: "camila-cabello.jpg",
        alternatives: [],
      },
      {
        name: "Celine Dion",
        image: "celine-dion.jpg",
        alternatives: [],
      },
      {
        name: "Chappell Roan",
        image: "chappell-roan.jpg",
        alternatives: [],
      },
      {
        name: "Charli XCX",
        image: "charli-xcx.jpg",
        alternatives: [],
      },
      {
        name: "Chloe Bailey",
        image: "chloe-bailey.jpg",
        alternatives: [],
      },
      {
        name: "Christina Aguilera",
        image: "christina-aguilera.jpg",
        alternatives: [],
      },
      {
        name: "Demi Lovato",
        image: "demi-lovato.jpg",
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
        name: "Ellie Goulding",
        image: "ellie-goulding.jpg",
        alternatives: [],
      },
      {
        name: "Fergie",
        image: "fergie.jpg",
        alternatives: [],
      },
      {
        name: "Florence Welch",
        image: "florence-welch.jpg",
        alternatives: [],
      },
      {
        name: "Grimes",
        image: "grimes.jpg",
        alternatives: [],
      },
      {
        name: "Halsey",
        image: "halsey.jpg",
        alternatives: [],
      },
      {
        name: "Hayley Williams",
        image: "hayley-williams.jpg",
        alternatives: [],
      },
      {
        name: "Janelle Monáe",
        image: "janelle-monae.jpg",
        alternatives: [],
      },
      {
        name: "Janet Jackson",
        image: "janet-jackson.jpg",
        alternatives: [],
      },
      {
        name: "Jennifer Lopez",
        image: "jennifer-lopez.jpg",
        alternatives: [],
      },
      {
        name: "Jessie J",
        image: "jessie-j.jpg",
        alternatives: [],
      },
      {
        name: "Katy Perry",
        image: "katy-perry.jpg",
        alternatives: [],
      },
      {
        name: "Kesha",
        image: "kesha.jpg",
        alternatives: [],
      },
      {
        name: "Kylie Minogue",
        image: "kylie-minogue.jpg",
        alternatives: [],
      },
      {
        name: "Lady Gaga",
        image: "lady-gaga.jpg",
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
        name: "Miley Cyrus",
        image: "miley-cyrus.jpg",
        alternatives: [],
      },
      {
        name: "Nicki Minaj",
        image: "nicki-minaj.jpg",
        alternatives: [],
      },
      {
        name: "Normani",
        image: "normani.jpg",
        alternatives: [],
      },
      {
        name: "Olivia Rodrigo",
        image: "olivia-rodrigo.jpg",
        alternatives: [],
      },
      {
        name: "Pink",
        image: "pink.jpg",
        alternatives: [],
      },
      {
        name: "Rihanna",
        image: "rihanna.jpg",
        alternatives: [],
      },
      {
        name: "Rosalía",
        image: "rosalia.jpg",
        alternatives: [],
      },
      {
        name: "Selena Gomez",
        image: "selena-gomez.jpg",
        alternatives: [],
      },
      {
        name: "Shakira",
        image: "shakira.jpg",
        alternatives: [],
      },
      {
        name: "Sia",
        image: "sia.jpg",
        alternatives: [],
      },
      {
        name: "Taylor Swift",
        image: "taylor-swift.jpg",
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
        name: "Whitney Houston",
        image: "whitney-houston.jpg",
        alternatives: [],
      },
    ],
  },
  "Chicago tourist stuff": {
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
        name: "Chicago Riverwalk",
        image: "chicago-riverwalk.jpg",
        alternatives: [],
      },
      {
        name: "Architectural Boat Tour",
        image: "architectural-boat-tour.jpg",
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
        name: "Adler Planetarium",
        image: "adler-planetarium.jpg",
        alternatives: [],
      },
      {
        name: "Art Institute of Chicago",
        image: "art-institute-of-chicago.jpg",
        alternatives: [],
      },
      {
        name: "Lincoln Park Zoo",
        image: "lincoln-park-zoo.jpg",
        alternatives: [],
      },
      {
        name: "Maggie Daley Park",
        image: "maggie-daley-park.jpg",
        alternatives: [],
      },
      {
        name: "Wrigley Field",
        image: "wrigley-field.jpg",
        alternatives: [],
      },
      {
        name: "Soldier Field",
        image: "soldier-field.jpg",
        alternatives: [],
      },
      {
        name: "Garfield Park Conservatory",
        image: "garfield-park-conservatory.jpg",
        alternatives: [],
      },
      {
        name: "Chicago Theatre",
        image: "chicago-theatre.jpg",
        alternatives: [],
      },
      {
        name: "Grant Park",
        image: "grant-park.jpg",
        alternatives: [],
      },
      {
        name: "360 Chicago",
        image: "360-chicago.jpg",
        alternatives: [],
      },
      {
        name: "Museum of Science and Industry",
        image: "museum-of-science-and-industry.jpg",
        alternatives: [],
      },
      {
        name: "Chicago Cultural Center",
        image: "chicago-cultural-center.jpg",
        alternatives: [],
      },
      {
        name: "The Magnificent Mile",
        image: "the-magnificent-mile.jpg",
        alternatives: [],
      },
      {
        name: "Chicago Water Tower",
        image: "chicago-water-tower.jpg",
        alternatives: [],
      },
      {
        name: "Chicago History Museum",
        image: "chicago-history-museum.jpg",
        alternatives: [],
      },
      {
        name: "Promontory Point",
        image: "promontory-point.jpg",
        alternatives: [],
      },
      {
        name: "The Robey rooftop",
        image: "the-robey-rooftop.jpg",
        alternatives: [],
      },
      {
        name: "Ferris wheel at Navy Pier",
        image: "ferris-wheel-at-navy-pier.jpg",
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
        name: "Billy Goat Tavern",
        image: "billy-goat-tavern.jpg",
        alternatives: [],
      },
      {
        name: "Portillo's",
        image: "portillos.jpg",
        alternatives: [],
      },
      {
        name: "Gino's East",
        image: "ginos-east.jpg",
        alternatives: [],
      },
      {
        name: "Garrett Popcorn",
        image: "garrett-popcorn.jpg",
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
        name: "The Violet Hour",
        image: "the-violet-hour.jpg",
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
        name: "The Green Mill",
        image: "the-green-mill.jpg",
        alternatives: [],
      },
      {
        name: "Chicago Botanic Garden",
        image: "chicago-botanic-garden.jpg",
        alternatives: [],
      },
      {
        name: "Brookfield Zoo",
        image: "brookfield-zoo.jpg",
        alternatives: [],
      },
      {
        name: "Calder's Flamingo",
        image: "calders-flamingo.jpg",
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
        name: "Andersonville Clark St.",
        image: "andersonville-clark-st.jpg",
        alternatives: [],
      },
      {
        name: "Chicago Hot Dog stands",
        image: "chicago-hot-dog-stands.jpg",
        alternatives: [],
      },
      {
        name: "Buckingham Fountain",
        image: "buckingham-fountain.jpg",
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
  },
  Apps: {
    name: "Apps",
    folder: "apps",
    examples: [
      {
        name: "Amazon",
        image: "amazon.png",
        alternatives: [],
      },
      {
        name: "Apple Maps",
        image: "apple-maps.png",
        alternatives: [],
      },
      {
        name: "Cash App",
        image: "cash-app.png",
        alternatives: [],
      },
      {
        name: "Discord",
        image: "discord.png",
        alternatives: [],
      },
      {
        name: "Disney",
        image: "disney.jpg",
        alternatives: [],
      },
      {
        name: "DoorDash",
        image: "doordash.png",
        alternatives: [],
      },
      {
        name: "ESPN",
        image: "espn.png",
        alternatives: [],
      },
      {
        name: "Facebook",
        image: "facebook.png",
        alternatives: [],
      },
      {
        name: "Fidelity",
        image: "fidelity.png",
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
        name: "Instagram",
        image: "instagram.png",
        alternatives: [],
      },
      {
        name: "Kindle",
        image: "kindle.png",
        alternatives: [],
      },
      {
        name: "LinkedIn",
        image: "linkedin.png",
        alternatives: [],
      },
      {
        name: "Messenger",
        image: "messenger.png",
        alternatives: [],
      },
      {
        name: "Microsoft Teams",
        image: "microsoft-teams.png",
        alternatives: [],
      },
      {
        name: "Netflix",
        image: "netflix.png",
        alternatives: [],
      },
      {
        name: "Notion",
        image: "notion.png",
        alternatives: [],
      },
      {
        name: "Pandora",
        image: "pandora.png",
        alternatives: [],
      },
      {
        name: "Partiful",
        image: "partiful.png",
        alternatives: [],
      },
      {
        name: "PayPal",
        image: "paypal.png",
        alternatives: [],
      },
      {
        name: "Pinterest",
        image: "pinterest.png",
        alternatives: [],
      },
      {
        name: "Prime Video",
        image: "prime-video.jpg",
        alternatives: [],
      },
      {
        name: "Reddit",
        image: "reddit.png",
        alternatives: [],
      },
      {
        name: "Robinhood",
        image: "robinhood.png",
        alternatives: [],
      },
      {
        name: "Roku",
        image: "roku.png",
        alternatives: [],
      },
      {
        name: "Shazam",
        image: "shazam.png",
        alternatives: [],
      },
      {
        name: "Signal",
        image: "signal.png",
        alternatives: [],
      },
      {
        name: "Slack",
        image: "slack.png",
        alternatives: [],
      },
      {
        name: "Snapchat",
        image: "snapchat.png",
        alternatives: [],
      },
      {
        name: "Southwest",
        image: "southwest.png",
        alternatives: [],
      },
      {
        name: "Spotify",
        image: "spotify.png",
        alternatives: [],
      },
      {
        name: "Strava",
        image: "strava.png",
        alternatives: [],
      },
      {
        name: "Target",
        image: "target.png",
        alternatives: [],
      },
      {
        name: "Telegram",
        image: "telegram.png",
        alternatives: [],
      },
      {
        name: "TikTok",
        image: "tiktok.png",
        alternatives: [],
      },
      {
        name: "Trello",
        image: "trello.png",
        alternatives: [],
      },
      {
        name: "Twitch",
        image: "twitch.png",
        alternatives: [],
      },
      {
        name: "Twitter",
        image: "twitter.png",
        alternatives: [],
      },
      {
        name: "Uber",
        image: "uber.png",
        alternatives: [],
      },
      {
        name: "United Airlines",
        image: "united-airlines.png",
        alternatives: [],
      },
      {
        name: "Venmo",
        image: "venmo.png",
        alternatives: [],
      },
      {
        name: "Walmart",
        image: "walmart.png",
        alternatives: [],
      },
      {
        name: "WeChat",
        image: "wechat.png",
        alternatives: [],
      },
      {
        name: "WhatsApp",
        image: "whatsapp.png",
        alternatives: [],
      },
      {
        name: "YouTube",
        image: "youtube.png",
        alternatives: [],
      },
      {
        name: "Zoom",
        image: "zoom.png",
        alternatives: [],
      },
    ],
  },
  "Board games": {
    name: "Board games",
    folder: "board-games",
    examples: [
      {
        name: "7 Wonders",
        image: "7-wonders.jpg",
        alternatives: [],
      },
      {
        name: "Aggravation",
        image: "aggravation.jpg",
        alternatives: [],
      },
      {
        name: "Apples to Apples",
        image: "apples-to-apples.jpg",
        alternatives: [],
      },
      {
        name: "Arkham Horror",
        image: "arkham-horror.jpg",
        alternatives: [],
      },
      {
        name: "Azul",
        image: "azul.jpg",
        alternatives: [],
      },
      {
        name: "Backgammon",
        image: "backgammon.jpg",
        alternatives: [],
      },
      {
        name: "Bananagrams",
        image: "bananagrams.jpg",
        alternatives: [],
      },
      {
        name: "Battleship",
        image: "battleship.jpg",
        alternatives: [],
      },
      {
        name: "Blokus",
        image: "blokus.jpg",
        alternatives: [],
      },
      {
        name: "Candy Land",
        image: "candy-land.jpg",
        alternatives: [],
      },
      {
        name: "Carcassonne",
        image: "carcassonne.jpg",
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
        name: "Chess",
        image: "chess.jpg",
        alternatives: [],
      },
      {
        name: "Chutes and Ladders",
        image: "chutes-and-ladders.jpg",
        alternatives: [],
      },
      {
        name: "Clue",
        image: "clue.jpg",
        alternatives: [],
      },
      {
        name: "Connect Four",
        image: "connect-four.jpg",
        alternatives: [],
      },
      {
        name: "Decrypto",
        image: "decrypto.jpg",
        alternatives: [],
      },
      {
        name: "Dominion",
        image: "dominion.jpg",
        alternatives: [],
      },
      {
        name: "Five Tribes",
        image: "five-tribes.jpg",
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
        name: "Gloomhaven",
        image: "gloomhaven.jpg",
        alternatives: [],
      },
      {
        name: "Guess Who",
        image: "guess-who.jpg",
        alternatives: [],
      },
      {
        name: "Hues and Clues",
        image: "hues-and-clues.jpg",
        alternatives: [],
      },
      {
        name: "Hungry Hungry Hippos",
        image: "hungry-hungry-hippos.jpg",
        alternatives: [],
      },
      {
        name: "Labyrinth",
        image: "labyrinth.jpg",
        alternatives: [],
      },
      {
        name: "Monopoly",
        image: "monopoly.jpg",
        alternatives: [],
      },
      {
        name: "Mouse Trap",
        image: "mouse-trap.jpg",
        alternatives: [],
      },
      {
        name: "Operation",
        image: "operation.jpg",
        alternatives: [],
      },
      {
        name: "Othello",
        image: "othello.jpg",
        alternatives: [],
      },
      {
        name: "Pandemic",
        image: "pandemic.jpg",
        alternatives: [],
      },
      {
        name: "Pictionary",
        image: "pictionary.jpg",
        alternatives: [],
      },
      {
        name: "Risk",
        image: "risk.jpg",
        alternatives: [],
      },
      {
        name: "Scattergories",
        image: "scattergories.jpg",
        alternatives: [],
      },
      {
        name: "Scrabble",
        image: "scrabble.jpg",
        alternatives: [],
      },
      {
        name: "Secret Hitler",
        image: "secret-hitler.jpg",
        alternatives: [],
      },
      {
        name: "Shadows Over Camelot",
        image: "shadows-over-camelot.jpg",
        alternatives: [],
      },
      {
        name: "Sorry",
        image: "sorry.jpg",
        alternatives: [],
      },
      {
        name: "Spirit Island",
        image: "spirit-island.jpg",
        alternatives: [],
      },
      {
        name: "Stratego",
        image: "stratego.jpg",
        alternatives: [],
      },
      {
        name: "Taboo",
        image: "taboo.jpg",
        alternatives: [],
      },
      {
        name: "The Game of Life",
        image: "the-game-of-life.jpg",
        alternatives: [],
      },
      {
        name: "Ticket to Ride",
        image: "ticket-to-ride.jpg",
        alternatives: [],
      },
      {
        name: "Trivial Pursuit",
        image: "trivial-pursuit.jpg",
        alternatives: [],
      },
      {
        name: "Trouble",
        image: "trouble.jpg",
        alternatives: [],
      },
      {
        name: "Twister",
        image: "twister.jpg",
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
        name: "Wingspan",
        image: "wingspan.jpg",
        alternatives: [],
      },
      {
        name: "Yahtzee",
        image: "yahtzee.jpg",
        alternatives: [],
      },
    ],
  },
  States: {
    name: "States",
    folder: "states",
    examples: [
      { name: "Alabama", image: "alabama.jpg", alternatives: [] },
      { name: "Alaska", image: "alaska.jpg", alternatives: [] },
      { name: "Arizona", image: "arizona.jpg", alternatives: [] },
      { name: "Arkansas", image: "arkansas.jpg", alternatives: [] },
      { name: "California", image: "california.jpg", alternatives: [] },
      { name: "Colorado", image: "colorado.jpg", alternatives: [] },
      { name: "Connecticut", image: "connecticut.jpg", alternatives: [] },
      { name: "Delaware", image: "delaware.jpg", alternatives: [] },
      { name: "Florida", image: "florida.jpg", alternatives: [] },
      { name: "Georgia", image: "georgia.jpg", alternatives: [] },
      { name: "Idaho", image: "idaho.jpg", alternatives: [] },
      { name: "Illinois", image: "illinois.jpg", alternatives: [] },
      { name: "Indiana", image: "indiana.jpg", alternatives: [] },
      { name: "Iowa", image: "iowa.jpg", alternatives: [] },
      { name: "Kansas", image: "kansas.jpg", alternatives: [] },
      { name: "Kentucky", image: "kentucky.png", alternatives: [] },
      { name: "Louisiana", image: "louisiana.jpg", alternatives: [] },
      { name: "Maine", image: "maine.jpg", alternatives: [] },
      { name: "Maryland", image: "maryland.jpg", alternatives: [] },
      { name: "Massachusetts", image: "massachusetts.png", alternatives: [] },
      { name: "Michigan", image: "michigan.jpg", alternatives: [] },
      { name: "Minnesota", image: "minnesota.jpg", alternatives: [] },
      { name: "Mississippi", image: "mississippi.jpg", alternatives: [] },
      { name: "Missouri", image: "missouri.jpg", alternatives: [] },
      { name: "Montana", image: "montana.jpg", alternatives: [] },
      { name: "Nebraska", image: "nebraska.jpg", alternatives: [] },
      { name: "Nevada", image: "nevada.png", alternatives: [] },
      { name: "New Jersey", image: "new-jersey.jpg", alternatives: [] },
      { name: "New Mexico", image: "new-mexico.jpg", alternatives: [] },
      { name: "New York", image: "new-york.jpg", alternatives: [] },
      { name: "North Carolina", image: "north-carolina.jpg", alternatives: [] },
      { name: "North Dakota", image: "north-dakota.jpg", alternatives: [] },
      { name: "Ohio", image: "ohio.png", alternatives: [] },
      { name: "Oklahoma", image: "oklahoma.jpg", alternatives: [] },
      { name: "Oregon", image: "oregon.jpg", alternatives: [] },
      { name: "Pennsylvania", image: "pennsylvania.jpg", alternatives: [] },
      { name: "Rhode Island", image: "rhode-island.jpg", alternatives: [] },
      { name: "South Dakota", image: "south-dakota.jpg", alternatives: [] },
      { name: "Tennessee", image: "tennessee.png", alternatives: [] },
      { name: "Texas", image: "texas.jpg", alternatives: [] },
      { name: "Utah", image: "utah.jpg", alternatives: [] },
      { name: "Vermont", image: "vermont.jpg", alternatives: [] },
      { name: "Virginia", image: "virginia.jpg", alternatives: [] },
      { name: "Washington", image: "washington.jpg", alternatives: [] },
      { name: "West Virginia", image: "west-virginia.jpg", alternatives: [] },
      { name: "Wisconsin", image: "wisconsin.jpg", alternatives: [] },
    ],
  },
  "Harry Potter characters": {
    name: "Harry Potter characters",
    folder: "harry-potter-characters",
    examples: [
      { name: "Alastor Moody", image: "alastor-moody.jpg", alternatives: [] },
      {
        name: "Albus Dumbledore",
        image: "albus-dumbledore.jpg",
        alternatives: [],
      },
      { name: "Argus Filch", image: "argus-filch.jpg", alternatives: [] },
      { name: "Arthur Weasley", image: "arthur-weasley.jpg", alternatives: [] },
      {
        name: "Barty Crouch Jr.",
        image: "barty-crouch-jr.png",
        alternatives: [],
      },
      {
        name: "Bellatrix Lestrange",
        image: "bellatrix-lestrange.jpg",
        alternatives: [],
      },
      { name: "Bill Weasley", image: "bill-weasley.jpg", alternatives: [] },
      { name: "Cedric Diggory", image: "cedric-diggory.jpg", alternatives: [] },
      {
        name: "Charlie Weasley",
        image: "charlie-weasley.jpg",
        alternatives: [],
      },
      { name: "Cho Chang", image: "cho-chang.jpg", alternatives: [] },
      {
        name: "Cornelius Fudge",
        image: "cornelius-fudge.jpg",
        alternatives: [],
      },
      { name: "Dean Thomas", image: "dean-thomas.jpg", alternatives: [] },
      { name: "Dobby", image: "dobby.jpg", alternatives: [] },
      {
        name: "Dolores Umbridge",
        image: "dolores-umbridge.jpg",
        alternatives: [],
      },
      { name: "Draco Malfoy", image: "draco-malfoy.jpg", alternatives: [] },
      {
        name: "Fenrir Greyback",
        image: "fenrir-greyback.jpg",
        alternatives: [],
      },
      { name: "Fred Weasley", image: "fred-weasley.jpg", alternatives: [] },
      { name: "George Weasley", image: "george-weasley.jpg", alternatives: [] },
      {
        name: "Gilderoy Lockhart",
        image: "gilderoy-lockhart.jpg",
        alternatives: [],
      },
      { name: "Ginny Weasley", image: "ginny-weasley.jpg", alternatives: [] },
      { name: "Harry Potter", image: "harry-potter.jpg", alternatives: [] },
      {
        name: "Hermione Granger",
        image: "hermione-granger.jpg",
        alternatives: [],
      },
      {
        name: "Horace Slughorn",
        image: "horace-slughorn.jpg",
        alternatives: [],
      },
      { name: "Igor Karkaroff", image: "igor-karkaroff.jpg", alternatives: [] },
      {
        name: "Kingsley Shacklebolt",
        image: "kingsley-shacklebolt.jpg",
        alternatives: [],
      },
      { name: "Kreacher", image: "kreacher.jpg", alternatives: [] },
      { name: "Lavender Brown", image: "lavender-brown.jpg", alternatives: [] },
      { name: "Lord Voldemort", image: "lord-voldemort.jpg", alternatives: [] },
      { name: "Lucius Malfoy", image: "lucius-malfoy.jpg", alternatives: [] },
      { name: "Luna Lovegood", image: "luna-lovegood.jpg", alternatives: [] },
      {
        name: "Minerva McGonagall",
        image: "minerva-mcgonagall.jpg",
        alternatives: [],
      },
      { name: "Molly Weasley", image: "molly-weasley.jpg", alternatives: [] },
      {
        name: "Narcissa Malfoy",
        image: "narcissa-malfoy.jpg",
        alternatives: [],
      },
      {
        name: "Neville Longbottom",
        image: "neville-longbottom.jpg",
        alternatives: [],
      },
      {
        name: "Nymphadora Tonks",
        image: "nymphadora-tonks.jpg",
        alternatives: [],
      },
      { name: "Padma Patil", image: "padma-patil.jpg", alternatives: [] },
      { name: "Parvati Patil", image: "parvati-patil.jpg", alternatives: [] },
      { name: "Percy Weasley", image: "percy-weasley.jpg", alternatives: [] },
      {
        name: "Peter Pettigrew",
        image: "peter-pettigrew.jpg",
        alternatives: [],
      },
      { name: "Pomona Sprout", image: "pomona-sprout.jpg", alternatives: [] },
      { name: "Remus Lupin", image: "remus-lupin.jpg", alternatives: [] },
      { name: "Rita Skeeter", image: "rita-skeeter.jpg", alternatives: [] },
      { name: "Ron Weasley", image: "ron-weasley.jpg", alternatives: [] },
      { name: "Rubeus Hagrid", image: "rubeus-hagrid.png", alternatives: [] },
      {
        name: "Seamus Finnigan",
        image: "seamus-finnigan.jpg",
        alternatives: [],
      },
      { name: "Severus Snape", image: "severus-snape.jpg", alternatives: [] },
      { name: "Sirius Black", image: "sirius-black.jpg", alternatives: [] },
      {
        name: "Sybil Trelawney",
        image: "sybil-trelawney.jpg",
        alternatives: [],
      },
      { name: "Viktor Krum", image: "viktor-krum.jpg", alternatives: [] },
    ],
  },
  "Spirit Halloween Catalogue": {
    name: "Spirit Halloween Catalogue",
    folder: "spirit-halloween-catalogue",
    examples: [
      { name: "Angel", image: "angel.jpg", alternatives: [] },
      { name: "Astronaut", image: "astronaut.jpg", alternatives: [] },
      { name: "Banana suit", image: "banana-suit.jpg", alternatives: [] },
      { name: "Batman", image: "batman.jpg", alternatives: [] },
      { name: "Beetlejuice", image: "beetlejuice.jpg", alternatives: [] },
      { name: "Cat costume", image: "cat-costume.jpg", alternatives: [] },
      { name: "Cheerleader", image: "cheerleader.jpg", alternatives: [] },
      { name: "Chucky", image: "chucky.jpg", alternatives: [] },
    ],
  },
  "Superheros": {
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
        name: "Wonder Woman",
        image: "wonder-woman.jpg",
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
        name: "Thor",
        image: "thor.jpg",
        alternatives: [],
      },
      {
        name: "Hulk",
        image: "hulk.jpg",
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
        name: "Green Lantern",
        image: "green-lantern.jpg",
        alternatives: [],
      },
      {
        name: "Aquaman",
        image: "aquaman.jpg",
        alternatives: [],
      },
      {
        name: "Cyborg",
        image: "cyborg.jpg",
        alternatives: [],
      },
      {
        name: "Deadpool",
        image: "deadpool.png",
        alternatives: [],
      },
      {
        name: "Daredevil",
        image: "daredevil.jpg",
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
        name: "Ant-Man",
        image: "ant-man.jpg",
        alternatives: [],
      },
      {
        name: "The Wasp",
        image: "the-wasp.jpg",
        alternatives: [],
      },
      {
        name: "Captain Marvel",
        image: "captain-marvel.jpg",
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
        name: "Drax",
        image: "drax.jpg",
        alternatives: [],
      },
      {
        name: "Rocket Raccoon",
        image: "rocket-raccoon.jpg",
        alternatives: [],
      },
      {
        name: "Groot",
        image: "groot.jpg",
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
        name: "Nightwing",
        image: "nightwing.jpg",
        alternatives: [],
      },
      {
        name: "Robin",
        image: "robin.jpg",
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
        name: "Professor X",
        image: "professor-x.jpg",
        alternatives: [],
      },
      {
        name: "Silver Surfer",
        image: "silver-surfer.jpg",
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
        name: "Hawkeye",
        image: "hawkeye.jpg",
        alternatives: [],
      },
      {
        name: "Martian Manhunter",
        image: "martian-manhunter.jpg",
        alternatives: [],
      },
    ],
  },
  "Video Game Characters": {
    name: "Video Game Characters",
    folder: "video-game-characters",
    examples: [
      {
        name: "Mario",
        image: "mario.png",
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
        name: "Link",
        image: "link.png",
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
        name: "Donkey Kong",
        image: "donkey-kong.jpg",
        alternatives: [],
      },
      {
        name: "Pikachu",
        image: "pikachu.png",
        alternatives: [],
      },
      {
        name: "Sonic the Hedgehog",
        image: "sonic-the-hedgehog.jpg",
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
        name: "Dr. Eggman",
        image: "dr-eggman.png",
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
        name: "Pac-Man",
        image: "pac-man.png",
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
        name: "Cloud Strife",
        image: "cloud-strife.jpg",
        alternatives: [],
      },
      {
        name: "Sephiroth",
        image: "sephiroth.jpg",
        alternatives: [],
      },
      {
        name: "Solid Snake",
        image: "solid-snake.png",
        alternatives: [],
      },
      {
        name: "Master Chief",
        image: "master-chief.png",
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
        name: "Lara Croft",
        image: "lara-croft.png",
        alternatives: [],
      },
      {
        name: "Geralt of Rivia",
        image: "geralt-of-rivia.jpg",
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
        name: "Arthur Morgan",
        image: "arthur-morgan.jpg",
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
        name: "Rayman",
        image: "rayman.jpg",
        alternatives: [],
      },
      {
        name: "Sora",
        image: "sora.jpg",
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
        name: "Agent 47",
        image: "agent-47.jpg",
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
        name: "Yoshi",
        image: "yoshi.jpg",
        alternatives: [],
      },
      {
        name: "Princess Zelda",
        image: "princess-zelda.jpg",
        alternatives: [],
      },
    ],
  },
  "City Skylines": {
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
        name: "Shanghai",
        image: "shanghai.jpg",
        alternatives: [],
      },
      {
        name: "Dubai",
        image: "dubai.jpg",
        alternatives: [],
      },
      {
        name: "Chicago",
        image: "chicago.jpg",
        alternatives: [],
      },
      {
        name: "Hong Kong",
        image: "hong-kong.jpg",
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
        name: "Seoul",
        image: "seoul.jpg",
        alternatives: [],
      },
      {
        name: "Los Angeles",
        image: "los-angeles.jpg",
        alternatives: [],
      },
      {
        name: "San Francisco",
        image: "san-francisco.jpg",
        alternatives: [],
      },
      {
        name: "Seattle",
        image: "seattle.jpg",
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
        name: "Taipei",
        image: "taipei.jpg",
        alternatives: [],
      },
      {
        name: "Melbourne",
        image: "melbourne.jpg",
        alternatives: [],
      },
      {
        name: "Vancouver",
        image: "vancouver.jpg",
        alternatives: [],
      },
      {
        name: "Panama City",
        image: "panama-city.jpg",
        alternatives: [],
      },
      {
        name: "Miami",
        image: "miami.jpg",
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
        name: "Las Vegas",
        image: "las-vegas.jpg",
        alternatives: [],
      },
      {
        name: "Madrid",
        image: "madrid.jpg",
        alternatives: [],
      },
      {
        name: "Barcelona",
        image: "barcelona.jpg",
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
        name: "Johannesburg",
        image: "johannesburg.jpg",
        alternatives: [],
      },
      {
        name: "Mumbai",
        image: "mumbai.jpg",
        alternatives: [],
      },
      {
        name: "Delhi",
        image: "delhi.jpg",
        alternatives: [],
      },
      {
        name: "Beijing",
        image: "beijing.jpg",
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
        name: "Mexico City",
        image: "mexico-city.jpg",
        alternatives: [],
      },
      {
        name: "Buenos Aires",
        image: "buenos-aires.jpg",
        alternatives: [],
      },
      {
        name: "Sao Paulo",
        image: "sao-paulo.jpg",
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
    ],
  },
};
