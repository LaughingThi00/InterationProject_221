import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import DataContextProvider from './context/DataContext';
import AuthContextProvider from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
  <DataContextProvider>
 <React.StrictMode>
    <App />
  </React.StrictMode>
  </DataContextProvider>
  </AuthContextProvider>

 
);

