import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { budgetService } from '../services/budgetService';
import { auth } from '../firebase';

const Container = styled.div`
  max-width: 600px;
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

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  width: 100%;
  margin-bottom: 10px;
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

const MessageList = styled.div`
  margin-top: 20px;
`;

const MessageItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const DeleteButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }
`;

const WarningMessage = styled.div`
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
  text-align: center;
  background-color: #fff3cd;
  color: #856404;
`;

const BudgetWarnings = () => {
  const [category, setCategory] = useState('');
  const [threshold, setThreshold] = useState(80);
  const [newMessage, setNewMessage] = useState('');
  const [warnings, setWarnings] = useState(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      budgetService.setUserId(user.uid);
    }
  }, []);

  const handleLoadWarnings = async () => {
    if (!category) return;
    
    setIsLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const data = await budgetService.getBudgetWarnings(category);
      setWarnings(data);
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateThreshold = async () => {
    if (!category || !warnings) return;

    setIsLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const updatedWarnings = {
        ...warnings,
        threshold: threshold
      };
      await budgetService.updateBudgetWarnings(category, updatedWarnings);
      setWarnings(updatedWarnings);
      setMessage('Threshold updated successfully!');
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMessage = async () => {
    if (!category || !newMessage.trim()) return;

    setIsLoading(true);
    setMessage('');
    setIsError(false);

    try {
      await budgetService.addCustomMessage(category, newMessage.trim());
      const updatedWarnings = await budgetService.getBudgetWarnings(category);
      setWarnings(updatedWarnings);
      setNewMessage('');
      setMessage('Message added successfully!');
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMessage = async (index) => {
    if (!category) return;

    setIsLoading(true);
    setMessage('');
    setIsError(false);

    try {
      await budgetService.removeCustomMessage(category, index);
      const updatedWarnings = await budgetService.getBudgetWarnings(category);
      setWarnings(updatedWarnings);
      setMessage('Message removed successfully!');
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Title>Budget Warning Settings</Title>

      <Section>
        <h3>Select Category</h3>
        <Input
          type="text"
          placeholder="Enter category name"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Button 
          onClick={handleLoadWarnings} 
          disabled={isLoading || !category}
        >
          {isLoading ? 'Loading...' : 'Load Settings'}
        </Button>
      </Section>

      {warnings && (
        <>
          <Section>
            <h3>Warning Threshold</h3>
            <Input
              type="number"
              min="0"
              max="100"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
            />
            <Button 
              onClick={handleUpdateThreshold} 
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Threshold'}
            </Button>
            <WarningMessage>
              Warning messages will appear when you reach {threshold}% of your budget
            </WarningMessage>
          </Section>

          <Section>
            <h3>Default Messages</h3>
            <MessageList>
              {warnings.messages.map((msg, index) => (
                <MessageItem key={`default-${index}`}>
                  {msg}
                </MessageItem>
              ))}
            </MessageList>
          </Section>

          <Section>
            <h3>Custom Messages</h3>
            <Input
              type="text"
              placeholder="Enter your custom warning message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button 
              onClick={handleAddMessage} 
              disabled={isLoading || !newMessage.trim()}
            >
              {isLoading ? 'Adding...' : 'Add Custom Message'}
            </Button>
            <MessageList>
              {warnings.customMessages.map((msg, index) => (
                <MessageItem key={`custom-${index}`}>
                  {msg}
                  <DeleteButton onClick={() => handleRemoveMessage(index)}>
                    Delete
                  </DeleteButton>
                </MessageItem>
              ))}
            </MessageList>
          </Section>
        </>
      )}

      {message && (
        <div style={{ color: isError ? '#f44336' : '#4CAF50' }}>
          {message}
        </div>
      )}
    </Container>
  );
};

export default BudgetWarnings; 