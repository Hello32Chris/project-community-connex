import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useState, useEffect } from "react";
import GoodsCard from './GoodsCard';


export default function GoddsServiceForm() {

    const [shop, setShop] = useState(null)

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
          const response = await fetch('/create_goods_service', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          });
        if (response.ok) {
            console.log('GoodsService created successfully');
            // Handle success, such as redirecting to another page
            alert(`Succesfully Created Service!`)
            window.location.reload()
            resetForm();
        } else {
            const data = await response.json();
            console.error('Error:', data.error);
            // Handle error, display an error message, etc.
          }
      } catch (error) {
          console.error('Error:', error.message);
          // Handle unexpected errors
      } finally {
          setSubmitting(false);
        }
      };



      useEffect(() => {
        fetch("/check_store_session").then((resp) => {
          if (resp.ok) {
            resp.json().then(setShop);
          }
        if (!shop) {
        return <div>Loading...</div>;
      }
        });
      }, []);

      console.log(shop?.goods_services)

      const goodsCard = shop && shop.goods_services.map((good) => {
        return <GoodsCard key={good.id}
            id={good.id}
            name={good.name}
            price={good.price}
            image={good.image}
        />
      })

      return (
        <div align='center'>
            <span>
                {goodsCard}
            </span>
        <h1>Create New Service Form</h1>
        <Formik
          initialValues={{
            name: '',
            image: '',
            price: '',
          }}
          validate={(values) => {
            const errors = {};
            // Add custom validation logic if needed
            return errors;
          }}
          onSubmit={handleSubmit}
        >
          <Form>
            <div>
              <label htmlFor="name">Name:</label>
              <Field type="text" id="name" name="name" />
              <ErrorMessage name="name" component="div" />
            </div>
            <br/>
    
            <div>
              <label id='imagelabel' htmlFor="image">Image:</label>
              <Field style={{resize:'none'}} as="textarea" id="image" name="image" />
              <ErrorMessage name="image" component="div" />
            </div>
            <br/>
    
            <div>
              <label htmlFor="price">Price:</label>
              <Field type="number" id="price" name="price" />
              <ErrorMessage name="price" component="div" />
            </div>
            <br/>
    
            <div>
              <button type="submit">Submit</button>
            </div>
          </Form>
        </Formik>
        </div>
      );
    };


