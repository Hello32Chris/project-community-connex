import React, { useEffect, useState } from "react";
import StoreCard from "./StoreCard";
import SubscribeByCode from "./SubscribeByCode";

export default function Stores({ stores }) {

    const [client, setClient] = useState(null)

    useEffect(() => {
        document.body.className = 'shopback';
        return () => {
            document.body.className = '';
        }
    }, []);



    useEffect(() => {
        fetch("/check_client_session").then((resp) => {
            if (resp.ok) {
                resp.json().then(setClient);
            }
        });
    }, []);

    const clog = client ? true : false

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
            {clog && <div id="subcodediv"><SubscribeByCode /></div>}
            {storeView}
        </div>
    )
}

