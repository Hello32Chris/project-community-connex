import React from "react";
import StoreCard from "./StoreCard";


export default function StoreAcctPage({ stores }) {

  const store = stores.map((store) => {
    return <StoreCard key={store.id}
       name={store.name}
       email={store.email}
       goodsNservices={store.goods_services}
       transactions={store.transactions}
    
    />
  })


  return (
    <div>
      <h2>Account Manager for store</h2>
      {store}
    </div>
  );
};


