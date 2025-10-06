import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../services/firebase';

export const useFirestore = (collectionName) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get all documents
  const getDocuments = async (conditions = [], orderByField = null) => {
    try {
      setLoading(true);
      let q = collection(db, collectionName);
      
      if (conditions.length > 0) {
        conditions.forEach(condition => {
          q = query(q, where(condition.field, condition.operator, condition.value));
        });
      }
      
      if (orderByField) {
        q = query(q, orderBy(orderByField));
      }
      
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setDocuments(docs);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get single document
  const getDocument = async (id) => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Document not found');
      }
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  // Add document
  const addDocument = async (data) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  // Update document
  const updateDocument = async (id, data) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Delete document
  const deleteDocument = async (id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Real-time listener
  const subscribeToCollection = (conditions = [], orderByField = null) => {
    let q = collection(db, collectionName);
    
    if (conditions.length > 0) {
      conditions.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value));
      });
    }
    
    if (orderByField) {
      q = query(q, orderBy(orderByField));
    }

    return onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDocuments(docs);
      setLoading(false);
    });
  };

  return {
    documents,
    loading,
    error,
    getDocuments,
    getDocument,
    addDocument,
    updateDocument,
    deleteDocument,
    subscribeToCollection
  };
};