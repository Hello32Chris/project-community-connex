import React, { useState, useEffect } from 'react';

const TransactionsByStore = () => {

  
  const [shop, setShop] = useState(null);
  const [trans, setTrans] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);


// ------------------------------------------------------------------ STORE SESSION CHECK --------------
  useEffect(() => {
    fetch("/check_store_session")
      .then((resp) => {
        if (resp.ok) {
          resp.json().then((store) => setShop(store));
        }
      });
  }, []);


// ------------------------------------------------------------------ FETCH FOR ALL TRANSACTIONS --------
  useEffect(() => {
    fetch('/transactions')
      .then((resp) => resp.json())
      .then((data) => setTrans(data))
      .finally(() => setLoading(false));
  }, []);


// -----------------------------------------------------------------------  --------
useEffect(() => {
    if (!shop || !trans || loading) {
      return;
    }
    const shopGoodsServiceNames = shop.goods_services.map((service) => service.name);
    const filtered = trans.filter((transaction) => {
      const transactionGoodsServiceNames = transaction.goods_service_names?.split(', ') || [];
      return transactionGoodsServiceNames.some((name) => shopGoodsServiceNames.includes(name));
    });
    setFilteredTransactions(filtered);
  }, [shop, trans, loading]);

  console.log(filteredTransactions)

  return (
    <div align='center' className='storess'>
      <br/>
      <h2>Filtered Transactions for<br/> {shop ? shop.name : ""}</h2>
      <ul>
        {filteredTransactions.map((tran) => (
          <div key={tran.id}>
            <p>Client: {tran.client.name}</p>
            <p>Email: {tran.client.email}</p>
            <p>Total Amount: ${tran.total_amount.toFixed(2)}</p>
            <p>Services: {tran.goods_service_names}</p>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsByStore;