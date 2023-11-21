import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import StoreAcctPage from "./StoreAcctPage";

function Navbar({ clientLoggedIn, storeLoggedIn, stores, loggedInStoreId }) {

  const [toggle, setToggle] = useState(true)
  // const [searchToggle, setToggleSearch] = useState(false)

  const store = stores.map((store) => {
    const id = store.id ? store.id : 'N/A'
    const name = store.name ? store.name : 'N/A'
    const email = store.email ? store.email : 'N/A'
    const code = store.code ? store.code : 'N/A'
    const subs = store.subscribed_clients ? store.subscribed_clients : 'N/A'
    const goods = store.goods_services ? store.goods_services : 'N/A'
    const trans = store.transactions ? store.transactions : 'N/A'
    return {
      id, name, email, code, subs, goods, trans
    }
  })


  function toggleNav(e) {
    e.preventDefault()
    setToggle(!toggle)
    console.log('clicked')
  }
  // function toggleSearch(e) {
  //   e.preventDefault()
  //   setToggleSearch(!searchToggle)
  //   console.log('clicked')
  // }

  // const loggedInStoreId = sessionStorage.getItem('store_id');

  

  const nav =
    <nav id="navbar">
      <div className="navbar">
        <li><NavLink className='link' to="/" activeClassName="active">Home</NavLink></li>
{/*  ------------STORE NAV SECTION----------------- */}
        {storeLoggedIn ? (
          <>
            <li><NavLink className='link' to={`/stores/${loggedInStoreId}`} activeClassName="active" >Profile</NavLink></li>
            <li><NavLink className='link' to={`/stores/${loggedInStoreId}/transactions`} activeClassName="active" >Transactions</NavLink></li>
            <li><NavLink className='link' to={`/stores/${loggedInStoreId}/services`} activeClassName="active" >Goods and Services</NavLink></li>
            <li><NavLink className='link' to={`/stores/${loggedInStoreId}/SubscribedClients`} activeClassName="active" >Subscribed Client</NavLink></li>
            <li><NavLink className='link' to={`/stores/${loggedInStoreId}/AccountManager`}  activeClassName="active" >Edit Account</NavLink></li>
          </>
        ) : (
// ------------CLIENT NAV SECTION-----------------
          <>
            <li><NavLink className='link' to="/stores" activeClassName="active" >Shops</NavLink></li>
            <li><NavLink className='link' to="/Subscribtions" activeClassName="active" >Subscribed Stores</NavLink></li>
          </>
        )}
        <li><NavLink className='link' to="/About" activeClassName="active" >About</NavLink></li>
      </div>
    </nav>;

  return (
    <div id="grid">
      <ul>
        {!clientLoggedIn && !storeLoggedIn ? (
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