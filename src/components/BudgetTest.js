import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

const BudgetStatus = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  border-radius: 4px;
  background-color: #f8f9fa;
`;

const Warning = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #dc3545;
  margin-top: 1rem;
`;

const Success = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #28a745;
  margin-top: 1rem;
`;

const BudgetTest = () => {
  const [category, setCategory] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [currentSpending, setCurrentSpending] = useState(0);
  const [warning, setWarning] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSetupBudget = (e) => {
    e.preventDefault();
    if (!category || !budgetAmount) {
      setWarning('Please fill in all fields');
      return;
    }

    const amount = parseFloat(budgetAmount);
    if (isNaN(amount) || amount <= 0) {
      setWarning('Please enter a valid budget amount');
      return;
    }

    setCurrentSpending(0);
    setWarning(null);
    setSuccess(`Budget of $${amount} set for ${category}`);
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!category || !budgetAmount) {
      setWarning('Please set up a budget first');
      return;
    }

    const amount = parseFloat(budgetAmount);
    const newSpending = currentSpending + 100; // Simulate adding $100 transaction

    setCurrentSpending(newSpending);

    if (newSpending > amount * 0.8) {
      setWarning(`Warning: You've spent $${newSpending} of your $${amount} budget for ${category}`);
    } else {
      setWarning(null);
    }
  };

  return (
    <Container>
      <Title>Budget Warning Test</Title>
      
      <Form onSubmit={handleSetupBudget}>
        <Input
          type="text"
          placeholder="Category (e.g., Groceries)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Budget Amount"
          value={budgetAmount}
          onChange={(e) => setBudgetAmount(e.target.value)}
        />
        <Button type="submit">Set Budget</Button>
      </Form>

      <Form onSubmit={handleAddTransaction}>
        <Button type="submit">Add $100 Transaction</Button>
      </Form>

      <BudgetStatus>
        <h3>Current Status</h3>
        <p>Category: {category || 'Not set'}</p>
        <p>Budget: ${budgetAmount || 'Not set'}</p>
        <p>Current Spending: ${currentSpending}</p>
        
        {warning && (
          <Warning>
            <FaExclamationTriangle />
            {warning}
          </Warning>
        )}
        
        {success && (
          <Success>
            <FaCheckCircle />
            {success}
          </Success>
        )}
      </BudgetStatus>
    </Container>
  );
};

export default BudgetTest; 