import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { customerEmail, customerName, orderId, totalAmount } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in', 
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_PASSWORD,
    },
  });

  // LUXURY BRAND HTML TEMPLATE
  const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; padding: 0; background-color: #050505; color: #f5f5f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #050505; padding-top: 40px; padding-bottom: 40px; }
        .main-table { width: 100%; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #111111; border-collapse: collapse; }
        .header { padding: 40px text-align: center; border-bottom: 1px solid #111111; }
        .logo { height: 35px; object-contain: contain; }
        .content { padding: 40px 30px; text-align: center; }
        .title { font-family: 'Cormorant Garamond', 'Georgia', serif; font-size: 28px; font-weight: 400; letter-spacing: 2px; color: #ffffff; margin-bottom: 10px; text-transform: uppercase; }
        .subtitle { font-size: 11px; letter-spacing: 3px; color: #ca8a04; text-transform: uppercase; margin-bottom: 30px; font-weight: 600; }
        .body-text { font-size: 14px; line-height: 1.8; color: #a3a3a3; margin-bottom: 30px; max-width: 480px; margin-left: auto; margin-right: auto; }
        .order-card { background-color: #111111; padding: 25px; margin-bottom: 30px; text-align: left; border: 1px solid #1c1c1c; }
        .card-row { font-size: 12px; font-family: monospace; color: #737373; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
        .card-value { color: #ffffff; font-weight: bold; font-family: sans-serif; font-size: 14px; }
        .footer { padding: 30px; border-t: 1px solid #111111; text-align: center; font-size: 11px; color: #404040; letter-spacing: 1px; text-transform: uppercase; }
      </style>
    </head>
    <body>
      <center class="wrapper">
        <table class="main-table">
          <tr>
            <td class="header">
              <img src="https://ejjcjskseatjqdoxabhm.supabase.co/storage/v1/object/public/store-assets/kael_weblogo.png" class="logo" alt="KAEL Haute Parfumerie">
            </td>
          </tr>
          <tr>
            <td class="content">
              <h1 class="title">Order Confirmed</h1>
              <div class="subtitle">Procurement Allocation Verified</div>
              <p class="body-text">Thank you for your acquisition, ${customerName}. Your structural fragrance compound registry signature has successfully locked into our active fulfillment line pipelines.</p>
              
              <div class="order-card">
                <div class="card-row">Reference Registry: <span class="card-value">#${orderId}</span></div>
                <div class="card-row">Fulfillment Model: <span class="card-value">Cash On Delivery (COD)</span></div>
                <div class="card-row" style="margin-bottom:0;">Liquidation Settlement: <span class="card-value" style="color: #fbbf24;">${totalAmount}</span></div>
              </div>
              
              <p class="body-text" style="font-size: 12px; color: #525252;">A delivery agent will verify allocation coordinates and request validation payment upon final parcel handoff configuration.</p>
            </td>
          </tr>
          <tr>
            <td class="footer">
              &copy; 2026 KAEL Parfums. All premium rights reserved.
            </td>
          </tr>
        </table>
      </center>
    </body>
    </html>
  `;

  try {
    // 1. Dispatch Master Template Layout directly to Client Pipeline
    await transporter.sendMail({
      from: `"KAEL Parfums" <${process.env.ZOHO_EMAIL}>`,
      to: customerEmail,
      subject: `Fulfillment Registry Confirmation: #${orderId}`,
      html: emailTemplate,
    });

    // 2. Clear Internal Notification Matrix straight to Administrator Account
    await transporter.sendMail({
      from: `"KAEL Systems" <${process.env.ZOHO_EMAIL}>`,
      to: process.env.ZOHO_EMAIL,
      subject: `Fulfillment Dispatch Required: #${orderId} [${totalAmount}]`,
      text: `Fulfillment notification tracking request.\n\nClient Name: ${customerName}\nContact Target: ${customerEmail}\nTotal Invoice Vector: ${totalAmount}\nOrder Payload Index: #${orderId}\n\nPlease parse this order tracking index map directly inside your Supabase client operations cockpit.`,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("SMTP Configuration Handoff Error:", error);
    res.status(500).json({ error: 'Fulfillment notification dispatch failure.' });
  }
}
