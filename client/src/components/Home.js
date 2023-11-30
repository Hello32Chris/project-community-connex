import React, { useEffect } from "react";

export default function Home() {

    useEffect(() => {
        document.body.className = 'homeback';
        return () => {
            document.body.className = '';
        }
    }, []);

    return (
        <div id="lastdiv" align='center'>
          <div id="helloframe">
            <div id="hello"></div>
            <h1 id="text">Hello and welcome to your future business!</h1>
          </div>
        </div>
      )
    }
