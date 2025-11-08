// app/api/submitBooking.js
import { createClient } from '@sanity/client';

// This code ONLY runs on the Vercel server, never in the browser
const client = createClient({
  projectId: '9lhkzgx8', // Your project ID
  dataset: 'production',
  apiVersion: '2023-05-03', // Use a current date
  useCdn: false, // Must be false to write

  // This securely reads your final, secret key from Vercel's settings
  token: process.env.SANITY_WRITE_TOKEN, 
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, phone, sessionType, dateTime } = req.body;

    // Create the new "sessionBooking" document
    const doc = await client.create({
      _type: 'sessionBooking',
      name: name,
      email: email,
      phone: phone,
      sessionType: sessionType,
      dateTime: dateTime,
    });

    res.status(200).json({ message: 'Booking submitted!', id: doc._id });

  } catch (err) {
    console.error('Sanity write error:', err);
    res.status(500).json({ message: 'Error submitting booking', error: err.message });
  }
}