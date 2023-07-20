import React, { useEffect, useState } from 'react'

// pass it all price info
function CompMarketSelection({ name, newPrice, oldPrice, imgURL, onSell }) {

    let arrowURL = `${process.env.PUBLIC_URL}/assets/images/market_direction_error.png`;
    if (newPrice === 0 && oldPrice === 0) {
        arrowURL = `${process.env.PUBLIC_URL}/assets/images/market-neutral.png`
    } else if (newPrice >= oldPrice * 1.019) {
        arrowURL = `${process.env.PUBLIC_URL}/assets/images/market-up.png`
    } else if (newPrice <= oldPrice * 0.981) {
        arrowURL = `${process.env.PUBLIC_URL}/assets/images/market-down.png`
    } else {
        arrowURL = `${process.env.PUBLIC_URL}/assets/images/market-neutral.png`
    }

    const [quantity, setQuantity] = useState(0)

    const handleSubmit = (e) => {
        e.preventDefault();
        onSell(name, quantity)
    }
    return (
        <div style={{ height: "100%" }}>
            <div style={{ border: '1px solid pink', height: "100%", display: 'flex', flexDirection: 'row' }}>
                <div style={{ height: '100%', width: '60%', border: '2px dotted navy', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid brown' }}>
                    <img src={`${process.env.PUBLIC_URL}/assets/images/`.concat(imgURL)} style={{ objectFit: 'contain', width: '100%', maxHeight: '100%' }} />
                </div>
                <div style={{ height: '100%', width: '40%', border: '2px dotted green', padding: "1.5vh 1vh", border: '1px solid brown', paddingTop: "10%" }}>
                    <div style={{ textAlign: 'center', textTransform: 'uppercase', textDecoration: 'underline', fontSize: "clamp(12px, 1vw, 80px)", wordBreak:'break-all' }}>{name}</div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5%', fontSize: '1.3vw' }}>${newPrice} <small>/each</small> <img src={arrowURL} style={{ width: '12%' }} /></div>
                    <div style={{ fontSize: '0.7vw' }}>${oldPrice} /each yesterday</div>
                    <div style={{ marginTop: "10%", textAlign: 'center' }}>
                        <form onSubmit={handleSubmit}>
                            <input
                                style={{ boxSizing: 'border-box', width: '85%', padding: "10% 0", textAlign: 'center' }}
                                name="sellQuantity" placeholder="0" onChange={(e) => setQuantity(e.target.value)}
                            ></input>
                            <input type="submit" value="SELL"></input>
                        </form>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default CompMarketSelection;