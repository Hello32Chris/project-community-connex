import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import ClientLoginForm from "./ClientLoginForm";
import StoreLoginForm from "./StoreLoginForm";



function Login({ clientLoggedIn, setStoreLoggedIn, setClientLoggedIn }) {

    const [getClients, setClients] = useState([]);
    const [getStores, setStores] = useState([]);

    useEffect(() => {
        fetch('/clients')
            .then((resp) => resp.json())
            .then(setClients);
    }, []);


    useEffect(() => {
        fetch('/stores')
            .then((resp) => resp.json())
            .then(setStores);
    }, []);


    // console.log(loggedIn)


    return (
        <div id='login-container'>
            <div id="client-login">
                <ClientLoginForm clientLoggedIn={clientLoggedIn} setClientLoggedIn={setClientLoggedIn} getClients={getClients} />
            </div>
            <div id="store-login">
                <StoreLoginForm setStoreLoggedIn={setStoreLoggedIn} getStores={getStores} />
            </div>
        </div>
    )
};

export default Login