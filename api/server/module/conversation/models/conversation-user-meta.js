const Schema = require('mongoose').Schema;

const schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    index: true
  },
  unreadMessageCount: {
    type: Number,
    default: 0
  },
  isReplied: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

module.exports = schema;
