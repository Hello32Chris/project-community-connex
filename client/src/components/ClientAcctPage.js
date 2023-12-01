import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from 'yup';



export default function ClientAccountPage() {
  const history = useHistory()

  const [client, setClient] = useState(null)
  const [toggle, setToggle] = useState(false)

  useEffect(() => {
    document.body.className = 'clientaccountback';
    return () => {
      document.body.className = '';
    }
  }, []);


  //--------------------------------------------------------------------------------------------------- LOGOUT FOR CLIENT ---------
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

  //------------------------------------------------------------------------------------------------ CHECK CLIENT SESSION -------
  useEffect(() => {
    fetch("/check_client_session").then((resp) => {
      if (resp.ok) {
        resp.json().then(setClient);
      }
    });
  }, []);

  //--------------------------------------------------------------------------------------------- DELETE FOR CLIENT ACCOUNT -------
  function handleDeleteClient(id) {
    const confirmDelete = window.confirm(`Are you sure you want to delete your account ${client.name}?`)
    if (confirmDelete) {
      fetch(`/clients/${id}`, { method: "DELETE" }).then((resp) => {
        if (resp.ok) {
          setClient((clientArr) =>
            clientArr?.filter((client) => client.id !== id)
          );
          alert(`Client ${client.name} Deleted!`)
          history.push('/')
          setTimeout(() => {
            window.location.reload()
          }, 10)
        }
      });
    }
  }

  //------------------------------------------------------------------------------------ PATCH FOR CLIENT -----------------------------
  // useEffect(() => {
  //   fetch("/check_client_session")
  //     .then((resp) => {
  //       if (resp.ok) {
  //         return resp.json();
  //       }
  //       throw new Error("Failed to fetch client session");
  //     })
  //     .then((data) => setClient(data))
  //     .catch((error) => console.error("Error fetching client session:", error));
  // }, []);

  //------------------------------------------------------------------------------------ CLIENT PATCH FORM ----------------------------
  const clientname = client?.name
  const clientemail = client?.email

  const formik = useFormik({
    initialValues: {
      name: clientname,
      email: clientemail,
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().optional(),
      email: Yup.string().email().optional(),
      password: Yup.string().optional(),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .optional(),
    }),
    onSubmit: (values) => {
      const { confirmPassword, ...dataWithoutConfirm } = values;

      fetch(`/clients/${client.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataWithoutConfirm),
      })
        .then((response) => {
          if (!response.ok) {
            console.log(client.id);
            throw new Error("Failed to update client data");
          }
          return response.json();
        })
        .then((data) => {
          alert(`Account has been updated!`);
          console.log("Client data updated successfully:", data);
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        })
        .catch((error) => {
          console.error("Error updating client data:", error);
        });
    },
  });
  //------------------------------------------------------------------------------------------- CLIENT CHECK LOADING ---------------------
  if (!client) {
    return <div>Loading...</div>;

  }

  //------------------------------------------------------------------------------------------ PATCH FOR CLIENT --------------------------
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
        <br />
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
        <br />
        <div>
          <label htmlFor="password"><b>Password:</b></label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
        </div>
        <br />
        <div>
          <label htmlFor="confirmPassword"><b>Confirm Password:</b></label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
          />
        </div>
        <br />
        <button id="profilebtn" type="submit">Update Profile</button>
      </form>
    </div>
  );

  return (
    <div align='center' id="regform">
      <h1>Account page for {client?.name}</h1>
      <br />
      <button className="regswitchformbtn" onClick={() => setToggle(!toggle)} >Edit Account</button>
      <br />
      {toggle && client ? formikForm : null}
      <br />
      <button className="deletebtn" onClick={() => { handleDeleteClient(client?.id); handleClientLogout(); }} >Delete Account</button>
    </div>
  )
}

