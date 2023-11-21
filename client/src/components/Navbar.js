import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import StoreAcctPage from "./StoreAcctPage";

function Navbar({ clientLoggedIn, storeLoggedIn, store }) {

  const [toggle, setToggle] = useState(true)
  // const [searchToggle, setToggleSearch] = useState(false)




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



  const nav =
    <nav id="navbar">
      <div className="navbar">
        <li><NavLink className='link' to="/" activeClassName="active">Home</NavLink></li>
        {storeLoggedIn ? (
// ------------STORE NAV SECTION-----------------
          <>
            <li><NavLink className='link' to="/storeprofile" activeClassName="active" >Profile</NavLink></li>
            <li><NavLink className='link' to="/transactions" activeClassName="active" >Transactions</NavLink></li>
            <li><NavLink className='link' to="/services" activeClassName="active" >Goods and Services</NavLink></li>
            <li><NavLink className='link' to="/SubscribedClients" activeClassName="active" >Subscribed Client</NavLink></li>
            <li><NavLink className='link' to="/AccountManager" activeClassName="active" >Edit Account</NavLink></li>
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
              <li><NavLink className='link' to="/" activeClassName="active">Login</NavLink></li>
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