import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


const StoreLogout = () => {

  const history = useHistory()

// -------------------------------------------------------------- STORE LOGOUT ------------  
  const handleStoreLogout = async () => {
    try {
        const response = await fetch('/store_logout', {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.status === 204) {
            console.log('Logout successful')

            setTimeout(() => {
              history.push(`/`);// After 2 seconds, navigate to the home page
            }, 2000);
        } else {
            console.error('Logout failed');
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
}

  return (
    <div>
      <p>Logging out... 🏈</p>
    </div>
  );
};

export default StoreLogout;