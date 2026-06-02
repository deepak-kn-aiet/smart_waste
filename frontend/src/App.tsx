import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Features from './sections/Features';
import Analyzer from './sections/Analyzer';
import Guide from './sections/Guide';
import Planner from './sections/Planner';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-dark-900 text-white' : 'bg-light-100 text-dark-900'}`}>
      <div className="gradient-mesh fixed inset-0 z-0 opacity-40 pointer-events-none" />
      
      <div className="relative z-10">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        
        <main>
          <Hero />
          <Features />
          <Analyzer />
          <Guide />
          <Planner />
        </main>
      </div>
    </div>
  );
}

export default App;
