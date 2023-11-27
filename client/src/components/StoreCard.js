import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SubscribeButton from "./SubscribeButton";
import Subscribers from './SubscribedStores'

export default function StoreCard({ storeid, storename, storeemail, storecode, storegoods }) {

  // console.log(name)
  // console.log(email)
  // console.log(id)


  //---------------STATE-------------
  const [showTransactions, setShowTransactions] = useState(false);
  const [goodsToggle, setGoodsToggle] = useState(false);
  const [subToggle, setSubToggle] = useState(false)
  const [client, setClient] = useState(null)


  //------------------------------------------------------------ FUNCTIONALITY-------------
  const toggleGoods = () => {
    setGoodsToggle(!goodsToggle);
  };

  //----------------------------------------------------------- GOODS AND SERVICES MAPPING -------------------
  const storegood = storegoods.map((good) => (
    <ul key={good.id}>
      <h2><b>{good.name}</b></h2>
      <p>${parseFloat(good.price).toFixed(2)}</p>
      <img className="goodsimage" src={good.image} alt={`image for ${good.name} at price $${good.price}`} title={`image for ${good.name} at price $${good.price}`} />
    </ul>
  ))

  //----------------------------------------------------------- CLIENT SESSION CHECK -------------------
  useEffect(() => {
    fetch("/check_client_session").then((resp) => {
      if (resp.ok) {
        resp.json().then(setClient);
      }
    });
  }, []);

  const clog = client ? true : false;

  //----------------------------------------------------------------- TOGGLE FOR SUBSCRIBE BUTTON -----------
  const handleSubToggle = () => {
    setSubToggle(!subToggle)

  }
  console.log(storegoods)

  return (
    <div>
      <div id="linkdiv">
        <Link to={`/stores/${storeid}`} style={{ textDecoration: 'none', color: 'inherit' }} >
          <div align='center' style={{ cursor: 'pointer' }}>
            <h2>Store:</h2>
            <p><b>Name:  </b>{storename}</p>
            <p><b>email:  </b>{storeemail}</p>
            <p><b>code:  </b>{storecode}</p>
            <h2><b>Services</b></h2>
          </div>
        </Link >
      </div>
      <div>
        <button onClick={toggleGoods}>{!goodsToggle ? 'Show Services' : 'Hide Services'}</button>
        {goodsToggle ? storegood : null}
        <br />
        <br />
        {clog &&
          <SubscribeButton storename={storename} storecode={storecode} storeid={storeid} />
        }
         
        <br />
      </div>
    </div>



  )
}

