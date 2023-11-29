import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import RegisterPage from "./RegisterPage";
import { useFormik } from "formik";


export default function ClientAccountPage() {

    const history = useHistory()

    const [client, setClient] = useState(null)
    const [toggle, setToggle] = useState(false)

    const handleClientLogout = async () => {
      try {
        const response = await fetch('/client_logout', {
          method: 'DELETE',
          credentials: 'include',
        });
        if (response.status === 204) {
          console.log('Logout successful')
        } else {
          console.error('Logout failed');
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }

    useEffect(() => {
        fetch("/check_client_session").then((resp) => {
          if (resp.ok) {
            resp.json().then(setClient);
          }
        });
      }, []);

    function handleDeleteClient(id) {     

        const confirmDelete = window.confirm(`Are you sure you want to delete your account ${client.name}?`)
        if (confirmDelete) {
            fetch(`/clients/${id}`, { method: "DELETE" }).then((resp) => {
            if (resp.ok) {
                setClient((clientArr) =>
                clientArr?.filter((client) => client.id !== id)
                );
                // window.location.reload();
                alert(`Client ${client.name} Deleted!`)
                history.push('/')
                setTimeout(() => {
                    window.location.reload()
                }, 10)
            }
        });
      }}
//---------------------------------------------------------------------- PATCH FOR CLIENT -----------------------------
useEffect(() => {
  fetch("/check_client_session")
    .then((resp) => {
      if (resp.ok) {
        return resp.json();
      }
      throw new Error("Failed to fetch client session");
    })
    .then((data) => setClient(data))
    .catch((error) => console.error("Error fetching client session:", error));
}, []);

const formik = useFormik({
  initialValues: {
    name: client ? client.name : "",
    email: client ? client.email : "",
    // Add other fields as needed
  },
  onSubmit: (values) => {
    // Send a PATCH request to update the client data
    fetch("/clients", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update client data");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Client data updated successfully:", data);
        // You can handle any success actions here
      })
      .catch((error) => {
        console.error("Error updating client data:", error);
      });
  },
});

if (!client) {
  return <div>Loading...</div>;
}

//---------------------------------------------------------------------- PATCH FOR CLIENT -----------------------------
      const formikForm = (
        <div>
          <h2>Edit Client Profile</h2>
          <form onSubmit={formik.handleSubmit}>
            <div>
              <label htmlFor="name"><b>Name:</b></label>
              <input
                type="text"
                id="name"
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
            </div>
            <br/>
            <div>
              <label htmlFor="email"><b>Email:</b></label>
              <input
                type="text"
                id="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
            </div>
            <br/>
            <button type="submit">Update Profile</button>
          </form>
        </div>
      );

    return (
        <div align='center' id="regform">
            <h1>Account page for {client?.name}</h1>
            <br/>
            <button onClick={() => setToggle(!toggle)} >Edit Account</button>
            <br/>
            {toggle && formikForm}
            <br/>
            <button onClick={() => {handleDeleteClient(client?.id); handleClientLogout();}} >Delete Account</button>
        </div>
    )
}

