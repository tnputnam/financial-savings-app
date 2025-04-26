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
`;

const WarningMessage = styled.div`
  padding: 15px;
  border-radius: 5px;
  margin: 20px 0;
  text-align: center;
  background-color: #fff3cd;
  color: #856404;
  font-size: 18px;
  font-weight: bold;
`;

const BudgetTest = () => {
  const [category, setCategory] = useState('Groceries');
  const [budget, setBudget] = useState(1000);
  const [spent, setSpent] = useState(0);
  const [warning, setWarning] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      budgetService.setUserId(user.uid);
    }
  }, []);

  const setupTestBudget = async () => {
    setIsLoading(true);
    try {
      // Set up budget warnings for the category
      await budgetService.updateBudgetWarnings(category, {
        threshold: 50, // Warning at 50% of budget
        messages: budgetService.defaultMessages,
        customMessages: []
      });
      
      // Initial test transaction
      setSpent(400);
      checkBudgetWarning(400);
    } catch (error) {
      console.error('Setup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTestTransaction = (amount) => {
    const newSpent = spent + amount;
    setSpent(newSpent);
    checkBudgetWarning(newSpent);
  };

  const checkBudgetWarning = async (currentSpent) => {
    const percentage = (currentSpent / budget) * 100;
    const warnings = await budgetService.getBudgetWarnings(category);
    
    if (budgetService.checkBudgetThreshold(currentSpent, budget, warnings.threshold)) {
      const message = budgetService.getRandomMessage(category, warnings);
      setWarning(message);
    } else {
      setWarning('');
    }
  };

  return (
    <Container>
      <Title>Budget Warning Test</Title>

      <Section>
        <h3>Test Setup</h3>
        <Input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Budget Amount"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
        />
        <Button onClick={setupTestBudget} disabled={isLoading}>
          {isLoading ? 'Setting up...' : 'Setup Test Budget'}
        </Button>
      </Section>

      <Section>
        <h3>Current Status</h3>
        <p>Budget: ${budget}</p>
        <p>Spent: ${spent}</p>
        <p>Percentage: {((spent / budget) * 100).toFixed(1)}%</p>
      </Section>

      <Section>
        <h3>Add Test Transactions</h3>
        <Button onClick={() => addTestTransaction(100)}>
          Add $100 Transaction
        </Button>
        <Button onClick={() => addTestTransaction(200)}>
          Add $200 Transaction
        </Button>
        <Button onClick={() => addTestTransaction(300)}>
          Add $300 Transaction
        </Button>
      </Section>

      {warning && (
        <WarningMessage>
          {warning}
        </WarningMessage>
      )}
    </Container>
  );
};

export default BudgetTest; 