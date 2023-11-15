const TOWNSINFO = require("./TOWNSINFO");
const CONSTANTS = require("./CONSTANTS");

// XP is integer
function calcTownLevel(XP) {
  if (!Number.isInteger(XP) || XP < 0) return 0;
  let thresholds = TOWNSINFO.townLevels;
  let townLevel = 0;
  let remaining = XP;
  let nextThreshold = -1;
  thresholds.forEach((threshold, index) => {
    if (remaining >= threshold) {
      remaining -= threshold;
      townLevel = index;
    } else {
      if (nextThreshold === -1) {
        nextThreshold = threshold;
      }
    }
  });
  // After reaching level 30 (final defined threshold) each level is just 30000 more
  while (remaining >= 30000) {
    townLevel++;
    remaining -= 30000;
  }
  return [townLevel, remaining, nextThreshold];
}

// townLevel is integer, perkName is string
function calcPerkLevels(townLevel) {
  if (!Number.isInteger(townLevel) || townLevel < 0) return 0;
  let perkLevels = TOWNSINFO.townLevelForPerks;
  let result = {
    growthPerk: 0,
    partsPerk: 0,
    animalPerk: 0,
    orderRefreshPerk: 0,
  };
  Object.keys(perkLevels).forEach((perk) => {
    let levelArr = perkLevels[perk];
    levelArr.forEach((lvlThreshold, index) => {
      if (townLevel >= lvlThreshold) result[perk] = index;
    });
  });

  return result;
}

// Rewards for finishing individual goal
function calcIndivRewards (good, quantity) {
  let rewards = {
      gold: 0,
      xp: 0,
      townXP: 0
  }
  // Gold is quantity / 15 * init market price if crop, or quantity * (2/3) * init market price if animal produce
  if(good?.includes("_")) {
      //animal produce
      rewards.gold = Math.round((quantity * (2/3)) * CONSTANTS.Init_Market_Prices[good])
      rewards.townXP = 120;
  } else {
      // crop
      rewards.gold = Math.round((quantity / 15) * CONSTANTS.Init_Market_Prices[good]);
      rewards.townXP = 100
  }
  return rewards;
}

function personalRewards(good, quantity) {
  let rewards = {
    gold: 0,
    xp: 0,
  };
  if (
    !(good in CONSTANTS.Init_Market_Prices) ||
    !Number.isInteger(quantity) ||
    quantity < 0
  )
    return rewards;

  // Gold is quantity / 15 * init market price if crop, or quantity * (2/3) * init market price if animal produce
  if (good?.includes("_")) {
    //animal produce
    rewards.gold = Math.round(
      quantity * (2 / 3) * CONSTANTS.Init_Market_Prices[good],
    );
  } else {
    // crop
    rewards.gold = Math.round(
      (quantity / 15) * CONSTANTS.Init_Market_Prices[good],
    );
  }
  // For now, personal XP is always 1000
  rewards.xp = 1000;

  return rewards;
}

export { calcTownLevel, calcPerkLevels, personalRewards, calcIndivRewards };
