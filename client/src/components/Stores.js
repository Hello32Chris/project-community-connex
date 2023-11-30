import React, { useEffect } from "react";
import StoreCard from "./StoreCard";

export default function Stores({ stores }) {

    useEffect(() => {
        document.body.className = 'shopback';
        return () => {
          document.body.className = '';
      }}, []);


// ----------------------------------------------------------- STORE LOGIN POST ------------
    const storeView = stores.map((store) => {
        return <div key={store.id} align='center' className="storess">
            <StoreCard 
                storeid={store.id}
                storename={store.name}
                storeemail={store.email}
                storecode={store.code}
                storesubs={store.subscribed_clients}
                storegoods={store.goods_services}
                storetrans={store.transactions}
            />
        </div>
    })


    return (
        <div>
            {storeView}
        </div>
    )
}

