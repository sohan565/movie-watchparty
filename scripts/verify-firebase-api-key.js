/**
 * Firebase API Key Verification Script
 * 
 * This script helps verify if your Firebase API key is valid by making a simple
 * request to the Firebase Auth REST API.
 * 
 * Usage:
 * 1. Make sure you have Node.js installed
 * 2. Run this script with your API key as an argument:
 *    node verify-firebase-api-key.js YOUR_API_KEY
 */

const https = require('https');

// Get API key from command line arguments
const apiKey = process.argv[2];

if (!apiKey) {
  console.error('Error: No API key provided');
  console.log('Usage: node verify-firebase-api-key.js YOUR_API_KEY');
  process.exit(1);
}

// Construct the URL to test the API key
// This endpoint is part of the Firebase Auth REST API
const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;

// Make a request to the Firebase Auth API
const req = https.request(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    const statusCode = res.statusCode;
    
    if (statusCode === 400) {
      // A 400 response with specific error messages is expected when the API key is valid
      // but we're not providing required parameters
      console.log('✅ API Key is valid!');
      console.log('The API key was accepted by Firebase Authentication services.');
    } else if (statusCode === 401 || statusCode === 403) {
      console.error('❌ API Key is invalid or restricted!');
      try {
        const response = JSON.parse(data);
        console.error(`Error: ${response.error?.message || 'Unknown error'}`);
        
        if (response.error?.status === 'PERMISSION_DENIED') {
          console.log('\nPossible causes:');
          console.log('1. The API key might have restrictions that prevent its use with Firebase Authentication');
          console.log('2. The Firebase Authentication API might not be enabled for this project');
        }
      } catch (e) {
        console.error('Error parsing response:', data);
      }
    } else {
      console.error(`❌ Unexpected response (Status code: ${statusCode})`);
      console.error('Response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
});

// Send an empty request body
req.write(JSON.stringify({}));
req.end();

console.log(`🔍 Verifying API key: ${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)}`);
console.log('Sending request to Firebase Authentication API...');