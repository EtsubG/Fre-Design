const axios = require('axios');

/**
 * Sends a Telegram notification for either a new order or a contact message.
 * Detects the type by checking payload.type === 'message'.
 */
const sendTelegramNotification = async (payload) => {
  try {
    const token  = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.warn('⚠️  Telegram credentials missing in .env file.');
      return;
    }

    let text;

    // ── Contact message notification ─────────────────────────────────────
    if (payload.type === 'message') {
      const c = payload.customerInfo || {};
      text = `
📩 *NEW CONTACT MESSAGE*

*From:* ${c.fullName || 'Unknown'}
*Email:* ${c.email || 'N/A'}
*Subject:* ${payload.subject || 'N/A'}

${payload.body || ''}
`.trim();

    // ── Order notification ────────────────────────────────────────────────
    } else {
      const order = payload;
      const c = order.customerInfo || {};
      const m = order.measurements  || {};
      const i = order.orderedItem   || {};
      const p = order.payment       || {};

      text = `
🚨 *NEW HABESHA KEMIS ORDER!*

*Order ID:* \`${order.orderId || order._id || 'N/A'}\`
*Status:* ${order.orderStatus || 'Pending'}

👤 *CUSTOMER*
• Name: ${c.fullName || 'N/A'}
• Phone: ${c.phoneNumber || 'N/A'}
• Email: ${c.email || 'N/A'}
• City: ${c.city || 'N/A'}
• Address: ${c.deliveryAddress || 'N/A'}
${c.additionalNotes ? `• Notes: ${c.additionalNotes}` : ''}

👗 *ORDER*
• Product: ${i.productName || i.product || 'N/A'}
• Fabric/Color: ${i.selectedColor || 'N/A'}

📏 *MEASUREMENTS (cm)*
• Height: ${m.height || '—'} | Waist: ${m.waist || '—'} | Hips: ${m.hips || '—'}
• Shoulder: ${m.shoulderWidth || '—'} | Sleeve: ${m.sleeveLength || '—'} | Dress: ${m.dressLength || '—'}

💳 *PAYMENT*
• Amount: $${p.amount || 0}
• Receipt: ${p.receiptUrl && p.receiptUrl !== 'pending' ? p.receiptUrl : 'Not uploaded yet'}
• Status: ${p.status || 'Pending Verification'}
`.trim();
    }

    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
    });

    console.log('✅ Telegram notification sent.');
  } catch (error) {
    console.error('❌ Telegram notification failed:', error.response?.data || error.message);
  }
};

module.exports = sendTelegramNotification;
