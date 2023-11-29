import React, { useState } from 'react';
import RegisterNewStore from './RegisterNewStore';
import RegisterNewClient from './RegisterNewClient';

const RegisterPage = () => {

  const [clicked, setClicked] = useState(true)

  const handleClick = () => {
    return setClicked(!clicked)
  }

  return (
    <div>
      <button onClick={handleClick}>{clicked ? 'Client Register Form' : 'Store Register Form'}</button>
      {clicked ? (
          <div>
            <h2>Store Signup</h2>
            <RegisterNewStore  />
          </div>
          ) : (
        <div>
          <h2>Client Signup</h2>
          <RegisterNewClient />
        </div>
      )}
    </div>
  );
};

export default RegisterPage;