<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Page Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Wiadomości
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
              Zarządzaj swoimi konwersacjami
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        <!-- Conversations List -->
        <div class="lg:col-span-1 card p-0 overflow-hidden">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Konwersacje
            </h2>
          </div>
          
          <div class="overflow-y-auto h-full">
            <!-- Loading -->
            <div v-if="isLoadingConversations" class="flex justify-center items-center py-8">
              <SimpleIcon name="mdi:loading" class="w-6 h-6 animate-spin text-blue-600" />
            </div>

            <!-- Empty state -->
            <div v-else-if="conversations.length === 0" class="text-center py-12 px-4">
              <SimpleIcon name="mdi:message-outline" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Brak konwersacji
              </h3>
              <p class="text-gray-500 dark:text-gray-400 text-sm">
                Zacznij rozmowę kontaktując się ze sprzedawcą na stronie produktu
              </p>
              <NuxtLink to="/produkty" class="btn-primary mt-4 inline-block">
                Przeglądaj produkty
              </NuxtLink>
            </div>

            <!-- Conversations -->
            <div v-else>
              <div
                v-for="conversation in conversations"
                :key="conversation.id"
                class="border-b border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                :class="{ 'bg-blue-50 dark:bg-blue-900/20': activeConversation?.id === conversation.id }"
                @click="selectConversation(conversation)"
              >
                <div class="flex items-center space-x-3">
                  <div class="relative">
                    <img
                      :src="conversation.otherUser.avatar || '/api/placeholder/40/40'"
                      :alt="conversation.otherUser.username"
                      class="w-10 h-10 rounded-full"
                    >
                    <div
                      v-if="conversation.unreadCount > 0"
                      class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                    >
                      {{ conversation.unreadCount > 9 ? '9+' : conversation.unreadCount }}
                    </div>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-start">
                      <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {{ conversation.otherUser.username }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatTime(conversation.lastMessage?.createdAt) }}
                      </p>
                    </div>
                    
                    <p class="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                      {{ conversation.lastMessage?.content || 'Brak wiadomości' }}
                    </p>
                    
                    <div v-if="conversation.product" class="flex items-center mt-2 text-xs text-gray-500">
                      <SimpleIcon name="mdi:package-variant" class="w-3 h-3 mr-1" />
                      {{ conversation.product.title }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="lg:col-span-2 card p-0 overflow-hidden flex flex-col">
          <!-- No conversation selected -->
          <div v-if="!activeConversation" class="flex-1 flex items-center justify-center">
            <div class="text-center">
              <SimpleIcon name="mdi:chat-outline" class="w-20 h-20 text-gray-400 mx-auto mb-4" />
              <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Wybierz konwersację
              </h3>
              <p class="text-gray-500 dark:text-gray-400">
                Kliknij na konwersację z lewej strony, aby zobaczyć wiadomości
              </p>
            </div>
          </div>

          <!-- Active conversation -->
          <template v-else>
            <!-- Chat Header -->
            <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div class="flex items-center space-x-3">
                <img
                  :src="activeConversation.otherUser.avatar || '/api/placeholder/40/40'"
                  :alt="activeConversation.otherUser.username"
                  class="w-10 h-10 rounded-full"
                >
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900 dark:text-white">
                    {{ activeConversation.otherUser.username }}
                  </h3>
                  <p v-if="activeConversation.product" class="text-sm text-gray-500 dark:text-gray-400">
                    Dotyczące: {{ activeConversation.product.title }}
                  </p>
                </div>
                
                <button
                  v-if="activeConversation.product"
                  @click="goToProduct(activeConversation.product.id)"
                  class="btn-secondary text-sm"
                >
                  Zobacz produkt
                </button>
              </div>
            </div>

            <!-- Messages -->
            <div class="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900" ref="messagesContainer">
              <!-- Loading messages -->
              <div v-if="isLoadingMessages" class="flex justify-center py-4">
                <SimpleIcon name="mdi:loading" class="w-6 h-6 animate-spin text-blue-600" />
              </div>

              <!-- Messages -->
              <div v-else class="space-y-4">
                <div
                  v-for="message in messages"
                  :key="message.id"
                  class="flex"
                  :class="message.senderId === user?.id ? 'justify-end' : 'justify-start'"
                >
                  <div
                    class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg"
                    :class="message.senderId === user?.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'"
                  >
                    <p class="text-sm">{{ message.content }}</p>
                    <div class="flex items-center justify-between mt-1">
                      <p 
                        class="text-xs"
                        :class="message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'"
                      >
                        {{ formatTime(message.createdAt) }}
                      </p>
                      <div
                        v-if="message.senderId === user?.id"
                        class="text-xs text-blue-100"
                      >
                        <SimpleIcon 
                          :name="message.isRead ? 'mdi:check-all' : 'mdi:check'"
                          class="w-3 h-3"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Empty messages -->
                <div v-if="messages.length === 0" class="text-center py-8">
                  <p class="text-gray-500 dark:text-gray-400">
                    Brak wiadomości w tej konwersacji
                  </p>
                </div>
              </div>
            </div>

            <!-- Message Input -->
            <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <form @submit.prevent="sendMessage" class="flex space-x-2">
                <input
                  v-model="newMessage"
                  type="text"
                  placeholder="Napisz wiadomość..."
                  class="form-input flex-1"
                  :disabled="isSending"
                >
                <button
                  type="submit"
                  :disabled="!newMessage.trim() || isSending"
                  class="btn-primary"
                >
                  <SimpleIcon 
                    v-if="isSending" 
                    name="mdi:loading" 
                    class="w-5 h-5 animate-spin" 
                  />
                  <SimpleIcon v-else name="mdi:send" class="w-5 h-5" />
                </button>
              </form>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { useNotificationStore } from '~/stores/notifications'

interface User {
  id: string
  username: string
  avatar?: string
}

interface Product {
  id: string
  title: string
}

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  productId?: string
  isRead: boolean
  createdAt: string
}

