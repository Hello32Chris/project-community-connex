import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import RegisterPage from "./RegisterPage";


export default function ClientAccountPage() {

    const history = useHistory()

    const [client, setClient] = useState(null)

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
                {() => handleClientLogout}
                setTimeout(() => {
                    window.location.reload()
                }, 2000)
            }
        });
      }}


    return (
        <div align='center' id="regform">
            <h1>Account page for {client?.name}</h1>
            <button onClick={() => handleDeleteClient(client?.id)} >Delete</button>
        </div>
    )
}

