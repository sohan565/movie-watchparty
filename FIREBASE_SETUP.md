# Firebase Setup Guide for SyncWatch

## Overview

This guide will walk you through setting up Firebase for the SyncWatch application. Firebase is used for authentication and database functionality in this application.

## Prerequisites

- A Google account
- Basic understanding of web development

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click on "Add project" or "Create a project"
3. Enter a project name (e.g., "SyncWatch")
4. Choose whether to enable Google Analytics (recommended)
5. Accept the terms and click "Create project"

## Step 2: Register Your Web Application

1. From your Firebase project dashboard, click on the web icon (</>) to add a web app
2. Enter a nickname for your app (e.g., "SyncWatch Web")
3. Check the box for "Also set up Firebase Hosting" if you plan to deploy your app using Firebase Hosting
4. Click "Register app"
5. You'll be shown your Firebase configuration. Keep this page open as you'll need these values for your `.env.local` file

## Step 3: Set Up Authentication

1. In the Firebase console, go to "Authentication" from the left sidebar
2. Click on "Get started"
3. Enable the following authentication methods:
   - Email/Password: Click on it, toggle the "Enable" switch, and click "Save"
   - Google: Click on it, toggle the "Enable" switch, add your support email, and click "Save"

## Step 4: Set Up Firestore Database

1. In the Firebase console, go to "Firestore Database" from the left sidebar
2. Click on "Create database"
3. Choose either "Start in production mode" or "Start in test mode" (for development, test mode is easier as it allows read/write access without authentication)
4. Select a location for your database that's closest to your target audience
5. Click "Enable"

## Step 5: Configure Your Application

1. Create or update your `.env.local` file in the root of your project with the following variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

Replace the placeholder values with the actual values from your Firebase project configuration.

2. Restart your development server for the changes to take effect:

```bash
npm run dev
# or
yarn dev
```

## Step 6: Test Your Firebase Setup

1. Try to sign up or log in to your application
2. Check the browser console for any Firebase-related errors
3. If you see a `FirebaseError: Firebase: Error (auth/invalid-api-key)` error, double-check your environment variables and make sure they match your Firebase project configuration

## Security Rules

For production, you should set up proper security rules for your Firestore database. Here's a basic example:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /rooms/{roomId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (resource == null || resource.data.hostId == request.auth.uid);
    }
  }
}
```

## Troubleshooting

If you encounter issues with Firebase:

1. Verify that all environment variables are correctly set in your `.env.local` file
2. Make sure you've enabled the authentication methods you're trying to use
3. Check that your Firebase project has the correct API restrictions (if you've set any)
4. Restart your development server after making changes to environment variables
5. Clear your browser cache and cookies

For more detailed troubleshooting, refer to the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) guide.

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Web SDK Reference](https://firebase.google.com/docs/reference/js)