interface Conversation {
  id: string
  otherUser: User
  product?: Product
  lastMessage?: Message
  unreadCount: number
}

// Meta tags
useHead({
  title: 'Wiadomości - BruktMarked',
  meta: [
    { name: 'description', content: 'Zarządzaj swoimi konwersacjami na BruktMarked' }
  ]
})

// Stores
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const { user } = storeToRefs(authStore)

// Redirect if not logged in
if (!authStore.isAuthenticated) {
  throw createError({
    statusCode: 401,
    statusMessage: 'Musisz być zalogowany, aby zobaczyć wiadomości'
  })
}

// State
const conversations = ref<Conversation[]>([])
const activeConversation = ref<Conversation | null>(null)
const messages = ref<Message[]>([])
const newMessage = ref('')
const isLoadingConversations = ref(true)
const isLoadingMessages = ref(false)
const isSending = ref(false)
const messagesContainer = ref<HTMLElement>()

// Methods
const loadConversations = async () => {
  isLoadingConversations.value = true
  try {
    const data = await $fetch<Conversation[]>('/api/messages/conversations', {
      headers: authStore.token ? {
        Authorization: `Bearer ${authStore.token}`
      } : {}
    })
    conversations.value = data || []
  } catch (error) {
    console.error('Failed to load conversations:', error)
    notificationStore.error('Błąd', 'Nie udało się załadować konwersacji')
  } finally {
    isLoadingConversations.value = false
  }
}

const selectConversation = async (conversation: Conversation) => {
  activeConversation.value = conversation
  await loadMessages(conversation)
}

const loadMessages = async (conversation: Conversation) => {
  if (!conversation) return
  
  isLoadingMessages.value = true
  try {
    const params = new URLSearchParams()
    params.append('otherUserId', conversation.otherUser.id)
    if (conversation.product?.id) {
      params.append('productId', conversation.product.id)
    }

    const data = await $fetch<Message[]>(`/api/messages/list?${params}`, {
      headers: authStore.token ? {
        Authorization: `Bearer ${authStore.token}`
      } : {}
    })
    
    messages.value = data || []
    
    // Mark messages as read
    const unreadMessageIds = messages.value
      .filter(msg => msg.receiverId === user.value?.id && !msg.isRead)
      .map(msg => msg.id)
    
    if (unreadMessageIds.length > 0) {
      await markMessagesAsRead(unreadMessageIds)
    }
    
    // Update conversation unread count
    conversation.unreadCount = 0
    
    // Scroll to bottom
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('Failed to load messages:', error)
    notificationStore.error('Błąd', 'Nie udało się załadować wiadomości')
  } finally {
    isLoadingMessages.value = false
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !activeConversation.value || !user.value) return
  
  isSending.value = true
  try {
    const message = await $fetch<Message>('/api/messages/send', {
      method: 'POST',
      headers: authStore.token ? {
        Authorization: `Bearer ${authStore.token}`
      } : {},
      body: {
        content: newMessage.value.trim(),
        receiverId: activeConversation.value.otherUser.id,
        productId: activeConversation.value.product?.id
      }
    })
    
    messages.value.push(message)
    newMessage.value = ''
    
    // Update conversation last message
    activeConversation.value.lastMessage = message
    
    // Scroll to bottom
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('Failed to send message:', error)
    notificationStore.error('Błąd', 'Nie udało się wysłać wiadomości')
  } finally {
    isSending.value = false
  }
}

const markMessagesAsRead = async (messageIds: string[]) => {
  try {
    await $fetch('/api/messages/mark-read', {
      method: 'POST',
      headers: authStore.token ? {
        Authorization: `Bearer ${authStore.token}`
      } : {},
      body: { messageIds }
    })
    
    // Update local messages
    messages.value.forEach(msg => {
      if (messageIds.includes(msg.id)) {
        msg.isRead = true
      }
    })
  } catch (error) {
    console.error('Failed to mark messages as read:', error)
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const goToProduct = (productId: string) => {
  navigateTo(`/produkt/${productId}`)
}

const formatTime = (dateString?: string) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffMinutes < 1) return 'Teraz'
  if (diffMinutes < 60) return `${diffMinutes}m`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`
  
  return date.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit'
  })
}

// Load conversations on mount
onMounted(() => {
  loadConversations()
})

// Auto-scroll to bottom when new messages arrive
watch(messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
})
</script>