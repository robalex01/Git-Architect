import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';
import App from './App';
import './styles.css';



// HashRouter (pas BrowserRouter) : l'app packagée est chargée via file://,
// où l'API History (utilisée par BrowserRouter) ne fonctionne pas.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <ReactFlowProvider>
        <App />
      </ReactFlowProvider>
    </HashRouter>
  </React.StrictMode>
);


