import React, { useState } from 'react';
import StoreSignupForm from './StoreSignupForm';

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
      <button onClick={handleClick}>{clicked ? 'Register Client Form' : 'Register Store Form'}</button>
      {clicked ? (
          <div>
            <h2>Store Signup</h2>
            <StoreSignupForm onSignup={handleSignup} />
          </div>
          ) : (
        <div>
          <h2>Client Signup</h2>
          <ClientSignupForm onSignup={handleSignup} />
        </div>
      )}
    </div>
  );
};

export default RegisterPage;