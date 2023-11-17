import { Route, Switch } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import About from "./About";
import Clients from './Clients';
import ClientLoginForm from "./ClientLoginForm";
import Home from './Home';
import Navbar from './Navbar';
import StoreLoginForm from './StoreLoginForm';
import Login from './Login';



export default function App() {

    const [clients, setClients] = useState([])
    const [storeLoggedin, setStoreLoggedIn] = useState(false)
    const [loggedIn, setLoggedIn] = useState(false)


    useEffect(() => {
        fetch('/clients')
            .then((resp) => resp.json())
            .then((data) => setClients(data))
    }, [])

    // console.log(clients)


    return (
        <>
        <header align='center'>
            <h1>COMMUNITY CONNEX!</h1>
        </header>
        <div id='bannerdiv'>
            <Navbar storeLoggedin={storeLoggedin} />
            
        </div>
        <div id='maindiv'>
            <Switch>
                <Route exact path="/"><Login loggedIn={loggedIn} storeLoggedin={storeLoggedin} setStoreLoggedIn={setStoreLoggedIn} /></Route>
                <Route exact path='/clients'><Clients clients={clients} /></Route>
                <Route exact path="/CustomerLogin" ><ClientLoginForm  setLoggedIn={setLoggedIn} loggedIn={loggedIn} /> </Route>
                <Route exact path="/StoreLogin"><StoreLoginForm storeLoggedin={storeLoggedin} setStoreLoggedIn={setStoreLoggedIn} /></Route> 
                <Route exact path="/About" component={About} />
            </Switch>
        </div>
    </>
    )
}