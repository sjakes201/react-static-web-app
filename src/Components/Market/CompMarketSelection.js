import React, { useEffect, useState, useRef } from 'react'

// pass it all price info
function CompMarketSelection({ name, newPrice, oldPrice, imgURL, onSell, items }) {

    const autoSubmit = useRef(false);

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



    const [quantity, setQuantity] = useState('')

    useEffect(() => {
        if (autoSubmit.current) {
            handleSubmit();
            autoSubmit.current = false;
        }
    }, [quantity])

    const handleSubmit = (e) => {
        e?.preventDefault();
        onSell(name, quantity)
        setQuantity('')
    }
    return (
        <div style={{
            height: '100%',
            width: 'calc(100% - 22px)',
            margin: '0 11px',
            height: '100%',
            boxSizing: 'border-box',
            boxShadow: '0 0 0 3px rgb(0, 0, 0), 0 0 0 6px rgb(245, 166, 43), 0 0 0 8px rgb(199, 135, 35), 0 0 0 11px rgb(0, 0, 0)',
        }}>
            <div style={{ height: "100%", display: 'flex', flexDirection: 'row' }}>
                <div style={{ height: '100%', width: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={`${process.env.PUBLIC_URL}/assets/images/`.concat(imgURL)} style={{ objectFit: 'contain', width: '100%', maxHeight: '100%' }} />
                </div>
                <div style={{ height: '100%', width: '40%', padding: "1.5vh 1vh", paddingTop: "10%" }}>
                    <div style={{ textAlign: 'center', textTransform: 'uppercase', textDecoration: 'underline', fontSize: "clamp(12px, 1vw, 80px)", wordBreak: 'break-all' }}>{name}</div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5%', fontSize: '1.3vw' }}>${newPrice} <small>/each</small> <img src={arrowURL} style={{ width: '12%' }} /></div>
                    <div style={{ fontSize: '0.7vw' }}>${oldPrice} /each previously</div>
                    <div style={{ marginTop: "10%", textAlign: 'center' }}>
                        <form onSubmit={handleSubmit} autocomplete="off">
                            <input
                                style={{
                                    boxSizing: 'border-box',
                                    width: '85%',
                                    padding: "10% 0",
                                    textAlign: 'center',
                                    boxShadow: '0 0 0 1px var(--black), 0 0 0 3px var(--border_yellow), 0 0 0 5px var(--border_shadow_yellow), 0 0 0 7px var(--black)',
                                }}
                                name="sellQuantity"
                                placeholder="0"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            ></input>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: '15%',
                                width: '100%',
                                height: '100%',
                                fontSize: '1.7vh'
                            }}>
                                <input type="submit" value="SELL"
                                    style={{
                                        boxSizing: 'border-box',
                                        boxShadow: '0 0 0 1px var(--black), 0 0 0 2px var(--border_orange), 0 0 0 3px var(--border_shadow_orange), 0 0 0 4px var(--black)',
                                        width: 'calc(45% - 8px)',
                                        height: 'calc(6vh - 8px)',
                                        cursor: 'pointer'
                                    }}>

                                </input>
                                <div style={{
                                    boxSizing: 'border-box',
                                    boxShadow: '0 0 0 1px var(--black), 0 0 0 2px var(--border_orange), 0 0 0 3px var(--border_shadow_orange), 0 0 0 4px var(--black)',
                                    width: 'calc(45% - 8px)',
                                    height: 'calc(6vh - 8px)',
                                    background: 'white',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    cursor: 'pointer'
                                }}
                                    onClick={() => {
                                        autoSubmit.current = true;
                                        setQuantity(items[name]);
                                    }}
                                >
                                    SELL ALL
                                </div>
                            </div>

                        </form>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default CompMarketSelection;