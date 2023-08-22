import React, { useEffect, useState } from "react";
import '../../CONSTANTS'
import CONSTANTS from "../../CONSTANTS";
import UPGRADES from "../../UPGRADES";

function CompTile({ tile, stage, updateTile }) {

    const [imgURL, setImgURL] = useState(`${process.env.PUBLIC_URL}/assets/images/dirt.png`);
    const [gif, setGif] = useState(null);

    const [partResult, setPartResult] = useState('EMPTY')
    const [animatePart, setAnimatePart] = useState(false)


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

    useEffect(() => {
        if (tile.CropID !== -1) {
            let cropName = CONSTANTS.SeedCropMap[CONSTANTS.ProduceNameFromID[tile.CropID]][0];
            let url = cropName.concat("_stage_", stage, ".png");
            setImgURL(`${process.env.PUBLIC_URL}/assets/images/${url}`);
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
                style={{
                    textAlign: 'center',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    cursor: (UPGRADES.GrowthTimes0[CONSTANTS.ProduceNameFromID[tile?.CropID]]?.length === stage) ? 'grab' : 'default'
                }}
                src={imgURL}
                alt={`seed ID: ${tile.CropID} tile ID: ${tile.TileID}`}
                draggable="false"
                onMouseDown={(e) => {
                    onTileClick(e);
                }
                }
            />

        </div>
    )
}

export default CompTile;