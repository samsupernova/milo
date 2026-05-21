// Simple localStorage-based messages management
const MESSAGES_KEY = 'milo_messages';

// Helper to get all messages from localStorage
const getAllMessagesFromStorage = () => {
  const messages = localStorage.getItem(MESSAGES_KEY);
  return messages ? JSON.parse(messages) : [];
};

// Helper to save messages to localStorage
const saveMessagesToStorage = (messages) => {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
};

// Generate a simple UUID
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Get messages for an event
export const getMessages = async (eventId) => {
  try {
    const allMessages = getAllMessagesFromStorage();
    return allMessages.filter(m => m.event_id === eventId);
  } catch (error) {
    console.error('Get messages error:', error);
    return [];
  }
};

// Send a message
export const sendMessage = async (eventId, userId, userName, userAvatar, message) => {
  try {
    const allMessages = getAllMessagesFromStorage();
    
    const newMessage = {
      id: generateId(),
      event_id: eventId,
      user_id: userId,
      user_name: userName,
      user_avatar: userAvatar,
      message,
      is_bot: false,
      created_at: new Date().toISOString(),
    };

    allMessages.push(newMessage);
    saveMessagesToStorage(allMessages);

    return {
      success: true,
      message: newMessage,
    };
  } catch (error) {
    console.error('Send message error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Delete a message
export const deleteMessage = async (messageId, userId) => {
  try {
    const allMessages = getAllMessagesFromStorage();
    const message = allMessages.find(m => m.id === messageId);
    
    if (!message) {
      return {
        success: false,
        error: 'Message not found',
      };
    }

    if (message.user_id !== userId) {
      return {
        success: false,
        error: 'You can only delete your own messages',
      };
    }

    const filteredMessages = allMessages.filter(m => m.id !== messageId);
    saveMessagesToStorage(filteredMessages);

    return { success: true };
  } catch (error) {
    console.error('Delete message error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Subscribe to messages (for real-time updates)
// In localStorage version, this is a no-op since we don't have real-time
export const subscribeToMessages = (eventId, callback) => {
  // Return a dummy unsubscribe function
  return () => {};
};
