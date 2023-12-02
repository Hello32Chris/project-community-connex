import React, { useState, useEffect } from "react";


export default function CartCard() {

    const [client, setClient] = useState({})
    const [carts, setCarts] = useState([]);
    const [filteredCarts, setFilteredCarts] = useState([]);
    const [goods, setGoods] = useState([]);
    const [clientGoods, setClientGoods] = useState([]);


//------------------------------------------------------------------- CARTS FETCH --------------------
    useEffect(() => {
        const fetchCarts = () => {
            fetch('/carts')
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch cart data');
                    }
                    return response.json();
                })
                .then((data) => {
                    setCarts(data.carts);
                })
                .catch((error) => {
                    console.error(error.message);
                });
        };
        fetchCarts();
    }, [client.id]);


//--------------------------------------------------------- CHECK CLIENT SESSION ---------------------
    useEffect(() => {
        fetch("/check_client_session").then((resp) => {
            if (resp.ok) {
                resp.json().then(setClient);
            }
        });
    }, []);


//------------------------------------------------------------ GOODS SERVICES FETCH -------------------
    useEffect(() => {
        fetch('/goods')
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setGoods(data);
            })
            .catch((error) => {
                console.error('Error fetching goods:', error);
            });
    }, []);


//------------------------------------------------------------ MAPPING THRU MAPPED-GOODS --------------
    const mappedGoods = goods.map((good) => {
        const id = good.id
        const name = good.name
        const price = good.price
        return { id, name, price }
    })

    console.log(mappedGoods)


//----------------------------------------------------- FETCH CART BASED ON CLIENT SESSION ------------
    const clientId = client?.id

    useEffect(() => {
        if (clientId) {
            const clientCarts = carts.filter((cart) => cart.client_id === clientId);
            setFilteredCarts(clientCarts);
        }
    }, [clientId, carts]);


//--------------------------------------------------------------- FILTER THROUGH CARTS BY GOODS ID ------
    useEffect(() => {
        if (filteredCarts.length > 0 && goods.length > 0) {
            const goodsInCarts = filteredCarts.map((cart) =>
                goods.find((good) => good.id === cart.goods_service_id)
            );
            setClientGoods(goodsInCarts);
        }
    }, [filteredCarts, goods]);

    console.log(clientGoods)


//------------------------------------------------------------------ DELETE CART ITEMS -------------------
    const handleDeleteCartItems = async (goods_id, goods_name) => {
        try {
            const response = await fetch('/delete_cart_items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clientId, goods_id }),
            });
            if (response.ok) {
                console.log('Cart items deleted successfully');
                alert(`Item ${goods_name} deleted from Cart!`)
            } else {
                console.error('Failed to delete cart items');
            }
        } catch (error) {
            console.error('Error during cart item deletion:', error);
        }
    };


//---------------------------------------------------------------------- CARTS MAPPED OUT FOR DISPLAY ------
    const cartDisplay = clientGoods.map((good) =>
        <div className='cartitems' key={good.id}>
            <div>Service -{good.name}</div>
            <div>Price - {good.price}</div>
            <button className='cartremovebtn' onClick={() => handleDeleteCartItems(good?.id, good?.name)} >Remove Cart Item</button>
            <br />
            <br />
        </div>
    )

    return (
        <div align='center' id="cart">
            {cartDisplay}
        </div>
    )
}

