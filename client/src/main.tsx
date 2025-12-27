import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'

import '../public/styles/reset.css';
import '../public/styles/typography.css';
import '../public/styles/_styles.css';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
      <App />
  </BrowserRouter>
)
