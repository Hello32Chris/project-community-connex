// LoginForm.js
import { useHistory } from "react-router-dom";
import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const StoreLoginForm = ({ setStoreLoggedIn, getStores }) => {


  const history = useHistory()
  const [message, setMessage] = useState('');


  const initialValues = {
    email: '',
    password: '', 
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setMessage('Logging in...');
      // Send login request to your backend
      const response = await fetch('/store_login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        // const store = 
        const store = await response.json();
        // getStores(store);
        setMessage('Login successful. Redirecting to Home...');
        setStoreLoggedIn(true)
        setTimeout(() => {
          history.push(`/stores/${store.name}`);// After 4 seconds, navigate to the home page
        }, 2000);
      } else {
        const error = await response.json();
        console.error('Login failed:', error);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }

    setSubmitting(false);
  };

  return (
    <div>
      {message ? (
        <div id="login-message">
          <div>{message}</div>
        </div>
      ) : (
        <div>
            <div> Store Login: </div>
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
            <br/>
              <div>
                <label htmlFor="email">Email:</label>
                <Field type="email" id="email" name="email" />
                <ErrorMessage name="email" component="div" />
              </div>
              <br/>
              <div>
                <label htmlFor="password">Password:</label>
                <Field type="password" id="storepassword" name="password" />
                <ErrorMessage name="password" component="div" />
              </div>
              <br/>
              <div>
                <button type="submit">Login</button>
              </div>
            </Form>
          </Formik>
        </div>
      )}
    </div>
  );
};

export default StoreLoginForm;















// import React, { useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";


// function LoginForm({setLoggedInID, setLoggedIn, loggedIn}) {

//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     const [validLogin, setValidLogin] = useState(false)
//     const history = useHistory()

    
//     const handleLogin = async () => {
//         try{
//             const response = await fetch('/clients') // Fetch customer data
//             const clientData = await response.json()
//             const client = clientData.find((client) => client.email === email);
            
            
//             if (client && client.password === password) {
//                 // Valid login
//                 console.log('Login successful')
//                 console.log(client.id)
//                 setLoggedIn(!loggedIn)
//                 setLoggedInID(client.id)
//                 history.push('/Home')
//             } else {
//                 // Invalid login
//                 setValidLogin('Invalid username or password');
//             }
            
//         } catch (error) {
//             console.error('Error fetching customer data', error);
//         };
//     };


//     return (
//         <div className="loginform">
//             <div className="centered-content">
//                 <h1 className="login">Login</h1>
//                 <br />
//                 <div id="logform">
//                     Email: <input
//                         className="loginput"
//                         type="text"
//                         placeholder="Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                     />
//                     <br/>
//                     Password: <input
//                         className="loginput"
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//                     <br />
//                     <button className="loginbutton" onClick={handleLogin}>Login</button>
//                     {validLogin && <p>{validLogin}</p>}
//                 </div>
//             </div>
//         </div>
//     )
// }


// export default LoginForm