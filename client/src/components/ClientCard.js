import React, { useState, useEffect } from "react";
import TransactionsCard from "./TransactionsCard";

export default function ClientCard({ id, name, email, trans }) {

  // console.log(name)
  // console.log(email)
  // console.log(id)
  console.log(id)

  //---------------STATE-------------
  const [shop, setShop] = useState(null);



  useEffect(() => {
    fetch("/check_store_session").then((resp) => {
      if (resp.ok) {
        resp.json().then(setShop);
      }
    });
  }, []);

  console.log(shop?.code)






  //---------------------------------------------------------------- MY CLIENT REMOVE FROM SUBSCRIBED CLIENTS BUTTON-------------------------------
  const [getmessage, setMessage] = useState('');

  const shopCode = shop?.code
  const shopName = shop?.name

  const handleUnsubscribe = async () => {
    const confirmUnsub = window.confirm(`Are you sure you want to remove ${name} from Clients?`);

    if (confirmUnsub) {
      try {
        const response = await fetch('/store_unsubscribe', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ client_id: id, store_code: shopCode }),
        });

        const data = await response.json();
        console.log(response.status)

        if (response.ok) {
          alert(`Successfully unsubscribed ${name} from ${shopName}`)
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








  return (
    <div align='center'>
      {getmessage ? getmessage : ''}
      <br />
      <b>Name:</b> {name}
      <br />
      <b>Email:</b> {email}
      <br />
      <br />
      <button onClick={handleUnsubscribe}>Unsubscribe Client</button>
      <br />
      <br />
      {/* <b><h1>Transactions:</h1> </b>
            <button onClick={toggleTransactions}>{showTransactions ? 'Hide Transactions' : 'Show Transactions'}</button>
            <br/>
            {showTransactions && <TransactionsCard  clientid={id} trans={trans} />} */}
      <br />
    </div>
  )
}
