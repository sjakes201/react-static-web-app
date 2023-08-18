import { useEffect, useState } from 'react'
import Order from "./Order";
import { useNavigate } from 'react-router-dom';
import CONSTANTS from '../../CONSTANTS';

function OrderBoard({ close, updateBalance, updateXP }) {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([{}, {}, {}, {}]);
    const [lastRefresh, setLastRefresh] = useState(0);

    const timePassedMS = Date.now() - lastRefresh;
    const timePassedMins = timePassedMS * (1 / 1000) * (1 / 60)

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');

            try {
                const orders = await fetch('https://farm-api.azurewebsites.net/api/getAllOrders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({})
                });
                if (!orders.ok) {
                    throw new Error(`HTTP error! status: ${orders.status}`);
                } else {
                    let data = await orders.json();
                    setOrders(data.orders)
                    setLastRefresh(data.lastOrderRefresh.LastOrderRefresh)
                }
            } catch (error) {
                if (error.message.includes('401')) {
                    console.log("AUTH EXPIRED")
                    localStorage.removeItem('token');
                    navigate('/');
                } else {
                    console.log(error)
                }
            }



        }
        fetchOrders();
    }, [])

    const claimOrder = async (orderNum, goldReward, xpReward) => {
        if (orders[orderNum - 1].numHave < orders[orderNum - 1].numNeeded) {
            return;
        }
        updateBalance(goldReward)
        updateXP(xpReward)
        const token = localStorage.getItem('token');
        const ordersQuery = await fetch('https://farm-api.azurewebsites.net/api/claimOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                orderNum: orderNum
            })
        });
        let data = await ordersQuery.json();
        // animation ?

        if (data.message === "SUCCESS") {
            setOrders((old) => {
                let newOrders = [...old]
                newOrders[orderNum - 1] = {
                    good: data.newGood,
                    numNeeded: data.newNumNeeded,
                    numHave: 0
                }
                return newOrders;
            })
        }

        //replace orderNum in orders array
    }

    const refreshOrder = async (orderNumToRefresh) => {
        let timePassedMS = Date.now() - lastRefresh;
        if (timePassedMS < CONSTANTS.VALUES.ORDER_REFRESH_COOLDOWN) {
            // NOT READY
        } else {
            // CAN REFRESH AGAIN
            try {
                const token = localStorage.getItem('token');

                const orders = await fetch('https://farm-api.azurewebsites.net/api/refreshOrder', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        orderNum: orderNumToRefresh
                    })
                });
                if (!orders.ok) {
                    throw new Error(`HTTP error! status: ${orders.status}`);
                } else {
                    let data = await orders.json();
                    setOrders((old) => {
                        let newOrders = [...old]
                        newOrders[orderNumToRefresh - 1] = {
                            good: data.newGood,
                            numNeeded: data.newNumNeeded,
                            numHave: 0
                        }
                        return newOrders;
                    })
                    setLastRefresh(Date.now())
                }
            } catch (error) {
                if (error.message.includes('401')) {
                    console.log("AUTH EXPIRED")
                    localStorage.removeItem('token');
                    navigate('/');
                } else {
                    console.log(error)
                }
            }
        }
    }

    return (
        <div id="order-screen" style={{
            width: '60vw',
            height: '80vh',
            boxShadow: '0 0 0 3px var(--black), 0 0 0 6px var(--border_orange), 0 0 0 8px var(--border_shadow_orange), 0 0 0 11px var(--black)',
            backgroundColor: 'var(--menu_dark)',
            position: 'relative'
        }}>
            <div style={{ position: 'absolute', top: '2.2vh', right: '1.3vw', cursor: 'pointer', textShadow: '-1px 1px var(--menu_light)' }} onClick={close}>X</div>
            <div id='title' style={{
                width: '100%',
                height: '10%',
                textDecoration: 'underline',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '3.5vh',
                paddingTop: '2%',
                color: 'var(--menu_lighter)',
                textShadow: '1px 1px 1px var(--black)',
            }}>
                <p>ORDER BOARD</p>
                {(timePassedMS < CONSTANTS.VALUES.ORDER_REFRESH_COOLDOWN) &&
                    <span style={{ position: 'absolute', right: '6%', fontSize: '0.8vw', color: 'lightgrey' }}>
                        <span style={{ textDecoration: 'underline' }}>Refresh cooldown:</span>
                        <span> </span>
                        {(Math.ceil(CONSTANTS.VALUES.ORDER_REFRESH_COOLDOWN * (1 / 1000) * (1 / 60) - timePassedMins))} {(Math.ceil(CONSTANTS.VALUES.ORDER_REFRESH_COOLDOWN * (1 / 1000) * (1 / 60) - timePassedMins)) === 1 ? 'minute' : 'minutes'}
                    </span>
                }
            </div>
            <div id="order-board" style={{
                width: '100%',
                height: '90%',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gridTemplateRows: 'repeat(2, 1fr)',
            }}>
                {orders[1].good !== undefined && <Order orderNum={1} good={orders[0].good} numHave={orders[0].numHave} numNeeded={orders[0].numNeeded} claimOrder={claimOrder} refreshOrder={refreshOrder} refreshable={timePassedMS > CONSTANTS.VALUES.ORDER_REFRESH_COOLDOWN} />}
                {orders[1].good !== undefined && <Order orderNum={2} good={orders[1].good} numHave={orders[1].numHave} numNeeded={orders[1].numNeeded} claimOrder={claimOrder} refreshOrder={refreshOrder} refreshable={timePassedMS > CONSTANTS.VALUES.ORDER_REFRESH_COOLDOWN} />}
                {orders[1].good !== undefined && <Order orderNum={3} good={orders[2].good} numHave={orders[2].numHave} numNeeded={orders[2].numNeeded} claimOrder={claimOrder} refreshOrder={refreshOrder} refreshable={timePassedMS > CONSTANTS.VALUES.ORDER_REFRESH_COOLDOWN} />}
                {orders[1].good !== undefined && <Order orderNum={4} good={orders[3].good} numHave={orders[3].numHave} numNeeded={orders[3].numNeeded} claimOrder={claimOrder} refreshOrder={refreshOrder} refreshable={timePassedMS > CONSTANTS.VALUES.ORDER_REFRESH_COOLDOWN} />}

            </div>
        </div >
    )

}
export default OrderBoard;