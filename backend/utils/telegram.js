const axios = require('axios');

const sendTelegramNotification = async (order) => {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.warn('Telegram credentials missing in .env file.');
      return;
    }

    const customer = order.customerInfo || {};
    const payment = order.payment || {};

    const message = `
🚨 *NEW HABESHA KEMIS ORDER!* 🚨
----------------------------------
*Order ID:* \`${order.orderId || order._id}\`
*Customer Name:* ${customer.fullName || customer.name || 'Guest'}
*Phone:* ${customer.phone || 'N/A'}
*City / Address:* ${customer.city || customer.address || 'N/A'}

*Payment Method:* ${payment.method || 'N/A'}
*Total Price:* Br ${payment.amount || payment.totalAmount || 0}
----------------------------------
⏰ *Status:* ${order.orderStatus || 'Pending'}
    `;

    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    });

    console.log('Telegram order notification sent successfully!');
  } catch (error) {
    console.error('Failed to send Telegram notification:', error.response?.data || error.message);
  }
};

module.exports = sendTelegramNotification;