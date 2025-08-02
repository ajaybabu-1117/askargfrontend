import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export class FirestoreService {
  // Get news articles
  static async getNewsArticles() {
    try {
      const q = query(
        collection(db, 'news_articles'),
        orderBy('timestamp', 'desc'),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
    } catch (error) {
      console.error('Error fetching news articles:', error);
      return [];
    }
  }
  
  // Get jobs
  static async getJobs() {
    try {
      const q = query(
        collection(db, 'jobs'),
        orderBy('posted_date', 'desc'),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        posted_date: doc.data().posted_date?.toDate() || new Date()
      }));
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }
  }
  
  // Get internships
  static async getInternships() {
    try {
      const q = query(
        collection(db, 'internships'),
        orderBy('posted_date', 'desc'),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        posted_date: doc.data().posted_date?.toDate() || new Date()
      }));
    } catch (error) {
      console.error('Error fetching internships:', error);
      return [];
    }
  }
  
  // Get notifications for user
  static async getNotifications(userId) {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }
  
  // Listen to chat messages in real-time
  static listenToMessages(roomId, callback) {
    const q = query(
      collection(db, 'chat_rooms', roomId, 'messages'),
      orderBy('timestamp', 'asc'),
      limit(50)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
      callback(messages);
    });
  }
  
  // Send chat message
  static async sendMessage(roomId, userId, userName, message) {
    try {
      await addDoc(collection(db, 'chat_rooms', roomId, 'messages'), {
        sender: userName,
        senderId: userId,
        message: message,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
  
  // Get user analytics
  static async getUserAnalytics(userId) {
    try {
      const userDoc = await getDocs(query(collection(db, 'analytics'), where('user_id', '==', userId)));
      if (!userDoc.empty) {
        const data = userDoc.docs[0].data();
        return {
          ...data,
          last_login: data.last_login?.toDate() || new Date()
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }
  }
  
  // Add sample data (for development)
  static async addSampleData() {
    try {
      // Add sample news articles
      const newsArticles = [
        {
          title: "Tech Industry Sees Record Growth in 2025",
          summary: "Major technology companies report unprecedented expansion in AI and machine learning sectors, creating thousands of new opportunities.",
          source: "TechNews Daily",
          url: "https://example.com/article1",
          timestamp: new Date('2025-01-15'),
          category: "Technology"
        },
        {
          title: "Remote Work Trends Shaping the Future",
          summary: "Companies worldwide are adopting hybrid models, changing how we think about workplace culture and productivity.",
          source: "Business Weekly",
          url: "https://example.com/article2",
          timestamp: new Date('2025-01-14'),
          category: "Business"
        }
      ];
      
      for (const article of newsArticles) {
        await addDoc(collection(db, 'news_articles'), article);
      }
      
      // Add sample jobs
      const jobs = [
        {
          title: "Senior Frontend Developer",
          company: "TechCorp Inc.",
          location: "San Francisco, CA",
          salary: "$120k - $160k",
          type: "Full-time",
          apply_link: "https://example.com/job1",
          posted_date: new Date('2025-01-15'),
          description: "Join our team to build cutting-edge web applications using React, TypeScript, and modern tools.",
          requirements: ["React", "TypeScript", "5+ years experience"],
          remote: true
        }
      ];
      
      for (const job of jobs) {
        await addDoc(collection(db, 'jobs'), job);
      }
      
      // Add sample internships
      const internships = [
        {
          title: "Software Engineering Intern",
          organization: "Google",
          location: "Mountain View, CA",
          duration: "3 months",
          stipend: "$8,000/month",
          apply_link: "https://example.com/intern1",
          posted_date: new Date('2025-01-15'),
          description: "Work on real projects with Google's engineering teams and gain hands-on experience in software development.",
          skills: ["Python", "Java", "Data Structures", "Algorithms"],
          type: "Summer 2025",
          remote: false
        }
      ];
      
      for (const internship of internships) {
        await addDoc(collection(db, 'internships'), internship);
      }
      
      console.log('Sample data added successfully!');
    } catch (error) {
      console.error('Error adding sample data:', error);
    }
  }
}