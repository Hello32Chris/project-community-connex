import React, { useState, useEffect } from "react";
import ClientCard from "./ClientCard";

export default function Clients({ clients }) {

    const [shop, setShop] = useState(null)

    useEffect(() => {
        fetch("/check_store_session").then((resp) => {
          if (resp.ok) {
            resp.json().then(setShop);
          }
        });
      }, []);

    const subbedClients = shop?.subscribed_clients || [];

    const mappedSubbedClients = subbedClients?.map((client) => {
        console.log(client)
        const id = client.id
        return id
    })
    console.log(mappedSubbedClients)

    // const checkSub = useEffect(() => {
    //     if (mappedSubbedClients.includes())
    // })

    


    // console.log(clients.name)
    // console.log(clients.email)
    // console.log(clients.transactions)
    // console.log(clients)

    const clientView = subbedClients.map((client) => {
        return (
            <ClientCard key={client.id}
                id={client.id}
                name={client.name}
                email={client.email}
            />
        )
    })



    return (
        <div align='center'>
            {clientView}
        </div>
    )
}

