# Troubleshooting Guide

## Firebase Authentication Issues

### Error: FirebaseError: Firebase: Error (auth/invalid-api-key)

This error occurs when the Firebase API key is invalid or not properly configured.

**Solution:**

1. Check that you have created a `.env.local` file in the root directory of your project.
2. Ensure the file contains all the required Firebase configuration variables:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
   ```
3. Verify that you've copied the correct API key from your Firebase project console.
4. Restart the development server after creating or modifying the `.env.local` file:
   ```bash
   npm run dev
   ```
5. Make sure your Firebase project has Authentication enabled in the Firebase console.

### Error: FirebaseError: Firebase: Error (auth/operation-not-allowed)

This error occurs when the authentication method you're trying to use is not enabled in the Firebase console.

**Solution:**

1. Go to the Firebase console: https://console.firebase.google.com/
2. Select your project
3. Go to Authentication > Sign-in method
4. Enable the authentication methods you want to use (Email/Password, Google, etc.)
5. Save your changes

## Socket.IO Connection Issues

### Error: Failed to connect to Socket.IO server

This error occurs when the application cannot connect to the Socket.IO server.

**Solution:**

1. Check that the Socket.IO server is running
2. Verify that the Socket.IO server URL in your `.env.local` file is correct:
   ```
   NEXT_PUBLIC_SOCKET_SERVER_URL=http://localhost:3001
   SOCKET_SERVER_PORT=3001
   ```
3. Make sure there are no firewall or network issues blocking the connection

## Video Playback Issues

### Error: Video not playing or synchronizing

**Solution:**

1. Check that the video URL is valid and accessible
2. For Google Drive videos, ensure the link is properly formatted and the file is shared with appropriate permissions
3. Verify that all participants have a stable internet connection

## General Troubleshooting

1. **Clear browser cache and cookies**
2. **Try a different browser**
3. **Check console for errors** - Open your browser's developer tools (F12) and look for errors in the console
4. **Restart the development server**
5. **Reinstall dependencies** - Delete the `node_modules` folder and run `npm install`