import React, { useState } from 'react';
import RegisterNewStore from './RegisterNewStore';

const RegisterPage = () => {

  const [clicked, setClicked] = useState(true)
  const handleSignup = (storeData) => {
    // Handle successful signup, e.g., redirect to a different page
    console.log('Store signup successful:', storeData);
  };

  const handleClick = () => {
    return setClicked(!clicked)
  }

  return (
    <div>
      <button onClick={handleClick}>{clicked ? 'Client Register Form' : 'Store Register Form'}</button>
      {clicked ? (
          <div>
            <h2>Store Signup</h2>
            <RegisterNewStore onSignup={handleSignup} />
          </div>
          ) : (
        <div>
          <h2>Client Signup</h2>
          {/* <ClientSignupForm onSignup={handleSignup} /> */}
          Hello!!
        </div>
      )}
    </div>
  );
};

export default RegisterPage;