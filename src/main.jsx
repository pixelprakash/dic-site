import React from 'react';
import ReactDOM from 'react-dom/client';
import App, { preloadRoute } from './App';

const start = () =>
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

// The built pages already contain their content as HTML. Wait for this page's
// code before starting the app, so that content is replaced in one step.
preloadRoute(window.location.pathname).then(start, start);
