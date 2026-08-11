const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  createMessage,
  getMessages,
  markAsRead,
  deleteMessage,
} = require('../controllers/messageController');

// Public: submit a contact message
router.post('/', createMessage);

// Admin only: list, mark as read, delete
router.get('/', protect, getMessages);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
