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
  const transactions = shop.transactions || [];
  console.log(shop)

  return (
    <div align='center' className='storess'>
      <h2>Transactions for {shop ? shop.name : ""}</h2>
      {transactions.map((transaction) => (
        <div key={transaction.id}>
          <div><b>Client:</b> {transaction.client.name}</div>
          <div><b>Email:</b> {transaction.client.email}</div>
          <div><b>Total Amount:</b> ${transaction.total_amount.toFixed(2)}</div>
          {/* Add more details as needed */}
          <br />
          {/* Format date similar to ClientTransactions component */}
          <div><b>Date/Time:</b> {new Date(transaction.timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'America/New_York',
          })}</div>
          <div>-----------------------------------------------------------------</div>
          <div>-------------------------------------------------------------------------</div>
          <br />
          <br />
        </div>
      ))}
    </div>
  );
};

export default TransactionsByStore;

//   const [shop, setShop] = useState(null);

//   useEffect(() => {
//     fetch("/check_store_session").then((resp) => {
//       if (resp.ok) {
//         resp.json().then((store) => setShop(store));
//       }
//     });
//   }, []);

//   // Check if shop is null or undefined
//   if (!shop) {
//     return <p>Loading...</p>; // You might want to display a loading indicator
//   }

//   // Check if transactions is null or undefined
//   const trans = shop.transactions || [];

//   return (
//     <div align='center' className='storess'>
//       <h2>Transactions for {shop ? shop.name : ""}</h2>
//       <ul>
//         {trans.map((tran) => (
//           <p key={tran.id}>
//             <p>Client: {tran.client.name}</p>
//             <p>Email: {tran.client.email}</p>
//             <p>Total Amount: {tran.total_amount}</p>
//             {/* Add more details as needed */}
//           </p>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default TransactionsByStore;
