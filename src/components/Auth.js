import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { auth } from '../firebase';
import { syncService } from '../services/syncService';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';

const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #1976D2;
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  margin-top: 10px;
`;

const SuccessMessage = styled.div`
  color: #4CAF50;
  margin-top: 10px;
`;

const DeviceList = styled.div`
  margin-top: 20px;
`;

const DeviceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        syncService.setUserId(user.uid);
        // Load connected devices
        loadDevices(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadDevices = async (userId) => {
    // In a real app, you would fetch this from your backend
    // For now, we'll simulate it
    setDevices([
      { id: '1', name: 'iPhone 12', lastActive: '2023-04-26T12:00:00' },
      { id: '2', name: 'iPad Pro', lastActive: '2023-04-26T11:30:00' }
    ]);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setSuccess('Account created successfully!');
      setError('');
    } catch (error) {
      setError(error.message);
      setSuccess('');
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setSuccess('Signed in successfully!');
      setError('');
    } catch (error) {
      setError(error.message);
      setSuccess('');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setSuccess('Signed out successfully!');
      setError('');
    } catch (error) {
      setError(error.message);
      setSuccess('');
    }
  };

  const handleLinkDevice = async () => {
    try {
      // In a real app, you would generate a unique code and send it to the server
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setSuccess(`Share this code with the other device: ${code}`);
      setError('');
    } catch (error) {
      setError(error.message);
      setSuccess('');
    }
  };

  if (user) {
    return (
      <Container>
        <h2>Welcome, {user.email}</h2>
        <DeviceList>
          <h3>Connected Devices</h3>
          {devices.map(device => (
            <DeviceItem key={device.id}>
              <div>
                <strong>{device.name}</strong>
                <div>Last active: {new Date(device.lastActive).toLocaleString()}</div>
              </div>
              <Button onClick={handleLinkDevice}>Link New Device</Button>
            </DeviceItem>
          ))}
        </DeviceList>
        <Button onClick={handleSignOut} style={{ marginTop: '20px' }}>
          Sign Out
        </Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
      </Container>
    );
  }

  return (
    <Container>
      <h2>Sign In / Sign Up</h2>
      <Form onSubmit={handleSignIn}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Sign In</Button>
        <Button type="button" onClick={handleSignUp}>
          Sign Up
        </Button>
      </Form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
    </Container>
  );
};

export default Auth; 