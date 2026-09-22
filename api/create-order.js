import Razorpay from 'razorpay';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const { amount, currency = 'INR', receipt = 'receipt_1' } = req.body;

  try {
    const options = {
      amount: amount, // amount in the smallest currency unit (paise)
      currency: currency,
      receipt: receipt,
    };
    
    const order = await razorpay.orders.create(options);
    return res.status(200).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
