# Comprehensive Firebase Troubleshooting Guide

## Overview

This guide provides a complete workflow for troubleshooting Firebase configuration issues in the SyncWatch application. It combines all the tools and techniques we've implemented to help you quickly identify and resolve Firebase-related problems.

## Quick Diagnosis

### 1. Check Environment Variables

Verify that all required Firebase environment variables are properly set:

```bash
npm run check-env
```

This script will check your `.env.local` file and show the status of each Firebase configuration variable without revealing the full values.

### 2. Verify API Key

Confirm that your Firebase API key is valid and working:

```bash
npm run verify-api-key YOUR_API_KEY
```

Replace `YOUR_API_KEY` with your actual Firebase API key from the `.env.local` file.

### 3. Visual Verification

Use the built-in Firebase test page to visually verify your configuration:

1. Start the development server: `npm run dev`
2. Open [http://localhost:3000/firebase-test](http://localhost:3000/firebase-test) in your browser
3. Check the status indicators for environment variables, Firebase initialization, Authentication, and Firestore

## Common Issues and Solutions

### Invalid API Key Error

If you see `Firebase: Error (auth/api-key-not-valid-please-pass-a-valid-api-key)`:

1. Verify your API key is correct using the verification script
2. Check for API restrictions in the Google Cloud Console
3. Ensure the Firebase APIs are enabled for your project
4. Try regenerating the API key if necessary

See [FIREBASE_API_KEY_TROUBLESHOOTING.md](./FIREBASE_API_KEY_TROUBLESHOOTING.md) for detailed steps.

### Authentication Not Enabled

If you see `Firebase: Error (auth/operation-not-allowed)`:

1. Go to the Firebase Console > Authentication > Sign-in methods
2. Enable the authentication methods you need (Email/Password, Google, etc.)
3. Save your changes

### Firestore Database Issues

If Firestore tests fail:

1. Verify that Firestore is enabled in your Firebase project
2. Check that your security rules allow the operations you're trying to perform
3. Ensure your project is on the appropriate billing plan if needed

## Debugging Tools

### Browser Developer Tools

1. Open your browser's developer tools (F12)
2. Check the Console tab for Firebase-related errors
3. Look at the Network tab to see Firebase API requests and responses

### Firebase Emulator

For local development without affecting your production Firebase project:

1. Install the Firebase CLI: `npm install -g firebase-tools`
2. Initialize the emulator: `firebase init emulators`
3. Start the emulator: `firebase emulators:start`
4. Configure your app to use the emulator

## Maintenance Best Practices

### Regular Verification

1. Run the environment check script after any configuration changes
2. Verify your API key periodically, especially after Google Cloud Console changes
3. Use the Firebase test page before and after major updates

### Security Considerations

1. Never commit your `.env.local` file to version control
2. Set appropriate API key restrictions in the Google Cloud Console
3. Configure proper Firebase security rules for your database
4. Regularly review authentication methods and user access

## Additional Resources

- [Firebase Setup Guide](./FIREBASE_SETUP.md) - Complete setup instructions
- [API Key Troubleshooting](./FIREBASE_API_KEY_TROUBLESHOOTING.md) - Specific API key issues
- [General Troubleshooting](./TROUBLESHOOTING.md) - Other common issues
- [Firebase Documentation](https://firebase.google.com/docs) - Official Firebase docs

## Getting Help

If you've tried all the troubleshooting steps and still have issues:

1. Check the [Firebase Support](https://firebase.google.com/support) page
2. Search for similar issues on [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)
3. Review the [Firebase GitHub repository](https://github.com/firebase/firebase-js-sdk/issues)
4. Consider creating a new Firebase project to start fresh