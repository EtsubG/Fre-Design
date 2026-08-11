const Message = require('../models/Message');
const sendTelegramNotification = require('../utils/telegram');

// @desc    Submit a contact message (public)
// @route   POST /api/messages
const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newMessage = await Message.create({ name, email, subject, message });

    // Non-blocking Telegram notification to the designer
    try {
      await sendTelegramNotification({
        orderId: null,
        customerInfo: { fullName: name, email },
        type: 'message',
        subject,
        body: message,
      });
    } catch (_) {
      // Telegram failure should never block the response
    }

    res.status(201).json({
      message: 'Message sent successfully.',
      id: newMessage._id,
      date: newMessage.createdAt,
    });
  } catch (error) {
    console.error('Message creation error:', error);
    res.status(500).json({ message: 'Server error while sending message.', error: error.message });
  }
};

// @desc    Get all messages (admin only)
// @route   GET /api/messages
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: messages.length,
      messages: messages.map((m) => ({
        id: m._id,
        name: m.name,
        email: m.email,
        subject: m.subject,
        message: m.message,
        read: m.read,
        date: m.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error while fetching messages.', error: error.message });
  }
};

// @desc    Mark a message as read (admin only)
// @route   PUT /api/messages/:id/read
const markAsRead = async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true },
    );

    if (!msg) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    res.status(200).json({ message: 'Marked as read.', id: msg._id });
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Delete a message (admin only)
// @route   DELETE /api/messages/:id
const deleteMessage = async (req, res) => {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id);

    if (!msg) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    res.status(200).json({ message: 'Message deleted.' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

module.exports = { createMessage, getMessages, markAsRead, deleteMessage };
