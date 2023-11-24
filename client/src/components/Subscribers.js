import React, { useState, useEffect } from "react";


export default function Subscribers({ clients, stores }) {

    const [getSubs, setSubs] = useState([])



    // const subscribedClients = clients.filter((client) =>
    //     stores.some((subscription) => subscription.client_id === client.id)
    // );

    const clientView = clients.map((client) => (
        <div key={client.id}>
            <p>{client.name}</p>
            <p>{client.email}</p>
            {/* Add additional client details as needed */}
        </div>
    ));

    useEffect(() => {
        fetch('/subscriptions')
            .then((resp) => resp.json())
            .then((data) => setSubs(data))
    }, [])

    console.log(getSubs)


    return (
        <div id="subbedclients" align='center'>
            Clients Subscribed
            {clientView}
        </div>
    )
}

