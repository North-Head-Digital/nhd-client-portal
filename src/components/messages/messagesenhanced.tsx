import { useState, useEffect } from 'react'
import { useMessages } from '../../hooks/usemessages'
import { useToast } from '../common/toastcontainer'
import { 
  MessageSquare, 
  Send, 
  Search,
  AlertCircle,
  User,
  RefreshCw,
  Clock,
  CheckCheck,
  TrendingUp
} from 'lucide-react'
import { getErrorMessage, ErrorMessage } from '../../utils/errormessages'
import ErrorDisplay from '../common/errordisplay'

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
      return 'bg-red-100 text-red-800 border-red-300'
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-300'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'low':
      return 'bg-green-100 text-green-800 border-green-300'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'project-update':
      return <TrendingUp className="h-4 w-4 text-blue-600" />
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

export default function MessagesEnhanced() {
  const { 
    messages, 
    loading, 
    error, 
    unreadCount,
    fetchMessages, 
    sendMessage, 
    replyToMessage, 
    markAsRead 
  } = useMessages({ pollingInterval: 10000, autoRefresh: true })
  
  const { showToast } = useToast()
  
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)
  const [newMessage, setNewMessage] = useState({
    subject: '',
    content: '',
    priority: 'medium',
    category: 'general'
  })
  const [replyContent, setReplyContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [uiError, setUiError] = useState<ErrorMessage | null>(null)

  // Update last refresh time when messages change
  useEffect(() => {
    if (!loading && messages.length > 0) {
      setLastRefresh(new Date())
    }
  }, [messages, loading])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatLastRefresh = () => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - lastRefresh.getTime()) / 1000)
    
    if (diffInSeconds < 10) return 'just now'
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    return `${diffInMinutes}m ago`
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.senderName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === 'all' || message.priority === filterPriority
    const matchesCategory = filterCategory === 'all' || message.category === filterCategory
    
    return matchesSearch && matchesPriority && matchesCategory
  })

  const handleManualRefresh = async () => {
    setRefreshing(true)
    await fetchMessages(false)
    showToast('Messages refreshed', 'success')
    setRefreshing(false)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.subject || !newMessage.content) {
      setUiError(getErrorMessage(new Error('Required fields missing'), 'message'))
      return
    }

    setSubmitting(true)
    setUiError(null)
    
    try {
      const result = await sendMessage(newMessage)
      
      if (result.success) {
        showToast('Message sent successfully! 🎉', 'success')
        setShowNewMessageModal(false)
        setNewMessage({
          subject: '',
          content: '',
          priority: 'medium',
          category: 'general'
        })
      } else {
        const errorMessage = getErrorMessage(new Error(result.error || 'Failed to send message'), 'message')
        setUiError(errorMessage)
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error as Error, 'message')
      setUiError(errorMessage)
    }
    
    setSubmitting(false)
  }

  const handleReplyToMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMessage || !replyContent.trim()) {
      showToast('Please enter a reply message', 'warning')
      return
    }

    setSubmitting(true)
    const result = await replyToMessage(selectedMessage._id, replyContent)
    
    if (result.success) {
      showToast('Reply sent successfully! 💬', 'success')
      setReplyContent('')
      
      // Update the selected message with the new reply locally for instant feedback
      const updatedMessages = messages.map(msg => 
        msg._id === selectedMessage._id 
          ? { 
              ...msg, 
              replies: [
                ...(msg.replies || []), 
                { 
                  content: replyContent, 
                  senderName: 'You', 
                  createdAt: new Date().toISOString() 
                }
              ] 
            } 
          : msg
      )
      
      // Find and set the updated message
      const updatedMessage = updatedMessages.find(msg => msg._id === selectedMessage._id)
      if (updatedMessage) {
        setSelectedMessage(updatedMessage)
      }
    } else {
      showToast(result.error || 'Failed to send reply', 'error')
    }
    
    setSubmitting(false)
  }

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message)
    if (!message.isRead) {
      markAsRead(message._id)
    }
  }

  if (loading && messages.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600">Loading your messages...</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Unread Badge and Refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              {unreadCount > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-primary-600 text-white animate-pulse">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-gray-600">Communicate with your project team</p>
              <span className="text-xs text-gray-400 flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Updated {formatLastRefresh()}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="btn-secondary flex items-center"
            title="Refresh messages"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setShowNewMessageModal(true)}
            className="btn-primary"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            New Message
          </button>
        </div>
      </div>

      {/* Error Display */}
      <ErrorDisplay 
        error={uiError} 
        onDismiss={() => setUiError(null)} 
        className="mb-4"
      />

      {/* Enhanced Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">🔴 Urgent</option>
              <option value="high">🟠 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="project-update">Project Update</option>
              <option value="question">Question</option>
              <option value="feedback">Feedback</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="card p-12 text-center">
          <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm || filterPriority !== 'all' || filterCategory !== 'all' 
              ? 'No matching messages' 
              : 'No messages yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterPriority !== 'all' || filterCategory !== 'all'
              ? 'Try adjusting your filters or search terms'
              : 'Your project team will send you updates and messages here'}
          </p>
          {!searchTerm && filterPriority === 'all' && filterCategory === 'all' && (
            <button 
              onClick={() => setShowNewMessageModal(true)}
              className="btn-primary"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Send First Message
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((message) => (
            <div
              key={message._id}
              className={`card p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.01] ${
                !message.isRead 
                  ? 'border-l-4 border-l-primary-600 bg-gradient-to-r from-primary-50 to-white' 
                  : 'hover:border-l-4 hover:border-l-gray-300'
              }`}
              onClick={() => handleMessageClick(message)}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="relative">
                    {getCategoryIcon(message.category)}
                    {!message.isRead && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary-600 rounded-full animate-pulse"></span>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className={`text-lg font-semibold ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                      {message.subject}
                    </h3>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(message.priority)}`}>
                        {message.priority}
                      </span>
                      {!message.isRead && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-primary-600 text-white shadow-sm">
                          NEW
                        </span>
                      )}
                      {message.isRead && (
                        <CheckCheck className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <User className="h-3.5 w-3.5" />
                    <span className="font-medium">{message.senderName}</span>
                    <span>•</span>
                    <span>{formatDate(message.createdAt)}</span>
                  </div>
                  <p className="text-gray-700 line-clamp-2 mb-2">
                    {message.content}
                  </p>
                  {message.replies && message.replies.length > 0 && (
                    <div className="flex items-center space-x-2 text-sm font-medium text-primary-600">
                      <MessageSquare className="h-4 w-4" />
                      <span>{message.replies.length} {message.replies.length === 1 ? 'reply' : 'replies'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 backdrop-blur-sm transition-opacity">
          <div className="relative top-10 mx-auto p-6 border w-11/12 max-w-4xl shadow-2xl rounded-xl bg-white animate-slide-in-up mb-10">
            <div className="flex items-start justify-between mb-6 pb-4 border-b">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedMessage.subject}</h2>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(selectedMessage.priority)}`}>
                    {selectedMessage.priority}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{selectedMessage.senderName}</span>
                  <span>•</span>
                  <span className="text-sm">{formatDate(selectedMessage.createdAt)}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedMessage(null)
                  setReplyContent('')
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {/* Original Message */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="prose max-w-none">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{selectedMessage.content}</p>
                </div>
              </div>

              {/* Replies */}
              {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-primary-600" />
                    Replies ({selectedMessage.replies.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedMessage.replies.map((reply, index) => (
                      <div 
                        key={index} 
                        className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-blue-100 shadow-sm animate-fade-in"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900 flex items-center">
                            <User className="h-4 w-4 mr-1.5 text-blue-600" />
                            {reply.senderName}
                          </span>
                          <span className="text-sm text-gray-500">{formatDate(reply.createdAt)}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reply Form */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Send className="h-5 w-5 mr-2 text-primary-600" />
                Reply to Message
              </h3>
              <form onSubmit={handleReplyToMessage} className="space-y-4">
                <div>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Type your reply here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
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
                    Close
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={submitting || !replyContent.trim()}
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
      )}

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 backdrop-blur-sm transition-opacity">
          <div className="relative top-20 mx-auto p-6 border w-11/12 max-w-2xl shadow-2xl rounded-xl bg-white animate-slide-in-up mb-10">
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <MessageSquare className="h-7 w-7 mr-3 text-primary-600" />
                Send New Message
              </h2>
              <button
                onClick={() => setShowNewMessageModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-5">
              <div>
                <label className="label">Subject *</label>
                <input
                  type="text"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                  className="input"
                  placeholder="Enter message subject"
                  required
                  maxLength={200}
                />
              </div>

              <div>
                <label className="label">Message Content *</label>
                <textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                  className="input resize-none"
                  rows={6}
                  placeholder="Type your message here..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Priority *</label>
                  <select
                    value={newMessage.priority}
                    onChange={(e) => setNewMessage({...newMessage, priority: e.target.value})}
                    className="input"
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🟠 High</option>
                    <option value="urgent">🔴 Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="label">Category *</label>
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

              <div className="flex justify-end space-x-3 pt-4 border-t">
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
                      <Send className="h-4 w-4 mr-2" />
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
