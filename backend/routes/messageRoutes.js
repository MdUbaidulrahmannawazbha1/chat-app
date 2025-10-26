 const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  markAsRead,
  deleteMessage,
  getConversations
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/:userId', protect, getMessages);
router.put('/:messageId/read', protect, markAsRead);
router.delete('/:messageId', protect, deleteMessage);

module.exports = router;
