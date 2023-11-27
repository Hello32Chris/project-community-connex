import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import StoreCard from "./StoreCard";
import TransactionsByStore from "./TransactionsByStore";


export default function StoreAcctPage({ stores }) {

  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState(null);

  useEffect(() => {
    fetch("/check_store_session").then((resp) => {
      if (resp.ok) {
        resp.json().then(setShop);
      }
    });
  }, []);

  const loggedInStoreId = shop && shop.id;


  console.log(loggedInStoreId ? loggedInStoreId : 'none')


  const nameStore = shop?.name
  const emailStore = shop?.email
  const codeStore = shop?.code

  //--------------------------------------------------------------------------------------------
  const initialValues = {
    name: nameStore,
    email: emailStore,
    code: codeStore,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string(),
    email: Yup.string().email('Invalid email address'),
    code: Yup.string().length(6, 'Code must be exactly 6 characters long'),
    // Add more validations as needed
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const confirmDelete = window.confirm(`Are you sure you want to alter the profile for ${nameStore}?`);
    
    if (confirmDelete) {
      try {
        const response = await fetch(`/stores/${loggedInStoreId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        console.log(response)
      if (response.ok) {
          const updatedStore = await response.json();
          setTimeout(() => {
            window.location.reload();
          }, 500);
      } else {
          const error = await response.json();
          console.error('User update failed:', error);
        }
      } catch (error) {
        console.error('Error during User update:', error);
      }
  
      setSubmitting(false);
    }
  };




  return (
    <div align='center' id="account">
      <h2>Edit Account for {nameStore}!</h2>

      {/* Formik form for editing store details */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div>
            <label htmlFor="name"><b>Store Name:</b></label>
            <Field type="text" id="name" name="name" />
            <ErrorMessage name="name" component="div" />
          </div>
          <br/>

          <div>
            <label htmlFor="email"><b>Store Email:</b></label>
            <Field type="email" id="email" name="email" />
            <ErrorMessage name="email" component="div" />
          </div>
          <br/>

          <div>
            <label htmlFor="code"><b>Store Code:</b></label>
            <Field type="text" id="code" name="code" />
            <ErrorMessage name="code" component="div" />
          </div>

          {/* Add more form fields as needed */}
          <br />
          <div>
            <button type="submit">Save Changes</button>
          </div>
        </Form>
      </Formik>


      <h2>Welcome to the Store Dashboard, {nameStore}!</h2>
      <p>Store Name: {nameStore}</p>
      <p>Store Email: {emailStore}</p>
      <p>Store Code: {codeStore}</p>
      {/* <TransactionsByStore storename={store.name} storeId={store.id} /> */}
      {/* Add more components or details as needed */}
    </div>
  );
};


