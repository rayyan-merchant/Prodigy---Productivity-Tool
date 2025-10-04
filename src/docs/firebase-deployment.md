
# Firebase Cloud Functions Deployment Guide

This guide will walk you through deploying the Firebase Cloud Functions used for AI features in Prodigy.

## Prerequisites

1. **Firebase CLI Installation**
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase Login**
   ```bash
   firebase login
   ```

## Initial Setup (Only First Time)

1. **Initialize Firebase in Your Project**
   ```bash
   firebase init functions
   ```
   - Select JavaScript or TypeScript
   - Choose if you want to use ESLint
   - Install dependencies when prompted

## Configure Environment Variables

1. **Set the Mistral API Key Securely**
   ```bash
   firebase functions:config:set mistral.api_key="lSNty7xtmbCkjgJ2YIoKxGUZhhFGJMnp"
   ```

2. **Verify Configuration**
   ```bash
   firebase functions:config:get
   ```

## Function Code Structure

Your function code should be structured like this:

```typescript
const functions = require('firebase-functions');
const fetch = require('node-fetch');

exports.callMistral = functions.https.onCall(async (data, context) => {
  // Authenticate the user
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  try {
    // Get API key from environment
    const apiKey = functions.config().mistral.api_key;
    if (!apiKey) {
      throw new Error('Mistral API key is not configured');
    }

    // Make request to Mistral API
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: data.messages
      })
    });

    const result = await response.json();
    return { result };
  } catch (error) {
    console.error('Error calling Mistral AI:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

## Deploy the Function

```bash
firebase deploy --only functions
```

## Testing Your Deployment

1. After deployment, go to the Firebase Console > Functions section
2. You should see your function listed as "Active"
3. Test the function from your frontend code:

```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const callMistral = httpsCallable(functions, 'callMistral');

// Usage example
const response = await callMistral({
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Summarize this task list." }
  ]
});

const result = response.data;
console.log(result);
```

## Troubleshooting

If you encounter issues:

1. Check the Cloud Functions logs in Firebase Console
2. Verify your API key is correctly set
3. Test with a simpler function to confirm deployment is working
4. Check for any billing issues (Cloud Functions require the Blaze plan)

Remember to set proper security rules to prevent unauthorized access to your functions.
