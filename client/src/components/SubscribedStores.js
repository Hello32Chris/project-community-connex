import React, { useState, useEffect } from "react";


export default function SubscribedStores({ stores }) {

  const [client, setClient] = useState(null)
  const [getmessage, setMessage] = useState('');

  useEffect(() => {
    fetch("/check_client_session").then((resp) => {
      if (resp.ok) {
        resp.json().then(setClient);
      }
    });
  }, []);


  const storeName = stores.map((store) => store.name)
  // const storeId = stores.map((store) => store.id)
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

        const data = await response.json();
        console.log(response.status)

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



  // console.log(client?.subscribed_stores)
  // const handleUnsub = () => {
  //   return alert('clicked')
  // }

  const subbedStores = client?.subscribed_stores || []

  const subDiv = subbedStores.map((store, index) => (
    <div key={index} >
      <p>Name: {store.name}</p>
      <p>Email: {store.email}</p>
      <p>Code: {store.code}</p>
      <br />
      <button onClick={() => handleUnsub(store)}>Unsubscribe</button>
    </div>
  ))

  console.log(client?.subscribed_stores)



  return (
    <div align='center' id="subbedclients">
      <div>{getmessage && getmessage}</div>
      <div  >
        <div><h1>Subscribed Stores</h1></div>
      </div>
      <div>
        <div>{subDiv}</div>
      </div >
    </div>
  )
}

