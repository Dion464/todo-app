import { useState, useEffect } from 'react';
import '../styles/globals.css';
import Footer from '../components/Footer';

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
      <Footer /> {/* Add the footer component here */}
    </div>
  );
}

export default MyApp;
