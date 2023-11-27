import React, { useState, useEffect } from 'react';

const TransactionsByStore = () => {
  const [shop, setShop] = useState(null);

  useEffect(() => {
    fetch("/check_store_session").then((resp) => {
      if (resp.ok) {
        resp.json().then((store) => setShop(store));
      }
    });
  }, []);

  // Check if shop is null or undefined
  if (!shop) {
    return <p>Loading...</p>; // You might want to display a loading indicator
  }

  // Check if transactions is null or undefined
  const trans = shop.transactions || [];

  return (
    <div align='center' className='storess'>
      <h2>Transactions for {shop ? shop.name : ""}</h2>
      <ul>
        {trans.map((tran) => (
          <p key={tran.id}>
            <p>Client: {tran.client.name}</p>
            <p>Email: {tran.client.email}</p>
            <p>Total Amount: {tran.total_amount}</p>
            {/* Add more details as needed */}
          </p>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsByStore;
