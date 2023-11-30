import { useHistory } from "react-router-dom";
import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const RegisterNewStore = () => {

const history = useHistory()
const [message, setMessage] = useState('');


// ------------------------------------------------------------------- FORM SCHEMA ---------------
  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '', // New field for confirming the password
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Required'),
  });

// ------------------------------------------------------------------- NEW STORE SIGNUP ---------------
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch('/store_signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        const storeData = await response.json();
        setMessage('Registration successful. Redirecting to home...');
        setTimeout(() => {
          history.push(`/stores/${storeData.id}`);
        }, 100);
        setTimeout(() => {
           alert('Lets set up Your profile!')
        }, 200);
        setTimeout(() => {
          window.location.reload() 
        }, 200);
      } else {
        const error = await response.json();
        console.error('Store signup failed:', error);
      }
    } catch (error) {
      console.error('Error during store signup:', error);
    }
    setSubmitting(false);
  };

  return (
    <div id="registerBox">
      {message ? (
        <div>
          <div>{message}</div>
        </div>
      ) : (
      <div className="loginform">
        <h1 className='RegTitle'>Register New Store: </h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <br />
            <div>
              <label className='label-text' htmlFor="name">Store Name:</label>
              <Field type="text" id="name" name="name" />
              <ErrorMessage name="name" component="div" />
            </div>
            <br />
            <div>
              <label className='label-text' htmlFor="email">Email:</label>
              <Field type="email" id="email" name="email" />
              <ErrorMessage name="email" component="div" />
            </div>
            <br />
            <div>
              <label className='label-text' htmlFor="password">Password:</label>
              <Field type="password" id="password" name="password" />
              <ErrorMessage name="password" component="div" />
            </div>
            <br />
            <div>
              <label className='label-text' htmlFor="confirmPassword">Confirm Password:</label>
              <Field type="password" id="confirmPassword" name="confirmPassword" />
              <ErrorMessage name="confirmPassword" component="div" />
            </div>
            <br />
            <div>
              <button type="submit">Sign Up</button>
            </div>
          </Form>
        </Formik>
      </div>
      )}
    </div>
  );
};

export default RegisterNewStore;