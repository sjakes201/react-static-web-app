//TODO: Make something that easily creates this from a much simpler input form

module.exports = {
    //itemLocater helps you find the table things are in, instead of having to splice string to see if seeds is concated. [column_name, table]
    // ITEMLOCATER SHOULD BE UNUSED NOW
    itemLocater: {
        // SEEDS TABLE
        carrot_seeds: ["carrot_seeds", "Inventory_SEEDS"],
        melon_seeds: ["melon_seeds", "Inventory_SEEDS"],
        cauliflower_seeds: ["cauliflower_seeds", "Inventory_SEEDS"],
        pumpkin_seeds: ["pumpkin_seeds", "Inventory_SEEDS"],
        yam_seeds: ["yam_seeds", "Inventory_SEEDS"],
        beet_seeds: ["beet_seeds", "Inventory_SEEDS"],
        parsnip_seeds: ["parsnip_seeds", "Inventory_SEEDS"],
        flower_seeds: ["flower_seeds", "Inventory_SEEDS"],
        bamboo_seeds: ["bamboo_seeds", "Inventory_SEEDS"],
        hops_seeds: ["hops_seeds", "Inventory_SEEDS"],
        corn_seeds: ["corn_seeds", "Inventory_SEEDS"],
        potato_seeds: ["potato_seeds", "Inventory_SEEDS"],
        blueberry_seeds: ["blueberry_seeds", "Inventory_SEEDS"],
        grape_seeds: ["grape_seeds", "Inventory_SEEDS"],
        oats_seeds: ["oats_seeds", "Inventory_SEEDS"],
        strawberry_seeds: ["strawberry_seeds", "Inventory_SEEDS"],

        // PRODUCE TABLE
        carrot: ["carrot", "Inventory_PRODUCE"],
        melon: ["melon", "Inventory_PRODUCE"],
        cauliflower: ["cauliflower", "Inventory_PRODUCE"],
        pumpkin: ["pumpkin", "Inventory_PRODUCE"],
        yam: ["yam", "Inventory_PRODUCE"],
        beet: ["beet", "Inventory_PRODUCE"],
        parsnip: ["parsnip", "Inventory_PRODUCE"],
        flower: ["flower", "Inventory_PRODUCE"],
        bamboo: ["bamboo", "Inventory_PRODUCE"],
        hops: ["hops", "Inventory_PRODUCE"],
        corn: ["corn", "Inventory_PRODUCE"],
        potato: ["potato", "Inventory_PRODUCE"],
        blueberry: ["blueberry", "Inventory_PRODUCE"],
        grape: ["grape", "Inventory_PRODUCE"],
        oats: ["oats", "Inventory_PRODUCE"],
        strawberry: ["strawberry", "Inventory_PRODUCE"],
        cow_milk: ["cow_milk", "Inventory_PRODUCE"],
        chicken_egg: ["chicken_egg", "Inventory_PRODUCE"],

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
        flower_seeds: 8,
        bamboo_seeds: 9,
        hops_seeds: 10,
        corn_seeds: 11,
        potato_seeds: 12,
        blueberry_seeds: 13,
        grape_seeds: 14,
        oats_seeds: 15,
        strawberry_seeds: 16
    },
    // CropNames is the exact inverse of above, to easily get names from id's, first index is null for indexing
    ProduceNameFromID: [null, "carrot_seeds", "melon_seeds", "cauliflower_seeds", "pumpkin_seeds", "yam_seeds",
        "beet_seeds", "parsnip_seeds", "flower_seeds", "bamboo_seeds", "hops_seeds", "corn_seeds", "potato_seeds",
        "blueberry_seeds", "grape_seeds", "oats_seeds", "strawberry_seeds"],
    // Maps seeds to what crop they make, key is seed name, value is array of [crop_name, qty per harvest, total_harvests] produced
    SeedCropMap: {
        carrot_seeds: ["carrot", 3, 2],
        melon_seeds: ["melon", 1, 1],
        cauliflower_seeds: ["cauliflower", 1, 1],
        pumpkin_seeds: ["pumpkin", 1, 1],
        yam_seeds: ["yam", 4, 3],
        beet_seeds: ["beet", 4, 3],
        parsnip_seeds: ["parsnip", 2, 1],
        flower_seeds: ["flower", 4, 3],
        bamboo_seeds: ["bamboo", 5, 4],
        hops_seeds: ["hops", 1, 3],
        corn_seeds: ["corn", 1, 3],
        potato_seeds: ["potato", 3, 3],
        blueberry_seeds: ["blueberry", 6, 5],
        grape_seeds: ["grape", 6, 5],
        oats_seeds: ["oats", 4, 4],
        strawberry_seeds: ["strawberry", 3, 4]
    },
    // GrowthTimes is an array for how long crops spend at each stage in MINUTES, with the final stage being harvestable. Intermediate
    // stages are purely cosmetic, the database only stores plant times. It goes to the stage (index + 1) after the time has passed, 
    // cumulative. So [3, 4, 5] would be stage 0, then stage 1 after 3 minutes, then stage 2 after 7 minutes, then stage 3 (harvestable)
    // after 12 minutes
    GrowthTimes: {
        carrot_seeds: [10, 15, 15],
        melon_seeds: [0, 0, 5],
        cauliflower_seeds: [10, 10, 10, 10],
        pumpkin_seeds: [4, 4, 8, 12],
        yam_seeds: [5, 5, 5],
        beet_seeds: [2, 2, 2],
        parsnip_seeds: [2, 2, 2],
        flower_seeds: [2, 2, 2],
        bamboo_seeds: [2, 2, 2],
        hops_seeds: [2, 2, 2],
        corn_seeds: [10, 10, 10, 10],
        potato_seeds: [2, 2, 2],
        blueberry_seeds: [2, 2, 2],
        grape_seeds: [2, 2, 2],
        oats_seeds: [4, 5, 6],
        strawberry_seeds: [2, 2, 2]
    },
    // Fixed prices is for prices of things you buy from the game (seeds, animals)
    Fixed_Prices: {
        carrot_seeds: 12,
        melon_seeds: 80,
        cauliflower_seeds: 90,
        pumpkin_seeds: 75,
        yam_seeds: 10,
        beet_seeds: 10,
        parsnip_seeds: 10,
        flower_seeds: 20,
        bamboo_seeds: 25,
        hops_seeds: 15,
        corn_seeds: 15,
        potato_seeds: 15,
        blueberry_seeds: 35,
        grape_seeds: 40,
        oats_seeds: 8,
        strawberry_seeds: 25
    },
    Init_Market_Prices: {
        carrot: 40,
        melon: 1400,
        cauliflower: 1800,
        pumpkin: 2000,
        yam: 20,
        beet: 50,
        parsnip: 50,
        flower: 50,
        bamboo: 45,
        hops: 50,
        corn: 12,
        potato: 50,
        blueberry: 50,
        grape: 80,
        oats: 4,
        strawberry: 50,
        cow_milk: 6,
        chicken_egg: 4,
        duck_egg: 7,
        quail_egg: 7,
        honey: 9,
        yak_milk: 10,
        sheep_wool: 8,
        goat_milk: 10,
        ostrich_egg: 100,
        llama_wool: 10
    },
    // key: type, array is [building, cost]
    AnimalTypes: {
        "cow": ['barn', 100],
        "chicken": ['coop', 10],
        "duck": ['coop', 40],
        "quail": ['coop', 80],
        "bees": ['coop', 120],
        "yak": ['barn', 150],
        "sheep": ['barn', 120],
        "goat": ['barn', 180],
        "ostrich": ['coop', 150],
        "llama": ['barn', 170]
    },
    // default time per collect in seconds
    AnimalCollectTimes: {
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
    AnimalProduceMap: {
        "cow": ["cow_milk", 1],
        "chicken": ["chicken_egg", 1]
    },
    // [ display name , more details ]
    InventoryDescriptions: {
        carrot_seeds: ["Carrot Seeds", "x Harvests y time intervals"],
        melon_seeds: ["Melon Seeds", "x Harvests y time intervals"],
        corn_seeds: ["Corn Seeds", "x Harvests y time intervals"],
        cauliflower_seeds: ["Cauliflower Seeds", "x Harvests y time intervals"],
        pumpkin_seeds: ["Pumpkin Seeds", "x Harvests y time intervals"],
        yam_seeds: ["Yam Seeds", "x Harvests y time intervals"],
        beet_seeds: ["Beet Seeds", "x Harvests y time intervals"],
        parsnip_seeds: ["Parsnip Seeds", "x Harvests y time intervals"],
        flower_seeds: ["Flower Seeds", "x Harvests y time intervals"],
        bamboo_seeds: ["Bamboo Seeds", "x Harvests y time intervals"],
        hops_seeds: ["Hops Seeds", "x Harvests y time intervals"],
        potato_seeds: ["Potato Seeds", "x Harvests y time intervals"],
        blueberry_seeds: ["Blueberry Seeds", "x Harvests y time intervals"],
        grape_seeds: ["Grape Seeds", "x Harvests y time intervals"],
        oats_seeds: ["Oat Seeds", "x Harvests y time intervals"],
        strawberry_seeds: ["Strawberry Seeds", "x Harvests y time intervals"],
        cow: ["Cow", "Produces milk"],
        chicken: ["Chicken", "Produces eggs"],
        duck: ["Duck", "Produces duck eggs"],
        quail: ["Quail", "Produces quail eggs"],
        bees: ["Bees", "Produces honey"],
        yak: ["Yak", "Produces yak milk"],
        sheep: ["Sheep", "Produces sheep wool"],
        goat: ["Goat", "Produces goat milk"],
        ostrich: ["Ostrich", "Produces ostrich eggs"],
        llama: ["Llama", "Produces llama wool"],
        carrot: ["Carrot", "Flora"],
        melon: ["Melon", "Flora"],
        cauliflower: ["Cauliflower", "Flora"],
        pumpkin: ["Pumpkin", "Flora"],
        yam: ["Yam", "Flora"],
        beet: ["Beet", "Flora"],
        parsnip: ["Parsnip", "Flora"],
        flower: ["Flower", "Flora"],
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
        honey: ["Honey", "Produce"],
        yak_milk: ["Yak Milk", "Produce"],
        sheep_wool: ["Sheep Wool", "Produce"],
        goat_milk: ["Goat Milk", "Produce"],
        ostrich_egg: ["Ostrich Egg", "Produce"],
        llama_wool: ["Llama Wool", "Produce"],
        Balance: ["Coins", "Currency"]
    },
    // For each permit type, what crops and animals it permits
    Permits: {
        "deluxeCrops": ['grape_seeds', 'bamboo_seeds', 'hops_seeds'],
        "exoticAnimals": ['quail', 'bees', 'llamas'],
    },
	// Luxury goods have a artifical bonus in market prices of 5% and higher floors, usually from deluxe/exotics or things that need permits / higher costs
	LuxuryGoods: ['grape','bamboo','hops'],
    // What crops are unlocked at each XP threshold
    Levels: {
        0: ['carrot_seeds', 'oats_seeds', 'cauliflower_seeds', 'corn_seeds', 'potato_seeds', 'parsnip_seeds', 'cow', 'chicken', 'grape_seeds', 'bamboo_seeds', 'hops_seeds', 'quail', 'bees', 'llamas'],
        200: ['pumpkin_seeds', 'yam_seeds','beet_seeds', 'duck', 'sheep', 'goat'],
        500: ['melon_seeds', 'llama', 'yak', 'bees'],
        1000: ['flower_seeds','blueberry_seeds', 'ostrich', 'quail'],
        2000: ['strawberry_seeds']
    },
    // the xp you get from harvesting/collecting this thing once total, not per item (ex: total for grape tile harvest, not per grape)
    XP: {
        carrot: 3,
        melon: 4,
        cauliflower: 2,
        pumpkin: 3,
        yam: 4,
        beet: 5,
        parsnip: 4,
        flower: 3,
        bamboo: 4,
        hops: 2,
        corn: 4,
        potato: 3,
        blueberry: 2,
        grape: 1,
        oats: 2,
        strawberry: 3,
        cow_milk: 12,
        chicken_egg: 8,
        duck_egg: 5,
        quail_egg: 5,
        honey: 6,
        yak_milk: 8,
        sheep_wool: 6,
        goat_milk: 5,
        ostrich_egg: 10,
        llama_wool: 6
    }
}