'use client';

import { useState, useEffect } from 'react';
import { initializeApp, FirebaseApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously, Auth, AuthError } from 'firebase/auth';

const FirebaseConfigChecker = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [configDetails, setConfigDetails] = useState<{[key: string]: string}>({});
  const [showConfig, setShowConfig] = useState<boolean>(false);

  useEffect(() => {
    checkFirebaseConfig();
  }, []);

  const checkFirebaseConfig = async () => {
    try {
      // Get environment variables
      const config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };

      // Check if any config values are missing
      const missingValues = Object.entries(config)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

      if (missingValues.length > 0) {
        throw new Error(`Missing Firebase configuration: ${missingValues.join(', ')}`);
      }

      // Store masked config for display
      const maskedConfig = Object.entries(config).reduce((acc, [key, value]) => {
        if (typeof value === 'string') {
          // Mask the value to show only first and last few characters
          const maskedValue = value.length > 8 
            ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}` 
            : '********';
          acc[key] = maskedValue;
        }
        return acc;
      }, {} as {[key: string]: string});
      
      setConfigDetails(maskedConfig);

      // Initialize Firebase if not already initialized
      let app: FirebaseApp;
      let auth: Auth;
      
      if (getApps().length === 0) {
        app = initializeApp(config as any);
      } else {
        app = getApps()[0];
      }
      
      auth = getAuth(app);

      // Test authentication by trying to sign in anonymously
      await signInAnonymously(auth);
      
      setStatus('success');
    } catch (error) {
      setStatus('error');
      const authError = error as AuthError;
      setErrorMessage(authError.code || authError.message || 'Unknown error');
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading': return 'bg-yellow-100 border-yellow-400 text-yellow-700';
      case 'success': return 'bg-green-100 border-green-400 text-green-700';
      case 'error': return 'bg-red-100 border-red-400 text-red-700';
      default: return 'bg-gray-100 border-gray-400 text-gray-700';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'loading': return 'Checking Firebase configuration...';
      case 'success': return 'Firebase configuration is valid!';
      case 'error': return `Firebase configuration error: ${errorMessage}`;
      default: return 'Unknown status';
    }
  };

  const getErrorHelp = () => {
    if (status !== 'error') return null;
    
    if (errorMessage.includes('api-key-not-valid')) {
      return (
        <div className="mt-4">
          <h3 className="font-bold">API Key Error</h3>
          <p>Your Firebase API key appears to be invalid. Please check:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Your <code>.env.local</code> file has the correct API key</li>
            <li>The API key has no restrictions preventing its use</li>
            <li>Your Firebase project is active and in good standing</li>
          </ul>
          <p className="mt-2">
            See the <a href="/FIREBASE_API_KEY_TROUBLESHOOTING.md" className="underline text-blue-600">Firebase API Key Troubleshooting</a> guide for more help.
          </p>
        </div>
      );
    }
    
    if (errorMessage.includes('auth/operation-not-allowed')) {
      return (
        <div className="mt-4">
          <h3 className="font-bold">Authentication Method Not Enabled</h3>
          <p>Anonymous authentication is not enabled for your Firebase project.</p>
          <p className="mt-2">Go to the Firebase Console &gt; Authentication &gt; Sign-in methods and enable Anonymous authentication.</p>
        </div>
      );
    }
    
    return (
      <div className="mt-4">
        <p>Please check the <a href="/TROUBLESHOOTING.md" className="underline text-blue-600">Troubleshooting Guide</a> for help with this error.</p>
      </div>
    );
  };

  return (
    <div className={`border ${getStatusColor()} px-4 py-3 rounded relative my-4`}>
      <div className="flex items-center">
        <span className="mr-2 text-xl">{getStatusIcon()}</span>
        <strong className="font-bold">{getStatusText()}</strong>
      </div>
      
      {getErrorHelp()}
      
      <div className="mt-4">
        <button 
          onClick={() => setShowConfig(!showConfig)}
          className="text-sm underline"
        >
          {showConfig ? 'Hide' : 'Show'} configuration details
        </button>
        
        {showConfig && (
          <div className="mt-2 bg-gray-100 p-3 rounded text-sm font-mono">
            {Object.entries(configDetails).map(([key, value]) => (
              <div key={key}>
                <span className="font-bold">{key}:</span> {value}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <button 
          onClick={checkFirebaseConfig}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Recheck Configuration
        </button>
      </div>
    </div>
  );
};

export default FirebaseConfigChecker;