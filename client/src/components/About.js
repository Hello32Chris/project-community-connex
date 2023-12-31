import React, { useEffect } from 'react';

export default function About() {

  useEffect(() => {
    document.body.className = 'aboutBack';
    return () => {
      document.body.className = '';
  }}, []);

  return (
    <div align='center' id='about-message'>
      <img alt='Little happy moose' src="./Images/moose.gif" />
      <h1>
        This project was inspired by my love of business and networking.
        <br />
        I have implemented my coding knowledge to create a coherent and welcoming
        <br />
        environment where members can build a wholesome community based on provided services.
      </h1>
    </div>
  );
}