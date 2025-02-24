const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');


router.get('/search', protect, async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = await User.find({
      $or: [
        { email: { $regex: query, $options: 'i' } },
        { mobile: { $regex: query, $options: 'i' } }
      ],
      _id: { $ne: req.user._id } 
    }).select('-password');

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/conversations', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { recipient: req.user._id }
      ]
    }).sort({ createdAt: -1 });

    const userIds = new Set();
    messages.forEach(message => {
      if (message.sender.toString() !== req.user._id.toString()) {
        userIds.add(message.sender.toString());
      }
      if (message.recipient.toString() !== req.user._id.toString()) {
        userIds.add(message.recipient.toString());
      }
    });

    const conversations = await User.find({
      _id: { $in: Array.from(userIds) }
    }).select('-password');

    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (user) => {
        const lastMessage = await Message.findOne({
          $or: [
            { sender: req.user._id, recipient: user._id },
            { sender: user._id, recipient: req.user._id }
          ]
        }).sort({ createdAt: -1 });

        const unreadCount = await Message.countDocuments({
          sender: user._id,
          recipient: req.user._id,
          read: false
        });

        return {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            avatar: user.avatar,
            isOnline: user.isOnline,
            lastSeen: user.lastSeen
          },
          lastMessage: lastMessage ? {
            _id: lastMessage._id,
            content: lastMessage.content,
            sender: lastMessage.sender,
            createdAt: lastMessage.createdAt,
            read: lastMessage.read
          } : null,
          unreadCount
        };
      })
    );

    conversationsWithLastMessage.sort((a, b) => {
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
    });

    res.json(conversationsWithLastMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/:id/messages', protect, async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: userId },
        { sender: userId, recipient: req.user._id }
      ]
    }).sort({ createdAt: 1 });
    
    await Message.updateMany(
      { sender: userId, recipient: req.user._id, read: false },
      { $set: { read: true } }
    );
    
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/pending-messages', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      recipient: req.user._id,
      delivered: false
    }).populate('sender', 'name email mobile avatar');
    
    await Message.updateMany(
      { recipient: req.user._id, delivered: false },
      { $set: { delivered: true } }
    );
    
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;