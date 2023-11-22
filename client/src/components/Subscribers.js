import React, { useState, useEffect } from "react";


export default function Subscribers({ clientid, storeid }) {

    const [getStores, setStores] = useState([])
    const [getClients, setClients] = useState([])


    useEffect(() => {
        fetch('/clients')
            .then((resp) => resp.json())
            .then((data) => setClients(data))
    }, [])



    useEffect(() => {
        fetch('/stores')
            .then((resp) => resp.json())
            .then((data) => setStores(data))
    }, [])

    const subscribedClients = getClients.filter((client) =>
        getClients.some((subscription) => subscription.client_id === client.id)
    );

    const clientView = subscribedClients.map((client) => (
        <div key={client.id}>
            <p>{client.name}</p>
            <p>{client.email}</p>
            {/* Add additional client details as needed */}
        </div>
    ));


    return (
        <div align='center'>
            {clientView}
        </div>
    )
}

