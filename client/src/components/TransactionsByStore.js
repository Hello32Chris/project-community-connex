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
          </p>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsByStore;

//   const [shop, setShop] = useState(null);
//   const [carts, setCarts] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("/check_store_session");
//         if (response.ok) {
//           const store = await response.json();
//           setShop(store);

//           // Assuming there is a carts endpoint, fetch cart data here
//           const cartsResponse = await fetch("/carts");
//           if (cartsResponse.ok) {
//             const cartData = await cartsResponse.json();
//             setCarts(cartData.carts);
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching store data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   // Check if shop or carts is null or undefined
//   if (!shop || !carts) {
//     return <p>Loading...</p>; // You might want to display a loading indicator
//   }

//   // Check if transactions is null or undefined
//   const transactions = shop.transactions || [];
//   console.log(shop.goods_services);

//   // Map over goods_services and filter the cart by goods_service_id
//   const goodsServicesWithCart = shop.goods_services.map((goodsService) => {
//     const cartForGoodsService = carts.find((cart) => cart.goods_service_id === goodsService.id);
//     return {
//       ...goodsService,
//       cart: cartForGoodsService || null,
//     };
//   });

//   return (
//     <div align='center' className='storess'>
//       <h2>Transactions for {shop ? shop.name : ""}</h2>
//       {transactions.map((transaction) => (
//         <div key={transaction.id}>
//           <div><b>Client:</b> {transaction.client.name}</div>
//           <div><b>Email:</b> {transaction.client.email}</div>
//           <div><b>Total Amount:</b> ${transaction.total_amount.toFixed(2)}</div>
//           {/* Add more details as needed */}
//           <br />
//           {/* Format date similar to ClientTransactions component */}
//           <div><b>Date/Time:</b> {new Date(transaction.timestamp).toLocaleString('en-US', {
//             year: 'numeric',
//             month: 'numeric',
//             day: 'numeric',
//             hour: 'numeric',
//             minute: 'numeric',
//             hour12: true,
//             timeZone: 'America/New_York',
//           })}</div>
//           <div>-----------------------------------------------------------------</div>
//           <div>-------------------------------------------------------------------------</div>
//           <br />
//           <br />
//         </div>
//       ))}

//       {goodsServicesWithCart.map((goodsService) => (
//         <div key={goodsService.id}>
//           <h3>{goodsService.name}</h3>
//           <p>Price: ${goodsService.price.toFixed(2)}</p>
//           {goodsService.cart && (
//             <p>Cart Information: {/* Render cart details from goodsService.cart */}</p>
//           )}
//           <hr />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TransactionsByStore;