import {StrictMode, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Hide loading screen when React is ready
function LoadingScreenRemover() {
  useEffect(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      // Keep the logo splash visible for 5 seconds while the app/data initialize.
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        // Remove from DOM after transition
        setTimeout(() => {
          loadingScreen.remove();
        }, 300);
      }, 5000);
    }
  }, []);
  return null;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoadingScreenRemover />
    <App />
  </StrictMode>,
);