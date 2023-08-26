import React, { useEffect, useState } from "react";
import '../../CONSTANTS'
import CONSTANTS from "../../CONSTANTS";
import UPGRADES from "../../UPGRADES";

function CompTile({ tile, stage, updateTile, equippedFert, fertilizeTile }) {
    const [imgURL, setImgURL] = useState(`${process.env.PUBLIC_URL}/assets/images/dirt.png`);
    const [gif, setGif] = useState(null);

    const [partResult, setPartResult] = useState('EMPTY')
    const [animatePart, setAnimatePart] = useState(false)

    // console.log(tile.hasTimeFertilizer)

    const createGif = (e) => {
        if (gif) return;
        const rect = e.target.getBoundingClientRect();
        setGif({
            x: e.clientX - rect.left - 16,
            y: e.clientY - rect.top - 16,
            id: Date.now(),
            src: `${process.env.PUBLIC_URL}/assets/images/scythe.gif`
        })

        setTimeout(() => setGif(null), 300)
    }

    const onTileClick = async (e) => {
        if (equippedFert !== '') {
            fertilizeTile(tile.TileID);
            return
        }
        let equipped = sessionStorage.getItem("equipped");
        if (equipped !== "") {
            // is it plantable?
            // seed, attempt plant
            updateTile(tile.TileID, 'plant', equipped, tile.CropID);

        } else {
            // nothing equipped, harvest animation if final stage and attempt harvest
            if (tile.CropID !== -1) {
                let seedName = CONSTANTS.ProduceNameFromID[tile.CropID];
                if (UPGRADES.GrowthTimes0[seedName].length === stage) {
                    createGif(e);
                }
            }
            let resPartResult = await updateTile(tile.TileID, 'harvest', null, tile.CropID);
            if (['MetalSheets', 'Bolts', 'Gears'].includes(resPartResult)) {
                setPartResult(resPartResult);
            }
        }
    }

    let seedsArray = [null, "carrot_seeds", "melon_seeds", "cauliflower_seeds", "pumpkin_seeds", "yam_seeds",
        "beet_seeds", "parsnip_seeds", "bamboo_seeds", "hops_seeds", "corn_seeds", "potato_seeds",
        "blueberry_seeds", "grape_seeds", "oats_seeds", "strawberry_seeds"];
    let seedCropMap = {
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
    }
    
    useEffect(() => {
        if (tile.CropID !== -1) {
            // console.log(tile.CropID)

            let cropName = seedCropMap[seedsArray[tile.CropID]][0];
            // console.log(stage)
            let url = cropName.concat("_stage_", stage, ".png");
            setImgURL(`${process.env.PUBLIC_URL}/assets/images/crops/${url}`);
        } else {
            setImgURL(`${process.env.PUBLIC_URL}/assets/images/dirt.png`);
        }
    }, [tile, stage]);

    useEffect(() => {
        if (partResult !== '') {
            setAnimatePart(true);
            setTimeout(() => {
                setAnimatePart(false);
                setPartResult('EMPTY')
            }, 1500);
        }
    }, [partResult]);

    // animation styles for part gotten
    const defaultStyle = {
        transition: 'all 1.5s ease-out',
        opacity: 1,
        transform: 'translateY(0)',
        position: 'absolute',
        top: '0',
        right: '25%',
        zIndex: '50',
        width: '50%',
        pointerEvents: 'none'
    };

    const animatedStyle = {
        ...defaultStyle,
        opacity: 0,
        transform: 'translateY(-30px)',
    };

    let imgStyle = {
        textAlign: 'center',
        maxWidth: '100%',
        height: '100%',
        objectFit: 'contain',
    }

    let pnid = [null, "carrot_seeds", "melon_seeds", "cauliflower_seeds", "pumpkin_seeds", "yam_seeds",
    "beet_seeds", "parsnip_seeds", "bamboo_seeds", "hops_seeds", "corn_seeds", "potato_seeds",
    "blueberry_seeds", "grape_seeds", "oats_seeds", "strawberry_seeds"];


    if (UPGRADES.GrowthTimes0[pnid[tile?.CropID]]?.length === stage && equippedFert === "") {
        imgStyle.cursor = 'grab'
    }

    return (
        <div
            style={{
                width: '92%',
                height: '92%',
                position: 'relative'
            }}>
            {gif && <img
                key={gif.id}
                style={{ position: 'absolute', left: gif.x, right: gif.y, width: '32px', height: '32px', zIndex: '15' }}
                src={gif.src}
                alt="harvest gif"
            />}

            <img
                src={`${process.env.PUBLIC_URL}/assets/images/${partResult}.png`}
                alt="Description"
                style={animatePart ? animatedStyle : defaultStyle}
            />



            <img
                style={imgStyle}
                src={imgURL}
                alt={`seed ID: ${tile.CropID} tile ID: ${tile.TileID}`}
                draggable="false"
                onMouseDown={(e) => {
                    onTileClick(e);
                }
                }
            />
            <div style={{
                position: 'absolute', bottom: '0', width: '100%', display: 'flex',
                justifyContent: 'center', zIndex: '5', opacity: '0.75', pointerEvents: 'none',
            }}>
                {tile.YieldsFertilizer !== 0 &&
                    <img src={`${process.env.PUBLIC_URL}/assets/images/YieldsFertilizer.png`}
                        style={{
                            width: '20%',
                            objectFit: 'contain',
                        }}
                    />}
                {tile.HarvestsFertilizer !== 0 &&
                    <img src={`${process.env.PUBLIC_URL}/assets/images/HarvestsFertilizer.png`}
                        style={{
                            width: '20%',
                            objectFit: 'contain',
                        }}
                    />}
                {tile.hasTimeFertilizer &&
                    <img src={`${process.env.PUBLIC_URL}/assets/images/TimeFertilizer.png`}
                        style={{
                            width: '20%',
                            objectFit: 'contain',
                        }}
                    />}

            </div>
        </div>
    )
}

export default CompTile;