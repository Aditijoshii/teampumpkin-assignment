const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  delivered: {
    type: Boolean,
    default: false
  },
  read: {
    type: Boolean,
    default: false
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

MessageSchema.index({ sender: 1, recipient: 1 });

module.exports = mongoose.model('Message', MessageSchema);