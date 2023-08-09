module.exports = {
    // costs for each upgrade, num of upgrade is length 
    // default [******* BALANCED ******
    UpgradeCosts: {
        exoticPermit: [20000],
        deluxePermit: [20000],
        barnCollectTimeUpgrade: [8000, 15000],
        barnCollectQuantityUpgrade: [9000, 15000],
        barnCapacityUpgrade: [5000, 10000],
        coopCollectTimeUpgrade: [8000, 16000],
        coopCollectQuantityUpgrade: [8000, 12000],
        coopCapacityUpgrade: [5000, 10000],
        plantGrowthTimeUpgrade: [6000, 12000],
        plantHarvestQuantityUpgrade: [8000, 15000],
        plantNumHarvestsUpgrade: [9000, 15000],
    },
    UpgradeDescriptions: {
        exoticPermit: ["Exotic Animals", "Allows the farmer to handle exotic animals"],
        deluxePermit: ["Deluxe Crops", "Allows the farmer to plant luxury crops"],
        barnCollectTimeUpgrade: ["Barn Collect", "Increases barn animal production speed"],
        barnCollectQuantityUpgrade: ["Barn Quantity", "Increases the yield of barn animals"],
        barnCapacityUpgrade: ["Barn Capacity", "Increases the total barn capacity"],
        coopCollectTimeUpgrade: ["Coop Collect", "Increases Coop animal production speed"],
        coopCollectQuantityUpgrade: ["Coop Quantity", "Increases the yield of coop animals"],
        coopCapacityUpgrade: ["Coop Capacity", "Increases the total coop capacity"],
        plantGrowthTimeUpgrade: ["Crop Growth Time", "Decreases total crop growth time"],
        plantHarvestQuantityUpgrade: ["Crop Harvest Quantity", "Increases per harvest crop yields"],
        plantNumHarvestsUpgrade: ["Crop Num Harvests", "Increases total harvests for multi harvest crops"],

    },
    // default [******* BALANCED *******]
    GrowthTimes0: {
        carrot_seeds: [210, 90],
        melon_seeds: [2400, 2400, 2400, 3600],
        cauliflower_seeds: [1350, 1350, 1350, 1350],
        pumpkin_seeds: [1350, 1350, 1350, 1350],
        yam_seeds: [60, 60, 60],
        beet_seeds: [90, 60],
        parsnip_seeds: [120, 60],
        bamboo_seeds: [30, 30, 30],
        hops_seeds: [112, 112, 75],
        corn_seeds: [15, 25, 20, 15],
        potato_seeds: [360, 90],
        blueberry_seeds: [450, 450, 60],
        grape_seeds: [900, 900, 60],
        oats_seeds: [11, 11, 8],
        strawberry_seeds: [375, 375, 300]
    },
    // 1st upgrade [******* BALANCED *******]
    GrowthTimes1: {
        carrot_seeds: [160, 70],
        melon_seeds: [1500, 1500, 2000, 1500],
        cauliflower_seeds: [1000, 1000, 1000, 1500],
        pumpkin_seeds: [1200, 1200, 1400, 1400],
        yam_seeds: [55, 55, 50],
        beet_seeds: [80, 50],
        parsnip_seeds: [110, 50],
        bamboo_seeds: [25, 25, 25],
        hops_seeds: [100, 100, 60],
        corn_seeds: [12, 22, 20, 12],
        potato_seeds: [300, 80],
        blueberry_seeds: [330, 330, 50],
        grape_seeds: [330, 330, 50],
        oats_seeds: [7, 13, 6],
        strawberry_seeds: [325, 325, 250]
    },
    // 2nd upgrade [******* BALANCED *******]
    GrowthTimes2: {
        carrot_seeds: [100, 40],
        melon_seeds: [1000, 1200, 1300, 1000],
        cauliflower_seeds: [800, 1000, 1000, 1200],
        pumpkin_seeds: [1200, 1400, 1200, 1400],
        yam_seeds: [50, 50, 45],
        beet_seeds: [70, 40],
        parsnip_seeds: [100, 45],
        bamboo_seeds: [20, 20, 20],
        hops_seeds: [80, 80, 40],
        corn_seeds: [15, 15, 15, 10],
        potato_seeds: [180, 40],
        blueberry_seeds: [200, 200, 40],
        grape_seeds: [200, 200, 40],
        oats_seeds: [7, 8, 4],
        strawberry_seeds: [175, 175, 160]
    },
    // [******* BALANCED *******]
    NumHarvests0: {
        carrot_seeds: 2,
        melon_seeds: 1,
        cauliflower_seeds: 1,
        pumpkin_seeds: 1,
        yam_seeds: 1,
        beet_seeds: 1,
        parsnip_seeds: 1,
        bamboo_seeds: 2,
        hops_seeds: 2,
        corn_seeds: 2,
        potato_seeds: 2,
        blueberry_seeds: 3,
        grape_seeds: 3,
        oats_seeds: 3,
        strawberry_seeds: 2
    },
    // [******* BALANCED *******]
    NumHarvests1: {
        carrot_seeds: 3,
        melon_seeds: 1,
        cauliflower_seeds: 1,
        pumpkin_seeds: 2,
        yam_seeds: 2,
        beet_seeds: 2,
        parsnip_seeds: 2,
        bamboo_seeds: 3,
        hops_seeds: 3,
        corn_seeds: 3,
        potato_seeds: 3,
        blueberry_seeds: 4,
        grape_seeds: 4,
        oats_seeds: 3,
        strawberry_seeds: 3
    },
    // [******* BALANCED *******]
    NumHarvests2: {
        carrot_seeds: 3,
        melon_seeds: 1,
        cauliflower_seeds: 2,
        pumpkin_seeds: 2,
        yam_seeds: 2,
        beet_seeds: 2,
        parsnip_seeds: 2,
        bamboo_seeds: 3,
        hops_seeds: 3,
        corn_seeds: 4,
        potato_seeds: 3,
        blueberry_seeds: 5,
        grape_seeds: 5,
        oats_seeds: 4,
        strawberry_seeds: 3
    },
    // [******* BALANCED *******]
    PlantQuantityYields0: {
        carrot_seeds: 4,
        melon_seeds: 1,
        cauliflower_seeds: 1,
        pumpkin_seeds: 1,
        yam_seeds: 3,
        beet_seeds: 3,
        parsnip_seeds: 3,
        bamboo_seeds: 5,
        hops_seeds: 4,
        corn_seeds: 3,
        potato_seeds: 4,
        blueberry_seeds: 6,
        grape_seeds: 5,
        oats_seeds: 3,
        strawberry_seeds: 3
    },
    // [******* BALANCED *******] 
    PlantQuantityYields1: {
        carrot_seeds: 4,
        melon_seeds: 1,
        cauliflower_seeds: 2,
        pumpkin_seeds: 1,
        yam_seeds: 3,
        beet_seeds: 3,
        parsnip_seeds: 4,
        bamboo_seeds: 5,
        hops_seeds: 5,
        corn_seeds: 4,
        potato_seeds: 5,
        blueberry_seeds: 6,
        grape_seeds: 4,
        oats_seeds: 3,
        strawberry_seeds: 3
    },
    // [******* BALANCED *******] 
    PlantQuantityYields2: {
        carrot_seeds: 5,
        melon_seeds: 2,
        cauliflower_seeds: 2,
        pumpkin_seeds: 2,
        yam_seeds: 4,
        beet_seeds: 4,
        parsnip_seeds: 5,
        bamboo_seeds: 6,
        hops_seeds: 6,
        corn_seeds: 4,
        potato_seeds: 5,
        blueberry_seeds: 6,
        grape_seeds: 5,
        oats_seeds: 4,
        strawberry_seeds: 5
    },
    // how much of an increase in capacity for purchasing that level
    // default [******* BALANCED ******
    CapacityIncreases: {
        Barn: [4, 4, 4],
        Coop: [4, 6, 4]
    },
    // barn and coop upgrades, go to the table for the levels [******* BALANCED *******]
    AnimalCollectTimes0: {
        "cow": [240],
        "chicken": [120],
        "duck": [180],
        "quail": [220],
        "yak": [400],
        "sheep": [360],
        "goat": [220],
        "ostrich": [900],
        "llama": [400],
        "kiwi": [660]
    },
    // [******* BALANCED *******]
    AnimalProduceMap0: {
        "cow": ["cow_milk", 1],
        "chicken": ["chicken_egg", 1],
        "duck": ["duck_egg", 1],
        "quail": ["quail_egg", 1],
        "yak": ["yak_milk", 1],
        "sheep": ["sheep_wool", 1],
        "goat": ["goat_milk", 1],
        "ostrich": ["ostrich_egg", 1],
        "llama": ["llama_wool", 1],
        "kiwi": ["kiwi_egg", 1]
    },
    // [******* BALANCED *******]
    AnimalCollectTimes1: {
        "cow": [200],
        "chicken": [120],
        "duck": [155],
        "quail": [200],
        "yak": [300],
        "sheep": [280],
        "goat": [160],
        "ostrich": [450],
        "llama": [350],
        "kiwi": [420]
    },
    // [******* BALANCED *******]
    AnimalProduceMap1: {
        "cow": ["cow_milk", 2],
        "chicken": ["chicken_egg", 2],
        "duck": ["duck_egg", 2],
        "quail": ["quail_egg", 2],
        "yak": ["yak_milk", 1],
        "sheep": ["sheep_wool", 2],
        "goat": ["goat_milk", 2],
        "ostrich": ["ostrich_egg", 1],
        "llama": ["llama_wool", 2],
        "kiwi": ["kiwi_egg", 1]
    },
    // [******* BALANCED *******]
    AnimalCollectTimes2: {
        "cow": [150],
        "chicken": [110],
        "duck": [140],
        "quail": [150],
        "yak": [260],
        "sheep": [260],
        "goat": [120],
        "ostrich": [450],
        "llama": [350],
        "kiwi": [280]
    },
    // [******* BALANCED *******]
    AnimalProduceMap2: {
        "cow": ["cow_milk", 2],
        "chicken": ["chicken_egg", 3],
        "duck": ["duck_egg", 3],
        "quail": ["quail_egg", 2],
        "yak": ["yak_milk", 2],
        "sheep": ["sheep_wool", 3],
        "goat": ["goat_milk", 2],
        "ostrich": ["ostrich_egg", 2],
        "llama": ["llama_wool", 3],
        "kiwi": ["kiwi_egg", 1]
    },
    // AnimalCollectTimes3: {
    //     "cow": [20],
    //     "chicken": [2],
    //     "duck": [3],
    //     "quail": [4],
    //     "yak": [8],
    //     "sheep": [6],
    //     "goat": [6],
    //     "ostrich": [10],
    //     "llama": [12],
    //     "kiwi": [20]
    // },
    // AnimalProduceMap3: {
    //     "cow": ["cow_milk", 3],
    //     "chicken": ["chicken_egg", 4],
    //     "duck": ["duck_egg", 2],
    //     "quail": ["quail_egg", 3],
    //     "yak": ["yak_milk", 3],
    //     "sheep": ["sheep_wool", 3],
    //     "goat": ["goat_milk", 2],
    //     "ostrich": ["ostrich_egg", 1],
    //     "llama": ["llama_wool", 3],
    //     "kiwi": ["kiwi_egg", 1]
    // },


}