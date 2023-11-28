import { Route, Switch } from 'react-router-dom';
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
import Subscribers from './SubscribedStores';
import ClientAccountPage from './ClientAcctPage';
import GoddsServiceForm from './CreateGoodsService';
import SubscribedStores from './SubscribedStores';
import Checkout from './Checkout';
import ClientTransactions from './ClientTransactions';



export default function App() {

    const [clients, setClients] = useState([])
    const [stores, setStores] = useState([])
    const [storeLoggedIn, setStoreLoggedIn] = useState(false)
    const [clientLoggedIn, setClientLoggedIn] = useState(false)
    const [shop, setShop] = useState(null);
    // const [loggedInStoreId, setLoggedInStoreId] = useState(null);
    
    //-------------------------------------------------------------------------- CLIENTS FETCH -------------
    useEffect(() => {
        fetch('/clients')
        .then((resp) => resp.json())
        .then((data) => setClients(data))
    }, [])
    

    //-------------------------------------------------------------------------- STORES FETCH -------------

    useEffect(() => {
        fetch('/stores')
            .then((resp) => resp.json())
            .then((data) => setStores(data))
    }, [])

    // --------------------------------------------------------- CHECK SESSION FOR STORE ---------------------

    useEffect(() => {
      fetch("/check_store_session").then((resp) => {
        if (resp.ok) {
          resp.json().then(setShop);
        }
      });
    }, []);

    const loggedInStoreId = shop && shop.id;
    console.log(shop)

    return (
        <>
        <header align='center'>
            <h1>COMMUNITY CONNEX!</h1>
        </header>
        <div id='bannerdiv'>
            <Navbar shop={shop} loggedInStoreId={loggedInStoreId} setClientLoggedIn={setClientLoggedIn} stores={stores} setStoreLoggedIn={setStoreLoggedIn} storeLoggedIn={storeLoggedIn} />
            
        </div>
        <div id='maindiv'>
            <Switch>
                <Route exact path="/Login"><Login  setClientLoggedIn={setClientLoggedIn} setStoreLoggedIn={setStoreLoggedIn} /></Route>
                <Route exact path='/'><Home /></Route>
                <Route exact path='/clients'><Clients clients={clients} /></Route>
                <Route exact path='/client/transactions'><ClientTransactions /></Route>
                <Route exact path='/cart'><Checkout /></Route>
                <Route exact path='/EditAccount'><ClientAccountPage clients={clients} /></Route>
                <Route exact path='/stores'><Stores stores={stores} /></Route>
                <Route exact path='/stores/:store_id'><StoreProfile stores={stores} /></Route>
                <Route exact path='/store/transactions'><TransactionsByStore /></Route>
                <Route exact path='/store/StoreSubscriptions'><SubscribedStores stores={stores} /></Route>
                <Route exact path='/store/AccountManager'><StoreAcctPage loggedInStoreId={loggedInStoreId} stores={stores} /></Route>
                <Route exact path='/store/services'><GoddsServiceForm loggedInStoreId={loggedInStoreId} stores={stores} /></Route>
                <Route exact path="/About"><About /></Route>
            </Switch>
        </div>
    </>
    )
}