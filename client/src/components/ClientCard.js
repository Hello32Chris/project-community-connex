import React, { useState, useEffect } from "react";


export default function ClientCard({ id, name, email}) {

  const [shop, setShop] = useState(null);
  const [getmessage, setMessage] = useState('');

//--------------------------------------------------------------------STORE SESSION CHECK ----------------------------------
  useEffect(() => {
    fetch("/check_store_session").then((resp) => {
      if (resp.ok) {
        resp.json().then(setShop);
      }
    });
  }, []);

  console.log(shop?.code)

//------------------------------------------------------ REMOVE CLIENT FROM SUBSCRIBED CLIENTS -------------------------------

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
    </div>
  )
}
