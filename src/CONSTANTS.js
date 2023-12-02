module.exports = {
  VALUES: {
    NUM_CROP_TILES: 60,
    ORDER_REFRESH_COOLDOWN: 900000,
    TimeFeritilizeDuration: 600000, //ms duration of time fertilizer
    SEASON_GROWTH_BUFF: 0.15, // 15% faster crop growth for current season crops
    SEASON_ANIMAL_BUFF: 0.10, // 10% faster animal production in season
  },
  cropSeasons: {
    spring: ["bamboo_seeds", "parsnip_seeds", "hops_seeds", "melon_seeds", "carrot_seeds"],
    summer: ["blueberry_seeds", "strawberry_seeds", "potato_seeds", "oats_seeds", "cauliflower_seeds"],
    fall: ["yam_seeds", "grape_seeds", "beet_seeds", "pumpkin_seeds", "corn_seeds"],
    winter: []
  },
  animalSeasons: {
      spring: ["chicken", "duck", "quail", "ostrich", "kiwi"],
      summer: [],
      fall: ["cow", "yak", "sheep", "goat", "llama"],
      winter: []
  },
  fertilizerInfo: {
    YieldsFertilizer: "Next 10 harvests receive higher yields",
    HarvestsFertilizer: "Next 5 seeds plants receive 1 extra harvest",
    TimeFertilizer: "Double growth speed for next 10 minutes",
  },
  yieldFertilizerBonuses: {
    carrot_seeds: 2,
    melon_seeds: 1,
    cauliflower_seeds: 1,
    pumpkin_seeds: 1,
    yam_seeds: 2,
    beet_seeds: 2,
    parsnip_seeds: 2,
    bamboo_seeds: 3,
    hops_seeds: 3,
    corn_seeds: 2,
    potato_seeds: 2,
    blueberry_seeds: 3,
    grape_seeds: 2,
    oats_seeds: 2,
    strawberry_seeds: 2,
  },
  // CropIDS are for the integer ID's for different crops in SQL tile table
  ProduceIDs: {
    carrot_seeds: 1,
    melon_seeds: 2,
    cauliflower_seeds: 3,
    pumpkin_seeds: 4,
    yam_seeds: 5,
    beet_seeds: 6,
    parsnip_seeds: 7,
    bamboo_seeds: 8,
    hops_seeds: 9,
    corn_seeds: 10,
    potato_seeds: 11,
    blueberry_seeds: 12,
    grape_seeds: 13,
    oats_seeds: 14,
    strawberry_seeds: 15,
  },
  // CropNames is the exact inverse of above, to easily get names from id's, first index is null for indexing
  ProduceNameFromID: [
    null,
    "carrot_seeds",
    "melon_seeds",
    "cauliflower_seeds",
    "pumpkin_seeds",
    "yam_seeds",
    "beet_seeds",
    "parsnip_seeds",
    "bamboo_seeds",
    "hops_seeds",
    "corn_seeds",
    "potato_seeds",
    "blueberry_seeds",
    "grape_seeds",
    "oats_seeds",
    "strawberry_seeds",
  ],
  // Maps seeds to what crop they make, key is seed name, value is array of [crop_name, qty per harvest, total_harvests] produced
  SeedCropMap: {
    carrot_seeds: ["carrot", 3, 2],
    melon_seeds: ["melon", 1, 1],
    cauliflower_seeds: ["cauliflower", 1, 1],
    pumpkin_seeds: ["pumpkin", 1, 1],
    yam_seeds: ["yam", 4, 3],
    beet_seeds: ["beet", 4, 3],
    parsnip_seeds: ["parsnip", 2, 1],
    bamboo_seeds: ["bamboo", 5, 4],
    hops_seeds: ["hops", 1, 3],
    corn_seeds: ["corn", 1, 3],
    potato_seeds: ["potato", 3, 3],
    blueberry_seeds: ["blueberry", 6, 5],
    grape_seeds: ["grape", 6, 5],
    oats_seeds: ["oats", 4, 4],
    strawberry_seeds: ["strawberry", 3, 4],
  },
  // Fixed prices is for prices of things you buy from the game (seeds, animals)
  //
  Fixed_Prices: {
    carrot_seeds: 25,
    melon_seeds: 25,
    cauliflower_seeds: 25,
    pumpkin_seeds: 25,
    yam_seeds: 20,
    beet_seeds: 25,
    parsnip_seeds: 25,
    bamboo_seeds: 20,
    hops_seeds: 25,
    corn_seeds: 25,
    potato_seeds: 20,
    blueberry_seeds: 40,
    grape_seeds: 40,
    oats_seeds: 15,
    strawberry_seeds: 22,
  },
  //
  Init_Market_Prices: {
    carrot: 8,
    melon: 100,
    cauliflower: 100,
    pumpkin: 100,
    yam: 25,
    beet: 18,
    parsnip: 15,
    bamboo: 6,
    hops: 8,
    corn: 9,
    potato: 8,
    blueberry: 5,
    grape: 6,
    oats: 4,
    strawberry: 10,

    cow_milk: 35,
    chicken_egg: 25,
    duck_egg: 30,
    quail_egg: 30,
    yak_milk: 60,
    sheep_wool: 50,
    goat_milk: 30,
    ostrich_egg: 150,
    llama_wool: 80,
    kiwi_egg: 125,
  },
  // key: type, array is [building, cost]
  AnimalTypes: {
    cow: ["barn", 300],
    chicken: ["coop", 175],
    duck: ["coop", 400],
    quail: ["coop", 500],
    yak: ["barn", 600],
    sheep: ["barn", 400],
    goat: ["barn", 500],
    ostrich: ["coop", 900],
    llama: ["barn", 700],
    kiwi: ["coop", 800],
  },
  // default time per collect in seconds
  // [ display name , more details ]
  InventoryDescriptions: {
    carrot_seeds: ["Carrot Seeds", "High yield, medium growth time"],
    melon_seeds: ["Melon Seeds", "Low yield, very long growth time"],
    corn_seeds: ["Corn Seeds", "Medium yield, medium growth time"],
    cauliflower_seeds: ["Cauliflower Seeds", "Low yield, long growth time"],
    pumpkin_seeds: ["Pumpkin Seeds", "Low yield, very long growth time"],
    yam_seeds: ["Yam Seeds", "Medium yield, medium growth time"],
    beet_seeds: ["Beet Seeds", "Medium yield, medium growth time"],
    parsnip_seeds: ["Parsnip Seeds", "Medium yield, medium growth time"],
    bamboo_seeds: ["Bamboo Seeds", "High yield, short growth time"],
    hops_seeds: ["Hops Seeds", "High yield, medium growth time"],
    potato_seeds: ["Potato Seeds", "High yield, medium growth time"],
    blueberry_seeds: [
      "Blueberry Seeds",
      "High yield, high initial growth time with short regrowth",
    ],
    grape_seeds: [
      "Grape Seeds",
      "High yield, high initial growth time with short regrowth",
    ],
    oats_seeds: ["Oat Seeds", "High yield, short growth time"],
    strawberry_seeds: ["Strawberry Seeds", "Medium yield, long growth time"],
    cow: ["Cow", "Produces milk"],
    chicken: ["Chicken", "Produces eggs"],
    duck: ["Duck", "Produces duck eggs"],
    quail: ["Quail", "Produces quail eggs"],
    yak: ["Yak", "Produces yak milk"],
    sheep: ["Sheep", "Produces sheep wool"],
    goat: ["Goat", "Produces goat milk"],
    ostrich: ["Ostrich", "Produces ostrich eggs"],
    llama: ["Llama", "Produces llama wool"],
    kiwi: ["Kiwi", "Produces kiwi egg"],
    carrot: ["Carrot", "Flora"],
    melon: ["Melon", "Flora"],
    cauliflower: ["Cauliflower", "Flora"],
    pumpkin: ["Pumpkin", "Flora"],
    yam: ["Yam", "Flora"],
    beet: ["Beet", "Flora"],
    parsnip: ["Parsnip", "Flora"],
    bamboo: ["Bamboo", "Flora"],
    hops: ["Hops", "Flora"],
    corn: ["Corn", "Flora"],
    potato: ["Potato", "Flora"],
    blueberry: ["Blueberries", "Flora"],
    grape: ["Grapes", "Flora"],
    oats: ["Oats", "Flora"],
    strawberry: ["Strawberry", "Flora"],
    cow_milk: ["Cow Milk", "Produce"],
    chicken_egg: ["Chicken Egg", "Produce"],
    duck_egg: ["Duck Egg", "Produce"],
    quail_egg: ["Quail Egg", "Produce"],
    yak_milk: ["Yak Milk", "Produce"],
    sheep_wool: ["Sheep Wool", "Produce"],
    goat_milk: ["Goat Milk", "Produce"],
    ostrich_egg: ["Ostrich Egg", "Produce"],
    llama_wool: ["Llama Wool", "Produce"],
    kiwi_egg: ["Kiwi Egg", "Produce"],
    Balance: ["Money", "Currency"],
    XP: ["XP", "Experience points"],
  },
  InventoryDescriptionsPlural: {
    carrot_seeds: ["Carrot Seeds", "High yield, medium growth time"],
    melon_seeds: ["Melon Seeds", "Low yield, very long growth time"],
    corn_seeds: ["Corn Seeds", "Medium yield, medium growth time"],
    cauliflower_seeds: ["Cauliflower Seeds", "Low yield, long growth time"],
    pumpkin_seeds: ["Pumpkin Seeds", "Low yield, very long growth time"],
    yam_seeds: ["Yam Seeds", "Medium yield, medium growth time"],
    beet_seeds: ["Beet Seeds", "Medium yield, medium growth time"],
    parsnip_seeds: ["Parsnip Seeds", "Medium yield, medium growth time"],
    bamboo_seeds: ["Bamboo Seeds", "High yield, short growth time"],
    hops_seeds: ["Hops Seeds", "High yield, medium growth time"],
    potato_seeds: ["Potato Seeds", "High yield, medium growth time"],
    blueberry_seeds: [
      "Blueberry Seeds",
      "High yield, high initial growth time with short regrowth",
    ],
    grape_seeds: [
      "Grape Seeds",
      "High yield, high initial growth time with short regrowth",
    ],
    oats_seeds: ["Oats Seeds", "High yield, short growth time"],
    strawberry_seeds: ["Strawberry Seeds", "Medium yield, long growth time"],
    cow: ["Cows", "Produces milk"],
    chicken: ["Chickens", "Produces eggs"],
    duck: ["Ducks", "Produces duck eggs"],
    quail: ["Quail", "Produces quail eggs"],
    yak: ["Yaks", "Produces yak milk"],
    sheep: ["Sheep", "Produces sheep wool"],
    goat: ["Goats", "Produces goat milk"],
    ostrich: ["Ostriches", "Produces ostrich eggs"],
    llama: ["Llamas", "Produces llama wool"],
    kiwi: ["Kiwis", "Produces kiwi egg"],
    carrot: ["Carrots", "Flora"],
    melon: ["Melons", "Flora"],
    cauliflower: ["Cauliflowers", "Flora"],
    pumpkin: ["Pumpkins", "Flora"],
    yam: ["Yams", "Flora"],
    beet: ["Beets", "Flora"],
    parsnip: ["Parsnips", "Flora"],
    bamboo: ["Bamboo", "Flora"],
    hops: ["Hops", "Flora"],
    corn: ["Corn", "Flora"],
    potato: ["Potatoes", "Flora"],
    blueberry: ["Blueberries", "Flora"],
    grape: ["Grapes", "Flora"],
    oats: ["Oats", "Flora"],
    strawberry: ["Strawberries", "Flora"],
    cow_milk: ["Cow Milk", "Produce"],
    chicken_egg: ["Chicken Eggs", "Produce"],
    duck_egg: ["Duck Eggs", "Produce"],
    quail_egg: ["Quail Eggs", "Produce"],
    yak_milk: ["Yak Milk", "Produce"],
    sheep_wool: ["Sheep Wool", "Produce"],
    goat_milk: ["Goat Milk", "Produce"],
    ostrich_egg: ["Ostrich Eggs", "Produce"],
    llama_wool: ["Llama Wool", "Produce"],
    kiwi_egg: ["Kiwi Eggs", "Produce"],
    Balance: ["Money", "Currency"],
    multiharvest: ["Multiharvest tool", "Tool"],
    multiplant: ["Multiplant tool", "Tool"],
  },
  // For each permit type, what crops and animals it permits
  Permits: {
    deluxeCrops: ["grape_seeds", "bamboo_seeds", "hops_seeds"],
    exoticAnimals: ["quail", "llama", "kiwi"],
  },
  // Luxury goods have a artifical bonus in market prices of 5% and higher floors, usually from deluxe/exotics or things that need permits / higher costs
  LuxuryGoods: ["grape", "bamboo", "hops"],
  // What crops are unlocked at each XP threshold
  // The index is level (starting at 0) and the value is the number of total XP needed for the non formulaic beginning levels. This is level 1-15. Everything after that is
  // a level every 600 XP-
  xpToLevel: [
    0, 45, 120, 190, 250, 350, 500, 650, 800, 1150, 1500, 1900, 2300, 2700,
    3100, 3500,
  ],
  // what is unlocked at every unlock level
  levelUnlocks: {
    0: ["carrot_seeds", "oats_seeds", "corn_seeds", "cow", "chicken"],
    1: ["potato_seeds"],
    2: ["parsnip_seeds"],
    4: ["cauliflower_seeds", "beet_seeds"],
    8: ["pumpkin_seeds"],
    10: ["hops_seeds", "sheep"],
    15: ["bamboo_seeds"],
    20: ["melon_seeds", "yam_seeds", "multiharvest", "multiplant"],
    25: ["llama", "goat"],
    30: ["yak", "duck"],
    35: ["blueberry_seeds"],
    40: ["grape_seeds", "quail"],
    45: ["ostrich"],
    50: ["strawberry_seeds", "kiwi"],
  },
  shopOrder: [
    "carrot_seeds",
    "oats_seeds",
    "corn_seeds",
    "cow",
    "chicken",
    "potato_seeds",
    "parsnip_seeds",
    "cauliflower_seeds",
    "beet_seeds",
    "pumpkin_seeds",
    "hops_seeds",
    "sheep",
    "bamboo_seeds",
    "melon_seeds",
    "yam_seeds",
    "llama",
    "goat",
    "yak",
    "duck",
    "blueberry_seeds",
    "grape_seeds",
    "quail",
    "ostrich",
    "strawberry_seeds",
    "kiwi",
  ],
  // the xp you get from harvesting/collecting this thing once total, not per item (ex: total for grape tile harvest, not per grape)
  XP: {
    carrot: 4,
    melon: 10,
    cauliflower: 10,
    pumpkin: 10,
    yam: 5,
    beet: 4,
    parsnip: 4,
    bamboo: 2,
    hops: 4,
    corn: 3,
    potato: 4,
    blueberry: 2,
    grape: 2,
    oats: 3,
    strawberry: 5,

    cow_milk: 8,
    chicken_egg: 6,
    duck_egg: 8,
    quail_egg: 8,
    yak_milk: 9,
    sheep_wool: 7,
    goat_milk: 7,
    ostrich_egg: 12,
    llama_wool: 12,
    kiwi_egg: 12,
  },
};
