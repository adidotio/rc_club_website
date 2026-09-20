import https from 'node:https';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { amount, receipt, notes } = req.body || {};
  const keyId = process.env.VITE_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(500).json({ error: 'Razorpay keys not configured' });
  }

  const postData = JSON.stringify({
    amount: Math.round(Number(amount)),
    currency: 'INR',
    receipt: String(receipt || `rcpt_${Date.now()}`).slice(0, 40),
    notes: notes || {},
  });

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  return new Promise((resolve) => {
    const rzpReq = https.request(
      {
        hostname: 'api.razorpay.com',
        path: '/v1/orders',
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (rzpRes) => {
        let rzpBody = '';
        rzpRes.on('data', (c) => (rzpBody += c));
        rzpRes.on('end', () => {
          try {
            const parsed = JSON.parse(rzpBody);
            res.status(rzpRes.statusCode || 200).json(parsed);
          } catch {
            res.status(rzpRes.statusCode || 200).send(rzpBody);
          }
          resolve(true);
        });
      }
    );

    rzpReq.on('error', (err) => {
      res.status(500).json({ error: err.message });
      resolve(true);
    });

    rzpReq.write(postData);
    rzpReq.end();
  });
}
