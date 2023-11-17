import React, { useState } from "react";

export default function ClientCard({ id, name, email, trans }) {

  // console.log(name)
  // console.log(email)
  // console.log(id)
  
    const [client, setClient] = useState([]);

    function handleDeleteClient(id) {
      
        // eslint-disable-next-line
        const confirmDelete = window.confirm(`Are you sure you want to delete ${name}?`)

        if (confirmDelete) {
            fetch(`/clients/${id}`, { method: "DELETE" }).then((resp) => {
            if (resp.ok) {
            setClient((clientArr) =>
              clientArr.filter((client) => client.id !== id)
            );
            // window.location.reload();
            alert(`Client ${name} Deleted!`)
          }
        });
      }}





    return (
        <div align='center'>
            <br/>
            <b>Name: {name}</b>
            <br/>
            <b>Email: {email}</b>
            <br/>
            <br/>
            <button onClick={() => handleDeleteClient(id)}>Delete</button>
            <br/>
            <br/>
            <b><h1>Transactions:</h1> </b>
        <br/>
        </div>
    )
}

