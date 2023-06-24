import React from 'react';
import ReactDOM from 'react-dom';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import './index.css';
import App from './App';
import { ModalProvider } from './context/Modal';
import configureStore from './store';
import * as sessionActions from './store/session';

import { restoreCSRF, csrfFetch } from './store/csrf';

const store = configureStore();

if (process.env.NODE_ENV !== 'production') {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

function Root() {
  return (
    <ReduxProvider store={store}>
      <ModalProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </ModalProvider>
    </ReduxProvider>
  );
}

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);
