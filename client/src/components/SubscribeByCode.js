import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';

const SubscribeByCode = () => {

    const [stores, setStores] = useState(null)
    const [subscribedStore, setSubscribedStore] = useState(null);


    useEffect(() => {
        fetch('/stores')
            .then((resp) => resp.json())
            .then((data) => setStores(data))
    }, [])


    console.log(stores)

    // const storebycode = stores?.map((store) => store.code)

    // console.log(storebycode)

    const handleSubscribe = async (storeCode) => {
        try {
            const response = await fetch('/subscribe_by_code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ store_code: storeCode.toUpperCase() }),
            });
            if (response.ok) {
                const data = await response.json();
                const subscribedStore = stores.find((store) => store.code === storeCode);
                setSubscribedStore(subscribedStore);
                console.log(subscribedStore)
                alert(`You have Subscribed to ${subscribedStore?.name}`);
                setTimeout(() => {
                    window.location.reload()
                })
                console.log(data.message);
                // Notify the parent component that a subscription has occurred
            } else {
                // Handle errors
                const errorData = await response.json();
                console.error('Failed to subscribe:', errorData.error);
                alert('You are already subscribed to this store!')
                setTimeout(() => {
                    window.location.reload()
                })
            }
        } catch (error) {
            console.error('Error during subscription:', error.message);
        }
    };

    return (
        <Formik
            initialValues={{ storeCode: '' }}
            validate={(values) => {
                const errors = {};
                if (!values.storeCode) {
                    errors.storeCode = 'Store code is required';
                }
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                handleSubscribe(values.storeCode);
                setSubmitting(false);
            }}
        >
            <Form id='daddydiv'>
                <label className='label-text' htmlFor="storeCode">Store Code:</label>
                <Field className='custom-input' type="text" id="storeCode" name="storeCode" />
                <ErrorMessage name="storeCode" component="div" />

                <button id='sub-btn' type="submit">Subscribe</button>
            </Form>
        </Formik>
    );
};

export default SubscribeByCode;