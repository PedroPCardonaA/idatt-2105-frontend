<script setup>
import '@/assets/css/chat/chat.css'
import Message from './Message.vue'
import { ref, onMounted, toRaw } from 'vue'
import { useUserStore } from '@/stores/UserStore.js'
import { fetchChats, sendMessage, markAsSeen } from '@/services/ChatService.js'
import { throwErrorPopup } from '@/utils/ErrorController.js'
import router from '@/router'
import chatListFormat from '@/utils/ChatFormatter.js'

const userStore = useUserStore()

const chatBtn = ref(null)
const chatContainer = ref(null)
const chatOpen = ref(false)
const chatToOpen = ref('')
const chatToSend = ref('')

const chatData = ref([])

onMounted(async () => {
  // Check if user is logged in
  if (!userStore.isLoggedIn) {
    return
  }

  let response = null
  // Fetch chats
  try {
    response = await fetchChats(userStore.username)
  } catch (error) {
    // Check if error is 401
    userStore.logUserOut()
    console.log('You need to be logged in')
    throwErrorPopup('You need to be logged in')
  }
  
  if (response.status === 200) {
    let rawData = response.data
  } else {
    console.log('Error fetching chats')
    throwErrorPopup('Error fetching chats')
  }

  chatData.value = await chatListFormat(response.data)
})


function formatPreviewMessage(message) {
  let rawMessage = message
  let messageJson = null

  if (message.startsWith('{')) {
    // Replace all ' with "
    message = message.replace(/'/g, '"')

    // Convert message to JSON
    messageJson = JSON.parse(message)

    if (messageJson.type === 'bid') {
      return 'Bid placed on a NFT'
    } else if (messageJson.type === 'acceptance') {
      return 'Bid accepted'
    } else if (messageJson.type === 'decline') {
      return 'Bid declined'
    } else if (messageJson.type === 'purchase') {
      return 'NFT purchased'
    }
  }

  if (message.length > 20) {
    return message.substring(0, 20) + '...'
  } else {
    return message
  }
}

async function openChat() {
  // Set all messages to seen
  chatData.value.find((chat) => chat.username === chatToOpen.value).messages[
    Object.keys(chatData.value.find((chat) => chat.username === chatToOpen.value).messages)[
      Object.keys(chatData.value.find((chat) => chat.username === chatToOpen.value).messages)
        .length - 1
    ]
  ].seen = true

  let chatId = chatData.value.find((chat) => chat.username === chatToOpen.value).chatId
  await markAsSeen(chatId)

  console.log('Opened chat with ' + chatToOpen.value)
}

async function sendChat() {
  // Check if message is empty
  if (chatToSend.value.trim() === '') {
    return
  }

  // Send chat to database
  console.log('Sent chat to ' + chatToOpen.value + ': ' + chatToSend.value)

  // Add chat to chatData
  chatData.value.find((chat) => chat.username === chatToOpen.value).messages[
    Object.keys(chatData.value.find((chat) => chat.username === chatToOpen.value).messages).length
  ] = {
    messageId: 0,
    message: chatToSend.value,
    time: new Date().toLocaleTimeString(),
    seen: true,
    isMe: true
  }

  //Send message to database
  let chatId = chatData.value.find((chat) => chat.username === chatToOpen.value).chatId
  try {
    await sendMessage(chatId, chatToSend.value)
  } catch (error) {
    throwErrorPopup('Error sending message, please try again later')
  }

  console.log(chatData.value)

  // Clear chatToSend
  chatToSend.value = ''
}

function toggleChat() {
  chatBtn.value.classList.toggle('active')
  chatContainer.value.classList.toggle('active')
}
</script>

<template>
  <div class="chat-btn" ref="chatBtn" v-if="userStore.isLoggedIn">
    <button class="btn btn-primary" @click="toggleChat">
      <i class="fas fa-comment-dots"></i>
      <i
        class="fas fa-circle notification"
        v-if="
          chatData.find(
            (chat) =>
              chat.messages[Object.keys(chat.messages)[Object.keys(chat.messages).length - 1]]
                .seen === false
          )
        "
      ></i>
    </button>
  </div>
  <div class="chat-container" ref="chatContainer" v-if="userStore.isLoggedIn">
    <div class="chat-header">
      <button class="btn btn-primary" @click="toggleChat">
        <i class="fas fa-times"></i>
      </button>
      <h3 class="chat-title" v-if="!chatOpen">Chat</h3>
      <h3 class="chat-title" v-if="chatOpen">
        {{ chatToOpen }}
      </h3>
    </div>
    <div class="chat-body">
      <div class="chat-list" v-if="!chatOpen">
        <div
          class="chat-item clickable"
          v-for="chat in chatData"
          :key="chat.username"
          @click="chatOpen = true, chatToOpen = chat.username, openChat()">
          <div class="chat-item-header">
            <h4 class="chat-item-title">{{ chat.username }}</h4>
            <i
              class="fas fa-circle notification"
              v-if="
                chat.messages[Object.keys(chat.messages)[Object.keys(chat.messages).length - 1]]
                  .seen === false
              "
            ></i>
          </div>
          <div class="chat-item-body">
            <p class="chat-item-message">
              {{
                formatPreviewMessage(
                  chat.messages[Object.keys(chat.messages)[Object.keys(chat.messages).length - 1]]
                    .message
                )
              }}
            </p>
            <p class="chat-item-time">
              {{
                chat.messages[Object.keys(chat.messages)[Object.keys(chat.messages).length - 1]]
                  .time
              }}
            </p>
          </div>
        </div>
      </div>
      <div class="chat-content" v-if="chatOpen">
        <div class="chat-content-header">
          <h4 class="chat-content-title">{{ chatToOpen }}</h4>
          <button class="btn btn-primary" @click="chatOpen = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="chat-content-body">
          <Message
            v-for="message in chatData.find((chat) => chat.username === chatToOpen).messages"
            :key="message.time"
            :message="message"
          />
        </div>
        <div class="chat-content-footer">
          <input
            type="text"
            class="form-control"
            placeholder="Type a message..."
            v-model="chatToSend"
            @keyup.enter="sendChat"
          />
          <button class="btn btn-primary" @click="sendChat">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
