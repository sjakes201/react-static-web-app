module.exports = {
    upgradeBoosts: {
        growthPerkLevel: [0, 0.05, 0.10, 0.15, 0.20, 0.25],
        partsPerkLevel: [0, 0.25, 0.5, 0.75, 1, 1.5],
        orderRefreshPerkLevel: [0, 0.25, 0.5, 0.75, 1, 1.5],
        animalPerkLevel: [0, 0.05, 0.10, 0.15, 0.20, 0.25],
    },
    townIcons: ['corn', 'grape', 'hops', 'parsnip', 'kiwi', 'chicken', 'cow', 'ostrich'],

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
    townLevelForPerks: {
        // The town level at which you unlock the level that is the index. For example growthPerk[3] is level x. So you need to be level x to get growthPerk level 3
        // Each perk has 6 total levels, including 0
        growthPerk: [0, 1, 5, 9, 13, 17],
        partsPerk: [0, 2, 6, 10, 14, 18],
        animalPerk: [0, 3, 7, 11, 15, 19],
        orderRefreshPerk: [0, 4, 8, 12, 16, 20]
    },
    // XP needed to get to next level, ex: townLevels[5] is 6000, so to get from level 4 to 5 you need 6000 more XP
    townLevels: [0, 3000, 4000, 5000, 5000, 6000, 6500, 7000, 7500, 7500, 10000, 10000, 10000, 15000, 15000, 15000, 20000, 20000, 20000, 25000, 25000]
}