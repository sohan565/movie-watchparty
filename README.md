# Watch Party Web Application

A professional, responsive web application for hosting synchronized watch parties. This application allows users to create rooms, share Google Drive video links, and watch videos together in perfect synchronization with real-time chat.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- **Synchronized Video Playback**: When the host plays, pauses, or seeks, all viewers stay in sync
- **Host Controls**: Full control over playback and ability to mute/kick users
- **Room Management**: Create and join rooms via unique room IDs or links
- **User Authentication**: Sign up and login with email/password or Google OAuth
- **Real-time Chat**: Chat with other participants while watching
- **Video Hash Display**: Ensures everyone is watching the same file
- **Dark/Light Theme**: Toggle between dark and light modes
- **Participant List**: View all participants with their current status

## Technologies Used

- **Frontend**: Next.js (React) with TypeScript
- **Styling**: Tailwind CSS
- **Real-time Communication**: Socket.IO
- **Authentication & Database**: Firebase (Authentication, Firestore)
- **Video Player**: ReactPlayer
- **UI Components**: React Icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository and install dependencies

```bash
git clone <repository-url>
cd movie-website
npm install
# or
yarn install
```

2. Set up environment variables

Create a `.env.local` file in the root directory with the following variables (see `.env.local.example` for reference):

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_SOCKET_SERVER_URL=http://localhost:3001
SOCKET_SERVER_PORT=3001
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Verifying Firebase Setup

There are multiple ways to verify your Firebase configuration:

### 1. Using the Firebase Test Page

Visit the `/firebase-test` page in your application. This page will show you:

- Whether all required Firebase environment variables are set
- If Firebase is properly initialized
- If Firebase Authentication is working
- If Firestore Database is working

### 2. Using Command Line Scripts

This project includes helpful scripts to verify your Firebase configuration:

```bash
# Check if all required environment variables are set in .env.local
npm run check-env

# Verify if your Firebase API key is valid
npm run verify-api-key YOUR_API_KEY
```

Replace `YOUR_API_KEY` with your actual Firebase API key.

If you encounter any issues, refer to the [FIREBASE_SETUP.md](./FIREBASE_SETUP.md), [FIREBASE_API_KEY_TROUBLESHOOTING.md](./FIREBASE_API_KEY_TROUBLESHOOTING.md), and [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) guides.

### Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google providers)
3. Create a Firestore database
4. Get your Firebase configuration from Project Settings > General > Your Apps > SDK setup and configuration
5. Add the configuration values to your `.env.local` file

**Important Note:** If you see a `FirebaseError: Firebase: Error (auth/invalid-api-key)` error, make sure you have:

- Created the `.env.local` file with all required Firebase configuration values
- Used the correct API key from your Firebase project
- Restarted the development server after creating or modifying the `.env.local` file
- Verified that your Firebase project has Authentication enabled

For detailed API key troubleshooting, see the [FIREBASE_API_KEY_TROUBLESHOOTING.md](./FIREBASE_API_KEY_TROUBLESHOOTING.md) guide.

For other common issues, refer to the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) guide.

## Usage

1. Sign up or log in to your account
2. Create a new room or join an existing one
3. If creating a room, paste a Google Drive video link
4. Share the room ID with friends
5. Enjoy watching together with synchronized playback and chat

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
