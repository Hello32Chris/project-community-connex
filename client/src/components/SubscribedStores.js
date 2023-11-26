import React, { useState, useEffect } from "react";


export default function SubscribedStores() {

  const [client, setClient] = useState(null)

  useEffect(() => {
    fetch("/check_client_session").then((resp) => {
      if (resp.ok) {
        resp.json().then(setClient);
      }
    });
  }, []);

  // console.log(client?.subscribed_stores)

  const subbedStores = client?.subscribed_stores || []

  const subDiv = subbedStores.map((store, index) => (
    <div key={index} >
      <p>Name: {store.name}</p>
      <p>Email: {store.email}</p>
      <p>Code: {store.code}</p>
      <br />
    </div>
  ))

  console.log(client?.subscribed_stores)



  return (
    <div align='center' id="subbedclients">
      <div  >
        <div><h1>Subscribed Stores</h1></div>
      </div>
      <div>
        <div>{subDiv}</div>
      </div >
    </div>
  )
}

