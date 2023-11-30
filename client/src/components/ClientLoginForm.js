// LoginForm.js
import { useHistory } from "react-router-dom";
import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ClientLoginForm = ({ setClientLoggedIn, clientLoggedIn }) => {

  const history = useHistory()
  const [message, setMessage] = useState('');

  // ------------------------------------------------------------------- FORM SCHEMA ------------
  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
  });

  // ----------------------------------------------------------------- POST FOR CLIENT LOGIN----
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setMessage('Logging in...');
      // Send login request to your backend
      const response = await fetch('/client_login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        await response.json();
        setMessage('Login successful. Redirecting to home...');
        setTimeout(() => {
          history.push(`/stores`);
        }, 2000);
        setTimeout(() => {
          setClientLoggedIn(true)
          window.location.reload()
        }, 2000);
      } else {
        const error = await response.json();
        console.error('Login failed:', error);
        alert('No user found!')
        window.location.reload()
        setClientLoggedIn(false)
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
    setSubmitting(false);
  };

  console.log(clientLoggedIn)

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="loginform">
      {message ? (
        <div id="login-message">
          <div>{message}</div>
          <div className="container">
            <svg className="loader" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 340">
              <circle cx="170" cy="170" r="135" stroke="red" />
              <circle cx="170" cy="170" r="110" stroke="yellow" />
              <circle cx="170" cy="170" r="85" stroke="blue" />
              <circle cx="170" cy="170" r="55" stroke="green" />
            </svg>
          </div>
        </div>
      ) : (
        <div>
          <h1 id="LoginTitle">Client Login:</h1>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <br />
              <div>
                <label className='label-text' htmlFor="email">Email:</label>
                <Field type="email" id="email" name="email" />
                <ErrorMessage name="email" component="div" />
              </div>
              <br />
              <div>
                <label className='label-text' htmlFor="password">Password:</label>
                <div className="password-field-container">
                  <Field type={showPassword ? 'text' : 'password'} id="password" name="password" />
                  <div className="password-toggle-icon" onClick={toggleShowPassword}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
                <ErrorMessage name="password" component="div" />
              </div>
              <br />
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


export default ClientLoginForm;