import React, { useState, useEffect } from "react";
import RegisterPage from "./RegisterPage";


export default function CartCard() {

    const [client, setClient] = useState([])
    const [carts, setCarts] = useState([]);
    const [filteredCarts, setFilteredCarts] = useState([]);

    

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

    useEffect(() => {
        fetch("/check_client_session").then((resp) => {
            if (resp.ok) {
                resp.json().then(setClient);
            }
        });
    }, []);

    const clientId = client?.id

    const presentCarts = carts && carts

    
    
    
    useEffect(() => {
        if (clientId) {
            // Filter carts based on clientId
            const clientCarts = carts.filter((cart) => cart.client_id === clientId);
            setFilteredCarts(clientCarts);
        }
    }, [clientId, carts]);
    
    console.log(filteredCarts)

    console.log(clientId)


    //   const cartItems = clientCarts?.map((item) => {
    //     return <div key={item.id}>
    //         <div>Service - {item.name}</div>
    //         <div>Store - {item.store.name}</div>
    //         <div>Price - {item.price}</div>
    //         <br/>
    //     </div>
    //   })


    return (
        <div align='center' id="cart">
            {/* {cartItems} */}
        </div>
    )
}

