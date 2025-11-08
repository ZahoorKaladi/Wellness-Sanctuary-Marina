// app/api/submitContact.js
import { createClient } from '@sanity/client';

// This code ONLY runs on the Vercel server, never in the browser
const client = createClient({
  projectId: '9lhkzgx8',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, // Must be false to write

  // This is the CRITICAL part. It securely reads your key from Vercel's settings.
  token: process.env.SANITY_WRITE_TOKEN, 
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    // Create the new document in your "contactSubmission" inbox
    const doc = await client.create({
      _type: 'contactSubmission',
      name: name,
      email: email,
      subject: subject,
      message: message,
    });

    res.status(200).json({ message: 'Message sent!', id: doc._id });

  } catch (err) {
    console.error('Sanity write error:', err);
    res.status(500).json({ message: 'Error sending message', error: err.message });
  }
}