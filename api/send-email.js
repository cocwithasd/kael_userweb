const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { customerEmail, customerName, orderId, totalAmount } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in', // Change to smtp.zoho.com if your account is global
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_PASSWORD,
    },
  });

  const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="margin: 0; padding: 0; background-color: #050505; color: #f5f5f5; font-family: sans-serif;">
      <center style="width: 100%; table-layout: fixed; background-color: #050505; padding: 40px 0;">
        <table style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #111; border-collapse: collapse;">
          <tr>
            <td style="padding: 40px; text-align: center; border-bottom: 1px solid #111;">
              <img src="https://ejjcjskseatjqdoxabhm.supabase.co/storage/v1/object/public/store-assets/kael_weblogo.png" style="height: 35px;" alt="KAEL">
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <h1 style="font-family: Georgia, serif; font-size: 28px; font-weight: 400; letter-spacing: 2px; color: #fff; margin-bottom: 10px; text-transform: uppercase;">Order Confirmed</h1>
              <div style="font-size: 11px; letter-spacing: 3px; color: #ca8a04; text-transform: uppercase; margin-bottom: 30px; font-weight: 600;">Procurement Allocation Verified</div>
              <p style="font-size: 14px; line-height: 1.8; color: #a3a3a3; margin-bottom: 30px;">Thank you for your acquisition, ${customerName}. Your structural fragrance compound registry signature has successfully locked into our active fulfillment line.</p>
              
              <div style="background-color: #111; padding: 25px; margin-bottom: 30px; text-align: left; border: 1px solid #1c1c1c;">
                <div style="font-size: 12px; font-family: monospace; color: #737373; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Reference Registry: <span style="color: #fff; font-weight: bold; font-family: sans-serif; font-size: 14px;">#${orderId}</span></div>
                <div style="font-size: 12px; font-family: monospace; color: #737373; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Fulfillment Model: <span style="color: #fff; font-weight: bold; font-family: sans-serif; font-size: 14px;">Cash On Delivery (COD)</span></div>
                <div style="font-size: 12px; font-family: monospace; color: #737373; text-transform: uppercase; letter-spacing: 1px;">Liquidation Settlement: <span style="color: #fbbf24; font-weight: bold; font-family: sans-serif; font-size: 14px;">${totalAmount}</span></div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; border-t: 1px solid #111; text-align: center; font-size: 11px; color: #404040; letter-spacing: 1px; text-transform: uppercase;">
              &copy; 2026 KAEL Parfums. All premium rights reserved.
            </td>
          </tr>
        </table>
      </center>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"KAEL Parfums" <${process.env.ZOHO_EMAIL}>`,
      to: customerEmail,
      subject: `Fulfillment Registry Confirmation: #${orderId}`,
      html: emailTemplate,
    });

    await transporter.sendMail({
      from: `"KAEL Systems" <${process.env.ZOHO_EMAIL}>`,
      to: process.env.ZOHO_EMAIL,
      subject: `Fulfillment Dispatch Required: #${orderId} [${totalAmount}]`,
      text: `Client Name: ${customerName}\nContact Target: ${customerEmail}\nTotal Invoice Vector: ${totalAmount}\nOrder Payload Index: #${orderId}`,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("SMTP Error:", error);
    res.status(500).json({ error: error.message || 'SMTP Email failure.' });
  }
};
