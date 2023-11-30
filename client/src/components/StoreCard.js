import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SubscribeButton from "./SubscribeButton";

export default function StoreCard({ storeid, storename, storeemail, storecode, storegoods }) {
  
  
//---------------STATE-------------
  const [goodsToggle, setGoodsToggle] = useState(false);
  const [subToggle, setSubToggle] = useState(false)
  const [client, setClient] = useState(null)
  
  
//----------------------------------------------------------- CLIENT SESSION CHECK -------------------
  useEffect(() => {
    fetch("/check_client_session").then((resp) => {
      if (resp.ok) {
        resp.json().then(setClient);
      }
    });
  }, []);

  const clog = client ? true : false;
  

//----------------------------------------------------------------------- FUNCTIONALITY-------------
  const toggleGoods = () => {
    setGoodsToggle(!goodsToggle);
  };


//-------------------------------------------------------------------------- ADD TO CART ------------
  const clientId = client?.id

  const handleAddToCart = async (goodsServiceID) => {
    console.log(goodsServiceID)
    console.log(clientId)
    try {
      const response = await fetch('/add_to_cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          goods_service_id: goodsServiceID,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // or handle success in some way
      } else {
        const errorData = await response.json();
        console.error(errorData.error); // or handle the error in some way
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


//----------------------------------------------------------- GOODS AND SERVICES MAPPING -------------------
  const storegood = storegoods.map((good) => (
    <ul className="storecardgood" key={good.id}>
      <p><h3>Service: </h3>{good.name}</p>
      <p><h3>Price: </h3>${parseFloat(good.price).toFixed(2)}</p>
      <img className="goodsimage" src={good.image} alt={`image for ${good.name} at price $${good.price}`} title={`image for ${good.name} at price $${good.price}`} />
      <br/>
      {client ? <button onClick={() => handleAddToCart(good?.id)}>Add to Cart</button> : null}
    </ul>
  ))


  //----------------------------------------------------------------- TOGGLE FOR SUBSCRIBE BUTTON -----------
  const handleSubToggle = () => {
    setSubToggle(!subToggle)

  }
  // console.log(storegoods)

  return (
    <div className="storecardDIV">
      <div id="linkdiv">
        <Link className='storeCard' to={`/stores/${storeid}`} style={{ textDecoration: 'none', color: 'inherit' }} >
          <div align='center' style={{ cursor: 'pointer' }}>
            <h2>Store:</h2>
            <p><b>Name:  </b>{storename}</p>
            <p><b>email:  </b>{storeemail}</p>
            <p><b>code:  </b>{storecode}</p>
          </div>
        </Link >
      </div>
      <div className="storeservices">
        <button className="storeservicebtn" onClick={toggleGoods}>{!goodsToggle ? 'Show Services' : 'Hide Services'}</button>
        {goodsToggle ? storegood : null}
        <br />
        <br />
        <div >
        {clog &&
          <SubscribeButton storename={storename} storecode={storecode} storeid={storeid} />
        }
        </div>
         
        <br />
      </div>
    </div>



  )
}

