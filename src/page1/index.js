import "core-js";
import "mutation-observer";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import "./../utils/polyfill";

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
    <App />,
  document.getElementById('root')
);

