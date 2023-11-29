import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Formik, Form, Field } from 'formik';

export default function StoreProfile() {
    
    const { store_id } = useParams();

    const [shop, setShop] = useState(null);
    const [storeSession, setStoreSession] = useState(null)
    const [client, setClient] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const clientId = client?.id;
    const slog = storeSession?.id === shop?.id ? true : false;


//------------------------------------------------------ FETCH FOR CLIENT SESSION ---------
    useEffect(() => {
        fetch("/check_client_session").then((resp) => {
            if (resp.ok) {
                resp.json().then(setClient);
            }
        });
    }, []);


//------------------------------------------------------ FETCH FOR STORE SESSION ---------
    useEffect(() => {
        fetch("/check_store_session").then((resp) => {
            if (resp.ok) {
                resp.json().then(setStoreSession);
            }
        });
    }, []);


//------------------------------------------------------ ADD TO CART ----------------------
    const handleAddToCart = async (goodsServiceID) => {
        try {
            const response = await fetch('/add_to_cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    client_id: clientId,
                    goods_service_id: goodsServiceID,
                }),
            });
            if (response.ok) {
                alert(`Added to Cart Successfully`);
                const data = await response.json();
                console.log(data.message);
            } else {
                const errorData = await response.json();
                console.error(errorData.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


//------------------------------------------------------------------ FETCH STORE BY ID ------
    useEffect(() => {
        const fetchStoreById = async () => {
            try {
                const response = await fetch(`/stores/${store_id}`);
                if (response.ok) {
                    const data = await response.json();
                    setShop(data);
                } else {
                    console.error(`Failed to fetch store data: ${response.status}`);
                }
            } catch (error) {
                console.error("Error fetching store data:", error);
            }
        };
        fetchStoreById();
    }, [store_id]);


// ------------------------------------------------------------ MAP THROUGH SHOP PROFILE -------
    const shopProfile = shop?.store_profile.map((prof) => (
        <div key={prof.id}>
            <h1>{prof.bio}</h1>
            <h1>{prof.location}</h1>
            <h1>{prof.phone_number}</h1>
        </div>
    ));


// --------------------------------------------------------------- MAP THROUGHT STORE GOODS ----
    const goods = shop?.goods_services.map((good) => (
        <div key={good.id}>
            <br />
            <img className="goodsimage" alt={`An image of ${good.name}`} src={good.image} />
            <h2>{good.name}</h2>
            <h2>${good.price.toFixed(2)}</h2>
            {client ? <button onClick={() => handleAddToCart(good.id)}>Add To Cart</button> : null}
            <br />
        </div>
    ));

    const initialValues = shop?.store_profile[0] || { bio: '', location: '', phone_number: '' };


// -------------------------------------------------------------- PROFILE UPDATE FORM ------------
    const storeProfileForm = (
        <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
                handleUpdateStoreProfile(values)
                alert('Submission Complete!')
            }}
        >
            <Form>
                <br />
                <div>
                    <label htmlFor="bio">Bio:</label>
                    <Field type="text" id="bio" name="bio" />
                </div>
                <br />
                <div>
                    <label htmlFor="location">Location:</label>
                    <Field type="text" id="location" name="location" />
                </div>
                <br />
                <div>
                    <label htmlFor="phone_number">Phone Number:</label>
                    <Field type="text" id="phone_number" name="phone_number" />
                </div>
                <br />
                <div>
                    <button type="submit">Submit</button>
                </div>
                <br />
            </Form>
        </Formik>
    );


// -------------------------------------------------------------- PATCH PROFILE ------------
    const handleUpdateStoreProfile = async (updatedProfile) => {
        try {
            const response = await fetch(`/store_profiles/${shop?.store_profile[0]?.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProfile),
            });
            if (response.ok) {
                alert('Store profile updated successfully!');
                setTimeout(() => {
                    window.location.reload()
                }, 125)
            } else {
                const errorData = await response.json();
                console.error(errorData.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    
    const toggleForm = () => {
        setShowForm(!showForm);
    };

    return (
        <div align='center'>
            <h1>Welcome to {shop?.name}!</h1>
            {shopProfile}
            <br />
            {goods}
            <br />
            {slog && <button onClick={toggleForm}>{showForm ? 'Hide Edit Profile' : 'Show Edit Profile'}</button>}
            {showForm && storeProfileForm}
            {showForm && 
                <div>
                    <Link to={`/store/services`} style={{ textDecoration: 'none', color: 'inherit' }} ><h2 id='editgoodsbtn'>Edit Goods and Services</h2></Link>
                </div>}
        </div>
    );
}