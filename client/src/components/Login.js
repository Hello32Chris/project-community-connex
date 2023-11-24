import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import ClientLoginForm from "./ClientLoginForm";
import StoreLoginForm from "./StoreLoginForm";
import RegisterNewStore from "./RegisterNewStore";
import RegisterPage from "./RegisterPage";



function Login({ setStoreLoggedIn, setClientLoggedIn, setLoggedInStoreId }) {

    const [getClients, setClients] = useState([]);
    const [getStores, setStores] = useState([]);
    const [toggle, setToggle] = useState(false);

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

    const toggleForm = () => {
        setToggle(!toggle)
    }


    return (
        <div id='login-container'>
            <div id="client-login">
                <ClientLoginForm setClientLoggedIn={setClientLoggedIn} getClients={getClients} />
            </div>
            <div id="store-login">
                {!toggle ? (<StoreLoginForm setLoggedInStoreId={setLoggedInStoreId} setStoreLoggedIn={setStoreLoggedIn} getStores={getStores} />
                ) : (
                    <RegisterPage />
                )}
            <button onClick={toggleForm}>{!toggle ? 'Register New Store' : 'Login WIth existing account'}</button></div>
            
        </div>
    )
};

export default Login