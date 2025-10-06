const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { auth } = require('../middleware/auth');

router.get('/', auth, messageController.getMyMessages);
router.get('/unread-count', auth, messageController.getUnreadCount);
router.get('/conversation/:userId', auth, messageController.getConversation);
router.post('/', auth, messageController.sendMessage);
router.put('/:id/read', auth, messageController.markAsRead);

module.exports = router;