const Razorpay = require('razorpay');
const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { amount } = req.body;

    // Connect to Supabase using the SERVICE ROLE KEY (to securely fetch the secret key)
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    try {
        // Fetch keys directly from your database
        const { data: store } = await supabase.from('store_settings').select('razorpay_key_id').single();
        const { data: secure } = await supabase.from('secure_settings').select('razorpay_key_secret').single();

        if (!store.razorpay_key_id || !secure.razorpay_key_secret) {
            return res.status(400).json({ error: 'Razorpay keys not configured in database.' });
        }

        const instance = new Razorpay({
            key_id: store.razorpay_key_id,
            key_secret: secure.razorpay_key_secret,
        });

        const options = {
            amount: Math.round(amount * 100), // Razorpay calculates in paise (multiply by 100)
            currency: "INR",
            receipt: `rcpt_${Date.now()}`
        };

        const order = await instance.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.error("Razorpay Error:", error);
        res.status(500).json({ error: 'Failed to create payment instance.' });
    }
};
