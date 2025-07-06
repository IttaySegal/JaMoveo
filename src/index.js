import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router> {/* ✅ Router comes first */}
      <AuthProvider> {/* ✅ Now safe to use useNavigate */}
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
