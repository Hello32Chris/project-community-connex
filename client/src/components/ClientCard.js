import React, { useState, useEffect } from "react";
import TransactionsCard from "./TransactionsCard";

export default function ClientCard({ id, name, email, trans }) {

  // console.log(name)
  // console.log(email)
  // console.log(id)
    console.log(id)

    //---------------STATE-------------
    const [client, setClient] = useState([]);
    const [showTransactions, setShowTransactions] = useState(false);
    const [shop, setShop] = useState(null);


 



  //---------------------------------------------------------------- MY CLIENT DELETE BUTTON-------------------------------


      
    


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
            {/* <b><h1>Transactions:</h1> </b>
            <button onClick={toggleTransactions}>{showTransactions ? 'Hide Transactions' : 'Show Transactions'}</button>
            <br/>
            {showTransactions && <TransactionsCard  clientid={id} trans={trans} />} */}
        <br/>
        </div>
    )
}

