import React, { useState, useEffect } from "react";
import RegisterPage from "./RegisterPage";


export default function CartCard() {

    const [client, setClient] = useState([])
    const [carts, setCarts] = useState([]);
    const [filteredCarts, setFilteredCarts] = useState([]);
    const [goods, setGoods] = useState([]);
    const [clientGoods, setClientGoods] = useState([]);

    
//------------------------------------------------------- CARTS FETCH --------------------
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

    
//------------------------------------------------------------ GOODS SERVICES FETCH --------------------
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

    const mappedGoods = goods.map((good) => {
        const id = good.id
        const name = good.name
        const price = good.price
        return {id, name, price}
    })

    console.log(mappedGoods)

//-------------------------------------------------------------------- FETCH CART BASED ON CLIENT SESSION ---------------------------------
    const clientId = client?.id

    useEffect(() => {
        if (clientId) {
          // Filter carts based on clientId
          const clientCarts = carts.filter((cart) => cart.client_id === clientId);
          setFilteredCarts(clientCarts);
        }
      }, [clientId, carts]);

    //   const clientGoods = mappedGoods.filter((goods) => goods.id)
    useEffect(() => {
        if (filteredCarts.length > 0 && goods.length > 0) {
            // Filter goods based on goods_service_id in filteredCarts
            const goodsInCarts = filteredCarts.map((cart) =>
                goods.find((good) => good.id === cart.goods_service_id)
            );
            setClientGoods(goodsInCarts);
        }
    }, [filteredCarts, goods]);

    
    console.log(clientGoods)

    const cartDisplay = clientGoods.map((good) => 
        <div key={good.id}>
            <div>Service -{good.name}</div>
            <div>Price - {good.price}</div>
            <br/>
        </div>
        
    )


    


    // console.log(filteredCarts)
    // console.log(clientId)
    // console.log(goods)




    return (
        <div align='center' id="cart">
            {cartDisplay}
        </div>
    )
}

