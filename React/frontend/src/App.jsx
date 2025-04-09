import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import Header from './components/Header';
import HomePage from './pages/homePage';
import Inventory from './pages/Inventory';
import Transaction from './pages/Transaction';
import Settings from './pages/settings';
import Profile from './pages/profile';
import Signin from './pages/signin';
import Signup from './pages/signup';
import Budget from './pages/budget';
import Dashboard from './pages/dashboard';
import TeamSection from './pages/teamSection';
import TodoApp from './pages/toBuy';
import OurServices from './pages/ourServices';


const ErrorFallback = ({ error }) => (
  <div role="alert">
    <h2>Something went wrong!</h2>
    <pre>{error.message}</pre>
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const hideHeaderOn = ["/signin", "/signup"];
  const shouldShowHeader = !hideHeaderOn.includes(location.pathname);
  return (
    <>
      {shouldShowHeader && <Header />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/homePage" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/toBuy" element={<TodoApp />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/teamSection" element={<TeamSection/>}/>
          <Route path="/ourServices" element={<OurServices/>}/>
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/budget" element={<Budget />} />
        </Routes>
      </main>
    </>
  );
};

const App = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
