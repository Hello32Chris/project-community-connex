import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useState, useEffect } from "react";
import GoodsCard from './GoodsCard';


export default function GoddsServiceForm() {

    const [shop, setShop] = useState(null)

    const handleSubmit = async (values, { setSubmitting }) => {
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
        <div>
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
    
            <div>
              <label htmlFor="image">Image:</label>
              <Field type="text" id="image" name="image" />
              <ErrorMessage name="image" component="div" />
            </div>
    
            <div>
              <label htmlFor="price">Price:</label>
              <Field type="number" id="price" name="price" />
              <ErrorMessage name="price" component="div" />
            </div>
    
            <div>
              <button type="submit">Submit</button>
            </div>
          </Form>
        </Formik>
        </div>
      );
    };





















    // const handleSubmit = async (values, { setSubmitting }) => {
    //     try {
    //       const formData = new FormData();
    //       formData.append('name', values.name);
    //       formData.append('price', values.price);
    //       formData.append('image', values.image);
    
    //       const response = await fetch('/create_goods_service', {
    //         method: 'POST',
    //         body: formData,
    //       });
    
    //       if (response.ok) {
    //         console.log('GoodsService created successfully');
    //         // Handle success, such as redirecting to another page
    //       } else {
    //         const data = await response.json();
    //         console.error('Error:', data.error);
    //         // Handle error, display an error message, etc.
    //       }
    //     } catch (error) {
    //       console.error('Error:', error.message);
    //       // Handle unexpected errors
    //     } finally {
    //       setSubmitting(false);
    //     }
    //   };
    
    //   return (
    //     <Formik
    //       initialValues={{
    //         name: '',
    //         image: null,
    //         price: '',
    //       }}
    //       validate={(values) => {
    //         const errors = {};
    //         // Add custom validation logic if needed
    //         return errors;
    //       }}
    //       onSubmit={handleSubmit}
    //     >
    //       <Form>
    //         <div>
    //           <label htmlFor="name">Name:</label>
    //           <Field type="text" id="name" name="name" />
    //           <ErrorMessage name="name" component="div" />
    //         </div>
    
    //         <div>
    //           <label htmlFor="image">Image:</label>
    //           <Field
    //             type="file"
    //             id="image"
    //             name="image"
    //             onChange={(event) => {
    //               // Set the value of the 'image' field to the selected file
    //               const file = event.currentTarget.files[0];
    //               setFieldValue('image', file);
    //             }}
    //             accept="image/*"
    //           />
    //           <ErrorMessage name="image" component="div" />
    //         </div>
    
    //         <div>
    //           <label htmlFor="price">Price:</label>
    //           <Field type="number" id="price" name="price" />
    //           <ErrorMessage name="price" component="div" />
    //         </div>
    
    //         <div>
    //           <button type="submit">Submit</button>
    //         </div>
    //       </Form>
    //     </Formik>
    //   );
    // }
