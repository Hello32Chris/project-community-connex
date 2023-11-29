import React from "react";

export default function TransactionCard({ trans, clientid }) {
  console.log(clientid)


//------------------------------------------------------------- FILTER THROUGH CLIENT TRANSACTIONS -------------
  const clientTransactions = trans.filter((transaction) => 
    transaction.client_id == clientid);

    const transactionDisplay = clientTransactions.map((transaction) => {
    const key = transaction.id;
    const storeName = transaction.store ? transaction.store.name : "N/A";
    const email = transaction.store ? transaction.store.email : "N/A";
    const serviceReceived = transaction.store && transaction.store.goods_services && transaction.store.goods_services.length > 0 ? transaction.store.goods_services[0].name : "N/A";
    const totalPaid = parseFloat(transaction.total_amount).toFixed(2);

    return {
      key,
      storeName,
      email,
      serviceReceived,
      totalPaid
    };
  });
  console.log(trans)

  return (
    <div>
      <h3>Transactions:</h3>
      {clientTransactions.length > 0 ? (
        transactionDisplay.map((transaction) => (
          <div key={transaction.key}>
            <p>
              <strong>Business:</strong> 
              {transaction.storeName}
            </p>
            <p>
              <strong>Email:</strong> 
              {transaction.email}
            </p>
            <p>
              <strong>Service Received:</strong> 
              {transaction.serviceReceived}
            </p>
            <p>
              <strong>Total Paid:</strong> 
              ${transaction.totalPaid}
            </p>
          </div>
        ))
      ) : (
        <p>No transactions.</p>
      )}
    </div>
  );
}