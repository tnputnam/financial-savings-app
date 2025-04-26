import { database } from '../firebase';
import { ref, get, set, update } from 'firebase/database';

class BudgetService {
  constructor() {
    this.userId = null;
    this.defaultMessages = [
      "Stop spending, fat ass!",
      "Your wallet is crying!",
      "Budget? What budget?",
      "Time to eat ramen!",
      "Your bank account needs therapy",
      "Money doesn't grow on trees... or does it?",
      "Another day, another dollar... spent",
      "Your savings account is judging you",
      "Maybe time to start a side hustle?",
      "Your future self is disappointed"
    ];
  }

  setUserId(userId) {
    this.userId = userId;
  }

  // Get budget warnings for a category
  async getBudgetWarnings(category) {
    if (!this.userId) return null;
    
    const warningsRef = ref(database, `users/${this.userId}/budgetWarnings/${category}`);
    const snapshot = await get(warningsRef);
    return snapshot.val() || {
      threshold: 80, // Default warning at 80% of budget
      messages: this.defaultMessages,
      customMessages: []
    };
  }

  // Update budget warnings for a category
  async updateBudgetWarnings(category, warnings) {
    if (!this.userId) return false;

    try {
      const warningsRef = ref(database, `users/${this.userId}/budgetWarnings/${category}`);
      await set(warningsRef, warnings);
      return true;
    } catch (error) {
      console.error('Update failed:', error);
      return false;
    }
  }

  // Add a custom message
  async addCustomMessage(category, message) {
    if (!this.userId) return false;

    try {
      const warningsRef = ref(database, `users/${this.userId}/budgetWarnings/${category}/customMessages`);
      const snapshot = await get(warningsRef);
      const currentMessages = snapshot.val() || [];
      
      await set(warningsRef, [...currentMessages, message]);
      return true;
    } catch (error) {
      console.error('Add message failed:', error);
      return false;
    }
  }

  // Remove a custom message
  async removeCustomMessage(category, index) {
    if (!this.userId) return false;

    try {
      const warningsRef = ref(database, `users/${this.userId}/budgetWarnings/${category}/customMessages`);
      const snapshot = await get(warningsRef);
      const currentMessages = snapshot.val() || [];
      
      const updatedMessages = currentMessages.filter((_, i) => i !== index);
      await set(warningsRef, updatedMessages);
      return true;
    } catch (error) {
      console.error('Remove message failed:', error);
      return false;
    }
  }

  // Get a random warning message
  getRandomMessage(category, warnings) {
    const allMessages = [...warnings.messages, ...warnings.customMessages];
    return allMessages[Math.floor(Math.random() * allMessages.length)];
  }

  // Check if budget threshold is reached
  checkBudgetThreshold(spent, budget, threshold) {
    const percentage = (spent / budget) * 100;
    return percentage >= threshold;
  }
}

export const budgetService = new BudgetService(); 