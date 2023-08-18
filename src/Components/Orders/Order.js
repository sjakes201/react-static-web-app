import { useEffect, useState } from 'react'
import CONSTANTS from '../../CONSTANTS';


function Order({ good, numNeeded, numHave, claimOrder, orderNum, refreshOrder, refreshable }) {

    const goldReward = Math.floor(CONSTANTS.Init_Market_Prices[good] * (2 / 3) * numNeeded);
    const xpReward = Math.floor(CONSTANTS.XP[good] * (2 / 3) * numNeeded);


    const [progressWidth, setProgressWidth] = useState('40%');
    const [progressHeight, setProgressHeight] = useState('60%');


    // Inline styling resources

    let dotStyling = {
        position: 'absolute',
        width: '2.5%',
        height: '4%',
        border: '1px solid black',
        borderRadius: '50%',
        background: 'var(--black)',
    }

    let progressStyle = {
        border: '1px solid black',
        width: progressWidth,
        height: progressHeight,
        boxShadow: '0 0 0 1px var(--black), 0 0 0 2px var(--border_yellow), 0 0 0 3px var(--border_shadow_yellow), 0 0 0 4px var(--black)',
        backgroundColor: 'var(--menu_lighter)',
        fontSize: '1vw',
    }

    let completeStyle = {
        border: '1px solid black',
        transition: 'width 1s linear, height 1s linear, font-size 1s linear',
        width: progressWidth,
        height: progressHeight,
        boxShadow: '0 0 0 2px var(--black), 0 0 0 4px var(--border_orange), 0 0 0 6px var(--border_shadow_orange), 0 0 0 8px var(--black)',
        backgroundColor: 'var(--menu_lighter)',
        fontSize: `${progressHeight.substring(0, 2) / 60}vw`,
    }

    useEffect(() => {

        let intervalID;
        if (numHave >= numNeeded) {
            const changeSizes = () => {
                setProgressWidth((old) => old === '40%' ? '44%' : '40%')
                setProgressHeight((old) => old === '60%' ? '68%' : '60%')

            }
            changeSizes();
            intervalID = setInterval(() => { changeSizes() }, 1000)
        }

        return () => {
            //cleanup
            clearInterval(intervalID)
        }
    }, [numHave, numNeeded])

    let barStyle = numHave >= numNeeded ? completeStyle : progressStyle;

    return (
        <div
            onClick={() => claimOrder(orderNum, goldReward)}
            style={{
                width: 'calc(90% - 14px)',
                height: 'calc(90% - 14px)',
                justifySelf: 'center',
                alignSelf: 'center',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: `
            0 0 0 1px var(--black),
            0 0 0 3px var(--border_yellow),
            0 0 0 4px var(--border_shadow_yellow),
            0 0 0 7px var(--black),
            -15px 0 6px -15px black, /* Additional shadow for the left side */
            -15px 15px 6px -5px black /* Additional shadow for the bottom */
          `,
                backgroundColor: 'var(--menu_lighter)',
                cursor: numHave >= numNeeded ? 'pointer' : 'default'
            }}>
            <div style={{ ...dotStyling, top: '4%', left: '2%' }}></div>
            <div style={{ ...dotStyling, top: '4%', right: '2%' }}></div>
            <div style={{ ...dotStyling, bottom: '4%', left: '2%' }}></div>
            <div style={{ ...dotStyling, bottom: '4%', right: '2%' }}></div>

            <div id='order-details' style={{
                width: '100%',
                height: '75%',
                display: 'flex',
                flexDirection: 'row',
            }}>
                <img alt={'Order good icon'} src={`${process.env.PUBLIC_URL}/assets/images/${good}.png`} style={{
                    width: '45%',
                    objectFit: 'contain',
                    height: '97%',
                    marginTop: '3%',
                    marginLeft: '5%'
                }} />
                <div id="order-rewards" style={{
                    width: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <p style={{ textDecoration: 'underline', fontSize: '2.2vh' }}>REWARD</p>
                    <p style={{ fontSize: '2.3vh' }}><span style={{
                        fontSize: '2.6vh',
                        fontWeight: 'bold',
                        color: 'gold',
                        textShadow: '1px 1px 1px black',
                    }}>$:</span> {goldReward}</p>
                    <p style={{ fontSize: '2.3vh' }}><span style={{
                        fontSize: '2.6vh',
                        fontWeight: 'bold',
                        color: 'lightblue',
                        textShadow: '1px 1px 1px darkblue',
                    }}>XP:</span> {xpReward}</p>
                </div>
            </div>

            <div id='order-completion-status' style={{
                height: '25%',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <span style={{
                    ...barStyle,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'var(--menu_light)',
                    position: 'relative',
                }}>{numHave}/{numNeeded} {CONSTANTS.InventoryDescriptions[good][0]}
                    <div style={{
                        position: 'absolute',
                        right: '-32%',
                        top: '5%',
                        width: '20%',
                    }}>
                        {numHave < numNeeded &&
                            <img src={`${process.env.PUBLIC_URL}/assets/images/${refreshable ? 'refresh' : 'refresh_disabled'}.png`} style={{
                                cursor: refreshable ? 'pointer' : 'default',
                                width: '100%',
                                objectFit: 'contain'
                            }}
                                onClick={() => {
                                    refreshOrder(orderNum)
                                }} />}
                    </div>
                </span>

            </div>
        </div>
    )

}

export default Order;