'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import FirebaseTest from '@/components/FirebaseTest';

export default function FirebaseTestPage() {
  const [envVars, setEnvVars] = useState<{
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  }>({ 
    apiKey: '', 
    authDomain: '', 
    projectId: '', 
    storageBucket: '', 
    messagingSenderId: '', 
    appId: '' 
  });

  useEffect(() => {
    // Check if environment variables are set (without exposing actual values)
    setEnvVars({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓ Set' : '✗ Not Set',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✓ Set' : '✗ Not Set',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✓ Set' : '✗ Not Set',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✓ Set' : '✗ Not Set',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✓ Set' : '✗ Not Set',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✓ Set' : '✗ Not Set',
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Firebase Configuration Test</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            This page helps you verify that Firebase is properly configured in your application.
          </p>
        </div>

        <div className="mb-8">
          <Link 
            href="/"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Environment Variables</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">API Key</p>
                  <p className={`mt-1 text-sm ${envVars.apiKey.includes('✓') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {envVars.apiKey}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Auth Domain</p>
                  <p className={`mt-1 text-sm ${envVars.authDomain.includes('✓') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {envVars.authDomain}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Project ID</p>
                  <p className={`mt-1 text-sm ${envVars.projectId.includes('✓') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {envVars.projectId}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Storage Bucket</p>
                  <p className={`mt-1 text-sm ${envVars.storageBucket.includes('✓') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {envVars.storageBucket}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Messaging Sender ID</p>
                  <p className={`mt-1 text-sm ${envVars.messagingSenderId.includes('✓') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {envVars.messagingSenderId}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">App ID</p>
                  <p className={`mt-1 text-sm ${envVars.appId.includes('✓') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {envVars.appId}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <FirebaseTest />

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Next Steps</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                <li>If all checks are green, your Firebase configuration is working correctly!</li>
                <li>If you see any red indicators, check your <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">.env.local</code> file and Firebase console settings.</li>
                <li>Refer to the <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">FIREBASE_SETUP.md</code> guide for detailed setup instructions.</li>
                <li>For troubleshooting, see the <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">TROUBLESHOOTING.md</code> file.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}