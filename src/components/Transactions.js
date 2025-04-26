import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format, parseISO } from 'date-fns';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const TransactionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  margin-top: 20px;
`;

const TransactionList = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TransactionItem = styled.div`
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const CategoryTag = styled.span`
  background-color: ${props => props.color || '#e9ecef'};
  color: ${props => props.textColor || '#495057'};
  padding: 4px 8px;
  border-radius: 15px;
  font-size: 0.8em;
  margin-left: 10px;
`;

const Filters = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  height: fit-content;
`;

const FilterGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
  
  &:hover {
    background-color: #45a049;
  }
`;

const ReminderBanner = styled.div`
  background-color: #fff3cd;
  color: #856404;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    account: 'all',
    category: 'all',
    dateRange: '30',
    search: ''
  });
  const [categories, setCategories] = useState([
    { id: 'groceries', name: 'Groceries', color: '#ffd700', textColor: '#000' },
    { id: 'dining', name: 'Dining', color: '#ff6b6b', textColor: '#fff' },
    { id: 'transportation', name: 'Transportation', color: '#4dabf7', textColor: '#fff' },
    { id: 'utilities', name: 'Utilities', color: '#20c997', textColor: '#fff' },
    { id: 'entertainment', name: 'Entertainment', color: '#be4bdb', textColor: '#fff' },
    { id: 'shopping', name: 'Shopping', color: '#fd7e14', textColor: '#fff' },
    { id: 'health', name: 'Health', color: '#e64980', textColor: '#fff' },
    { id: 'investment', name: 'Investment', color: '#339af0', textColor: '#fff' }
  ]);

  // Fetch transactions from USAA and combine with manual entries
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions');
        const data = await response.json();
        setTransactions(data.transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = async (transactionId, newCategory) => {
    try {
      const response = await fetch(`/api/transactions/${transactionId}/category`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: newCategory }),
      });
      
      if (response.ok) {
        setTransactions(prev => prev.map(t => 
          t.id === transactionId ? { ...t, category: newCategory } : t
        ));
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesAccount = filters.account === 'all' || transaction.accountId === filters.account;
    const matchesCategory = filters.category === 'all' || transaction.category === filters.category;
    const matchesSearch = transaction.description.toLowerCase().includes(filters.search.toLowerCase());
    return matchesAccount && matchesCategory && matchesSearch;
  });

  return (
    <Container>
      <h2>Transaction History</h2>
      
      <ReminderBanner>
        <div>
          <strong>Balance Update Reminder</strong>
          <p>Remember to update your manual account balances monthly</p>
        </div>
        <Button onClick={() => {/* Add reminder logic */}}>
          Set Reminder
        </Button>
      </ReminderBanner>

      <TransactionGrid>
        <TransactionList>
          {filteredTransactions.map(transaction => (
            <TransactionItem key={transaction.id}>
              <div>
                <strong>{transaction.description}</strong>
                <CategoryTag 
                  color={categories.find(c => c.id === transaction.category)?.color}
                  textColor={categories.find(c => c.id === transaction.category)?.textColor}
                >
                  {transaction.category}
                </CategoryTag>
              </div>
              <div>{format(parseISO(transaction.date), 'MMM dd, yyyy')}</div>
              <div>${transaction.amount.toFixed(2)}</div>
              <Select
                value={transaction.category}
                onChange={(e) => handleCategoryChange(transaction.id, e.target.value)}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </TransactionItem>
          ))}
        </TransactionList>

        <Filters>
          <h3>Filters</h3>
          <FilterGroup>
            <Label>Account</Label>
            <Select name="account" value={filters.account} onChange={handleFilterChange}>
              <option value="all">All Accounts</option>
              {/* Add account options dynamically */}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>Category</Label>
            <Select name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>Date Range</Label>
            <Select name="dateRange" value={filters.dateRange} onChange={handleFilterChange}>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>Search</Label>
            <Input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search transactions..."
            />
          </FilterGroup>
        </Filters>
      </TransactionGrid>
    </Container>
  );
}

export default Transactions; 