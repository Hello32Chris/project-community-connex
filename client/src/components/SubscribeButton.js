import React, { useState, useEffect } from "react";



export default function SubscribeButton({ storecode, storeid }) {

    const [subToggle, setSubToggle] = useState(false)
    const [getsubs, setSubs] = useState([])
    const [client, setclient] = useState([])


    //------------------------------------------------------------------ CLIENT CHECK SESSION -------------------------
    useEffect(() => {
        fetch("/check_client_session").then((resp) => {
            if (resp.ok) {
                resp.json().then(setclient);
            }
        });
    }, []);



    //------------------------------------------------------------- SUBSCRIPTION LOGIC --------------------------------------------
    const subStores = client?.subscribed_stores || []
    const mappedStoreIds = subStores.map((store) => {
        const id = store.id
        return id
    })
    //------------------------------------------ if the store id is already in the clients subscriptions toggle the subscribe buttons to say unsubscribe ----------------------
    const checkSub = useEffect(() => {
        if (mappedStoreIds.includes(storeid))
            setSubToggle(true)
    }, [mappedStoreIds, storeid])

    
    
    
    const handleSubscribe = async () => {
        try {
            const response = await fetch('/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ store_code: storecode }),
            });
            if (response.ok) {
                const data = await response.json();
                setSubToggle(true)
                // Handle successful subscription
                console.log(data.message);
                setSubscribed(true);
                // Notify the parent component that a subscription has occurred
            } else {
                // Handle errors
                const errorData = await response.json();
                console.error('Failed to subscribe:', errorData.error);
            }
        } catch (error) {
            console.error('Error during subscription:', error.message);
        }
    };
    
    if (!client) {
        return <p>Loading...</p>; // You might want to display a loading indicator
    }
    
    
    return (
        <div align='center'>
            {checkSub}
            <button onClick={(handleSubscribe)} >
                {subToggle ? 'Unsubscribe' : 'Subscribe'}
            </button>
        </div>
    )
}

