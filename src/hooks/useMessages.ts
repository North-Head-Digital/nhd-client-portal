import { useState, useEffect, useCallback, useRef } from 'react'
import { API_URL } from '../utils/apiConfig'

export interface Message {
  _id: string
  subject: string
  content: string
  senderName: string
  createdAt: string
  isRead: boolean
  priority: string
  category: string
  replies?: Array<{
    content: string
    senderName: string
    createdAt: string
  }>
}

interface UseMessagesOptions {
  pollingInterval?: number // in milliseconds
  autoRefresh?: boolean
}

export function useMessages(options: UseMessagesOptions = {}) {
  const { pollingInterval = 10000, autoRefresh = true } = options
  
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isFetchingRef = useRef(false)

  const fetchMessages = useCallback(async (showLoading = true) => {
    // Prevent concurrent fetches
    if (isFetchingRef.current) return
    
    isFetchingRef.current = true
    if (showLoading) setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('nhd_auth_token')
      const response = await fetch(`${API_URL}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
        
        // Calculate unread count
        const unread = data.messages.filter((msg: Message) => !msg.isRead).length
        setUnreadCount(unread)
      } else {
        setError('Failed to fetch messages')
      }
    } catch (err) {
      setError('Error fetching messages')
      console.error('Error fetching messages:', err)
    } finally {
      setLoading(false)
      isFetchingRef.current = false
    }
  }, [])

  const sendMessage = useCallback(async (messageData: {
    subject: string
    content: string
    priority: string
    category: string
  }) => {
    try {
      const token = localStorage.getItem('nhd_auth_token')
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      })
      
      if (response.ok) {
        // Optimistically add to messages or refetch
        await fetchMessages(false)
        return { success: true }
      } else {
        const errorData = await response.json()
        return { success: false, error: errorData.error || 'Failed to send message' }
      }
    } catch (err) {
      console.error('Error sending message:', err)
      return { success: false, error: 'Error sending message' }
    }
  }, [fetchMessages])

  const replyToMessage = useCallback(async (messageId: string, content: string) => {
    try {
      const token = localStorage.getItem('nhd_auth_token')
      const response = await fetch(`${API_URL}/messages/${messageId}/reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      })
      
      if (response.ok) {
        await fetchMessages(false)
        return { success: true }
      } else {
        return { success: false, error: 'Failed to send reply' }
      }
    } catch (err) {
      console.error('Error sending reply:', err)
      return { success: false, error: 'Error sending reply' }
    }
  }, [fetchMessages])

  const markAsRead = useCallback(async (messageId: string) => {
    try {
      const token = localStorage.getItem('nhd_auth_token')
      
      // Optimistic update
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? { ...msg, isRead: true } : msg
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
      
      const response = await fetch(`${API_URL}/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        // Revert on error
        await fetchMessages(false)
      }
    } catch (err) {
      console.error('Error marking message as read:', err)
      // Revert on error
      await fetchMessages(false)
    }
  }, [fetchMessages])

  // Initial fetch
  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  // Set up polling
  useEffect(() => {
    if (!autoRefresh) return

    pollingIntervalRef.current = setInterval(() => {
      fetchMessages(false) // Don't show loading state on polls
    }, pollingInterval)

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [autoRefresh, pollingInterval, fetchMessages])

  return {
    messages,
    loading,
    error,
    unreadCount,
    fetchMessages,
    sendMessage,
    replyToMessage,
    markAsRead
  }
}
