import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Auth from './components/Auth';
import VoiceTransaction from './components/VoiceTransaction';
import BankLink from './components/BankLink';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import BudgetTest from './components/BudgetTest';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Nav = styled.nav`
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 1rem;
`;

const NavItem = styled.li`
  a {
    color: #333;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f0f0f0;
    }
  }
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
        <Container>
          <Nav>
            <NavList>
              <NavItem><Link to="/">Dashboard</Link></NavItem>
              <NavItem><Link to="/bank-link">Bank Link</Link></NavItem>
              <NavItem><Link to="/transactions">Transactions</Link></NavItem>
              <NavItem><Link to="/voice-transaction">Voice Entry</Link></NavItem>
              <NavItem><Link to="/budget-test">Budget Test</Link></NavItem>
            </NavList>
          </Nav>

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bank-link" element={<BankLink />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/voice-transaction" element={<VoiceTransaction />} />
            <Route path="/budget-test" element={<BudgetTest />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
};

export default App; 