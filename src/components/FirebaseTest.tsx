'use client';

import { useState, useEffect } from 'react';
import { app, auth, db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function FirebaseTest() {
  const [status, setStatus] = useState<{
    initialized: boolean;
    auth: boolean;
    firestore: boolean;
    error?: string;
  }>({ 
    initialized: false, 
    auth: false, 
    firestore: false 
  });

  useEffect(() => {
    const checkFirebase = async () => {
      try {
        // Check if Firebase is initialized
        if (app) {
          setStatus(prev => ({ ...prev, initialized: true }));
        }

        // Check if Auth is working
        if (auth) {
          setStatus(prev => ({ ...prev, auth: true }));
        }

        // Check if Firestore is working
        if (db) {
          try {
            // Try to access a collection (will succeed even if collection doesn't exist)
            await getDocs(collection(db, 'test-collection'));
            setStatus(prev => ({ ...prev, firestore: true }));
          } catch (error) {
            console.error('Firestore test error:', error);
            setStatus(prev => ({ 
              ...prev, 
              error: error instanceof Error ? error.message : 'Unknown Firestore error' 
            }));
          }
        }
      } catch (error) {
        console.error('Firebase check error:', error);
        setStatus(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Unknown Firebase error' 
        }));
      }
    };

    checkFirebase();
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Firebase Status</h2>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <div className={`w-4 h-4 rounded-full mr-2 ${status.initialized ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-gray-700 dark:text-gray-300">Firebase Initialized</span>
        </div>
        
        <div className="flex items-center">
          <div className={`w-4 h-4 rounded-full mr-2 ${status.auth ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-gray-700 dark:text-gray-300">Authentication</span>
        </div>
        
        <div className="flex items-center">
          <div className={`w-4 h-4 rounded-full mr-2 ${status.firestore ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-gray-700 dark:text-gray-300">Firestore Database</span>
        </div>
      </div>
      
      {status.error && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
          <p className="font-medium">Error:</p>
          <p className="text-sm">{status.error}</p>
        </div>
      )}
      
      {status.initialized && status.auth && status.firestore ? (
        <div className="mt-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
          <p className="font-medium">Firebase is properly configured! 🎉</p>
        </div>
      ) : (
        <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
          <p className="font-medium">Firebase configuration issues detected.</p>
          <p className="text-sm">Please check your .env.local file and Firebase console settings.</p>
        </div>
      )}
    </div>
  );
}