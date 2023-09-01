import React, { useEffect, useState } from "react";
import '../../CONSTANTS'
import CONSTANTS from "../../CONSTANTS";
import CROPINFO from "../../CROPINFO";
import UPGRADES from "../../UPGRADES";

function CompTile({ tool, partResult, setHovering, highlighted, tile, stage, tileAction, equippedFert, fertilizeTile }) {
    const [imgURL, setImgURL] = useState(`${process.env.PUBLIC_URL}/assets/images/dirt.png`);
    const [gif, setGif] = useState(null);

    const [animatePart, setAnimatePart] = useState(false)
    const [partToAnimate, setPartToAnimate] = useState('EMPTY')

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
        if (tile.CropID === -1 && CROPINFO.seedsFromID.includes(equipped)) {
            // Something equipped attempt plant
            tileAction(tile.TileID, 'plant', equipped, tile.CropID);

        } else {
            // nothing equipped, harvest animation and attempt harvest
            if (tile.CropID !== -1) {
                let seedName = CONSTANTS.ProduceNameFromID[tile.CropID];
                if (UPGRADES.GrowthTimes0[seedName].length === stage) {
                    createGif(e);
                }
            }
            tileAction(tile.TileID, 'harvest', null, tile.CropID);

        }
    }

    let seedIDS = CROPINFO.seedsFromID;
    let seedCropMap = CROPINFO.seedCropMap;

    useEffect(() => {
        if (tile.CropID !== -1) {
            let cropName = seedCropMap[seedIDS[tile.CropID]];
            let url = cropName.concat("_stage_", stage, ".png");
            setImgURL(`${process.env.PUBLIC_URL}/assets/images/crops/${url}`);
        } else {
            setImgURL(`${process.env.PUBLIC_URL}/assets/images/dirt.png`);
        }
    }, [tile, stage]);

    useEffect(() => {
        if (partResult !== '') {
            setPartToAnimate(partResult)
            setAnimatePart(true);
            setTimeout(() => {
                setAnimatePart(false);
                setPartToAnimate('EMPTY')
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
        zIndex: '10',
        width: '50%',
        pointerEvents: 'none',
        right: '25%',
    };

    const animatedStyle = {
        ...defaultStyle,
        opacity: 0,
        transform: 'translateY(-30px)',
    };


    let imgStyle = {
        maxWidth: '100%',
        height: '100%',
        objectFit: 'contain',
    }

    if (UPGRADES.GrowthTimes0[seedIDS[tile?.CropID]]?.length === stage && equippedFert === "") {
        imgStyle.cursor = 'grab'
    }

    return (
        <div
            style={{
                width: '92%',
                height: '92%',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            {gif && <img
                key={gif.id}
                style={{ position: 'absolute', left: gif.x, right: gif.y, width: '32px', height: '32px', zIndex: '15' }}
                src={gif.src}
                alt="harvest gif"
            />}

            <img
                src={`${process.env.PUBLIC_URL}/assets/images/${partToAnimate === '' ? 'EMPTY' : partToAnimate}.png`}
                alt="machine part Animation"
                style={animatePart ? animatedStyle : defaultStyle}
            />



            <img
                style={imgStyle}
                src={imgURL}
                alt={`seed ID: ${tile.CropID} tile ID: ${tile.TileID}`}
                draggable="false"
                onMouseDown={(e) => {
                    onTileClick(e);
                }}
                onMouseEnter={() => setHovering(tile.TileID)}
            />

            {highlighted &&
                <div style={{
                    width: '100%',
                    height: '100%',
                    boxShadow: `0 0 3px 2px ${tool === 'multiharvest' ? 'gold' : 'lightblue'}`,
                    position: 'absolute',
                    top: '0',
                    pointerEvents: 'none'
                }}>

                </div>
            }
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