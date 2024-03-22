import axios from 'axios'
import { useUserStore } from '@/stores/UserStore.js'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }
})

/**
 * Retrieves the chats associated with the given username
 * @param {string} username - The username of the user who's chats are being requested
 * @returns {Promise} - Promise object represents the response from the server
 */  
export async function fetchChats(username) {
    try {
        console.log(`Bearer ${useUserStore().userToken}`)
        const response = await apiClient.get('chats/' + username, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + useUserStore().userToken
            }
        })


        return response
    } catch (error) {
        throw new Error('There was an error while fetching chats: ' + error.response)
    }
}

/**
 * Retrieves the messages associated with the given chatId
 * @param {string} chatId - The chatId of the chat whose messages are being requested
 * @returns {Promise} - Promise object represents the response from the server
 * @throws {Error} - Throws an error if there was an error while fetching messages
*/
export async function fetchMessages(chatId) {
    try {
        const response = await apiClient.get('messages/chats/' + chatId, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + useUserStore().userToken
            }

        })
        return response
    } catch (error) {
        throw error
    }
}

/**
 * Sends a message to the given chatId
 * @param {*} chatId  - The chatId of the chat to send the message to
 * @param {*} message  - The message to be sent
 * @returns  {Promise} - Promise object represents the response from the server
 */
export async function sendMessage(chatId, message) {
    try {
        const response = await apiClient.post('messages/post', {
            chatId: chatId,
            message: message,
            senderName: useUserStore().username
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + useUserStore().userToken
                }
            })
        return response
    } catch (error) {
        throw new Error('There was an error while sending message: ' + error.response)
    }
}

export async function markAsSeen(chatId) {
    try {
        const response = await apiClient.put('chats/seen/' + chatId, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + useUserStore().userToken
            }
        })
        return response
    } catch (error) {
        throw new Error('There was an error while marking messages as seen: ' + error.response)
    }
}

/**
 * Creates a new chat
 * @param {*} chat  - The chat object to be created
 * @returns  {Promise} - Promise object represents the response from the server
 */
export async function createChat(chat) {
    try {
        const response = await apiClient.post('chats/chat', chat, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + useUserStore().userToken
            }
        })
        return response
    } catch (error) {
        throw new Error('There was an error while creating chat: ' + error.response)
    }
}

/**
 * Sends a purchase notification to the given chatId
 * @param {string} sellerName - The username of the seller
 * @param {string} buyerName - The username of the buyer
 * @param {number} amount - The amount of the transaction
 * @param {string} itemId - The id of the item being purchased
 * @returns {Promise} - Promise object represents the response from the server
 */
export async function sendPurchaseNotification(sellerName, buyerName, amount, itemId) {
    // Check if a chat already exists between the two users
    const chats = await fetchChats(buyerName)
    let chatId = null

    for (let i = 0; i < chats.data.length; i++) {
        if (chats.data[i].sellerName === sellerName || chats.data[i].buyerName === sellerName) {
            chatId = chats.data[i].chatId
            break
        }
    }

    // If a chat does not exist, create one
    if (chatId === null) {
        const chat = {
            sellerName: sellerName,
            buyerName: buyerName
        }
        
        try {
            const response = await createChat(chat)
            chatId = response.data.chatId
        } catch (error) {
            throw new Error('There was an error while creating chat: ' + error.response)
        }
    }

    // Send the purchase notification to the chat
    try {
        const message = "{'type':'purchase','amount':" + amount + ", 'itemId':'" + itemId + "'}"
        const response = await sendMessage(chatId, message)
        return response
    } catch (error) {
        throw new Error('There was an error while sending purchase notification: ' + error.response)
    }
}

/**
 * Sends a bid notification to the given chatId
 * @param {string} sellerName - The username of the seller
 * @param {string} buyerName - The username of the buyer
 * @param {number} amount - The amount of the transaction
 * @param {string} itemId - The id of the item being bid on
 * @returns {Promise} - Promise object represents the response from the server
 */
