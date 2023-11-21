import React, { useState, useEffect } from 'react';

const TransactionsByStore = ({ stores, loggedInStoreId }) => {

  const [transactions, setTransactions] = useState([]);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchedStore = stores.find(store => store.id === loggedInStoreId);
        

        if (!matchedStore) {
          // Handle the case where the store is not found
          console.error('Store not found for the logged-in ID:', loggedInStoreId);
          return;
        }

        const response = await fetch(`/transactions/${loggedInStoreId}`);
        const data = await response.json();

        // Return data and set them to states
        setShop(matchedStore);
        setTransactions(data.transactions);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [stores,loggedInStoreId]);

  if (loading) {
    return <p>Loading...</p>;
  }
// NEED TO CREAT ROUTE TO RECEIVE TRANSACTIONS BY STORE ID

  return (
    <div>
      <h2>Transactions for {shop ? shop.name : ""}</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            {/* Render transaction details here */}
            <p>Total Amount: {transaction.total_amount}</p>
            {/* Add more details as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsByStore;