import react from 'react';
import './AccountComponents.css'
import CONSTANTS from '../../CONSTANTS';

function GoodCountGrid({ cropData, type }) {

    return (
        <div className="acc-collect-grids yellow-border">
            {Object.keys(cropData).map((crop) => {
                if (
                    crop in CONSTANTS.Init_Market_Prices &&
                    (type === "crops" ? !crop.includes("_")
                        : type === "produce" ? crop.includes("_")
                            : false)
                ) {
                    return (
                        <div className="acc-goods-slot" key={crop}>
                            <img
                                src={`${process.env.PUBLIC_URL}/assets/images/${crop}.png`}
                                alt={crop}
                            />
                            {cropData[crop]?.toLocaleString()}
                        </div>
                    );
                }
            })}
        </div>
    );
}

export default GoodCountGrid;