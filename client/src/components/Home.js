import React, { useEffect } from "react";

export default function Home() {

    useEffect(() => {
        document.body.className = 'homeback';
        return () => {
          document.body.className = '';
      }}, []);


    return (
        <div align='center'>
            <h1>Hello and welcome to your future business!</h1>
            <div className="frame">
                <img className="shape" alt="" src="/Images/welcome.JPG" />
            </div>
        </div>
    )
}

