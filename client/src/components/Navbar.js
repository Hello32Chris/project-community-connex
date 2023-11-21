import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import StoreAcctPage from "./StoreAcctPage";

function Navbar({ setSearchTerm, storeLogged, store }) {

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


  const nav = (toggle ? <button className="login-butt" id="navButton" onClick={toggleNav}>Navigation</button> :
    <nav id="navbar" >
      <div className="navbar">
        <button id="closebtn" onClick={toggleNav}>X</button>
        <NavLink className='link' to="/" activeClassName="active">Home</NavLink>
        <NavLink className='link' to="/clients" activeClassName="active" >Clients</NavLink>
        <NavLink className='link' to="/About" activeClassName="active" >About</NavLink>
        {storeLogged &&
          <NavLink className='link' to="/clients" activeClassName="active" >Clients</NavLink>}
      </div>
    </nav>)

    


  // console.log(toggle)

  return (
    <div id="grid">
      <ul>
        <nav id="navbar" >
      <div className="navbar">
        <li><NavLink className='link' to="/" activeClassName="active">Login</NavLink></li>
        <li><NavLink className='link' to="/stores" activeClassName="active" >Stores</NavLink></li>
        <li><NavLink className='link' to="/clients" activeClassName="active" >Clients</NavLink></li>
        <li><NavLink className='link' to="/About" activeClassName="active" >About</NavLink></li>
        {storeLogged &&
        <li><NavLink className='link' to="/clients" activeClassName="active" >Clients</NavLink></li>}
      </div>
    </nav>
      </ul>

    </div>
    // <div id="navarea">
    //   {/* <button className="login-butt" onClick={toggleSearch}>Search</button> */}
    //   {/* {searchToggle ? <Search setSearchTerm={setSearchTerm}  gamesArr={gamesArr} /> : null} */}
    //   {nav}
    // </div>
  );
}

export default Navbar;
