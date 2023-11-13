module.exports = {
  // TODO: REMOVE THIS
  upgradeBoosts: {
    growthPerkLevel: [0, 0.05, 0.1, 0.15, 0.2, 0.25],
    partsPerkLevel: [0, 0.25, 0.5, 0.75, 1, 1.5],
    orderRefreshPerkLevel: [0, 0.25, 0.5, 0.75, 1, 1.5],
    animalPerkLevel: [0, 0.05, 0.1, 0.15, 0.2, 0.25],
  },
  perkNames: {
    cropTimeLevel: "Faster crop growth time",
    animalTimeLevel: "Faster animal produce time",
    partsChanceLevel: "Higher machine parts chance",
    orderRefreshLevel: "Faster order board refresh cooldown ",
    happinessMultiplierLevel: "Animal food happiness boost"
  },
  townIcons: [
    "corn",
    "grape",
    "hops",
    "parsnip",
    "kiwi",
    "chicken",
    "cow",
    "ostrich",
  ],
  // The townFunds required to purchase that level (level is index + 1) from previous level
  perkCosts: {
    cropTimeLevel: [1000, 2000, 3000, 5000, 8000, 12000, 18000, 25000, 30000, 35000, 50000, 100000, 150000, 200000, 250000],
    animalTimeLevel: [1000, 2000, 3000, 5000, 8000, 12000, 18000, 25000, 30000, 35000, 50000, 100000, 150000, 200000, 250000],
    partsChanceLevel: [1000, 2000, 3000, 5000, 8000, 12000, 18000, 25000, 30000, 35000, 50000, 100000, 150000, 200000, 250000],
    orderRefreshLevel: [1000, 2000, 3000, 5000, 8000, 12000, 18000, 25000, 30000, 35000, 50000, 100000, 150000, 200000, 250000],
    happinessMultiplierLevel: [1000, 2000, 3000, 5000, 8000, 12000, 18000, 25000, 30000, 35000, 50000, 100000, 150000, 200000, 250000],
  },
  // The percent boost this level gives
  perkBoosts: {
    cropTimeLevel: [0.03, 0.05, 0.08, 0.10, 0.13, 0.15, 0.18, 0.20, 0.23, 0.26, 0.30, 0.35, 0.40, 0.45, 0.50],
    animalTimeLevel: [0.03, 0.05, 0.08, 0.10, 0.13, 0.15, 0.18, 0.20, 0.23, 0.26, 0.30, 0.35, 0.40, 0.45, 0.50],
    partsChanceLevel: [0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.45, 0.60, 0.80, 1.00, 1.25, 1.50, 1.75, 2.00],
    orderRefreshLevel: [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.85, 1.00, 1.25, 1.5, 1.75, 2.0, 2.25, 2.50, 3.00],
    happinessMultiplierLevel: [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.85, 1.00, 1.15, 1.30, 1.35, 1.5, 1.65, 1.80, 2.00],
  },

  goalQuantities: {
    carrot: 30000,
    melon: 900,
    cauliflower: 900,
    pumpkin: 900,
    yam: 6500,
    beet: 12000,
    parsnip: 16000,
    bamboo: 30000,
    hops: 28000,
    corn: 30000,
    potato: 30000,
    blueberry: 40000,
    grape: 35000,
    oats: 64000,
    strawberry: 20000,
    cow_milk: 625,
    chicken_egg: 625,
    duck_egg: 500,
    quail_egg: 250,
    yak_milk: 500,
    sheep_wool: 625,
    goat_milk: 625,
    ostrich_egg: 125,
    llama_wool: 375,
    kiwi_egg: 125,
  },
  // TODO: REMOVE THIS
  townLevelForPerks: {
    // The town level at which you unlock the level that is the index. For example growthPerk[3] is level x. So you need to be level x to get growthPerk level 3
    // Each perk has 6 total levels, including 0
    growthPerk: [0, 1, 5, 9, 13, 17],
    partsPerk: [0, 2, 6, 10, 14, 18],
    animalPerk: [0, 3, 7, 11, 15, 19],
    orderRefreshPerk: [0, 4, 8, 12, 16, 20],
  },
  // TODO: REMOVE THIS
  // XP needed to get to next level, ex: townLevels[5] is 6000, so to get from level 4 to 5 you need 6000 more XP
  townLevels: [
    0, 3000, 4000, 5000, 5000, 7000, 8500, 10000, 11000, 12000, 13000, 14500,
    16000, 17000, 18000, 19000, 20000, 22000, 24000, 25000, 28000,
  ],
};
