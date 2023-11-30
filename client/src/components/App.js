import { Route, Switch, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import About from "./About";
import Clients from './Clients';
import Home from './Home';
import Navbar from './Navbar';
import Login from './Login';
import StoreAcctPage from './StoreAcctPage';
import Stores from './Stores';
import StoreProfile from './StoreProfile';
import TransactionsByStore from "./TransactionsByStore";
import ClientAccountPage from './ClientAcctPage';
import GoodsServiceForm from './CreateGoodsService';
import SubscribedStores from './SubscribedStores';
import Checkout from './Checkout';
import ClientTransactions from './ClientTransactions';
import { useUserContext } from "../UserContext";


export default function App() {


    const [clients, setClients] = useState([])
    const [stores, setStores] = useState([])
    const [storeLoggedIn, setStoreLoggedIn] = useState(false)
    const [clientLoggedIn, setClientLoggedIn] = useState(false)
    const [shop, setShop] = useState(null);
    const { userId, setUserId } = useUserContext();
    

    
//-------------------------------------------------------------------------- CLIENTS FETCH ------------------------------
    useEffect(() => {
        fetch('/clients')
        .then((resp) => resp.json())
        .then((data) => setClients(data))
    }, [])
    

//-------------------------------------------------------------------------- STORES FETCH -------------------------------
    useEffect(() => {
        fetch('/stores')
            .then((resp) => resp.json())
            .then((data) => setStores(data))
    }, [])

// ------------------------------------------------------------------------- CHECK SESSION FOR STORE ---------------------
    useEffect(() => {
      fetch("/check_store_session").then((resp) => {
        if (resp.ok) {
          resp.json().then(setShop);
        }
      });
    }, []);

    useEffect(() => {
        fetch('/clients')
            .then((resp) => resp.json())
            .then(setUserId);
    }, []);

    const loggedInStoreId = shop && shop.id;
    console.log(loggedInStoreId)







    return (
        <>
        <header id='bkgrnd' align='center'>
            <h1 id='header'><b id='title'><span>COMMUNITY CONNEX</span></b></h1>
        </header>
        <div id='bannerdiv'>
            <Navbar shop={shop} loggedInStoreId={loggedInStoreId} setClientLoggedIn={setClientLoggedIn} stores={stores} setStoreLoggedIn={setStoreLoggedIn} storeLoggedIn={storeLoggedIn} />
            
        </div>
        <div id='maindiv'>
            <Switch>
                <Route exact path='/'><Home /></Route>
                <Route exact path="/Login"><Login setClientLoggedIn={setClientLoggedIn} setStoreLoggedIn={setStoreLoggedIn} /></Route>
                <Route exact path='/clients'><Clients /></Route>
                <Route exact path='/client/transactions'><ClientTransactions /></Route>
                <Route exact path='/cart'><Checkout /></Route>
                <Route exact path='/EditAccount'><ClientAccountPage clients={clients} /></Route>
                <Route exact path='/stores'><Stores stores={stores} /></Route>
                <Route exact path='/stores/:store_id'><StoreProfile stores={stores} /></Route>
                <Route exact path='/store/transactions'><TransactionsByStore /></Route>
                <Route exact path='/store/StoreSubscriptions'><SubscribedStores stores={stores} /></Route>
                <Route exact path='/store/AccountManager'><StoreAcctPage /></Route>
                <Route exact path='/store/services'><GoodsServiceForm loggedInStoreId={loggedInStoreId} stores={stores} /></Route>
                <Route exact path="/About"><About /></Route>
            </Switch>
        </div>
    </>
    )
}