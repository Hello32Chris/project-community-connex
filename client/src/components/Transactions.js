import React from "react";

export default function Transactions({email, service, price, name}) {
  


    return (
        <div align='center'>
           <p><h3><b>Business:</b></h3> {name}</p> 
           <p><h3><b>Email:</b></h3> {email}</p> 
           <p><h3><b>Service Recieved:</b></h3> {service}</p> 
           <p><h3><b>Total Paid:</b></h3> ${price.toFixed(2)}</p> 
        </div>
    )
}

