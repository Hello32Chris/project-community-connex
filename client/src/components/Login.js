import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import ClientLoginForm from "./ClientLoginForm";
import StoreLoginForm from "./StoreLoginForm";
import RegisterPage from "./RegisterPage";



function Login({ setStoreLoggedIn, setClientLoggedIn, setLoggedInStoreId }) {

    useEffect(() => {
        document.body.className = 'loginback';
        return () => {
            document.body.className = '';
        }
    }, []);

    const [getClients, setClients] = useState([]);
    const [getStores, setStores] = useState([]);
    const [toggle, setToggle] = useState(false);

// ------------------------------------------------------------------------------------ CLIENTS FETCH ------
    useEffect(() => {
        fetch('/clients')
            .then((resp) => resp.json())
            .then(setClients);
    }, []);

// ------------------------------------------------------------------------------------ CLIENTS FETCH ------
    useEffect(() => {
        fetch('/stores')
            .then((resp) => resp.json())
            .then(setStores);
    }, []);

    const toggleForm = () => {
        setToggle(!toggle)
    }

    return (
        <div>
            {!toggle ? (
            <div id="logincontainer">
                <div id="client-login"> 
                    <ClientLoginForm setClientLoggedIn={setClientLoggedIn} getClients={getClients} />
                </div>
                <div id="store-login">
                    <StoreLoginForm setLoggedInStoreId={setLoggedInStoreId} setStoreLoggedIn={setStoreLoggedIn} getStores={getStores} />
                </div>
            </div>
                ) : (
                <div id="registercontainer" >
                    <RegisterPage />
                </div>
                )}
            <div id="registerDiv">
                <button id="registerBtn" onClick={toggleForm}>{!toggle ? 'Register New Store' : 'Login WIth existing account'}</button>
            </div>
        </div>
    )
};

export default Login;