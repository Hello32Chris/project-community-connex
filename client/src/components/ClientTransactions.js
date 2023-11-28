import React, { useState, useEffect } from "react";


export default function ClientTransactions() {

  const [client, setClient] = useState(null)

  useEffect(() => {
    fetch("/check_client_session").then((resp) => {
      if (resp.ok) {
        resp.json().then(setClient);
      }
    });
  }, []);

  console.log(client?.transactions)

  const clientTransactions = client?.transactions.map((trans) => {
    const formattedDate = new Date(trans.timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'America/New_York',
    });

    return (<div key={trans.id}>
      <div><b>Service(s) Received:</b> <h5>{trans.goods_service_names}</h5></div>
      <div><b>Total Amount Paid:</b> ${trans.total_amount.toFixed(2)}</div>
      <br/>
      <div><b>Date/TIme:</b> {formattedDate}</div>
      <div>-----------------------------------------------------------------</div>
      <div>-------------------------------------------------------------------------</div>
      <br/>
      <br/>
    </div>
    );
  })










  return (
    <div align='center' id="clienttrans">
      Client Transactions for {client?.name}:
      <div>================================</div>
      <br/>
      <br/>
      {clientTransactions}
    </div>
  )
}

