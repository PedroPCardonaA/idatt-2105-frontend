import { useUserStore } from '../stores/UserStore';
import { fetchMessages } from '../services/ChatService';
import { toRaw } from 'vue';

// Converts the data from the database into a format that can be used by the chat component
export default async function chatListFormat(chatList) {
  if (chatList.length === 0) return [];

  let chatArray = [];

  for (const chat of chatList) {
    let username = chat.sellerName;
    if (username === useUserStore().username) {
      username = chat.buyerName;
    }

    // Make a call to the backend to get the messages for this chat
    const messagesList = [];
    const messagesResponse = await fetchMessages(chat.chatId);

    messagesResponse.data.forEach((message) => {
        let time = new Date(message.messageTime);
        let isMe = message.senderName === useUserStore().username;

        let seen = message.seen;
        if (isMe) {
            seen = true;
        }

      let messageObj = {
        messageId: message.messageId,
        message: message.message,
        time: time.toLocaleTimeString(),
        seen: seen,
        isMe: isMe,
      };

      messagesList.push(messageObj);
    });

    if (messagesList.length === 0) {
      messagesList.push({
        messageId: 0,
        message: 'No messages yet',
        time: '00:00',
        seen: false,
        isMe: false,
        });
    }

    let chatObj = {
      chatId: chat.chatId,
      username: username,
      messages: messagesList,
    };

    chatArray.push(chatObj);
  }

  return chatArray;
}