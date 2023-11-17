// LoginForm.js
import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ClientLoginForm = ({ getClients }) => {
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
      // Send login request to your backend
      const response = await fetch('/client_login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const client = await response.json();
        getClients(client);
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
          <Field type="password" id="password" name="password" />
          <ErrorMessage name="password" component="div" />
        </div>
        <br/>
        <div>
       
          <button type="submit">Login</button>
        </div>
      </Form>
    </Formik>
  );
};

export default ClientLoginForm;















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