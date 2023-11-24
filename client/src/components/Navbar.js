import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import StoreAcctPage from "./StoreAcctPage";
import StoreLogout from './StoreLogout.js'
import { useHistory } from "react-router-dom";

function Navbar({ clientLoggedIn, setStoreLoggedIn, storeLoggedIn, stores }) {
  
  
  const [shop, setShop] = useState(null);

  const history = useHistory()
  
  

  const handleStoreLogout = async () => {
    try {
      const response = await fetch('/store_logout', {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.status === 204) {
        console.log('Logout successful')
        
        setTimeout(() => {
        setStoreLoggedIn(false)  
        history.push(`/`);
        }, 2000);
        setTimeout(() => {  
          window.location.reload()
          // After 2 seconds, navigate to the home page
        }, 2000);
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }


  //----------------------------------------------------------- STORE SESSION CHECK -------------------
  useEffect(() => {
    fetch("/check_store_session").then((resp) => {
      if (resp.ok) {
        resp.json().then(setShop);
      }
    });
  }, []);

  const loggedInStoreId = shop && shop.id;
  const slog = shop ? true : false
  console.log(shop)



  const nav =
    <nav id="navbar">
      <div className="navbar">
        <li><NavLink className='link' to="/stores" activeClassName="active" >Shops</NavLink></li>
        {/*  ------------STORE NAV SECTION----------------- */}
        {slog ? (
          <>
            <li><NavLink className='link' to={`/stores/${loggedInStoreId}`} activeClassName="active" >Profile</NavLink></li>
            <li><NavLink className='link' to={`/stores/transactions`} activeClassName="active" >Transactions</NavLink></li>
            <li><NavLink className='link' to={`/stores/services`} activeClassName="active" >Goods and Services</NavLink></li>
            <li><NavLink className='link' to={`/stores/SubscribedClients`} activeClassName="active" >Subscribed Client</NavLink></li>
            <li><NavLink className='link' to={`/stores/AccountManager`} activeClassName="active" >Edit Account</NavLink></li>
            <li><button onClick={handleStoreLogout}>Logout</button></li>
          </>
        ) : (
          // ------------CLIENT NAV SECTION-----------------
          <>
            <li><NavLink className='link' to="/Subscribtions" activeClassName="active" >Subscribed Stores</NavLink></li>
            <li><NavLink className='link' to="/EditAccount" activeClassName="active" >Edit Account</NavLink></li>
          </>
        )}
        <li><NavLink className='link' to="/About" activeClassName="active" >About</NavLink></li>
      </div>
    </nav>;

  return (
    <div id="grid">
      <ul>
        {!clientLoggedIn && !slog ? (
          // If neither client nor store is logged in, display login options
          <nav id="navbar">
            <div className="navbar">
              <li><NavLink className='link' to="/Login" activeClassName="active">Login</NavLink></li>
              <li><NavLink className='link' to="/stores" activeClassName="active" >Stores</NavLink></li>
              <li><NavLink className='link' to="/clients" activeClassName="active" >Clients</NavLink></li>
              <li><NavLink className='link' to="/About" activeClassName="active" >About</NavLink></li>
            </div>
          </nav>
        ) : (
          // Display dynamic navigation based on login status
          nav
        )}
      </ul>
    </div>
  );
}

export default Navbar;