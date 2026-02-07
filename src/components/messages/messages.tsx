import { useState, useEffect } from 'react'
import { API_URL } from '../../utils/apiconfig'
import logger from '../../utils/logger'
import { 
  MessageSquare, 
  Send, 
  Search,
  AlertCircle,
  User
} from 'lucide-react'

interface Message {
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

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-800'
    case 'high':
      return 'bg-orange-100 text-orange-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'low':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'project-update':
      return <MessageSquare className="h-4 w-4 text-blue-600" />
    case 'question':
      return <MessageSquare className="h-4 w-4 text-green-600" />
    case 'feedback':
      return <MessageSquare className="h-4 w-4 text-purple-600" />
    case 'urgent':
      return <AlertCircle className="h-4 w-4 text-red-600" />
    default:
      return <MessageSquare className="h-4 w-4 text-gray-600" />
  }
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)
  const [newMessage, setNewMessage] = useState({
    subject: '',
    content: '',
    priority: 'medium',
    category: 'general'
  })
  const [replyContent, setReplyContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchMessages = async () => {
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
        } else {
          logger.error('Failed to fetch messages', new Error(`HTTP ${response.status}`))
        }
      } catch (error) {
        logger.error('Error fetching messages', error as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.senderName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === 'all' || message.priority === filterPriority
    
    return matchesSearch && matchesPriority
  })

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const token = localStorage.getItem('nhd_auth_token')
      const response = await fetch(`${API_URL}/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        setMessages(messages.map(msg => 
          msg._id === messageId ? { ...msg, isRead: true } : msg
        ))
      }
    } catch (error) {
      logger.error('Error marking message as read', error as Error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.subject || !newMessage.content) return

    setSubmitting(true)
    try {
      const token = localStorage.getItem('nhd_auth_token')
      logger.debug('Sending message', { hasToken: !!token })
      
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMessage)
      })
      
      
      if (response.ok) {
        const responseData = await response.json()
        logger.info('Message sent successfully', { messageId: responseData.message?._id })
        setShowNewMessageModal(false)
        setNewMessage({
          subject: '',
          content: '',
          priority: 'medium',
          category: 'general'
        })
        // Refresh messages
        const messagesResponse = await fetch(`${API_URL}/messages`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        if (messagesResponse.ok) {
          const data = await messagesResponse.json()
          setMessages(data.messages)
        }
        alert('Message sent successfully!')
      } else {
        const errorData = await response.json()
        logger.error('Failed to send message', new Error(errorData.error || 'Unknown error'))
        alert(`Failed to send message: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      logger.error('Error sending message', error as Error)
      alert(`Error sending message: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleReplyToMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMessage || !replyContent.trim()) return

    setSubmitting(true)
    try {
      const token = localStorage.getItem('nhd_auth_token')
      const response = await fetch(`${API_URL}/messages/${selectedMessage._id}/reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: replyContent })
      })
      
      if (response.ok) {
        setReplyContent('')
        // Refresh messages
        const messagesResponse = await fetch(`${API_URL}/messages`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        if (messagesResponse.ok) {
          const data = await messagesResponse.json()
          setMessages(data.messages)
        }
        alert('Reply sent successfully!')
      } else {
        logger.error('Failed to send reply', new Error(`HTTP ${response.status}`))
        alert('Failed to send reply. Please try again.')
      }
    } catch (error) {
      logger.error('Error sending reply', error as Error)
      alert('Error sending reply. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600">Loading your messages...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Communicate with your project team</p>
        </div>
        <button 
          onClick={() => setShowNewMessageModal(true)}
          className="btn-primary"
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          New Message
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="card p-12 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
          <p className="text-gray-600 mb-4">Your project team will send you updates and messages here.</p>
          <button 
            onClick={() => setShowNewMessageModal(true)}
            className="btn-primary"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Send Message
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <div
              key={message._id}
              className={`card p-6 cursor-pointer hover:shadow-md transition-shadow ${
                !message.isRead ? 'border-l-4 border-l-primary-600' : ''
              }`}
              onClick={() => {
                setSelectedMessage(message)
                if (!message.isRead) {
                  handleMarkAsRead(message._id)
                }
              }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getCategoryIcon(message.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-medium ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                      {message.subject}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                        {message.priority}
                      </span>
                      {!message.isRead && (
                        <span className="bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    From {message.senderName} • {formatDate(message.createdAt)}
                  </p>
                  <p className="text-gray-700 mt-2 line-clamp-2">
                    {message.content}
                  </p>
                  {message.replies && message.replies.length > 0 && (
                    <p className="text-sm text-primary-600 mt-2">
                      {message.replies.length} reply{message.replies.length !== 1 ? 'ies' : 'y'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedMessage.subject}</h2>
                <p className="text-gray-600">
                  From {selectedMessage.senderName} • {formatDate(selectedMessage.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Message Content */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-900">{selectedMessage.senderName}</span>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedMessage.priority)}`}>
                    {selectedMessage.priority}
                  </span>
                </div>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>
              </div>

              {/* Replies */}
              {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Replies</h3>
                  <div className="space-y-4">
                    {selectedMessage.replies.map((reply, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{reply.senderName}</span>
                          <span className="text-sm text-gray-500">{formatDate(reply.createdAt)}</span>
                        </div>
                        <p className="text-gray-700">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply Form */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Reply to Message</h3>
                <form onSubmit={handleReplyToMessage} className="space-y-4">
                  <div>
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Type your reply..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={4}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMessage(null)
                        setReplyContent('')
                      }}
                      className="btn-secondary"
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Reply
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Send Message to Admin</h2>
              <button
                onClick={() => setShowNewMessageModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-6">
              <div>
                <label className="label">Subject</label>
                <input
                  type="text"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                  className="input"
                  placeholder="Enter message subject"
                  required
                />
              </div>

              <div>
                <label className="label">Message Content</label>
                <textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                  className="input"
                  rows={6}
                  placeholder="Type your message here..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Priority</label>
                  <select
                    value={newMessage.priority}
                    onChange={(e) => setNewMessage({...newMessage, priority: e.target.value})}
                    className="input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="label">Category</label>
                  <select
                    value={newMessage.category}
                    onChange={(e) => setNewMessage({...newMessage, category: e.target.value})}
                    className="input"
                  >
                    <option value="general">General</option>
                    <option value="project-update">Project Update</option>
                    <option value="question">Question</option>
                    <option value="feedback">Feedback</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewMessageModal(false)}
                  className="btn-secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}