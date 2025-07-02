/**
 * Environment Variables Check Script
 * 
 * This script checks if all required Firebase environment variables are set in .env.local
 * and displays their status without revealing the actual values.
 * 
 * Usage:
 * node scripts/check-env-vars.js
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  console.error('❌ Error: .env.local file not found!');
  console.log('Please create a .env.local file with your Firebase configuration.');
  process.exit(1);
}

const envConfig = dotenv.parse(fs.readFileSync(envPath));

// Define required Firebase environment variables
const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

// Check if all required variables are set
const missingVars = [];
const placeholderVars = [];

console.log('\n🔍 Checking Firebase environment variables in .env.local:\n');

requiredVars.forEach(varName => {
  const value = envConfig[varName];
  
  if (!value) {
    console.log(`❌ ${varName}: Not set`);
    missingVars.push(varName);
  } else if (
    value === 'your_api_key_here' || 
    value === 'your_auth_domain_here' || 
    value === 'your_project_id_here' || 
    value === 'your_storage_bucket_here' || 
    value === 'your_messaging_sender_id_here' || 
    value === 'your_app_id_here' ||
    value === 'your_firebase_api_key'
  ) {
    console.log(`⚠️ ${varName}: Contains placeholder value`);
    placeholderVars.push(varName);
  } else {
    // Show first and last few characters of the value for verification
    const maskedValue = value.length > 8 
      ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}` 
      : '********';
    console.log(`✅ ${varName}: Set (${maskedValue})`);
  }
});

console.log('');

if (missingVars.length > 0 || placeholderVars.length > 0) {
  if (missingVars.length > 0) {
    console.log('❌ Missing environment variables:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    console.log('');
  }
  
  if (placeholderVars.length > 0) {
    console.log('⚠️ Placeholder values detected:');
    placeholderVars.forEach(varName => console.log(`   - ${varName}`));
    console.log('');
  }
  
  console.log('Please update your .env.local file with the correct values from your Firebase project.');
  console.log('See FIREBASE_SETUP.md for detailed instructions.');
} else {
  console.log('✅ All Firebase environment variables are properly set!');
}

console.log('\nTo verify your API key is valid, run:');
console.log('node scripts/verify-firebase-api-key.js YOUR_API_KEY');