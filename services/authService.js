import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export class AuthService {
  // Register new user
  static async register(email, password, name) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile with name
      await updateProfile(user, {
        displayName: name
      });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
        createdAt: new Date(),
        loginStreak: 1,
        articlesRead: 0,
        lastLogin: new Date()
      });

      // Create analytics document
      await setDoc(doc(db, 'analytics', user.uid), {
        user_id: user.uid,
        login_streak: 1,
        articles_read: 0,
        last_login: new Date()
      });
      
      return {
        id: user.uid,
        name: name,
        email: email
      };
    } catch (error) {
      console.error('Registration error:', error);
      // Pass the original error with its code
      const customError = new Error(error.message);
      customError.code = error.code;
      throw customError;
    }
  }
  
  // Sign in user
  static async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      // Update last login if user document exists
      if (userData) {
        await setDoc(doc(db, 'users', user.uid), {
          ...userData,
          lastLogin: new Date()
        }, { merge: true });
      } else {
        // Create user document if it doesn't exist (for users created outside the app)
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName || email.split('@')[0],
          email: user.email,
          createdAt: new Date(),
          loginStreak: 1,
          articlesRead: 0,
          lastLogin: new Date()
        });
      }
      
      return {
        id: user.uid,
        name: userData?.name || user.displayName || email.split('@')[0],
        email: user.email
      };
    } catch (error) {
      console.error('Login error:', error);
      // Pass the original error with its code
      const customError = new Error(error.message);
      customError.code = error.code;
      throw customError;
    }
  }
  
  // Sign out user
  static async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      const customError = new Error(error.message);
      customError.code = error.code;
      throw customError;
    }
  }
  
  // Listen to auth state changes
  static onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();
          
          callback({
            id: user.uid,
            name: userData?.name || user.displayName || user.email.split('@')[0],
            email: user.email
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fallback to basic user info
          callback({
            id: user.uid,
            name: user.displayName || user.email.split('@')[0],
            email: user.email
          });
        }
      } else {
        callback(null);
      }
    });
  }
  
  // Get current user
  static getCurrentUser() {
    return auth.currentUser;
  }

  // Check if Firebase is connected
  static async checkConnection() {
    try {
      // Try to access the auth instance
      const user = auth.currentUser;
      return true;
    } catch (error) {
      console.error('Firebase connection error:', error);
      return false;
    }
  }
}