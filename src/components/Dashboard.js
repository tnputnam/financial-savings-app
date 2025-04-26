import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';

const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const BudgetItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ProgressBar = styled.div`
  height: 10px;
  background: #eee;
  border-radius: 5px;
  margin-top: 5px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background: ${props => props.percentage > 80 ? '#ff4444' : props.percentage > 50 ? '#ffbb33' : '#00C851'};
  width: ${props => props.percentage}%;
`;

function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([
    { category: 'Groceries', amount: 500, spent: 350 },
    { category: 'Entertainment', amount: 200, spent: 180 },
    { category: 'Transportation', amount: 300, spent: 250 },
    { category: 'Utilities', amount: 400, spent: 380 }
  ]);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);

  const chartData = {
    labels: transactions.slice(-7).map(t => format(new Date(t.date), 'MMM dd')),
    datasets: [
      {
        label: 'Daily Spending',
        data: transactions.slice(-7).map(t => t.amount),
        borderColor: '#4CAF50',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Recent Spending'
      }
    }
  };

  return (
    <DashboardContainer>
      <h1>Financial Dashboard</h1>
      
      <Grid>
        <Card>
          <h2>Total Balance</h2>
          <h3>${totalBalance.toFixed(2)}</h3>
        </Card>
        
        <Card>
          <h2>Monthly Budget</h2>
          <h3>${totalBudget.toFixed(2)}</h3>
        </Card>
        
        <Card>
          <h2>Spent This Month</h2>
          <h3>${totalSpent.toFixed(2)}</h3>
        </Card>
      </Grid>

      <Card>
        <h2>Spending Trends</h2>
        <Line data={chartData} options={chartOptions} />
      </Card>

      <Card>
        <h2>Budget Categories</h2>
        {budgets.map((budget, index) => (
          <BudgetItem key={index}>
            <div>
              <strong>{budget.category}</strong>
              <div>${budget.spent} / ${budget.amount}</div>
              <ProgressBar>
                <Progress percentage={(budget.spent / budget.amount) * 100} />
              </ProgressBar>
            </div>
            <div>
              {((budget.spent / budget.amount) * 100).toFixed(0)}%
            </div>
          </BudgetItem>
        ))}
      </Card>
    </DashboardContainer>
  );
}

export default Dashboard; 