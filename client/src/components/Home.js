import React, { useEffect } from "react";

export default function Home() {

    useEffect(() => {
        document.body.className = 'homeback';
        return () => {
            document.body.className = '';
        }
    }, []);


    return (
        <div align='center'>
            <div>
                <h1 id="hello" >
                    Hello and welcome to your future business!
                </h1>
            </div>
            <div>
                <img id="welcomesign" src='/Images/welcomesign.png' alt='' />
            </div>
        </div>
    )
}

