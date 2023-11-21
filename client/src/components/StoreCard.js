import React, { useState } from "react";
import Subscribers from './Subscribers'

export default function StoreCard({ storeid, storename, storeemail, storecode, storesubs, storegoods, storetrans }) {

  // console.log(name)
  // console.log(email)
  // console.log(id)


  //---------------STATE-------------
  const [showTransactions, setShowTransactions] = useState(false);


  //---------------FUNCTIONALITY-------------
  const toggleTransactions = () => {
    setShowTransactions(!showTransactions);
  };

  const subscribers = storesubs.map((sub) => {
    return (
      <Subscribers
        clientid={sub.client_id}
        storeid={storeid}
        name={storename}
        email={storeemail}
      />
    )
  })

  const storegood = storegoods.map((good) => (
    <ul key={good.id}>
      <p>{good.name}</p>
      <p>${parseFloat(good.price).toFixed(2)}</p>
      <p>{good.image}</p>
    </ul>
  ))



  return (
    <div align='center'>
      <h2>Store:</h2>
      <p>Name:{storename}</p>
      <p>email:{storeemail}</p>
      <p>code:{storecode}</p>
      <p>subs:{subscribers}</p>
      <h2>goods:</h2>{storegood}
      <p>trans:</p>
      <button onClick={toggleTransactions} >Show Transactions</button>
      <br />
    </div>
  )
}

