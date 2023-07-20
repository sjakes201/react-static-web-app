module.exports = {
    // costs for each upgrade, num of upgrade is length 
    UpgradeCosts: {
        exoticPermit: [200],
        deluxePermit: [200],
        barnCollectTimeUpgrade: [50, 80, 120],
        barnCollectQuantityUpgrade: [40, 100, 130],
        barnCapacityUpgrade: [150, 300,450],
        coopCollectTimeUpgrade: [50, 70, 130],
        coopCollectQuantityUpgrade: [50, 110, 130],
        coopCapacityUpgrade: [150, 200, 250],
        plantGrowthTimeUpgrade: [50, 60],
        plantHarvestQuantityUpgrade: [50, 60],
        plantNumHarvestsUpgrade: [55, 65],
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
    // default
    GrowthTimes0: {
        carrot_seeds: [4, 8, 8],
        melon_seeds: [40, 40, 40],
        cauliflower_seeds: [30, 30, 40, 40],
        pumpkin_seeds: [30, 50, 50, 50],
        yam_seeds: [1, 1, 2],
        beet_seeds: [2, 2],
        parsnip_seeds: [2, 2],
        flower_seeds: [2, 2, 2],
        bamboo_seeds: [2, 2, 2],
        hops_seeds: [2, 2, 2],
        corn_seeds: [4, 4, 4, 2],
        potato_seeds: [2, 2, 2],
        blueberry_seeds: [2, 2, 2],
        grape_seeds: [2, 2, 2],
        oats_seeds: [4, 5, 6],
        strawberry_seeds: [2, 2, 2]
    },
    // 1st upgrade
    GrowthTimes1: {
        carrot_seeds: [10, 15, 15],
        melon_seeds: [0, 0, 5],
        cauliflower_seeds: [10, 10, 10, 10],
        pumpkin_seeds: [4, 4, 8, 12],
        yam_seeds: [5, 5, 5],
        beet_seeds: [2, 2],
        parsnip_seeds: [2, 2],
        flower_seeds: [2, 2, 2],
        bamboo_seeds: [2, 2, 2],
        hops_seeds: [2, 2, 2],
        corn_seeds: [4, 4, 4, 4],
        potato_seeds: [2, 2, 2],
        blueberry_seeds: [2, 2, 2],
        grape_seeds: [2, 2, 2],
        oats_seeds: [4, 5, 6],
        strawberry_seeds: [2, 2, 2]
    },
    // 2nd upgrade
    GrowthTimes2: {
        carrot_seeds: [10, 15, 15],
        melon_seeds: [0, 0, 5],
        cauliflower_seeds: [10, 10, 10, 10],
        pumpkin_seeds: [4, 4, 8, 12],
        yam_seeds: [5, 5, 5],
        beet_seeds: [2, 2],
        parsnip_seeds: [2, 2],
        flower_seeds: [2, 2, 2],
        bamboo_seeds: [2, 2, 2],
        hops_seeds: [2, 2, 2],
        corn_seeds: [4, 4, 4, 2],
        potato_seeds: [2, 2, 2],
        blueberry_seeds: [2, 2, 2],
        grape_seeds: [2, 2, 2],
        oats_seeds: [4, 5, 6],
        strawberry_seeds: [2, 2, 2]
    },
    NumHarvests0: {
        carrot_seeds: 2,
        melon_seeds: 1,
        cauliflower_seeds: 1,
        pumpkin_seeds: 1,
        yam_seeds: 3,
        beet_seeds: 3,
        parsnip_seeds: 1,
        flower_seeds: 3,
        bamboo_seeds: 4,
        hops_seeds: 3,
        corn_seeds: 2,
        potato_seeds: 3,
        blueberry_seeds: 5,
        grape_seeds: 5,
        oats_seeds: 4,
        strawberry_seeds: 4
    },
    NumHarvests1: {
        carrot_seeds: 2,
        melon_seeds: 1,
        cauliflower_seeds: 1,
        pumpkin_seeds: 1,
        yam_seeds: 3,
        beet_seeds: 3,
        parsnip_seeds: 1,
        flower_seeds: 3,
        bamboo_seeds: 4,
        hops_seeds: 3,
        corn_seeds: 3,
        potato_seeds: 3,
        blueberry_seeds: 5,
        grape_seeds: 5,
        oats_seeds: 4,
        strawberry_seeds: 4
    },
    NumHarvests2: {
        carrot_seeds: 2,
        melon_seeds: 1,
        cauliflower_seeds: 1,
        pumpkin_seeds: 1,
        yam_seeds: 3,
        beet_seeds: 3,
        parsnip_seeds: 1,
        flower_seeds: 3,
        bamboo_seeds: 4,
        hops_seeds: 3,
        corn_seeds: 4,
        potato_seeds: 3,
        blueberry_seeds: 5,
        grape_seeds: 5,
        oats_seeds: 4,
        strawberry_seeds: 4
    },
    PlantQuantityYields0: {
        carrot_seeds: 2,
        melon_seeds: 1,
        cauliflower_seeds: 1,
        pumpkin_seeds: 1,
        yam_seeds: 3,
        beet_seeds: 3,
        parsnip_seeds: 1,
        flower_seeds: 3,
        bamboo_seeds: 4,
        hops_seeds: 3,
        corn_seeds: 3,
        potato_seeds: 3,
        blueberry_seeds: 5,
        grape_seeds: 5,
        oats_seeds: 4,
        strawberry_seeds: 4
    },
    PlantQuantityYields1: {
        carrot_seeds: 2,
        melon_seeds: 1,
        cauliflower_seeds: 1,
        pumpkin_seeds: 1,
        yam_seeds: 3,
        beet_seeds: 3,
        parsnip_seeds: 1,
        flower_seeds: 3,
        bamboo_seeds: 4,
        hops_seeds: 3,
        corn_seeds: 4,
        potato_seeds: 3,
        blueberry_seeds: 5,
        grape_seeds: 5,
        oats_seeds: 4,
        strawberry_seeds: 4
    },
    PlantQuantityYields2: {
        carrot_seeds: 2,
        melon_seeds: 1,
        cauliflower_seeds: 1,
        pumpkin_seeds: 1,
        yam_seeds: 3,
        beet_seeds: 3,
        parsnip_seeds: 1,
        flower_seeds: 3,
        bamboo_seeds: 4,
        hops_seeds: 3,
        corn_seeds: 5,
        potato_seeds: 3,
        blueberry_seeds: 5,
        grape_seeds: 5,
        oats_seeds: 4,
        strawberry_seeds: 4
    },
    // how much of an increase for purchasing that level
    CapacityIncreases: {
        Barn: [4, 4, 4],
        Coop: [4, 6, 4]
    },
    // barn and coop upgrades, go to the table for the levels 
    AnimalCollectTimes0: {
        "cow": [60],
        "chicken": [4],
        "duck": [10],
        "quail": [12],
        "bees": [8],
        "yak": [20],
        "sheep": [15],
        "goat": [16],
        "ostrich": [40],
        "llama": [30]
    },
    AnimalProduceMap0: {
        "cow": ["cow_milk", 1],
        "chicken": ["chicken_egg", 1],
        "duck": ["duck_egg", 1],
        "quail": ["quail_egg", 1],
        "bees": ["honey", 1],
        "yak": ["yak_milk", 1],
        "sheep": ["sheep_wool", 2],
        "goat": ["goat_milk", 1],
        "ostrich": ["ostrich_egg", 1],
        "llama": ["llama_wool", 1]
    },
    AnimalCollectTimes1: {
        "cow": [50],
        "chicken": [3],
        "duck": [8],
        "quail": [10],
        "bees": [6],
        "yak": [15],
        "sheep": [10],
        "goat": [12],
        "ostrich": [30],
        "llama": [25]
    },
    AnimalProduceMap1: {
        "cow": ["cow_milk", 1],
        "chicken": ["chicken_egg", 2],
        "duck": ["duck_egg", 1],
        "quail": ["quail_egg", 2],
        "bees": ["honey", 2],
        "yak": ["yak_milk", 1],
        "sheep": ["sheep_wool", 2],
        "goat": ["goat_milk", 1],
        "ostrich": ["ostrich_egg", 1],
        "llama": ["llama_wool", 2]
    },
    AnimalCollectTimes2: {
        "cow": [50],
        "chicken": [3],
        "duck": [8],
        "quail": [10],
        "bees": [6],
        "yak": [15],
        "sheep": [10],
        "goat": [12],
        "ostrich": [30],
        "llama": [25]
    },
    AnimalProduceMap2: {
        "cow": ["cow_milk", 2],
        "chicken": ["chicken_egg", 3],
        "duck": ["duck_egg", 2],
        "quail": ["quail_egg", 2],
        "bees": ["honey", 2],
        "yak": ["yak_milk", 2],
        "sheep": ["sheep_wool", 3],
        "goat": ["goat_milk", 1],
        "ostrich": ["ostrich_egg", 1],
        "llama": ["llama_wool", 2]
    },
    AnimalCollectTimes3: {
        "cow": [20],
        "chicken": [2],
        "duck": [3],
        "quail": [4],
        "bees": [3],
        "yak": [8],
        "sheep": [6],
        "goat": [6],
        "ostrich": [10],
        "llama": [12]
    },
    AnimalProduceMap3: {
        "cow": ["cow_milk", 3],
        "chicken": ["chicken_egg", 4],
        "duck": ["duck_egg", 2],
        "quail": ["quail_egg", 3],
        "bees": ["honey", 2],
        "yak": ["yak_milk", 3],
        "sheep": ["sheep_wool", 3],
        "goat": ["goat_milk", 2],
        "ostrich": ["ostrich_egg", 1],
        "llama": ["llama_wool", 3]
    },








}