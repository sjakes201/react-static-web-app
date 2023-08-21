module.exports = {
    machineTypeIDS: {
        'cheese': 0,
        'cloth': 1,
        'mayonnaise': 2
    },
    machineTypeFromIDS: ['cheese', 'cloth', 'mayonnaise'],
    cheeseMachineInfo: {
        validInputs: ['cow_milk', 'yak_milk', 'goat_milk'],
        tier1: {
            capacity: 5,
            timeInMs: 5000,
            /* probabilities is probability of q3, then q2, then q1, then q0. The first one the random() is less than is quality
            ex: [0.10, 0.40, 0.60, 1.00] means 10% chance of q3, 30% chance of q2, 20% of q1, 40% of q0, based on probability of being NOT below earlier but earlier than current elem
            So obviously, the final number should always be 1
            */
            probabilities: [0.25, 0.50, 0.75, 1.00]
        },
        tier2: {
            capacity: 10,
            timeInMs: 5000,
            probabilities: [0.25, 0.50, 0.75, 1.00]
        },
        tier3: {
            capacity: 20,
            timeInMs: 5000,
            probabilities: [0.25, 0.50, 0.75, 1.00]
        },
    },
    clothMachineInfo: {
        validInputs: ['sheep_wool', 'llama_wool'],
        tier1: {
            capacity: 5,
            timeInMs: 5000,
            /* probabilities is probability of q3, then q2, then q1, then q0. The first one the random() is less than is quality
            ex: [0.10, 0.40, 0.60, 1.00] means 10% chance of q3, 30% chance of q2, 20% of q1, 40% of q0, based on probability of being NOT below earlier but earlier than current elem
            So obviously, the final number should always be 1
            */
            probabilities: [0.25, 0.50, 0.75, 1.00]
        },
        tier2: {
            capacity: 10,
            timeInMs: 5000,
            probabilities: [0.25, 0.50, 0.75, 1.00]
        },
        tier3: {
            capacity: 20,
            timeInMs: 5000,
            probabilities: [0.25, 0.50, 0.75, 1.00]
        },
    },
    mayonnaiseMachineInfo: {
        validInputs: ['chicken_egg', 'duck_egg', 'quail_egg', 'ostrich_egg', 'kiwi_egg'],
        tier1: {
            capacity: 5,
            timeInMs: 5000,
            /* probabilities is probability of q3, then q2, then q1, then q0. The first one the random() is less than is quality
            ex: [0.10, 0.40, 0.60, 1.00] means 10% chance of q3, 30% chance of q2, 20% of q1, 40% of q0, based on probability of being NOT below earlier but earlier than current elem
            So obviously, the final number should always be 1
            */
            probabilities: [0.25, 0.50, 0.75, 1.00]
        },
        tier2: {
            capacity: 10,
            timeInMs: 5000,
            probabilities: [0.25, 0.50, 0.75, 1.00]
        },
        tier3: {
            capacity: 20,
            timeInMs: 5000,
            probabilities: [0.25, 0.50, 0.75, 1.00]
        },
    },
    cheeseMachineCost: {
        // tier 1 is basic
        tier1: {
            Money: 400,
            Gears: 0,
            MetalSheets: 0,
            Bolts: 0,
        },
        // tier 2 is first upgrade
        tier2: {
            Money: 1000,
            Gears: 0,
            MetalSheets: 0,
            Bolts: 0,
        },
        // tier 3 is second upgrade
        tier3: {
            Money: 500,
            Gears: 0,
            MetalSheets: 0,
            Bolts: 0,
        },

    },
    clothMachineCost: {
        // tier 1 is basic
        tier1: {
            Money: 500,
            Gears: 0,
            MetalSheets: 0,
            Bolts: 0,
        },
        // tier 2 is first upgrade
        tier2: {
            Money: 500,
            Gears: 2,
            MetalSheets: 3,
            Bolts: 4,
        },
        // tier 3 is second upgrade
        tier3: {
            Money: 500,
            Gears: 0,
            MetalSheets: 0,
            Bolts: 0,
        },
    },
    mayonnaiseMachineCost: {
        // tier 1 is basic
        tier1: {
            Money: 500,
            Gears: 2,
            MetalSheets: 1,
            Bolts: 1,
        },
        // tier 2 is first upgrade
        tier2: {
            Money: 500,
            Gears: 2,
            MetalSheets: 3,
            Bolts: 4,
        },
        // tier 3 is second upgrade
        tier3: {
            Money: 500,
            Gears: 2,
            MetalSheets: 3,
            Bolts: 4,
        },
    },
    sellRefunds: {
        tier1: {
            Gears: 1,
            MetalSheets: 1,
            Bolts: 1,
        },
        tier2: {
            Gears: 2,
            MetalSheets: 4,
            Bolts: 4,
        },
        tier3: {
            Gears: 3,
            MetalSheets: 4,
            Bolts: 5,
        },
    },
    artisanPrices: {
        cheeseQ0: 100,
        cheeseQ1: 100,
        cheeseQ2: 100,
        cheeseQ3: 100,
        clothQ0: 100,
        clothQ1: 100,
        clothQ2: 100,
        clothQ3: 100,
        mayonnaiseQ0: 100,
        mayonnaiseQ1: 100,
        mayonnaiseQ2: 100,
        mayonnaiseQ3: 100,
    }
}