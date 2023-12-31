import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";


export default function SubscribedStores() {



  useEffect(() => {
    document.body.className = 'substoreback';
    return () => {
      document.body.className = '';
    }
  }, []);

  const [client, setClient] = useState(null)
  const [getmessage, setMessage] = useState('');


  //------------------------------------------------------------- FETCH FOR CLIENT SESSION ---------
  useEffect(() => {
    fetch("/check_client_session").then((resp) => {
      if (resp.ok) {
        resp.json().then(setClient);
      }
    });
  }, []);


  //------------------------------------------------------------------ UNSUBSCRIBE BUTTON ----------
  const clientId = client?.id

  const handleUnsub = async (store) => {
    const confirmUnsub = window.confirm(`Are you sure you want to unsubscribe from ${store.name}?`);
    if (confirmUnsub) {
      try {
        const response = await fetch('/store_unsubscribe', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ client_id: clientId, store_code: store.code }),
        });
        if (response.ok) {
          alert(`Successfully unsubscribed from ${store.name}`)
          setTimeout(() => {
            window.location.reload()
          }, 500)
          setMessage('Success')
        } else {
          setMessage('Failed to unsubscribe');
          window.location.reload()
        }
      } catch (error) {
        console.error('Error:', error.message, error);
        setMessage('Error occurred');
      }
    };
  }

  const subbedStores = client?.subscribed_stores || []

  //------------------------------------------------------ MAPPING THROUGH SUBSCRIBED STORES ---------
  const subDiv = subbedStores.map((store, index) => (
    <div align='center' id="subbedclients" key={index} >
      <Link className='substores' to={`/stores/${store.id}`}>
        <p><b>Name: </b>{store.name}</p>
        <p><b>Email: </b>{store.email}</p>
        <p><b>Code:</b> {store.code}</p>
        <br />
        <button onClick={() => handleUnsub(store)}>Unsubscribe</button>
      </Link>
    </div>
  ))

  console.log(client?.subscribed_stores)

  return (
    <div id='subdiv'>
      <div>{getmessage && getmessage}</div>
      <div align='center'>
        <h1>Subscribed Stores</h1>
      </div>
      <div>
        {subDiv}
      </div>
    </div>
  )
}

