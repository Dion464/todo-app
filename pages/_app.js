import { useState, useEffect } from 'react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply dark mode on body element when the state changes
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div>
      <button 
        className="dark-mode-toggle" 
        onClick={() => setIsDarkMode(prevMode => !prevMode)}
      >
        {isDarkMode ? '🌙' : '🌞'}
      </button>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
