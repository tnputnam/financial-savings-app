import { database } from '../firebase';
import { ref, get, set } from 'firebase/database';

class BackupService {
  constructor() {
    this.userId = null;
    this.backupCode = null;
    this.backupTimeout = null;
  }

  setUserId(userId) {
    this.userId = userId;
  }

  // Generate a backup code that other devices can use to restore
  async generateBackupCode() {
    if (!this.userId) return null;
    
    // Generate a 6-digit code
    this.backupCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store the code in Firebase with a 5-minute expiration
    const backupRef = ref(database, `backups/${this.backupCode}`);
    await set(backupRef, {
      userId: this.userId,
      timestamp: new Date().toISOString()
    });

    // Set timeout to delete the backup code after 5 minutes
    this.backupTimeout = setTimeout(() => {
      this.clearBackupCode();
    }, 5 * 60 * 1000);

    return this.backupCode;
  }

  // Clear the backup code
  async clearBackupCode() {
    if (this.backupCode) {
      const backupRef = ref(database, `backups/${this.backupCode}`);
      await set(backupRef, null);
      this.backupCode = null;
    }
    if (this.backupTimeout) {
      clearTimeout(this.backupTimeout);
      this.backupTimeout = null;
    }
  }

  // Export all user data
  async exportData() {
    if (!this.userId) return null;

    const userRef = ref(database, `users/${this.userId}`);
    const snapshot = await get(userRef);
    return snapshot.val();
  }

  // Import data from another device
  async importData(data) {
    if (!this.userId) return false;

    try {
      const userRef = ref(database, `users/${this.userId}`);
      await set(userRef, data);
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }

  // Restore from another device using backup code
  async restoreFromCode(code) {
    try {
      // Get the backup details
      const backupRef = ref(database, `backups/${code}`);
      const snapshot = await get(backupRef);
      const backup = snapshot.val();

      if (!backup) {
        throw new Error('Invalid or expired backup code');
      }

      // Get the source user's data
      const sourceUserRef = ref(database, `users/${backup.userId}`);
      const sourceSnapshot = await get(sourceUserRef);
      const sourceData = sourceSnapshot.val();

      if (!sourceData) {
        throw new Error('No data found for backup');
      }

      // Import the data
      await this.importData(sourceData);
      return true;
    } catch (error) {
      console.error('Restore failed:', error);
      return false;
    }
  }
}

export const backupService = new BackupService(); 