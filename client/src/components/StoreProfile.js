import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";




export default function StoreProfile({ stores }) {
    const { store_id } = useParams()

    const [shop, setShop] = useState(null);
    const [client, setClient] = useState(null);



    useEffect(() => {
        fetch("/check_client_session").then((resp) => {
            if (resp.ok) {
                resp.json().then(setClient);
            }
        });
    }, []);

    const clog = client ? true : false;
    const clientId = client?.id
    //------------------------------------------------------------------------------ ADD TO CART ------------------------------
    const handleAddToCart = async (goodsServiceID) => {
        try {
            const response = await fetch('/add_to_cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    client_id: clientId,
                    goods_service_id: goodsServiceID,
                }),
            });

            if (response.ok) {
                alert(`Added to Cart Successfully`)
                const data = await response.json();
                console.log(data.message); // or handle success in some way
            } else {
                const errorData = await response.json();
                console.error(errorData.error); // or handle the error in some way
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    //---------------------------------------------------------------------------------------------------------------



    useEffect(() => {
        const fetchStoreById = async () => {
            try {
                // Use store_id from useParams to fetch the specific store
                const response = await fetch(`/stores/${store_id}`);
                if (response.ok) {
                    const data = await response.json();
                    setShop(data);
                } else {
                    console.error(`Failed to fetch store data: ${response.status}`);
                }
            } catch (error) {
                console.error("Error fetching store data:", error);
            }
        };

        fetchStoreById();
    }, [store_id]);

    console.log(shop)



    // console.log(shop?.goods_services)

    const shopProfile = shop?.store_profile.map((prof) => {
        //bio location phone_number
        // console.log(prof)
        return (
            <div key={prof.id}>
                <h1>{prof.bio}</h1>
                <h1>{prof.location}</h1>
                <h1>{prof.phone_number}</h1>
            </div>
        );
    })

    const goods = shop?.goods_services.map((good) => {
        // console.log(good) //image, name, price, id
        return (
            <div key={good.id}>
                <br />
                <img className="goodsimage" alt={`An image of ${good.name}`} src={good.image} />
                <h2>{good.name}</h2>
                <h2>${good.price.toFixed(2)}</h2>
                <button onClick={() => handleAddToCart(good.id)} >Add To Cart</button>
                <br />
            </div>
        );
    })

    return (
        <div align='center'>
            <h1>Welcome to {shop?.name}!</h1>
            {shopProfile}
            <br />
            {goods}
        </div>
    )
}

