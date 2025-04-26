import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { backupService } from '../services/backupService';
import { auth } from '../firebase';

const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const Button = styled.button`
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  margin-bottom: 10px;

  &:hover {
    background-color: #1976D2;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  width: 100%;
  margin-bottom: 10px;
`;

const CodeDisplay = styled.div`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 5px;
  margin: 20px 0;
`;

const Message = styled.div`
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
  text-align: center;
`;

const SuccessMessage = styled(Message)`
  background-color: #d4edda;
  color: #155724;
`;

const ErrorMessage = styled(Message)`
  background-color: #f8d7da;
  color: #721c24;
`;

const Backup = () => {
  const [backupCode, setBackupCode] = useState('');
  const [restoreCode, setRestoreCode] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    // Set the user ID when component mounts
    const user = auth.currentUser;
    if (user) {
      backupService.setUserId(user.uid);
    }
  }, []);

  const handleGenerateBackup = async () => {
    setIsGenerating(true);
    setMessage('');
    setIsError(false);

    try {
      const code = await backupService.generateBackupCode();
      setBackupCode(code);
      setMessage('Backup code generated! Share this code with your other device.');
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    setMessage('');
    setIsError(false);

    try {
      const success = await backupService.restoreFromCode(restoreCode);
      if (success) {
        setMessage('Data restored successfully!');
        setRestoreCode('');
      } else {
        setMessage('Restore failed. Please try again.');
        setIsError(true);
      }
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <Container>
      <Title>Device Backup & Restore</Title>

      <Section>
        <h3>Create Backup</h3>
        <Button 
          onClick={handleGenerateBackup} 
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Backup Code'}
        </Button>
        {backupCode && (
          <CodeDisplay>
            {backupCode}
          </CodeDisplay>
        )}
      </Section>

      <Section>
        <h3>Restore from Backup</h3>
        <Input
          type="text"
          placeholder="Enter backup code"
          value={restoreCode}
          onChange={(e) => setRestoreCode(e.target.value)}
        />
        <Button 
          onClick={handleRestore} 
          disabled={isRestoring || !restoreCode}
        >
          {isRestoring ? 'Restoring...' : 'Restore Data'}
        </Button>
      </Section>

      {message && (
        isError ? (
          <ErrorMessage>{message}</ErrorMessage>
        ) : (
          <SuccessMessage>{message}</SuccessMessage>
        )
      )}
    </Container>
  );
};

export default Backup; 