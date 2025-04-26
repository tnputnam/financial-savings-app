import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaHome, FaMoneyBillWave, FaCalendarAlt, FaPlus, FaChartLine, FaTools, FaUsers, FaBell } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Container = styled.div`
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const Section = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
  margin-bottom: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
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
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;

  &:hover {
    background-color: #45a049;
  }
`;

const AddButton = styled(Button)`
  background-color: #2196F3;
  &:hover {
    background-color: #1976D2;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  padding: 10px 20px;
  border: none;
  background: ${props => props.active ? '#2196F3' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#1976D2' : '#e9ecef'};
  }
`;

const ReminderBanner = styled.div`
  background: ${props => props.urgent ? '#ffebee' : '#e3f2fd'};
  color: ${props => props.urgent ? '#c62828' : '#1565c0'};
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const MaintenanceCard = styled(Card)`
  border-left: 4px solid ${props => {
    switch(props.priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#2196f3';
    }
  }};
`;

const TenantCard = styled(Card)`
  background: #f8f9fa;
`;

const PropertyManager = () => {
  const [properties, setProperties] = useState([]);
  const [loans, setLoans] = useState([]);
  const [bills, setBills] = useState([]);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [showBillForm, setShowBillForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [propertyHistory, setPropertyHistory] = useState({});
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [reminders, setReminders] = useState([]);

  const [newProperty, setNewProperty] = useState({
    name: '',
    address: '',
    purchasePrice: '',
    currentValue: '',
    mortgageBalance: '',
    rentalIncome: '',
    expenses: ''
  });

  const [newLoan, setNewLoan] = useState({
    name: '',
    type: 'mortgage',
    amount: '',
    interestRate: '',
    term: '',
    monthlyPayment: ''
  });

  const [newBill, setNewBill] = useState({
    name: '',
    amount: '',
    dueDate: '',
    frequency: 'monthly',
    category: 'utilities'
  });

  const [valueHistory, setValueHistory] = useState({});
  const [showValueForm, setShowValueForm] = useState(false);
  const [newValueEntry, setNewValueEntry] = useState({
    date: '',
    value: '',
    notes: ''
  });

  const [newMaintenanceTask, setNewMaintenanceTask] = useState({
    propertyId: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    cost: '',
    status: 'pending'
  });

  const [newTenant, setNewTenant] = useState({
    propertyId: '',
    name: '',
    contact: '',
    leaseStart: '',
    leaseEnd: '',
    rentAmount: '',
    deposit: ''
  });

  const handlePropertySubmit = (e) => {
    e.preventDefault();
    setProperties([...properties, newProperty]);
    setNewProperty({
      name: '',
      address: '',
      purchasePrice: '',
      currentValue: '',
      mortgageBalance: '',
      rentalIncome: '',
      expenses: ''
    });
    setShowPropertyForm(false);
  };

  const handleLoanSubmit = (e) => {
    e.preventDefault();
    setLoans([...loans, newLoan]);
    setNewLoan({
      name: '',
      type: 'mortgage',
      amount: '',
      interestRate: '',
      term: '',
      monthlyPayment: ''
    });
    setShowLoanForm(false);
  };

  const handleBillSubmit = (e) => {
    e.preventDefault();
    setBills([...bills, newBill]);
    setNewBill({
      name: '',
      amount: '',
      dueDate: '',
      frequency: 'monthly',
      category: 'utilities'
    });
    setShowBillForm(false);
  };

  const calculateAmortization = (loan) => {
    const principal = parseFloat(loan.amount);
    const rate = parseFloat(loan.interestRate) / 100 / 12;
    const term = parseFloat(loan.term) * 12;
    const monthlyPayment = (principal * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    
    let balance = principal;
    const schedule = [];
    
    for (let i = 1; i <= term; i++) {
      const interest = balance * rate;
      const principalPayment = monthlyPayment - interest;
      balance -= principalPayment;
      
      schedule.push({
        month: i,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interest,
        balance: balance
      });
    }
    
    return schedule;
  };

  const handleValueSubmit = (e) => {
    e.preventDefault();
    const propertyId = e.target.dataset.propertyId;
    setValueHistory(prev => ({
      ...prev,
      [propertyId]: [...(prev[propertyId] || []), newValueEntry]
    }));
    setNewValueEntry({ date: '', value: '', notes: '' });
    setShowValueForm(false);
  };

  const handleMaintenanceSubmit = (e) => {
    e.preventDefault();
    setMaintenanceTasks([...maintenanceTasks, newMaintenanceTask]);
    setNewMaintenanceTask({
      propertyId: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      cost: '',
      status: 'pending'
    });
  };

  const handleTenantSubmit = (e) => {
    e.preventDefault();
    setTenants([...tenants, newTenant]);
    setNewTenant({
      propertyId: '',
      name: '',
      contact: '',
      leaseStart: '',
      leaseEnd: '',
      rentAmount: '',
      deposit: ''
    });
  };

  useEffect(() => {
    const checkReminders = () => {
      const today = new Date();
      const upcomingBills = bills.filter(bill => {
        const dueDate = new Date(bill.dueDate);
        const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        return daysUntilDue <= 7 && daysUntilDue >= 0;
      });

      const upcomingMaintenance = maintenanceTasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        return daysUntilDue <= 7 && daysUntilDue >= 0;
      });

      setReminders([...upcomingBills, ...upcomingMaintenance]);
    };

    checkReminders();
    const interval = setInterval(checkReminders, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [bills, maintenanceTasks]);

  return (
    <Container>
      <TabContainer>
        <Tab 
          active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </Tab>
        <Tab 
          active={activeTab === 'properties'} 
          onClick={() => setActiveTab('properties')}
        >
          Properties
        </Tab>
        <Tab 
          active={activeTab === 'loans'} 
          onClick={() => setActiveTab('loans')}
        >
          Loans
        </Tab>
        <Tab 
          active={activeTab === 'bills'} 
          onClick={() => setActiveTab('bills')}
        >
          Bills
        </Tab>
        <Tab 
          active={activeTab === 'maintenance'} 
          onClick={() => setActiveTab('maintenance')}
        >
          Maintenance
        </Tab>
        <Tab 
          active={activeTab === 'tenants'} 
          onClick={() => setActiveTab('tenants')}
        >
          Tenants
        </Tab>
      </TabContainer>

      {reminders.length > 0 && (
        <Section>
          <SectionTitle>
            <FaBell /> Upcoming Reminders
          </SectionTitle>
          {reminders.map((reminder, index) => (
            <ReminderBanner 
              key={index}
              urgent={new Date(reminder.dueDate) - new Date() < 3 * 24 * 60 * 60 * 1000}
            >
              <FaBell />
              <div>
                <strong>{reminder.name || reminder.description}</strong>
                <p>Due: {new Date(reminder.dueDate).toLocaleDateString()}</p>
                {reminder.amount && <p>Amount: ${reminder.amount}</p>}
              </div>
            </ReminderBanner>
          ))}
        </Section>
      )}

      {activeTab === 'properties' && (
        <Section>
          <SectionTitle>
            <FaHome /> Properties
          </SectionTitle>
          <AddButton onClick={() => setShowPropertyForm(!showPropertyForm)}>
            <FaPlus /> Add Property
          </AddButton>

          {showPropertyForm && (
            <Form onSubmit={handlePropertySubmit}>
              <Input
                type="text"
                placeholder="Property Name"
                value={newProperty.name}
                onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
              />
              <Input
                type="text"
                placeholder="Address"
                value={newProperty.address}
                onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Purchase Price"
                value={newProperty.purchasePrice}
                onChange={(e) => setNewProperty({ ...newProperty, purchasePrice: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Current Value"
                value={newProperty.currentValue}
                onChange={(e) => setNewProperty({ ...newProperty, currentValue: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Mortgage Balance"
                value={newProperty.mortgageBalance}
                onChange={(e) => setNewProperty({ ...newProperty, mortgageBalance: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Monthly Rental Income"
                value={newProperty.rentalIncome}
                onChange={(e) => setNewProperty({ ...newProperty, rentalIncome: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Monthly Expenses"
                value={newProperty.expenses}
                onChange={(e) => setNewProperty({ ...newProperty, expenses: e.target.value })}
              />
              <Button type="submit">Save Property</Button>
            </Form>
          )}

          <Grid>
            {properties.map((property, index) => (
              <Card key={index}>
                <h3>{property.name}</h3>
                <p>{property.address}</p>
                <p>Purchase Price: ${property.purchasePrice}</p>
                <p>Current Value: ${property.currentValue}</p>
                <p>Mortgage Balance: ${property.mortgageBalance}</p>
                <p>Monthly Rental Income: ${property.rentalIncome}</p>
                <p>Monthly Expenses: ${property.expenses}</p>
                
                <Button onClick={() => setShowValueForm(true)}>
                  <FaChartLine /> Track Value
                </Button>

                {showValueForm && (
                  <Form onSubmit={handleValueSubmit} data-property-id={index}>
                    <Input
                      type="date"
                      value={newValueEntry.date}
                      onChange={(e) => setNewValueEntry({ ...newValueEntry, date: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Property Value"
                      value={newValueEntry.value}
                      onChange={(e) => setNewValueEntry({ ...newValueEntry, value: e.target.value })}
                    />
                    <Input
                      type="text"
                      placeholder="Notes"
                      value={newValueEntry.notes}
                      onChange={(e) => setNewValueEntry({ ...newValueEntry, notes: e.target.value })}
                    />
                    <Button type="submit">Add Value Entry</Button>
                  </Form>
                )}

                {valueHistory[index] && (
                  <div style={{ marginTop: '20px' }}>
                    <Line
                      data={{
                        labels: valueHistory[index].map(entry => entry.date),
                        datasets: [{
                          label: 'Property Value',
                          data: valueHistory[index].map(entry => entry.value),
                          borderColor: '#2196F3',
                          tension: 0.1
                        }]
                      }}
                    />
                  </div>
                )}
              </Card>
            ))}
          </Grid>
        </Section>
      )}

      {activeTab === 'loans' && (
        <Section>
          <SectionTitle>
            <FaMoneyBillWave /> Loans
          </SectionTitle>
          <AddButton onClick={() => setShowLoanForm(!showLoanForm)}>
            <FaPlus /> Add Loan
          </AddButton>

          {showLoanForm && (
            <Form onSubmit={handleLoanSubmit}>
              <Input
                type="text"
                placeholder="Loan Name"
                value={newLoan.name}
                onChange={(e) => setNewLoan({ ...newLoan, name: e.target.value })}
              />
              <Select
                value={newLoan.type}
                onChange={(e) => setNewLoan({ ...newLoan, type: e.target.value })}
              >
                <option value="mortgage">Mortgage</option>
                <option value="personal">Personal Loan</option>
                <option value="auto">Auto Loan</option>
                <option value="student">Student Loan</option>
              </Select>
              <Input
                type="number"
                placeholder="Loan Amount"
                value={newLoan.amount}
                onChange={(e) => setNewLoan({ ...newLoan, amount: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Interest Rate (%)"
                value={newLoan.interestRate}
                onChange={(e) => setNewLoan({ ...newLoan, interestRate: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Term (years)"
                value={newLoan.term}
                onChange={(e) => setNewLoan({ ...newLoan, term: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Monthly Payment"
                value={newLoan.monthlyPayment}
                onChange={(e) => setNewLoan({ ...newLoan, monthlyPayment: e.target.value })}
              />
              <Button type="submit">Save Loan</Button>
            </Form>
          )}

          <Grid>
            {loans.map((loan, index) => (
              <Card key={index}>
                <h3>{loan.name}</h3>
                <p>Type: {loan.type}</p>
                <p>Amount: ${loan.amount}</p>
                <p>Interest Rate: {loan.interestRate}%</p>
                <p>Term: {loan.term} years</p>
                <p>Monthly Payment: ${loan.monthlyPayment}</p>
                
                <div style={{ marginTop: '20px' }}>
                  <h4>Amortization Schedule</h4>
                  <Line
                    data={{
                      labels: calculateAmortization(loan).map(entry => `Month ${entry.month}`),
                      datasets: [
                        {
                          label: 'Principal',
                          data: calculateAmortization(loan).map(entry => entry.principal),
                          borderColor: '#4CAF50',
                          tension: 0.1
                        },
                        {
                          label: 'Interest',
                          data: calculateAmortization(loan).map(entry => entry.interest),
                          borderColor: '#F44336',
                          tension: 0.1
                        }
                      ]
                    }}
                  />
                </div>
              </Card>
            ))}
          </Grid>
        </Section>
      )}

      {activeTab === 'maintenance' && (
        <Section>
          <SectionTitle>
            <FaTools /> Maintenance Tasks
          </SectionTitle>
          <AddButton onClick={() => setShowMaintenanceForm(!showMaintenanceForm)}>
            <FaPlus /> Add Maintenance Task
          </AddButton>

          {showMaintenanceForm && (
            <Form onSubmit={handleMaintenanceSubmit}>
              <Select
                value={newMaintenanceTask.propertyId}
                onChange={(e) => setNewMaintenanceTask({ ...newMaintenanceTask, propertyId: e.target.value })}
              >
                <option value="">Select Property</option>
                {properties.map((property, index) => (
                  <option key={index} value={index}>{property.name}</option>
                ))}
              </Select>
              <Input
                type="text"
                placeholder="Description"
                value={newMaintenanceTask.description}
                onChange={(e) => setNewMaintenanceTask({ ...newMaintenanceTask, description: e.target.value })}
              />
              <Select
                value={newMaintenanceTask.priority}
                onChange={(e) => setNewMaintenanceTask({ ...newMaintenanceTask, priority: e.target.value })}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </Select>
              <Input
                type="date"
                value={newMaintenanceTask.dueDate}
                onChange={(e) => setNewMaintenanceTask({ ...newMaintenanceTask, dueDate: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Estimated Cost"
                value={newMaintenanceTask.cost}
                onChange={(e) => setNewMaintenanceTask({ ...newMaintenanceTask, cost: e.target.value })}
              />
              <Button type="submit">Add Task</Button>
            </Form>
          )}

          <Grid>
            {maintenanceTasks.map((task, index) => (
              <MaintenanceCard key={index} priority={task.priority}>
                <h3>{properties[task.propertyId]?.name || 'Unknown Property'}</h3>
                <p>{task.description}</p>
                <p>Priority: {task.priority}</p>
                <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                <p>Cost: ${task.cost}</p>
                <p>Status: {task.status}</p>
              </MaintenanceCard>
            ))}
          </Grid>
        </Section>
      )}

      {activeTab === 'tenants' && (
        <Section>
          <SectionTitle>
            <FaUsers /> Tenants
          </SectionTitle>
          <AddButton onClick={() => setShowTenantForm(!showTenantForm)}>
            <FaPlus /> Add Tenant
          </AddButton>

          {showTenantForm && (
            <Form onSubmit={handleTenantSubmit}>
              <Select
                value={newTenant.propertyId}
                onChange={(e) => setNewTenant({ ...newTenant, propertyId: e.target.value })}
              >
                <option value="">Select Property</option>
                {properties.map((property, index) => (
                  <option key={index} value={index}>{property.name}</option>
                ))}
              </Select>
              <Input
                type="text"
                placeholder="Tenant Name"
                value={newTenant.name}
                onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
              />
              <Input
                type="text"
                placeholder="Contact Information"
                value={newTenant.contact}
                onChange={(e) => setNewTenant({ ...newTenant, contact: e.target.value })}
              />
              <Input
                type="date"
                placeholder="Lease Start Date"
                value={newTenant.leaseStart}
                onChange={(e) => setNewTenant({ ...newTenant, leaseStart: e.target.value })}
              />
              <Input
                type="date"
                placeholder="Lease End Date"
                value={newTenant.leaseEnd}
                onChange={(e) => setNewTenant({ ...newTenant, leaseEnd: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Monthly Rent"
                value={newTenant.rentAmount}
                onChange={(e) => setNewTenant({ ...newTenant, rentAmount: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Security Deposit"
                value={newTenant.deposit}
                onChange={(e) => setNewTenant({ ...newTenant, deposit: e.target.value })}
              />
              <Button type="submit">Add Tenant</Button>
            </Form>
          )}

          <Grid>
            {tenants.map((tenant, index) => (
              <TenantCard key={index}>
                <h3>{tenant.name}</h3>
                <p>Property: {properties[tenant.propertyId]?.name || 'Unknown'}</p>
                <p>Contact: {tenant.contact}</p>
                <p>Lease: {new Date(tenant.leaseStart).toLocaleDateString()} - {new Date(tenant.leaseEnd).toLocaleDateString()}</p>
                <p>Rent: ${tenant.rentAmount}/month</p>
                <p>Deposit: ${tenant.deposit}</p>
              </TenantCard>
            ))}
          </Grid>
        </Section>
      )}

      {activeTab === 'bills' && (
        <Section>
          <SectionTitle>
            <FaCalendarAlt /> Recurring Bills
          </SectionTitle>
          <AddButton onClick={() => setShowBillForm(!showBillForm)}>
            <FaPlus /> Add Bill
          </AddButton>

          {showBillForm && (
            <Form onSubmit={handleBillSubmit}>
              <Input
                type="text"
                placeholder="Bill Name"
                value={newBill.name}
                onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Amount"
                value={newBill.amount}
                onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
              />
              <Input
                type="date"
                value={newBill.dueDate}
                onChange={(e) => setNewBill({ ...newBill, dueDate: e.target.value })}
              />
              <Select
                value={newBill.frequency}
                onChange={(e) => setNewBill({ ...newBill, frequency: e.target.value })}
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </Select>
              <Select
                value={newBill.category}
                onChange={(e) => setNewBill({ ...newBill, category: e.target.value })}
              >
                <option value="utilities">Utilities</option>
                <option value="insurance">Insurance</option>
                <option value="subscription">Subscription</option>
                <option value="rent">Rent</option>
                <option value="other">Other</option>
              </Select>
              <Button type="submit">Save Bill</Button>
            </Form>
          )}

          <Grid>
            {bills.map((bill, index) => (
              <Card key={index}>
                <h3>{bill.name}</h3>
                <p>Amount: ${bill.amount}</p>
                <p>Due Date: {bill.dueDate}</p>
                <p>Frequency: {bill.frequency}</p>
                <p>Category: {bill.category}</p>
              </Card>
            ))}
          </Grid>
        </Section>
      )}
    </Container>
  );
};

export default PropertyManager; 