export interface User {
  id: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  city?: string
  avatar?: string
  isAdmin: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  category: string
  size?: string
  condition: string
  color?: string
  brand?: string
  images: readonly string[]
  status: string
  views: number
  createdAt: string
  updatedAt: string
  sellerId: string
  seller: {
    id: string
    username: string
    firstName?: string
    lastName?: string
    avatar?: string
  }
  _count: {
    likes: number
  }
}

export interface CreateProductData {
  title: string
  description: string
  price: number
  category: string
  size?: string
  condition: string
  color?: string
  brand?: string
  images?: string[]
}

export interface ProductFilters {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  productId?: string
  isRead: boolean
  createdAt: string
}

export interface Conversation {
  id: string
  otherUser: {
    id: string
    username: string
    avatar?: string
  }
  product?: {
    id: string
    title: string
  }
  lastMessage?: Message
  unreadCount: number
}