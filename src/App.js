import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Auth from './components/Auth';
import PropertyManager from './components/PropertyManager';
import VoiceTransaction from './components/VoiceTransaction';
import BankLink from './components/BankLink';
import Backup from './components/Backup';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FaHome, FaChartLine, FaWallet, FaCog, FaBell, FaBackup, FaExclamationTriangle } from 'react-icons/fa';
import Dashboard from './components/Dashboard';
import Budget from './components/Budget';
import Transactions from './components/Transactions';
import Settings from './components/Settings';
import BudgetWarnings from './components/BudgetWarnings';
import BudgetTest from './components/BudgetTest';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const Nav = styled.nav`
  background-color: #2196F3;
  padding: 1rem;
  color: white;
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1rem;
`;

const NavItem = styled.li`
  a {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
`;

const Content = styled.main`
  padding: 2rem;
`;

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/auth" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

const AppContent = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Auth />;
  }

  return (
    <AppContainer>
      <MainContent>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/backup" element={<Backup />} />
          <Route path="/budget-warnings" element={<BudgetWarnings />} />
          <Route path="/budget-test" element={<BudgetTest />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </MainContent>
      <Nav>
        <NavLink to="/">
          <FaHome />
          <span>Home</span>
        </NavLink>
        <NavLink to="/budget">
          <FaChartLine />
          <span>Budget</span>
        </NavLink>
        <NavLink to="/transactions">
          <FaWallet />
          <span>Transactions</span>
        </NavLink>
        <NavLink to="/budget-warnings">
          <FaBell />
          <span>Warnings</span>
        </NavLink>
        <NavLink to="/budget-test">
          <FaExclamationTriangle />
          <span>Test</span>
        </NavLink>
        <NavLink to="/backup">
          <FaBackup />
          <span>Backup</span>
        </NavLink>
        <NavLink to="/settings">
          <FaCog />
          <span>Settings</span>
        </NavLink>
      </Nav>
    </AppContainer>
  );
};

export default App; 