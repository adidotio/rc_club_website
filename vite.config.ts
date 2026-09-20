import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import https from 'node:https';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'razorpay-order-middleware',
        configureServer(server) {
          server.middlewares.use('/api/create-order', (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Method Not Allowed' }));
              return;
            }

            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });

            req.on('end', () => {
              try {
                const parsed = JSON.parse(body || '{}');
                const keyId = env.VITE_RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
                const keySecret = env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET;

                if (!keyId || !keySecret) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Razorpay keys not configured in .env' }));
                  return;
                }

                const postData = JSON.stringify({
                  amount: Math.round(Number(parsed.amount)),
                  currency: 'INR',
                  receipt: String(parsed.receipt || `rcpt_${Date.now()}`).slice(0, 40),
                  notes: parsed.notes || {},
                });

                const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
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
                      res.statusCode = rzpRes.statusCode || 200;
                      res.setHeader('Content-Type', 'application/json');
                      res.end(rzpBody);
                    });
                  }
                );

                rzpReq.on('error', (err) => {
                  console.error('[Razorpay Order Error]:', err);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: err.message }));
                });

                rzpReq.write(postData);
                rzpReq.end();
              } catch (err: any) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err?.message || 'Invalid JSON body' }));
              }
            });
          });
        },
      },
    ],
    server: {
      port: 3000,
      open: true,
    },
  };
});
