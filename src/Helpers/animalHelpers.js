const UPGRADES = require("../UPGRADES");
const CONSTANTS = require("../CONSTANTS");
const BOOSTSINFO = require("../BOOSTSINFO");

const getCurrentSeason = () => {
    const seasons = ['spring', 'summer', 'fall', 'winter'];
    const nowMS = Date.now();
    let msPerDay = 24 * 60 * 60 * 1000;
    let daysPassed = Math.floor(nowMS / msPerDay)
    let seasonIndex = daysPassed % 4;
    return seasons[seasonIndex];
};

const getCollectQty = (animalType, quantityTableName, happiness, nextRandom, activeBoosts) => {
    let qty = UPGRADES[quantityTableName][animalType][1]
    let inSeason = CONSTANTS.animalSeasons[getCurrentSeason()].includes(animalType);
    console.log(activeBoosts)
    let probOfExtra = happiness > 1 ? 0.67 : happiness / 1.5;
    if (inSeason) {
        probOfExtra += 0.1
    }
    if (nextRandom < probOfExtra) {
        // extra produce bc of happiness
        qty += 1;
    }
    activeBoosts?.forEach(boost => {
        if (boost.Type === 'QTY' && boost.BoostTarget === 'ANIMALS') {
            let qtyIncrease = BOOSTSINFO[boost.BoostName].boostQtys[animalType]
            qty += qtyIncrease;
        } else if (boost.Type === 'QTY' && boost.BoostTarget === animalType) {
            let boostName = boost.BoostName;
            let level = boostName[boostName.length - 1];
            const qtyIncrease = BOOSTSINFO?.[`ANIMAL_INDIV_${level}`]?.boostQtys?.[animalType];
            qty += qtyIncrease;
        }
    })
    return qty
}

module.exports = {
    getCollectQty,
}