// Bank API configuration
const bankConfigs = {
  schwab: {
    apiUrl: 'https://api.schwabapi.com/v1',
    endpoints: {
      accounts: '/accounts',
      transactions: '/transactions',
      holdings: '/holdings'
    }
  },
  usaa: {
    apiUrl: 'https://api.usaa.com/v1',
    endpoints: {
      accounts: '/accounts',
      transactions: '/transactions'
    }
  }
};

// Function to handle Schwab API integration
export const connectToSchwab = async (credentials) => {
  try {
    const response = await fetch(`${bankConfigs.schwab.apiUrl}${bankConfigs.schwab.endpoints.accounts}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return {
      success: true,
      accounts: data.accounts.map(account => ({
        id: account.accountNumber,
        name: account.accountName,
        type: account.accountType,
        balance: account.currentBalance
      }))
    };
  } catch (error) {
    console.error('Schwab API Error:', error);
    return {
      success: false,
      error: 'Failed to connect to Schwab'
    };
  }
};

// Function to handle USAA API integration
export const connectToUSAA = async (credentials) => {
  try {
    const response = await fetch(`${bankConfigs.usaa.apiUrl}${bankConfigs.usaa.endpoints.accounts}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return {
      success: true,
      accounts: data.accounts.map(account => ({
        id: account.accountNumber,
        name: account.accountName,
        type: account.accountType,
        balance: account.currentBalance
      }))
    };
  } catch (error) {
    console.error('USAA API Error:', error);
    return {
      success: false,
      error: 'Failed to connect to USAA'
    };
  }
};

// Function to handle manual file uploads
export const processBankStatement = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        // Handle different file types
        if (file.type === 'text/csv') {
          const csvData = event.target.result;
          const transactions = parseCSV(csvData);
          resolve({
            success: true,
            transactions
          });
        } else if (file.type === 'application/pdf') {
          // PDF parsing would require additional libraries
          resolve({
            success: false,
            error: 'PDF parsing not yet implemented'
          });
        }
      } catch (error) {
        reject({
          success: false,
          error: 'Failed to process file'
        });
      }
    };
    
    reader.onerror = () => {
      reject({
        success: false,
        error: 'Failed to read file'
      });
    };
    
    reader.readAsText(file);
  });
};

// Helper function to parse CSV data
const parseCSV = (csvData) => {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const transaction = {};
    
    headers.forEach((header, index) => {
      transaction[header.trim()] = values[index]?.trim();
    });
    
    return transaction;
  });
}; 