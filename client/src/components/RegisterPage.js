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
      <button className='regswitchformbtn' onClick={handleClick}>{clicked ? 'Switch to Client Register Form' : 'Swtich to Store Register Form'}</button>
      {clicked ? (
          <div>
            <RegisterNewStore  />
          </div>
          ) : (
        <div>
          <RegisterNewClient />
        </div>
      )}
    </div>
  );
};

export default RegisterPage;