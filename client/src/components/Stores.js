import React, { useState } from "react";
import StoreCard from "./StoreCard";

export default function Stores({ stores }) {

    // function getSessionStoreId() {
    //     const sessionId = sessionStorage.getItem("sessionId");
    //     return sessionId;
    //   }

    // const loggedInStoreId = getSessionStoreId();

    // const filteredStores = stores.filter((store) =>
    // store.subscribed_clients.some((store) => store.id === loggedInStoreId)
    // );



    // console.log(stores.name)
    // console.log(stores.email)
    // console.log(stores.transactions)

    const storeView = stores.map((store) => {
        return <div align='center' className="storess">
            <StoreCard key={store.id}
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

