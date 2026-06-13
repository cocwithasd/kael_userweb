const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { customerEmail, customerName, orderId, newStatus } = req.body;

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
              <h1 style="font-family: Georgia, serif; font-size: 28px; font-weight: 400; letter-spacing: 2px; color: #fff; margin-bottom: 10px; text-transform: uppercase;">Order Update</h1>
              <div style="font-size: 11px; letter-spacing: 3px; color: #ca8a04; text-transform: uppercase; margin-bottom: 30px; font-weight: 600;">Status: ${newStatus}</div>
              <p style="font-size: 14px; line-height: 1.8; color: #a3a3a3; margin-bottom: 30px;">Hi ${customerName}, the status of your order <strong>#${orderId}</strong> has been updated to <strong>${newStatus}</strong>.</p>
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
      subject: `Order Update: #${orderId} is now ${newStatus}`,
      html: emailTemplate,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("SMTP Error:", error);
    res.status(500).json({ error: error.message || 'SMTP Email failure.' });
  }
};
