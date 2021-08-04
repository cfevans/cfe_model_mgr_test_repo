import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import {Provider, useSelector} from 'react-redux';
import rtConfigureStore from './rtkStore';

ReactDOM.render(
  <Provider store={rtConfigureStore}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
document.getElementById('root')
);

