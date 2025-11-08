// app/api/submitOrder.js
import { createClient } from '@sanity/client';

// This code ONLY runs on the Vercel server, never in the browser
const client = createClient({
  projectId: '9lhkzgx8', // Your project ID
  dataset: 'production',
  apiVersion: '2023-05-03', // Use a current date
  useCdn: false, // Must be false to write

  // This securely reads your key from Vercel's settings
  token: process.env.SANITY_WRITE_TOKEN, 
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 1. Destructure all the data from the form
    const { name, email, mobile, address, quantity, productId } = req.body;

    // 2. Create the new "order" document
    const doc = await client.create({
      _type: 'order',
      name: name,
      email: email,
      mobile: mobile,
      address: address,
      quantity: Number(quantity), // Convert quantity to a Number

      // 3. Create the reference to the product
      product: {
        _type: 'reference',
        _ref: productId, // This links it to the product
      }
    });

    res.status(200).json({ message: 'Order submitted!', id: doc._id });

  } catch (err) {
    console.error('Sanity write error:', err);
    res.status(500).json({ message: 'Error submitting order', error: err.message });
  }
}