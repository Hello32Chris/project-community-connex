import React, { useState, useEffect } from "react";
import ClientCard from "./ClientCard";

export default function Clients() {

  useEffect(() => {
    document.body.className = 'clientsubback';
    return () => {
      document.body.className = '';
  }}, []);

    const [shop, setShop] = useState(null)

// ----------------------------------------------------- STORE SESSION CHECK -------
    useEffect(() => {
        fetch("/check_store_session").then((resp) => {
          if (resp.ok) {
            resp.json().then(setShop);
          }
        if (!shop) {
          return <div>Loading...</div>;
        }
        });
      }, []);
    const subbedClients = shop?.subscribed_clients || [];
    const mappedSubbedClients = subbedClients?.map((client) => client)

    console.log(mappedSubbedClients)

//--------------------------------------------------------- MAPPED SUBBED CLIENTS ---
    const clientView = mappedSubbedClients.map((client) => (
            <ClientCard key={client.id}
                id={client.id}
                name={client.name}
                email={client.email}
            />
        ))

    return (
        <div align='center'>
            {clientView}
        </div>
    )
}

