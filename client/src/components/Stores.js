import React, { useState } from "react";
import StoreCard from "./StoreCard";

export default function Stores({ stores }) {


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

    // console.log(stores)


    return (
        <div>
            {storeView}
        </div>
    )
}

