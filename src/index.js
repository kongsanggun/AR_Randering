import React from 'react';
import ReactDOM, {render} from 'react-dom';
import reportWebVitals from './reportWebVitals';

import App1 from './Hat_AR';
import App2 from './Necklace_AR';
import App3 from './Earring_AR';

import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <App2 />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
