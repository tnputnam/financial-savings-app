import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { FaMicrophone, FaPlus, FaChartPie } from 'react-icons/fa';

const Container = styled.div`
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const VoiceButton = styled.button`
  background-color: ${props => props.isListening ? '#4CAF50' : '#2196F3'};
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px auto;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const StatusText = styled.div`
  text-align: center;
  margin: 10px 0;
  color: ${props => props.isListening ? '#4CAF50' : '#666'};
  font-weight: ${props => props.isListening ? 'bold' : 'normal'};
`;

const TransactionForm = styled.div`
  display: grid;
  gap: 15px;
  margin-top: 20px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;

  &:hover {
    background-color: #45a049;
  }
`;

const FloatingButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #2196F3;
  color: white;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    background-color: #1976D2;
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const QuickAddSection = styled.div`
  margin: 20px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
`;

const QuickAddButton = styled.button`
  background: white;
  border: 1px solid #ddd;
  padding: 8px 15px;
  border-radius: 20px;
  margin: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;

  &:hover {
    background: #e3f2fd;
    border-color: #2196F3;
  }
`;

const BudgetQueryResult = styled.div`
  margin: 20px 0;
  padding: 15px;
  background: ${props => props.isOver ? '#ffebee' : '#e8f5e9'};
  border-radius: 10px;
  color: ${props => props.isOver ? '#c62828' : '#2e7d32'};
`;

const categories = [
  { id: 'groceries', name: 'Groceries' },
  { id: 'dining', name: 'Dining Out' },
  { id: 'transportation', name: 'Transportation' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'shopping', name: 'Shopping' },
  { id: 'utilities', name: 'Utilities' },
  { id: 'health', name: 'Health' },
  { id: 'other', name: 'Other' }
];

const frequentTransactions = [
  { category: 'groceries', amount: 50, description: 'Weekly groceries' },
  { category: 'dining', amount: 20, description: 'Lunch out' },
  { category: 'transportation', amount: 15, description: 'Uber ride' },
  { category: 'coffee', amount: 5, description: 'Coffee' }
];

function VoiceTransaction() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [transaction, setTransaction] = useState({
    amount: '',
    category: '',
    description: '',
    paymentMethod: 'cash'
  });
  const [recognition, setRecognition] = useState(null);
  const [budgetQuery, setBudgetQuery] = useState(null);
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setTranscript(transcript);
          processVoiceInput(transcript);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognition);
      }
    }

    // Check if mobile device
    const isMobile = window.innerWidth < 768;
    setShowFloatingButton(isMobile);

    // Add resize listener
    window.addEventListener('resize', () => {
      setShowFloatingButton(window.innerWidth < 768);
    });

    return () => window.removeEventListener('resize', () => {});
  }, []);

  const processVoiceInput = (text) => {
    // Check for budget queries
    if (text.toLowerCase().includes('how much') || text.toLowerCase().includes('budget')) {
      const categoryMatch = categories.find(category => 
        text.toLowerCase().includes(category.name.toLowerCase())
      );
      if (categoryMatch) {
        // Simulate budget query response
        setBudgetQuery({
          category: categoryMatch.name,
          spent: 250,
          budget: 300,
          remaining: 50
        });
        return;
      }
    }

    // Extract amount using regex
    const amountMatch = text.match(/\$?(\d+(\.\d{2})?)/);
    if (amountMatch) {
      setTransaction(prev => ({
        ...prev,
        amount: amountMatch[1]
      }));
    }

    // Extract category
    const categoryMatch = categories.find(category => 
      text.toLowerCase().includes(category.name.toLowerCase())
    );
    if (categoryMatch) {
      setTransaction(prev => ({
        ...prev,
        category: categoryMatch.id
      }));
    }

    // Extract description (everything except amount and category)
    let description = text;
    if (amountMatch) {
      description = description.replace(amountMatch[0], '').trim();
    }
    if (categoryMatch) {
      description = description.replace(categoryMatch.name, '').trim();
    }
    setTransaction(prev => ({
      ...prev,
      description: description
    }));
  };

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...transaction,
          date: new Date().toISOString(),
          amount: parseFloat(transaction.amount)
        }),
      });

      if (response.ok) {
        // Reset form
        setTransaction({
          amount: '',
          category: '',
          description: '',
          paymentMethod: 'cash'
        });
        setTranscript('');
        alert('Transaction added successfully!');
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Error adding transaction. Please try again.');
    }
  };

  const handleQuickAdd = (transaction) => {
    setTransaction({
      ...transaction,
      paymentMethod: 'credit' // Default to credit card
    });
  };

  const handleFloatingButtonClick = () => {
    startListening();
  };

  return (
    <Container>
      <h2>Add Transaction with Voice</h2>
      
      <QuickAddSection>
        <h3>Quick Add</h3>
        <div>
          {frequentTransactions.map((t, index) => (
            <QuickAddButton 
              key={index}
              onClick={() => handleQuickAdd(t)}
            >
              <FaPlus size={12} />
              {t.description} (${t.amount})
            </QuickAddButton>
          ))}
        </div>
      </QuickAddSection>

      <VoiceButton 
        onClick={startListening} 
        isListening={isListening}
        disabled={isListening}
      >
        <FaMicrophone size={20} />
        {isListening ? 'Listening...' : 'Start Voice Input'}
      </VoiceButton>

      <StatusText isListening={isListening}>
        {isListening ? 'Listening...' : 'Click the button and say your transaction details'}
      </StatusText>

      {transcript && (
        <div style={{ margin: '20px 0' }}>
          <strong>You said:</strong> {transcript}
        </div>
      )}

      {budgetQuery && (
        <BudgetQueryResult isOver={budgetQuery.remaining < 0}>
          <h3>Budget Query Result</h3>
          <p>Category: {budgetQuery.category}</p>
          <p>Spent: ${budgetQuery.spent}</p>
          <p>Budget: ${budgetQuery.budget}</p>
          <p>Remaining: ${budgetQuery.remaining}</p>
        </BudgetQueryResult>
      )}

      <TransactionForm>
        <div>
          <label>Amount</label>
          <Input
            type="number"
            value={transaction.amount}
            onChange={(e) => setTransaction(prev => ({ ...prev, amount: e.target.value }))}
            placeholder="Amount"
            step="0.01"
          />
        </div>

        <div>
          <label>Category</label>
          <Select
            value={transaction.category}
            onChange={(e) => setTransaction(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label>Description</label>
          <Input
            type="text"
            value={transaction.description}
            onChange={(e) => setTransaction(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Description"
          />
        </div>

        <div>
          <label>Payment Method</label>
          <Select
            value={transaction.paymentMethod}
            onChange={(e) => setTransaction(prev => ({ ...prev, paymentMethod: e.target.value }))}
          >
            <option value="cash">Cash</option>
            <option value="credit">Credit Card</option>
            <option value="debit">Debit Card</option>
          </Select>
        </div>

        <Button onClick={handleSubmit}>
          Add Transaction
        </Button>
      </TransactionForm>

      {showFloatingButton && (
        <FloatingButton onClick={handleFloatingButtonClick}>
          <FaMicrophone size={24} />
        </FloatingButton>
      )}
    </Container>
  );
}

export default VoiceTransaction; 