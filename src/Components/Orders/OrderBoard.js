import { useEffect, useState } from 'react'
import Order from "./Order";

function OrderBoard() {

    const [orders, setOrders] = useState([{}, {}, {}, {}]);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            const orders = await fetch('https://farm-api.azurewebsites.net/api/getAllOrders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({})
            });
            let data = await orders.json();
            setOrders(data.orders)
        }
        fetchOrders();
    }, [])

    const claimOrder = async (orderNum) => {
        if(orders[orderNum-1].numHave < orders[orderNum-1].numNeeded){
            return;
        }
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

        if(data.message === "SUCCESS") {
            setOrders((old) => {
                let newOrders = [...old]
                newOrders[orderNum-1] = {
                    good: data.newGood,
                    numNeeded: data.newNumNeeded,
                    numHave: 0
                }
                return newOrders;
            })
        }

        //replace orderNum in orders array
    }

    return (
        <div id="order-screen" style={{
            width: '60vw',
            height: '80vh',
            boxShadow: '0 0 0 3px var(--black), 0 0 0 6px var(--border_orange), 0 0 0 8px var(--border_shadow_orange), 0 0 0 11px var(--black)',
            backgroundColor: 'var(--menu_dark)'
        }}>
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
            </div>
            <div id="order-board" style={{
                width: '100%',
                height: '90%',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gridTemplateRows: 'repeat(2, 1fr)',
            }}>
                {orders[1].good !== undefined && <Order orderNum={1} good={orders[0].good} numHave={orders[0].numHave} numNeeded={orders[0].numNeeded} claimOrder={claimOrder} />}
                {orders[1].good !== undefined && <Order orderNum={2} good={orders[1].good} numHave={orders[1].numHave} numNeeded={orders[1].numNeeded} claimOrder={claimOrder} />}
                {orders[1].good !== undefined && <Order orderNum={3} good={orders[2].good} numHave={orders[2].numHave} numNeeded={orders[2].numNeeded} claimOrder={claimOrder} />}
                {orders[1].good !== undefined && <Order orderNum={4} good={orders[3].good} numHave={orders[3].numHave} numNeeded={orders[3].numNeeded} claimOrder={claimOrder} />}

            </div>
        </div>
    )
}

export default OrderBoard;