import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])

  const add = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification = { ...notification, id }
    
    notifications.value.push(newNotification)

    // Auto remove after duration
    const duration = notification.duration || 5000
    setTimeout(() => {
      remove(id)
    }, duration)

    return id
  }

  const remove = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clear = () => {
    notifications.value = []
  }

  // Helper methods
  const success = (title: string, message?: string) => {
    return add({ type: 'success', title, message })
  }

  const error = (title: string, message?: string) => {
    return add({ type: 'error', title, message })
  }

  const warning = (title: string, message?: string) => {
    return add({ type: 'warning', title, message })
  }

  const info = (title: string, message?: string) => {
    return add({ type: 'info', title, message })
  }

  return {
    notifications: readonly(notifications),
    add,
    remove,
    clear,
    success,
    error,
    warning,
    info
  }
})