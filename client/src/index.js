import React from 'react';
import ReactDOM from 'react-dom/client';
import './stylesheets/index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from './UserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <UserProvider>
      <App />
    </UserProvider>
  </Router>
);

reportWebVitals();
