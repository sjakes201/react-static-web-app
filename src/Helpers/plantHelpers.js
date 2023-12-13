const UPGRADES = require("../UPGRADES");
const CONSTANTS = require("../CONSTANTS");
const BOOSTSINFO = require("../BOOSTSINFO");
/*
    seedName string
    quantityYieldsTable string
    yieldsFertilizer int
    activeBoosts array of boost info objects
*/
const getCropQty = (seedName, quantityYieldsTable, yieldsFertilizer, activeBoosts) => {
    let quantity = UPGRADES[quantityYieldsTable][seedName];
    if (yieldsFertilizer > 0) {
        let bonus = CONSTANTS.yieldFertilizerBonuses[seedName];
        quantity += bonus;
    }
    activeBoosts?.forEach((boost) => {
        if (boost.BoostTarget === "CROPS" && boost.Type === "QTY") {
            let qtyIncrease = BOOSTSINFO[boost.BoostName].boostQtys[seedName];
            quantity += qtyIncrease;
        } else if (boost.Type === 'QTY' && boost.BoostTarget === seedName) {
            let boostName = boost.BoostName;
            let level = boostName[boostName.length - 1];
            const qtyIncrease = BOOSTSINFO?.[`CROP_INDIV_${level}`]?.boostQtys?.[seedName];
            quantity += qtyIncrease;
        }
    })
    return quantity;
}

module.exports = {
    getCropQty,
}