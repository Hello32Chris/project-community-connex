import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";


export default function Checkout() {

    useEffect(() => {
        document.body.className = 'checkoutback';
        return () => {
          document.body.className = '';
      }}, []);

    const [client, setClient] = useState([])
    const [carts, setCarts] = useState([]);
    const [filteredCarts, setFilteredCarts] = useState([]);
    const [goods, setGoods] = useState([]);
    const [clientGoods, setClientGoods] = useState([]);

    const clientId = client?.id
    const history = useHistory()

//--------------------------------------------------------- CARTS FETCH -----------------------------
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

    const mappedGoods = goods.map((good) => {
        const id = good.id
        const name = good.name
        const price = good.price
        return { id, name, price }
    })

    console.log(mappedGoods)

//-------------------------------------------------- FETCH CART BASED ON CLIENT SESSION --------------------
    useEffect(() => {
        if (clientId) {
            const clientCarts = carts.filter((cart) => cart.client_id === clientId);
            setFilteredCarts(clientCarts);
        }
    }, [clientId, carts]);


//------------------------------------------------ COMPARING FETCHED CARTS AND GOODS/SERVICES TO GET LIST----
    useEffect(() => {
        if (filteredCarts.length > 0 && goods.length > 0) {
            const goodsInCarts = filteredCarts.map((cart) =>
                goods.find((good) => good.id === cart.goods_service_id)
            );
            setClientGoods(goodsInCarts);
        }
    }, [filteredCarts, goods]);

    console.log(clientGoods)

//------------------------------------------------------------ CALCULATE TOTAL OF CART ------------------------
    const calculateTotalPrice = () => {
        const totalPrice = clientGoods.reduce((total, good) => total + good.price, 0);
        return totalPrice.toFixed(2); 
    };

//-------------------------------------------------------------------------- CART DISPLAY FOR RETURN ----------
    const cartDisplay = clientGoods.map((good) =>
        <div key={good.id}>
            <div>Service -{good.name}</div>
            <div>Price - {good.price.toFixed(2)}</div>
            <br />
            <button onClick={() => handleDeleteCartItems(good.id, good.name)}>Remove from Cart</button>
            <br />
            <br />
        </div>

    )

//------------------------------------------------------------------------------ POST METHOD --------------------
    const checkout = async () => {
        const confirmDelete = window.confirm(` Check Out for total   $${calculateTotalPrice()}?`)
        if (confirmDelete) {
            try {
                const response = await fetch("/create_transaction", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        total_amount: calculateTotalPrice(),
                        store_id: 2,
                        client_id: clientId,
                        goods_service_names: clientGoods.map((good) => good.name).join(", "),
                    }),
                });
                if (response.ok) {
                    alert('Transaction Completed!\nThank you!')
                    setTimeout(() => {
                        history.push('/client/transactions')
                    }, 1000)
                    console.log("Transaction created successfully");
                } else {
                    console.error("Failed to create transaction");
                }
            } catch (error) {
                console.error("Error during checkout:", error);
            }
        }
    };

//----------------------------------------------------------------------------------- DELETE CART ITEMS -----------
    const handleDeleteCartItems = async (goods_id, goods_name) => {
        const confirmDelete = window.confirm(` Remove ${goods_name} from Cart?`)
        if (confirmDelete) {
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
                    setTimeout(() => {
                        window.location.reload()
                    }, 10)
                } else {
                    console.error('Failed to delete cart items');
                }
            } catch (error) {
                console.error('Error during cart item deletion:', error);
            }
        };}

        return (
            <div align='center' id="checkout">
                {cartDisplay}
                <div><b>Total Amount:</b> ${calculateTotalPrice()}</div>
                <br />
                <button className="finalchkout" onClick={checkout}><b>Checkout</b></button>
            </div>
        )
    }

