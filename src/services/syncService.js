import { database } from '../firebase';
import { ref, set, onValue, push, update, remove } from 'firebase/database';

class SyncService {
  constructor() {
    this.userId = null;
    this.listeners = new Map();
  }

  setUserId(userId) {
    this.userId = userId;
  }

  // Transactions synchronization
  syncTransactions(callback) {
    if (!this.userId) return;
    
    const transactionsRef = ref(database, `users/${this.userId}/transactions`);
    const unsubscribe = onValue(transactionsRef, (snapshot) => {
      const data = snapshot.val();
      callback(data || {});
    });

    this.listeners.set('transactions', unsubscribe);
  }

  addTransaction(transaction) {
    if (!this.userId) return;
    const transactionsRef = ref(database, `users/${this.userId}/transactions`);
    return push(transactionsRef, {
      ...transaction,
      createdAt: new Date().toISOString()
    });
  }

  updateTransaction(transactionId, updates) {
    if (!this.userId) return;
    const transactionRef = ref(database, `users/${this.userId}/transactions/${transactionId}`);
    return update(transactionRef, updates);
  }

  deleteTransaction(transactionId) {
    if (!this.userId) return;
    const transactionRef = ref(database, `users/${this.userId}/transactions/${transactionId}`);
    return remove(transactionRef);
  }

  // Properties synchronization
  syncProperties(callback) {
    if (!this.userId) return;
    
    const propertiesRef = ref(database, `users/${this.userId}/properties`);
    const unsubscribe = onValue(propertiesRef, (snapshot) => {
      const data = snapshot.val();
      callback(data || {});
    });

    this.listeners.set('properties', unsubscribe);
  }

  addProperty(property) {
    if (!this.userId) return;
    const propertiesRef = ref(database, `users/${this.userId}/properties`);
    return push(propertiesRef, {
      ...property,
      createdAt: new Date().toISOString()
    });
  }

  updateProperty(propertyId, updates) {
    if (!this.userId) return;
    const propertyRef = ref(database, `users/${this.userId}/properties/${propertyId}`);
    return update(propertyRef, updates);
  }

  deleteProperty(propertyId) {
    if (!this.userId) return;
    const propertyRef = ref(database, `users/${this.userId}/properties/${propertyId}`);
    return remove(propertyRef);
  }

  // Loans synchronization
  syncLoans(callback) {
    if (!this.userId) return;
    
    const loansRef = ref(database, `users/${this.userId}/loans`);
    const unsubscribe = onValue(loansRef, (snapshot) => {
      const data = snapshot.val();
      callback(data || {});
    });

    this.listeners.set('loans', unsubscribe);
  }

  updateLoan(loanId, data) {
    if (!this.userId) return;
    const loanRef = ref(database, `users/${this.userId}/loans/${loanId}`);
    return update(loanRef, data);
  }

  addLoan(data) {
    if (!this.userId) return;
    const loansRef = ref(database, `users/${this.userId}/loans`);
    return push(loansRef, data);
  }

  // Bills synchronization
  syncBills(callback) {
    if (!this.userId) return;
    
    const billsRef = ref(database, `users/${this.userId}/bills`);
    const unsubscribe = onValue(billsRef, (snapshot) => {
      const data = snapshot.val();
      callback(data || {});
    });

    this.listeners.set('bills', unsubscribe);
  }

  updateBill(billId, data) {
    if (!this.userId) return;
    const billRef = ref(database, `users/${this.userId}/bills/${billId}`);
    return update(billRef, data);
  }

  addBill(data) {
    if (!this.userId) return;
    const billsRef = ref(database, `users/${this.userId}/bills`);
    return push(billsRef, data);
  }

  // Maintenance tasks synchronization
  syncMaintenanceTasks(callback) {
    if (!this.userId) return;
    
    const tasksRef = ref(database, `users/${this.userId}/maintenanceTasks`);
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      callback(data || {});
    });

    this.listeners.set('maintenanceTasks', unsubscribe);
  }

  updateMaintenanceTask(taskId, data) {
    if (!this.userId) return;
    const taskRef = ref(database, `users/${this.userId}/maintenanceTasks/${taskId}`);
    return update(taskRef, data);
  }

  addMaintenanceTask(data) {
    if (!this.userId) return;
    const tasksRef = ref(database, `users/${this.userId}/maintenanceTasks`);
    return push(tasksRef, data);
  }

  // Tenants synchronization
  syncTenants(callback) {
    if (!this.userId) return;
    
    const tenantsRef = ref(database, `users/${this.userId}/tenants`);
    const unsubscribe = onValue(tenantsRef, (snapshot) => {
      const data = snapshot.val();
      callback(data || {});
    });

    this.listeners.set('tenants', unsubscribe);
  }

  updateTenant(tenantId, data) {
    if (!this.userId) return;
    const tenantRef = ref(database, `users/${this.userId}/tenants/${tenantId}`);
    return update(tenantRef, data);
  }

  addTenant(data) {
    if (!this.userId) return;
    const tenantsRef = ref(database, `users/${this.userId}/tenants`);
    return push(tenantsRef, data);
  }

  // Cleanup
  cleanup() {
    this.listeners.forEach(unsubscribe => unsubscribe());
    this.listeners.clear();
  }
}

export const syncService = new SyncService(); 