import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

if (process.env.NODE_ENV === 'development') {
    const eruda = require('eruda');
    eruda.init();
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <App />
);
