import { Link } from 'react-router-dom';

function HowToPlay() {

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            backgroundColor: 'var(--menu_dark)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2%',
            position: 'relative'
        }}>
            <div style={{ position: 'absolute', width: '10%', top: '2%', left: '2%' }}>
                <img
                    src={`${process.env.PUBLIC_URL}/assets/images/back_arrow_light.png`}
                    alt='back-arrow'
                    onClick={() => window.history.back()}
                    style={{ width: '70%', cursor: 'pointer'}}
                />

            </div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateRows: '2fr 3fr 3fr 3fr 3fr',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    width: '90%',
                    height: '90%',
                    justifyItems: 'center',
                    alignItems: 'center',
                }}>
                <div id='label'
                    style={{
                        backgroundColor: 'var(--menu_light)',
                        gridColumnStart: '1',
                        gridColumnEnd: '5',
                        gridRowStart: '1',
                        gridRowEnd: '2',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '5vh',
                        boxSizing: 'border-box',
                        width: '40%',
                        height: '75%',
                        boxSizing: 'border-box',
                        margin: '11px',
                        boxShadow: '0 0 0 3px var(--black), 0 0 0 6px var(--border_orange), 0 0 0 8px var(--border_shadow_orange), 0 0 0 11px var(--black)'

                    }}>
                    HOW TO PLAY
                </div>


                <div id='farming'
                    style={{
                        backgroundColor: 'var(--menu_light)',
                        gridColumnStart: '1',
                        gridColumnEnd: '3',
                        gridRowStart: '2',
                        gridRowEnd: '4',
                        width: 'calc(96% - 22px)',
                        height: 'calc(95% - 22px)',
                        boxSizing: 'border-box',
                        boxShadow: '0 0 0 3px var(--black), 0 0 0 6px var(--border_orange), 0 0 0 8px var(--border_shadow_orange), 0 0 0 11px var(--black)',
                        display: 'flex',
                        flexDirection: 'column',
                        fontSize: '1vw'
                    }}>
                    <div style={{ height: '10%', textAlign: 'center', fontSize: '1.5vw', paddingTop: '1%', textDecoration: 'underline' }}>
                        FARMING
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', height: '30%', padding: '3% 2% 2% 2%' }}>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/corn.png`} style={{ width: '24px', height: '24px' }} />
                        <p>
                            Grow crops and raise animals to harvest goods to sell in the market. Different crops and animals take different amounts of time to produce their goods, and crops may be multi-harvest.
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', height: '30%', padding: '4% 2% 2% 2%' }}>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/corn.png`} style={{ width: '24px', height: '24px' }} />
                        <p>
                            Once animals have produced, they will show you by holding their produce: click them to collect. Crops grow in stages, and can be harvested in the final stage.
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', height: '30%', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/goat_walking_right.gif`} style={{ width: '10%' }} />
                        <img src={`${process.env.PUBLIC_URL}/assets/images/orange_arrow.png`} style={{ width: '5%' }} />
                        <img src={`${process.env.PUBLIC_URL}/assets/images/goat_collectible_walking_right.gif`} style={{ width: '10%', cursor: 'grab' }} />
                        <img src={`${process.env.PUBLIC_URL}/assets/images/EMPTY.png`} style={{ width: '10%' }} />
                        <img src={`${process.env.PUBLIC_URL}/assets/images/blueberry_stage_0.png`} style={{ width: '10%' }} />
                        <img src={`${process.env.PUBLIC_URL}/assets/images/orange_arrow.png`} style={{ width: '5%' }} />
                        <img src={`${process.env.PUBLIC_URL}/assets/images/blueberry_stage_3.png`} style={{ width: '10%', cursor: 'grab' }} />
                    </div>
                </div>


                <div id='market'
                    style={{
                        backgroundColor: 'var(--menu_light)',
                        gridColumnStart: '3',
                        gridColumnEnd: '5',
                        gridRowStart: '2',
                        gridRowEnd: '4',
                        width: 'calc(96% - 22px)',
                        height: 'calc(95% - 22px)',
                        boxSizing: 'border-box',
                        margin: '11px',
                        boxShadow: '0 0 0 3px var(--black), 0 0 0 6px var(--border_orange), 0 0 0 8px var(--border_shadow_orange), 0 0 0 11px var(--black)',
                        display: 'grid',
                        gridTemplateRows: 'repeat(2, 1fr)',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        position: 'relative',
                        fontSize: '1vw'
                    }}>
                    <img src={`${process.env.PUBLIC_URL}/assets/images/cow_standing_right.png`} style={{ width: '50px', height: '50px', position: 'absolute', top: 'calc(-1* (39px + 11px))', left: '50%' }} />
                    <img src={`${process.env.PUBLIC_URL}/assets/images/cow_standing_right.png`} style={{ width: '50px', height: '50px', position: 'absolute', top: 'calc(-1* (39px + 11px))', left: '70%', transform: 'scaleX(-1)' }} />
                    <div style={{ gridColumnStart: '1', gridColumnEnd: '3', gridRowStart: '1', gridRowEnd: '2', paddingTop: '1%' }}>
                        <div style={{ textAlign: 'center', fontSize: '1.5vw', textDecoration: 'underline' }}>MARKET</div>
                        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
                            <img src={`${process.env.PUBLIC_URL}/assets/images/corn.png`} style={{ width: '24px', height: '24px' }} />
                            <p>
                                The market is where you sell your produce. It is a dynamic pricing model: the prices change at midnight, and are based on the volume of each good sold by all players the previous day.
                            </p>
                        </div>
                    </div>
                    <div style={{ gridColumnStart: '1', gridColumnEnd: '2', gridRowStart: '2', gridRowEnd: '3' }}>
                        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
                            <img src={`${process.env.PUBLIC_URL}/assets/images/corn.png`} style={{ width: '24px', height: '24px' }} />
                            <p>
                                The more something is sold, supply drives price down, and the less something is sold, demand drives the price up. Deluxe and exotic goods receive a sell price bonus.
                            </p>
                        </div>
                    </div>



                    <div id='orders'
                        style={{
                            gridColumnStart: '2',
                            gridColumnEnd: '3',
                            gridRowStart: '2',
                            gridRowEnd: '3',
                            width: 'calc(95% - 8px)',
                            height: 'calc(95% - 16px)',
                            boxSizing: 'border-box',
                            margin: '8px',
                        }}>
                        <div style={{
                            boxShadow: '0 0 0 2px var(--black), 0 0 0 4px var(--border_yellow), 0 0 0 6px var(--border_shadow_yellow), 0 0 0 8px var(--black)',
                            position: 'relative',
                            backgroundColor: 'var(--menu_lighter)',
                            height: '100%',
                            width: '100%',
                            textAlign: 'center',
                            padding: '2% 3% 3% 3%',
                            fontSize: '1.5vh'
                        }}>
                            <div style={{ fontSize: '1.8vh', textAlign: 'center', textDecoration: 'underline' }}>
                                ORDERS
                            </div>
                            <p>
                                The order board requests specific goods and can be filled by harvesting them. They reward gold and XP. You can keep the goods after you fill an order!
                            </p>
                            <hr />
                            <small>Find the Orders board button in your profile.</small>

                        </div>
                    </div>


                </div>

                <div id='shop'
                    style={{
                        backgroundColor: 'var(--menu_light)',
                        gridColumnStart: '1',
                        gridColumnEnd: '2',
                        gridRowStart: '4',
                        gridRowEnd: '6',
                        width: 'calc(92% - 22px)',
                        height: 'calc(95% - 22px)',
                        boxSizing: 'border-box',
                        margin: '11px',
                        boxShadow: '0 0 0 3px var(--black), 0 0 0 6px var(--border_orange), 0 0 0 8px var(--border_shadow_orange), 0 0 0 11px var(--black)',
                        padding: '2%',
                        fontSize: '1vw',
                        position: 'relative'
                    }}>
                    <img src={`${process.env.PUBLIC_URL}/assets/images/grape_seeds.png`} style={{ width: '10%', position: 'absolute', left: '10.5%', top: '4%', transform: 'rotate(30deg)', zIndex: '3' }} />
                    <img src={`${process.env.PUBLIC_URL}/assets/images/cauliflower_seeds.png`} style={{ width: '13%', left: '6%', top: '4%', position: 'absolute', zIndex: '5' }} />
                    <img src={`${process.env.PUBLIC_URL}/assets/images/carrot_seeds.png`} style={{ width: '10%', position: 'absolute', left: '4%', top: '4%', transform: 'rotate(-30deg)', zIndex: '2' }} />

                    <img src={`${process.env.PUBLIC_URL}/assets/images/bamboo_seeds.png`} style={{ width: '10%', position: 'absolute', right: '10.5%', top: '4%', transform: 'rotate(-30deg)', zIndex: '3' }} />
                    <img src={`${process.env.PUBLIC_URL}/assets/images/corn_seeds.png`} style={{ width: '13%', right: '6%', top: '4%', position: 'absolute', zIndex: '5' }} />
                    <img src={`${process.env.PUBLIC_URL}/assets/images/pumpkin_seeds.png`} style={{ width: '10%', position: 'absolute', right: '4%', top: '4%', transform: 'rotate(30deg)', zIndex: '2' }} />

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5vw', textDecoration: 'underline', height: '20%' }}>SHOP</div>
                    <div style={{ width: '100%', height: '40%', display: 'flex', flexDirection: 'row' }}>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/corn.png`} style={{ width: '24px', height: '24px' }} />
                        <p>
                            Buy seeds and new animals at the shop. You can also purchase upgrades that make your animals and plants more bountiful.
                        </p>
                    </div>
                    <div style={{ width: '100%', height: '40%', display: 'flex', flexDirection: 'row' }}>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/corn.png`} style={{ width: '24px', height: '24px' }} />
                        <p>
                            Here you can also rent permits to handle rarer animals and plants that produce more expensive goods.
                        </p>
                    </div>
                </div>


                <div id='leaderboard'
                    style={{
                        backgroundColor: 'var(--menu_light)',
                        gridColumnStart: '2',
                        gridColumnEnd: '4',
                        gridRowStart: '4',
                        gridRowEnd: '6',
                        width: 'calc(95% - 22px)',
                        height: 'calc(95% - 22px)',
                        boxSizing: 'border-box',
                        margin: '11px',
                        padding: '2%',
                        fontSize: '1vw',
                        boxShadow: '0 0 0 3px var(--black), 0 0 0 6px var(--border_orange), 0 0 0 8px var(--border_shadow_orange), 0 0 0 11px var(--black)',
                        position: 'relative'
                    }}>
                    <div style={{ textAlign: 'center', fontSize: '1.5vw', textDecoration: 'underline', height: '20%' }}>LEADERBOARD</div>
                    <div style={{ width: '100%', height: '30%', display: 'flex', flexDirection: 'row' }}>
                        <img src={`${process.env.PUBLIC_URL}/assets/images/corn.png`} style={{ width: '24px', height: '24px' }} />
                        <p>
                            The leaderboard tracks all crops and produce harvested by all players, with weekly and all time boards. It also tracks the richest players.
                        </p>
                    </div>
                    <div style={{ width: '100%', height: '50%', textAlign: 'center' }}>
                        <p>
                            Check it out to see your global position in individual goods!
                        </p>
                    </div>

                    <img src={`${process.env.PUBLIC_URL}/assets/images/corn.png`} style={{ height: '20%', position: 'absolute', bottom: '-4%', left: '8%', transform: 'rotate(10deg)', zIndex: '6' }} />
                    <img src={`${process.env.PUBLIC_URL}/assets/images/corn.png`} style={{ height: '20%', position: 'absolute', bottom: '-4%', left: '11%', transform: 'rotate(0deg)', zIndex: '6' }} />
                    <img src={`${process.env.PUBLIC_URL}/assets/images/corn.png`} style={{ height: '20%', position: 'absolute', bottom: '-4%', left: '14%', transform: 'rotate(0deg)', zIndex: '6' }} />
                    <img src={`${process.env.PUBLIC_URL}/assets/images/corn.png`} style={{ height: '20%', position: 'absolute', bottom: '-4%', left: '17%', transform: 'rotate(-10deg)', zIndex: '6' }} />
                    <img src={`${process.env.PUBLIC_URL}/assets/images/corn.png`} style={{ height: '20%', position: 'absolute', bottom: '5%', left: '10%', transform: 'rotate(20deg)', zIndex: '3' }} />
                    <img src={`${process.env.PUBLIC_URL}/assets/images/corn.png`} style={{ height: '20%', position: 'absolute', bottom: '5%', left: '12.5%', transform: 'rotate(0deg)', zIndex: '5' }} />
                    <img src={`${process.env.PUBLIC_URL}/assets/images/corn.png`} style={{ height: '20%', position: 'absolute', bottom: '5%', left: '15%', transform: 'rotate(-20deg)' }} />
                    <img src={`${process.env.PUBLIC_URL}/assets/images/corn.png`} style={{ height: '20%', position: 'absolute', bottom: '-5.8%', left: '1%', transform: 'rotate(-110deg)', zIndex: '2' }} />

                    <img src={`${process.env.PUBLIC_URL}/assets/images/potato.png`} style={{ height: '20%', position: 'absolute', bottom: '-4%', right: '8%', transform: 'rotate(10deg)', zIndex: '5' }} />
                    <img src={`${process.env.PUBLIC_URL}/assets/images/potato.png`} style={{ height: '20%', position: 'absolute', bottom: '-4%', right: '11%', transform: 'rotate(0deg)', zIndex: '5' }} />
                    <img src={`${process.env.PUBLIC_URL}/assets/images/potato.png`} style={{ height: '20%', position: 'absolute', bottom: '-4%', right: '14%', transform: 'rotate(0deg)', zIndex: '5' }} />
                    <img src={`${process.env.PUBLIC_URL}/assets/images/potato.png`} style={{ height: '20%', position: 'absolute', bottom: '-4%', right: '17%', transform: 'rotate(-10deg)', zIndex: '5' }} />
                    <img src={`${process.env.PUBLIC_URL}/assets/images/potato.png`} style={{ height: '20%', position: 'absolute', bottom: '-4%', right: '20%', transform: 'rotate(0deg)', zIndex: '5' }} />
                    <img src={`${process.env.PUBLIC_URL}/assets/images/potato.png`} style={{ height: '20%', position: 'absolute', bottom: '-4%', right: '23%', transform: 'rotate(0deg)', zIndex: '5' }} />
                    <img src={`${process.env.PUBLIC_URL}/assets/images/potato.png`} style={{ height: '20%', position: 'absolute', bottom: '-4%', right: '26%', transform: 'rotate(0deg)', zIndex: '5' }} />
                    <img src={`${process.env.PUBLIC_URL}/assets/images/potato.png`} style={{ height: '20%', position: 'absolute', bottom: '7%', right: '10%', transform: 'rotate(20deg)', zIndex: '3' }} />
                    <img src={`${process.env.PUBLIC_URL}/assets/images/potato.png`} style={{ height: '20%', position: 'absolute', bottom: '7%', right: '12.5%', transform: 'rotate(0deg)', zIndex: '3' }} />
                    <img src={`${process.env.PUBLIC_URL}/assets/images/potato.png`} style={{ height: '20%', position: 'absolute', bottom: '7%', right: '15%', transform: 'rotate(-20deg)', zIndex: '3' }} />
                    <img src={`${process.env.PUBLIC_URL}/assets/images/potato.png`} style={{ height: '20%', position: 'absolute', bottom: '7%', right: '17.5%', transform: 'rotate(0deg)', zIndex: '3' }} />
                    <img src={`${process.env.PUBLIC_URL}/assets/images/potato.png`} style={{ height: '20%', position: 'absolute', bottom: '7%', right: '20%', transform: 'rotate(0deg)', zIndex: '3' }} />
                    <img src={`${process.env.PUBLIC_URL}/assets/images/potato.png`} style={{ height: '20%', position: 'absolute', bottom: '6%', right: '22.5%', transform: 'rotate(5deg)', zIndex: '3' }} />

                </div>


                <div id='other' style={{
                    gridColumnStart: '4',
                    gridColumnEnd: '5',
                    gridRowStart: '4',
                    gridRowEnd: '6',
                    width: '100%',
                    height: '95%',
                }}>
                    <div style={{
                        width: 'calc(92% - 22px)',
                        height: 'calc(100% - 22px)',
                        boxSizing: 'border-box',
                        margin: '11px',
                        boxShadow: '0 0 0 3px var(--black), 0 0 0 6px var(--border_orange), 0 0 0 8px var(--border_shadow_orange), 0 0 0 11px var(--black)',
                        backgroundColor: 'var(--menu_light)',
                        padding: '0% 3% 0% 3%',
                        fontSize: '.7vw'
                    }}>
                        <div style={{ textAlign: 'center', fontSize: '1.5vw', height: '12%' }}>Other</div>
                        <p style={{ height: '60%' }}>
                            <span style={{ textDecoration: 'underline' }}>About</span>:
                            I am an undergrad studying computer science at UMass Amherst who enjoys programming in their free time, and made this website initially as a summer 2023 project.
                            It's done in React and hosted with various Azure services. I wrote all of the code and made all of the images.
                            I'm no artist, but when they're pixel images, there's only so many combinations of wrong before you get it right.
                            Hope you enjoy playing!
                        </p>
                        <div style={{ height: '20%' }}>
                            <li>Contact: livefarmgame@gmail.com</li>
                            <li><a target='_blank' href="/privacy.html">Privacy Policy</a></li>
                            <li><a target='_blank' href="/terms.html">Terms and Conditions</a></li>
                            <li><a target='_blank' href="/cookiepolicy.html">Cookie Policy</a></li>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    )

}

export default HowToPlay;