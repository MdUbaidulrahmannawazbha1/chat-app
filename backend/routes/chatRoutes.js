const express = require('express');
const { getChatReply } = require('../controllers/chatController');

const router = express.Router();

router.post('/', getChatReply);

module.exports = router;