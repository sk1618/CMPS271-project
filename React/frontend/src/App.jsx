import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Transaction from './pages/Transaction';

const App = () => {
  return (
    <Router>
      <Header /> {/* Navigation bar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="Inventory" element={<Inventory />} />
        <Route path="Transaction" element={<Transaction />} />
      </Routes>
    </Router>
  );
};

export default App;
