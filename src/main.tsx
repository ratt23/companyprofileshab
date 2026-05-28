import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';

import '@fontsource/aileron/400.css';
import '@fontsource/aileron/600.css';
import '@fontsource/aileron/700.css';
import '@fontsource/aileron/800.css';

import '@fontsource/poppins/400.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import '@fontsource/poppins/900.css';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
