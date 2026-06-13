import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { customerEmail, customerName, orderId, totalAmount } = req.body;

  // Configure Zoho SMTP securely using environment variables
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in', // Change to smtp.zoho.com if your account is global, not India-specific
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_PASSWORD,
    },
  });

  try {
    // 1. Send Confirmation to Customer
    await transporter.sendMail({
      from: `"KAEL Parfums" <${process.env.ZOHO_EMAIL}>`,
      to: customerEmail,
      subject: `Order Confirmed: #${orderId}`,
      html: `
        <div style="font-family: sans-serif; background-color: #050505; color: #fff; padding: 40px; text-align: center;">
          <h1 style="color: #fbbf24;">KAEL PARFUMS</h1>
          <h2>Thank you for your order, ${customerName}!</h2>
          <p>Your order <strong>#${orderId}</strong> for <strong>${totalAmount}</strong> has been successfully received.</p>
          <p>We are preparing your structural olfactive package and will notify you when it dispatches.</p>
        </div>
      `,
    });

    // 2. Send Alert to Admin
    await transporter.sendMail({
      from: `"KAEL System" <${process.env.ZOHO_EMAIL}>`,
      to: process.env.ZOHO_EMAIL,
      subject: `New Order: #${orderId} - ${totalAmount}`,
      text: `A new order has been placed by ${customerName} (${customerEmail}).\n\nTotal: ${totalAmount}\nOrder ID: ${orderId}\n\nPlease check your Supabase dashboard to arrange delivery.`,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("SMTP Error:", error);
    res.status(500).json({ error: 'Failed to send emails.' });
  }
}
