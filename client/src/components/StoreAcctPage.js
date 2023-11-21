import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import StoreCard from "./StoreCard";
import TransactionsByStore from "./TransactionsByStore";


export default function StoreAcctPage({ stores, loggedInStoreId }) {
  // const loggedInStoreId = sessionStorage.getItem('store_id');
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(loggedInStoreId ? loggedInStoreId : 'none')

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        if (loggedInStoreId) {
          // Filter the stores array based on the logged-in store ID
          const filteredStores = stores.filter((store) => store.id === parseInt(loggedInStoreId));

          // Check if the filteredStores array has any items
          if (filteredStores.length > 0) {
            // Assuming there's only one store with the given ID, set it as the store
            setStore(filteredStores[0]);
          } else {
            console.warn('Store not found with the provided ID.');
          }
        } else {
          console.warn('No store ID available.');
        }
      } catch (error) {
        console.error('Error fetching store data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [loggedInStoreId, stores]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!store) {
    // Handle the case where store data is not available
    return <p>Store data not found.</p>;
  }

  //--------------------------------------------------------------------------------------------
  const initialValues = {
    name: store.name,
    email: store.email,
    code: store.code,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    code: Yup.string().required('Required'),
    // Add more validations as needed
  });

  const handleSubmit = (values, { setSubmitting }) => {
    // Handle the submission logic here
    console.log('Form values:', values);
    setSubmitting(false);
    alert('Your account has been Changed')
  };




  return (
    <div>
      <h2>Welcome to the Store Dashboard, {store.name}!</h2>

      {/* Formik form for editing store details */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div>
            <label htmlFor="name">Store Name:</label>
            <Field type="text" id="name" name="name" />
            <ErrorMessage name="name" component="div" />
          </div>

          <div>
            <label htmlFor="email">Store Email:</label>
            <Field type="email" id="email" name="email" />
            <ErrorMessage name="email" component="div" />
          </div>

          <div>
            <label htmlFor="code">Store Code:</label>
            <Field type="text" id="code" name="code" />
            <ErrorMessage name="code" component="div" />
          </div>

          {/* Add more form fields as needed */}

          <div>
            <button type="submit">Save Changes</button>
          </div>
        </Form>
      </Formik>


      <h2>Welcome to the Store Dashboard, {store.name}!</h2>
      <p>Store Name: {store.name}</p>
      <p>Store Email: {store.email}</p>
      <p>Store Code: {store.code}</p>
      <p>Services: {}</p>
      {/* <TransactionsByStore storename={store.name} storeId={store.id} /> */}
      {/* Add more components or details as needed */}
    </div>
  );
};


