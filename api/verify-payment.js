import crypto from 'crypto';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, participantData } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  // 1. Create HMAC SHA256 digest
  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = shasum.digest('hex');

  if (digest === razorpay_signature) {
    // 2. Payment verified successfully! Now save to Google Sheets.
    try {
      if (participantData) {
        // Clean up the private key (Vercel sometimes adds quotes or escapes newlines differently)
        let privateKey = process.env.GOOGLE_PRIVATE_KEY || '';
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
          privateKey = privateKey.slice(1, -1); // Remove surrounding quotes
        }
        privateKey = privateKey.replace(/\\n/g, '\n'); // Fix escaped newlines

        // Initialize auth
        const serviceAccountAuth = new JWT({
          email: process.env.GOOGLE_CLIENT_EMAIL,
          key: privateKey,
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID, serviceAccountAuth);
        await doc.loadInfo(); // Loads document properties and worksheets
        const sheet = doc.sheetsByIndex[0]; // Gets the first tab in the spreadsheet

        // Append the row
        await sheet.addRow({
          Date: new Date().toISOString(),
          Event: participantData.event,
          'Lead Name': participantData.name,
          Email: participantData.email,
          WhatsApp: participantData.phone,
          College: participantData.college,
          'Amount Paid': participantData.amount,
          'Razorpay Order ID': razorpay_order_id,
          'Razorpay Payment ID': razorpay_payment_id,
        });
      }
      return res.status(200).json({ status: 'ok', message: 'Payment verified and saved' });
    } catch (sheetError) {
      console.error('Failed to save to Google Sheets:', sheetError);
      // We still return OK so the user sees success, since payment actually succeeded!
      return res.status(200).json({ status: 'ok', message: 'Payment verified but failed to save to sheets' });
    }
  } else {
    // Payment verification failed
    return res.status(400).json({ status: 'error', message: 'Invalid payment signature' });
  }
}
