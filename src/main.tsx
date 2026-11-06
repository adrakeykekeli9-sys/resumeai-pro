import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import AccessBar from './components/AccessBar.tsx';
import {installFetchInterceptor} from './access.ts';
import './index.css';

installFetchInterceptor();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <AccessBar />
  </StrictMode>,
);
