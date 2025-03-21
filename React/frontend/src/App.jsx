import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Inventory from './pages/Inventory';

const App = () => {
  return (
    <Router>
      <Header /> {/* Navigation bar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="Inventory" element={<Inventory />} />
      </Routes>
    </Router>
  );
};

export default App;
