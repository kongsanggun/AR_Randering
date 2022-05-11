import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

import Page_routes from "./page_routes";
import App1 from './Hat_AR';
import App2 from './Necklace_AR';
import App3 from './Earring_AR';

import './index.css';

ReactDOM.render(

    <Page_routes/>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
