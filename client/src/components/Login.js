import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import ClientLoginForm from "./ClientLoginForm";
import StoreLoginForm from "./StoreLoginForm";



function Login({ loggedIn, storeLogged, setStoreLoggedIn }) {

    const [getClients, setClients] = useState([]);
    const [getStores, setStores] = useState([]);

    useEffect(() => {
        fetch('/clients')
            .then((resp) => resp.json())
            .then(setClients);
    }, []);

    console.log(clients)

    useEffect(() => {
        fetch('/stores')
            .then((resp) => resp.json())
            .then(setStores);
    }, []);

    console.log(stores)

    // console.log(loggedIn)


    return (
        <div id='login-container'>
            <span >
                <div id="client-login">
                    Client Login: 
                    <br/>
                    <ClientLoginForm getClients={getClients}/>
                </div>
                <div id="store-login">
                    Store Login: <StoreLoginForm getStores={getStores}/>
                </div>
            </span>
        </div>
    )
};

export default Login