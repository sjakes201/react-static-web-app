
module.exports = {
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
        strawberry_seeds: 15
    },
    // CropNames is the exact inverse of above, to easily get names from id's, first index is null for indexing
    ProduceNameFromID: [null, "carrot_seeds", "melon_seeds", "cauliflower_seeds", "pumpkin_seeds", "yam_seeds",
        "beet_seeds", "parsnip_seeds", "bamboo_seeds", "hops_seeds", "corn_seeds", "potato_seeds",
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
        bamboo_seeds: ["bamboo", 5, 4],
        hops_seeds: ["hops", 1, 3],
        corn_seeds: ["corn", 1, 3],
        potato_seeds: ["potato", 3, 3],
        blueberry_seeds: ["blueberry", 6, 5],
        grape_seeds: ["grape", 6, 5],
        oats_seeds: ["oats", 4, 4],
        strawberry_seeds: ["strawberry", 3, 4]
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
        yak_milk: 10,
        sheep_wool: 8,
        goat_milk: 10,
        ostrich_egg: 100,
        llama_wool: 10,
        kiwi_egg: 50,
    },
    // key: type, array is [building, cost]
    AnimalTypes: {
        "cow": ['barn', 100],
        "chicken": ['coop', 10],
        "duck": ['coop', 40],
        "quail": ['coop', 80],
        "yak": ['barn', 150],
        "sheep": ['barn', 120],
        "goat": ['barn', 180],
        "ostrich": ['coop', 150],
        "llama": ['barn', 170],
        "kiwi": ['coop', 300],
    },
    // default time per collect in seconds
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
        Balance: ["Coins", "Currency"]
    },
    // For each permit type, what crops and animals it permits
    Permits: {
        "deluxeCrops": ['grape_seeds', 'bamboo_seeds', 'hops_seeds'],
        "exoticAnimals": ['quail', 'llama', 'kiwi'],
    },
    // Luxury goods have a artifical bonus in market prices of 5% and higher floors, usually from deluxe/exotics or things that need permits / higher costs
    LuxuryGoods: ['grape', 'bamboo', 'hops'],
    // What crops are unlocked at each XP threshold
    Levels: {
        0: ['carrot_seeds', 'oats_seeds', 'cauliflower_seeds', 'corn_seeds', 'potato_seeds', 'parsnip_seeds', 'cow', 'chicken', 'grape_seeds', 'bamboo_seeds', 'hops_seeds', 'quail', 'kiwi'],
        200: ['pumpkin_seeds', 'yam_seeds', 'beet_seeds', 'duck', 'sheep', 'goat'],
        500: ['melon_seeds', 'llama', 'yak'],
        1000: ['blueberry_seeds', 'ostrich', 'quail'],
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
        yak_milk: 8,
        sheep_wool: 6,
        goat_milk: 5,
        ostrich_egg: 10,
        llama_wool: 6,
        kiwi_egg: 15
    }
}