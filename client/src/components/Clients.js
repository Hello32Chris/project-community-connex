import React, { useState } from "react";
import ClientCard from "./ClientCard";

export default function Clients({ clients }) {

//     function getSessionStoreId() {
//         const sessionId = sessionStorage.getItem("sessionId");
//         return sessionId;
//       }

//     const loggedInStoreId = getSessionStoreId();

//     const filteredClients = clients.filter((client) =>
//     client.subscribed_stores.some((store) => store.id === loggedInStoreId)
//   );
    


    // console.log(clients.name)
    // console.log(clients.email)
    // console.log(clients.transactions)

    const clientView = clients.map((client) => {
        return (
            <ClientCard key={client.id}
                id={client.id}
                name={client.name}
                email={client.email}
                trans={client.transactions}
            />
        )
    })

    // console.log(clients)


    return (
        <div align='center'>
            {clientView}
        </div>
    )
}

