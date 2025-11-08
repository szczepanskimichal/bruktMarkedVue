import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'

interface ChatUser {
  userId: string
  username: string
  avatar?: string
  productId?: string
}

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  productId?: string
  createdAt: string
  isRead: boolean
}

export const useChatStore = defineStore('chat', () => {
  const isOpen = ref(false)
  const activeChat = ref<ChatUser | null>(null)
  const messages = ref<Message[]>([])
  const isLoading = ref(false)

  // Open chat with user
  const openChat = (user: ChatUser) => {
    activeChat.value = user
    isOpen.value = true
    loadMessages(user.userId, user.productId)
  }

  // Close chat
  const closeChat = () => {
    isOpen.value = false
    activeChat.value = null
    messages.value = []
  }

  // Load messages
  const loadMessages = async (userId: string, productId?: string) => {
    isLoading.value = true
    try {
      const params = new URLSearchParams({ otherUserId: userId })
      if (productId) params.append('productId', productId)
      
      // Get auth token from authStore
      const { useAuthStore } = await import('~/stores/auth')
      const authStore = useAuthStore()
      
      const data = await $fetch<Message[]>(`/api/messages/list?${params}`, {
        headers: authStore.token ? {
          Authorization: `Bearer ${authStore.token}`
        } : {}
      })
      messages.value = data
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Send message
  const sendMessage = async (content: string) => {
    if (!activeChat.value) return

    try {
      // Get auth token from authStore
      const { useAuthStore } = await import('~/stores/auth')
      const authStore = useAuthStore()
      
      const message = await $fetch<Message>('/api/messages/send', {
        method: 'POST',
        headers: authStore.token ? {
          Authorization: `Bearer ${authStore.token}`
        } : {},
        body: {
          content,
          receiverId: activeChat.value.userId,
          productId: activeChat.value.productId
        }
      })

      messages.value.push(message)
    } catch (error) {
      console.error('Failed to send message:', error)
      throw error
    }
  }

  // Mark messages as read
  const markAsRead = async (messageIds: string[]) => {
    try {
      await $fetch('/api/messages/mark-read', {
        method: 'POST',
        body: { messageIds }
      })

      // Update local state
      messages.value.forEach(msg => {
        if (messageIds.includes(msg.id)) {
          msg.isRead = true
        }
      })
    } catch (error) {
      console.error('Failed to mark messages as read:', error)
    }
  }

  return {
    isOpen: readonly(isOpen),
    activeChat: readonly(activeChat),
    messages: readonly(messages),
    isLoading: readonly(isLoading),
    openChat,
    closeChat,
    loadMessages,
    sendMessage,
    markAsRead
  }
})