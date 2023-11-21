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



export default function App() {

    const [clients, setClients] = useState([])
    const [stores, setStores] = useState([])
    const [storeLoggedIn, setStoreLoggedIn] = useState(false)
    const [clientLoggedIn, setClientLoggedIn] = useState(false)
    
    //this fetch is for clients card
    useEffect(() => {
        fetch('/clients')
        .then((resp) => resp.json())
        .then((data) => setClients(data))
    }, [])
    


    useEffect(() => {
        fetch('/stores')
            .then((resp) => resp.json())
            .then((data) => setStores(data))
    }, [])



    return (
        <>
        <header align='center'>
            <h1>COMMUNITY CONNEX!</h1>
        </header>
        <div id='bannerdiv'>
            <Navbar clientLoggedIn={clientLoggedIn} store={stores} storeLoggedIn={storeLoggedIn} />
            
        </div>
        <div id='maindiv'>
            <Switch>
                <Route exact path="/"><Login clientLoggedIn={clientLoggedIn} setClientLoggedIn={setClientLoggedIn} storeLoggedIn={storeLoggedIn} setStoreLoggedIn={setStoreLoggedIn} /></Route>
                <Route exact path='/clients'><Clients clients={clients} /></Route>
                <Route exact path="/About" component={About} />
                <Route exact path='/stores' render={(props) => <Stores {...props} stores={stores} />}></Route>
                <Route exact path='/stores/profile' render={(props) => <StoreProfile {...props} stores={stores} />} />
                {/* <Route exact path={`/stores/AccountManager`} component={<StoreAcctPage stores={stores} />} /> */}
            </Switch>
        </div>
    </>
    )
}