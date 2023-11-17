import React, {useState} from "react";
import ClientCard from "./ClientCard";
import Transactions from "./Transactions";

export default function Clients({ clients }) {
  
    // console.log(clients.name)
    // console.log(clients.email)
    // console.log(clients.transactions)
    const [showTransactions, setShowTransactions] = useState(false);

    
    
    const toggleTransactions = () => {
      setShowTransactions(!showTransactions);
    };
    
    const clientView = clients.map((client) => {
        const trans = client.transactions.map((tran) => {
            console.log(tran)
            return (
                <Transactions key={tran.id}
                    name={tran.store.name}
                    email={tran.store.email}
                    service={tran.store.goods_services[0].name}
                    price={tran.store.goods_services[0].price}
                />
            )
        })
        return (
        <div>
            <ClientCard key={client.id}
                id={client.id}
                name={client.name}
                email={client.email}
            />
            <button onClick={toggleTransactions}>
                {!showTransactions ? 'Show Transactions' : 'Hide Transactions'}
            </button>
                {showTransactions ? trans : null}
             
        </div>
    )})
    
    // console.log(clients)


    return (
        <div align='center'>
            {clientView}
        </div>
    )
}

