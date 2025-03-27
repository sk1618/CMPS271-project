import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/homePage';
import Inventory from './pages/Inventory';
import Transaction from './pages/Transaction';
import ToBuy from './pages/toBuy';
import Settings from './pages/settings';
import Profile from './pages/profile';
import Signin from './pages/signin';
import Signup from './pages/signup';
import Budget from './pages/budget';

const AppContent = () => {
  const location = useLocation();
  const hideHeaderOn = ["/signin", "/signup"];
  const shouldShowHeader = !hideHeaderOn.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Header />}
      <Routes>
        <Route path="/homePage" element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/toBuy" element={<ToBuy />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/budget" element={<Budget />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

