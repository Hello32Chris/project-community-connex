import React, { useState, useEffect } from "react";



export default function SubscribeButton({ storecode, storeid, storename }) {

    const [subToggle, setSubToggle] = useState(false)
    const [message, setMessage] = useState('')
    const [client, setclient] = useState([])


//------------------------------------------------------------------ CLIENT CHECK SESSION -------------------------
    useEffect(() => {
        fetch("/check_client_session").then((resp) => {
            if (resp.ok) {
                resp.json().then(setclient);
            }
        });
    }, []);


//------------------------------------------------------------------ SUBSCRIPTION LOGIC --------------------------------------------
    const subStores = client?.subscribed_stores || []
    const mappedStoreIds = subStores.map((store) => {
        const id = store.id
        return id
    })

    
//------------------------------------------ CHECKS FOR SUBSCRIPTIONS ALREADY PRESENT AND FLIPS BUTTONS BASED ON CLIENT SESSION ----------------------
    const checkSub = useEffect(() => {
        if (mappedStoreIds.includes(storeid))
            setSubToggle(true)
    }, [mappedStoreIds, storeid])


//------------------------------------------------------------------------------------------------ HANDLE SUBSCRIBE -------------------------
    const clientId = client?.id
    const handleUnsubscribe = async () => {
        const confirmUnsub = window.confirm(`Are you sure you want to usunbscribe from ${storename}?`);

        if (confirmUnsub) {
            try {
                const response = await fetch('/store_unsubscribe', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ client_id: clientId, store_code: storecode }),
                });
                if (response.ok) {
                    setMessage('Unsubscribed!')
                    setSubToggle(false)
                    alert(`Successfully unsubscribed from ${storename}`)
                    setTimeout(() => {
                        setMessage('')
                    }, 2000)
                } else {
                    setMessage('Failed to unsubscribe');
                }
            } catch (error) {
                console.error('Error:', error.message, error);
                setMessage('Error occurred');
            }
        };
    }


//------------------------------------------------------------------------------------------------ HANDLE SUBSCRIBE -------------------------
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
                alert(`You are now subscribed to ${storename}!`)
                setMessage('Subscribed!')
                // Handle successful subscription
                console.log(data.message);
                setTimeout(() => {
                    setMessage('')
                }, 2000)
                // Notify the parent component that a subscription has occurred
            } else {
                // Handle errors
                const errorData = await response.json();
                console.error('Failed to subscribe:', errorData.error);
                setMessage('Failed to unsubscribe');
            }
        } catch (error) {
            console.error('Error during subscription:', error.message);
            setMessage('Error occurred');
        }
    };

    if (!client) {
        return <p>Loading...</p>; 
    } 


    return (
        <div id="subBtn" align='center'>
            {checkSub}
            {message}
            <br />
            {!subToggle ? <button className="storeservicebtn" onClick={(handleSubscribe)} >Subscribe</button> : <button className="storeservicebtn" onClick={(handleUnsubscribe)} >Unsubscribe</button>}
        </div>
    )
}

