import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const secret = process.env.RAZORPAY_KEY_SECRET;

  // Create HMAC SHA256 digest
  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = shasum.digest('hex');

  if (digest === razorpay_signature) {
    // Payment verified successfully
    return res.status(200).json({ status: 'ok', message: 'Payment verified successfully' });
  } else {
    // Payment verification failed
    return res.status(400).json({ status: 'error', message: 'Invalid payment signature' });
  }
}
