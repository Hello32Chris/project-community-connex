import React, { useState } from "react";
import { Link } from "react-router-dom";
import Subscribers from './Subscribers'

export default function StoreCard({ storeid, storename, storeemail, storecode, storesubs, storegoods, storetrans }) {

  // console.log(name)
  // console.log(email)
  // console.log(id)


  //---------------STATE-------------
  const [showTransactions, setShowTransactions] = useState(false);
  const [goodsToggle, setGoodsToggle] = useState(false);


  //---------------FUNCTIONALITY-------------
  const toggleGoods = () => {
    setGoodsToggle(!goodsToggle);
  };

  // const subscribers = storesubs.map((sub) => {
  //   return (
  //     <Subscribers
  //       clientid={sub.client_id}
  //       storeid={storeid}
  //       name={storename}
  //       email={storeemail}
  //     />
  //   )
  // })

  const storegood = storegoods.map((good) => (
    <ul key={good.id}>
      <p>{good.name}</p>
      <p>${parseFloat(good.price).toFixed(2)}</p>
      <p>{good.image}</p>
    </ul>
  ))

  // const storetran = storetrans.map((tran) => {
  //   <ul key={tran.id}>
  //   <p>{tran.client.name}</p>
  //   </ul>
  // })


  return (
    
    <div align='center' style={{ cursor: 'pointer' }}>
      <h2>Store:</h2>
      <p>Name:{storename}</p>
      <p>email:{storeemail}</p>
      <p>code:{storecode}</p>
      <h2>goods:</h2>
      <button onClick={toggleGoods}>{!goodsToggle ? 'Show Services' : 'Hide Services'}</button>
      {goodsToggle ? storegood : null}

      <br />
      <Link to={`/stores/${storeid}`} >Profile</Link >
    </div>
    
  )
}

