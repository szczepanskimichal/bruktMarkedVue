<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-hidden" @click.self="closeChat">
      <div class="absolute inset-0 bg-black bg-opacity-50" />
      <div class="absolute bottom-4 right-4 w-[700px] h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex">
        <!-- Conversations List -->
        <div class="w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Konwersacje</h2>
          </div>
          <div>
            <div v-for="conv in conversations" :key="conv.id" class="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              :class="{ 'bg-blue-50 dark:bg-blue-900/20': activeChat?.userId === conv.otherUser.id }"
              @click="selectConversation(conv)">
              <div class="flex items-center space-x-3">
                <img :src="conv.otherUser.avatar || '/api/placeholder/40/40'" :alt="conv.otherUser.username" class="w-8 h-8 rounded-full" />
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ conv.otherUser.username }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(conv.lastMessage?.createdAt) }}</p>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">{{ conv.lastMessage?.content || 'Brak wiadomości' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Chat Area -->
        <div class="flex-1 flex flex-col">
          <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-3">
              <img :src="activeChat?.avatar || '/api/placeholder/32/32'" :alt="activeChat?.username" class="w-8 h-8 rounded-full" />
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">{{ activeChat?.username }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">Online</p>
              </div>
            </div>
            <button @click="closeChat" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <SimpleIcon name="mdi:close" class="w-5 h-5" />
            </button>
          </div>
          <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
            <div v-for="message in messages" :key="message.id" class="flex" :class="message.senderId === currentUserId ? 'justify-end' : 'justify-start'">
              <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg" :class="message.senderId === currentUserId ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'">
                <p class="text-sm">{{ message.content }}</p>
                <p class="text-xs opacity-75 mt-1">{{ formatTime(message.createdAt) }}</p>
              </div>
            </div>
            <div v-if="isLoading" class="flex justify-center">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          </div>
          <div class="p-4 border-t border-gray-200 dark:border-gray-700">
            <form @submit.prevent="sendMessage" class="flex space-x-2">
              <input v-model="newMessage" type="text" placeholder="Napisz wiadomość..." class="flex-1 form-input text-sm" :disabled="isLoading" />
              <button type="submit" :disabled="!newMessage.trim() || isLoading" class="btn-primary px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <SimpleIcon name="mdi:send" class="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '~/stores/chat'
import { useAuthStore } from '~/stores/auth'

const chatStore = useChatStore()
const authStore = useAuthStore()
const { isOpen, activeChat, messages, isLoading } = storeToRefs(chatStore)
const { user } = storeToRefs(authStore)

const newMessage = ref('')
const messagesContainer = ref<HTMLElement>()
const currentUserId = computed(() => user.value?.id)

const conversations = ref<any[]>([])

const loadConversations = async () => {
  try {
    const data = await $fetch<any[]>('/api/messages/conversations', {
      headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}
    })
    conversations.value = data || []
  } catch (error) {
    // handle error
  }
}


const selectConversation = (conv: any) => {
  chatStore.openChat({
    userId: conv.otherUser.id,
    username: conv.otherUser.username,
    avatar: conv.otherUser.avatar,
    productId: conv.product?.id
  })
}

// Automatyczne przełączanie na czat z wybranym użytkownikiem po otwarciu z produktu
watch(() => chatStore.activeChat, (newChat) => {
  if (!newChat?.userId) return
  // Szukaj konwersacji z tym userem
  const found = conversations.value.find(
    c => c.otherUser.id === newChat.userId && (newChat.productId ? c.product?.id === newChat.productId : true)
  )
  if (found) {
    selectConversation(found)
  } else {
    // Jeśli nie ma konwersacji, utwórz tymczasową
    conversations.value.unshift({
      id: `new-${newChat.userId}`,
      otherUser: {
        id: newChat.userId,
        username: newChat.username,
        avatar: newChat.avatar
      },
      product: newChat.productId ? { id: newChat.productId } : undefined,
      lastMessage: null,
      unreadCount: 0
    })
  }
}, { immediate: true })

const closeChat = () => {
  chatStore.closeChat()
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return
  try {
    await chatStore.sendMessage(newMessage.value.trim())
    newMessage.value = ''
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  } catch (error) {}
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
}

watch(messages, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}, { deep: true })

onMounted(() => {
  loadConversations()
})
</script>
