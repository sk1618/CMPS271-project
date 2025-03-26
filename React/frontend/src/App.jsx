import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Transaction from './pages/Transaction';
import Profile from "./pages/profile";
import Signin from "./pages/signin";
import Signup from "./pages/signup";

const App = () => {
  return (
    <Router>
      <Header /> {/* Navigation bar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="Inventory" element={<Inventory />} />
        <Route path="Transaction" element={<Transaction />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;
