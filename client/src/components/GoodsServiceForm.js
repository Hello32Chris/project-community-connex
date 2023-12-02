import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useState, useEffect } from "react";
import GoodsCard from './GoodsCard';


export default function GoodsServiceForm() {


  useEffect(() => {
    document.body.className = 'goodsback';
    return () => {
      document.body.className = '';
  }}, []);

    const [shop, setShop] = useState(null)

//---------------------------------------------------------------------- HANDLE SUBMIT FORM ----
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

// ------------------------------------------------------------------- CHECK CLIENT SESSION ------      
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

// --------------------------------------------------------------- MAP AND CREATE GOODS CARD -----
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
        <div className='newservform'>
        <h1>Create New Service Form</h1>
        <Formik
          initialValues={{
            name: '',
            image: '',
            price: '',
          }}
          validate={(values) => {
            const errors = {};
            return errors;
          }}
          onSubmit={handleSubmit}
        >
          <Form>
            <div>
              <label className='label-text' htmlFor="name"><b>Name:</b></label>
              <Field className='formik-box' type="text" id="name" name="name" />
              <ErrorMessage name="name" component="div" />
            </div>
            <br/>
            <div>
              <label className='label-text' id='imagelabel' htmlFor="image"><b>Image:</b></label>
              <Field className='formik-box' style={{resize:'none'}} as="textarea" id="image" name="image" />
              <ErrorMessage name="image" component="div" />
            </div>
            <br/>   
            <div>
              <label className='label-text' htmlFor="price"><b>Price:</b></label>
              <Field className='formik-box' type="number" id="price" name="price" />
              <ErrorMessage name="price" component="div" />
            </div>
            <br/>    
            <div>
              <button type="submit">Submit</button>
            </div>
          </Form>
        </Formik>
        </div>
      </div>
      );
    };


