import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import HomeScreen from './components/HomeScreen';
import { AuthService } from './services/authService';
import { FirestoreService } from './services/firestoreService';
import './styles/globals.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [firebaseError, setFirebaseError] = useState(null);

  useEffect(() => {
    console.log('Initializing Firebase connection...');
    
    // Check Firebase connection
    const checkFirebaseConnection = async () => {
      try {
        const isConnected = await AuthService.checkConnection();
        if (!isConnected) {
          setFirebaseError('Failed to connect to Firebase');
        }
      } catch (error) {
        console.error('Firebase connection check failed:', error);
        setFirebaseError('Firebase connection error');
      }
    };

    checkFirebaseConnection();

    // Listen to auth state changes
    const unsubscribe = AuthService.onAuthStateChanged((user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      setUser(user);
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    // Add sample data if needed (only run once in development)
    const addSampleData = async () => {
      try {
        // Uncomment the line below to add sample data to Firestore
        // console.log('Adding sample data...');
        // await FirestoreService.addSampleData();
        // console.log('Sample data added successfully');
      } catch (error) {
        console.error('Error adding sample data:', error);
      }
    };

    // Delay sample data addition to avoid conflicts
    setTimeout(addSampleData, 2000);

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      console.log('Attempting login for:', email);
      const userData = await AuthService.login(email, password);
      console.log('Login successful:', userData);
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const handleRegister = async (email, password, name) => {
    try {
      console.log('Attempting registration for:', email);
      const userData = await AuthService.register(email, password, name);
      console.log('Registration successful:', userData);
      return userData;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Attempting logout...');
      await AuthService.logout();
      console.log('Logout successful');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  // Show Firebase error if there's a connection issue
  if (firebaseError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Connection Error</h1>
          <p className="text-gray-600 mb-6">{firebaseError}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? (
                <LoginScreen onLogin={handleLogin} />
              ) : (
                <Navigate to="/home" replace />
              )
            } 
          />
          <Route 
            path="/register" 
            element={
              !isAuthenticated ? (
                <RegisterScreen onLogin={handleRegister} />
              ) : (
                <Navigate to="/home" replace />
              )
            } 
          />
          <Route 
            path="/home" 
            element={
              isAuthenticated ? (
                <HomeScreen user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/" 
            element={
              <Navigate to={isAuthenticated ? "/home" : "/login"} replace />
            } 
          />
          {/* Catch-all route for any unmatched paths */}
          <Route 
            path="*" 
            element={
              <Navigate to={isAuthenticated ? "/home" : "/login"} replace />
            } 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;