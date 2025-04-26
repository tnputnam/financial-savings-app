import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAPs2DYQIwexoV_SX4pIF7SPoqWK8ZfX5w",
  authDomain: "savings-app-306be.firebaseapp.com",
  projectId: "savings-app-306be",
  storageBucket: "savings-app-306be.firebasestorage.app",
  messagingSenderId: "610120416357",
  appId: "1:610120416357:web:cf259b4f858862531f1a8c",
  measurementId: "G-GDENN9FT0K"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const analytics = getAnalytics(app);

export { auth, database, analytics }; 