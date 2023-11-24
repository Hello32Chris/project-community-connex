import React, { useState } from "react";
import TransactionsCard from "./TransactionsCard";

export default function ClientCard({ id, name, email, trans }) {

  // console.log(name)
  // console.log(email)
  // console.log(id)
    console.log(id)

    //---------------STATE-------------
    const [client, setClient] = useState([]);
    const [showTransactions, setShowTransactions] = useState(false);


      //---------------FUNCTIONALITY-------------
    const toggleTransactions = () => {
      setShowTransactions(!showTransactions);
    };




  //---------------------------------------------------------------- MY CLIENT DELETE BUTTON-------------------------------
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
            <b>Name:</b> {name}
            <br/>
            <b>Email:</b> {email}
            <br/>
            <br/>
            <button onClick={() => handleDeleteClient(id)}>Delete</button>
            <br/>
            <br/>
            <b><h1>Transactions:</h1> </b>
            <button onClick={toggleTransactions}>{showTransactions ? 'Hide Transactions' : 'Show Transactions'}</button>
            <br/>
            {showTransactions && <TransactionsCard  clientid={id} trans={trans} />}
        <br/>
        </div>
    )
}