export async function sendBidNotification(sellerName, buyerName, bidId, amount, itemId) {
    // Check if a chat already exists between the two users
    const chats = await fetchChats(buyerName)
    let chatId = null

    for (let i = 0; i < chats.data.length; i++) {
        if (chats.data[i].sellerName === sellerName || chats.data[i].buyerName === sellerName) {
            chatId = chats.data[i].chatId
            break
        }
    }

    // If a chat does not exist, create one
    if (chatId === null) {
        const chat = {
            sellerName: sellerName,
            buyerName: buyerName
        }
        
        try {
            const response = await createChat(chat)
            chatId = response.data.chatId
        } catch (error) {
            throw new Error('There was an error while creating chat: ' + error.response)
        }
    }

    // Send the purchase notification to the chat
    try {
        const message = "{'type':'bid','amount':" + amount + ",'bidId':'" + bidId + "','itemId':'"+ itemId + "', 'buyerName':'" + buyerName + "'}"
        const response = await sendMessage(chatId, message)
        return response
    } catch (error) {
        throw new Error('There was an error while sending purchase notification: ' + error.response)
    }
}

export async function sendAcceptBidNotification(sellerName, buyerName, bidId, amount, itemId) {
    // Check if a chat already exists between the two users
    const chats = await fetchChats(buyerName)
    let chatId = null

    for (let i = 0; i < chats.data.length; i++) {
        if (chats.data[i].sellerName === sellerName || chats.data[i].buyerName === sellerName) {
            chatId = chats.data[i].chatId
            break
        }
    }

    // If a chat does not exist, create one
    if (chatId === null) {
        const chat = {
            sellerName: sellerName,
            buyerName: buyerName
        }
        
        try {
            const response = await createChat(chat)
            chatId = response.data.chatId
        } catch (error) {
            throw new Error('There was an error while creating chat: ' + error.response)
        }
    }

    // Send the purchase notification to the chat
    try {
        const message = "{'type':'acceptance','amount':" + amount + ",'bidId':'" + bidId + "','itemId':'" + itemId + "'}"
        const response = await sendMessage(chatId, message)
        return response
    } catch (error) {
        throw new Error('There was an error while sending purchase notification: ' + error.response)
    }
}

export async function sendDeclineBidNotification(sellerName, buyerName, bidId, amount, itemId) {
    // Check if a chat already exists between the two users
    const chats = await fetchChats(buyerName)
    let chatId = null

    for (let i = 0; i < chats.data.length; i++) {
        if (chats.data[i].sellerName === sellerName || chats.data[i].buyerName === sellerName) {
            chatId = chats.data[i].chatId
            break
        }
    }

    // If a chat does not exist, create one
    if (chatId === null) {
        const chat = {
            sellerName: sellerName,
            buyerName: buyerName
        }
        
        try {
            const response = await createChat(chat)
            chatId = response.data.chatId
        } catch (error) {
            throw new Error('There was an error while creating chat: ' + error.response)
        }
    }

    // Send the purchase notification to the chat
    try {
        const message = "{'type':'decline','amount':" + amount + ",'bidId':'" + bidId + "','itemId':'" + itemId + "'}"
        const response = await sendMessage(chatId, message)
        return response
    } catch (error) {
        throw new Error('There was an error while sending purchase notification: ' + error.response)
    }
}

/**
 * Deletes the message with the given messageId
 * @param {*} messageId  - The id of the message to be deleted
 * @returns {Promise} - Promise object represents the response from the server
 */
export async function closeMessage(messageId) {
    try {
        console.log('Closing message with id: ' + messageId)
        const response = await apiClient.put('messages/close/' + messageId, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + useUserStore().userToken
            }
        })
        return response
    } catch (error) {
        throw new Error('There was an error while deleting message: ' + error.response)
    }
}
