import React, { useState, useEffect } from 'react';

const TransactionsByStore = ({ storeId }) => {


  const [transactions, setTransactions] = useState([]);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/transactions/${storeId}`);
        const data = await response.json();

        // Assuming your API returns data in the format { store: {...}, transactions: [...] }
        setStore(data.store);
        setTransactions(data.transactions);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storeId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Transactions for {store.name}</h2>
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