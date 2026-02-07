import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/authcontext'
import { API_URL } from '../../utils/apiconfig'
import logger from '../../utils/logger'
import {
  Calendar,
  DollarSign,
  TrendingUp,
  FolderOpen,
  MessageSquare,
  Sparkles,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface Project {
  _id: string
  name: string
  status: string
  progress: number
  endDate: string
  priority: string
  budget?: number
}

interface Message {
  _id: string
  subject: string
  content: string
  senderName: string
  createdAt: string
  isRead: boolean
  priority: string
}

interface DashboardStats {
  activeProjects: number
  totalMessages: number
  unreadMessages: number
  totalBudget: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalBudget: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('nhd_auth_token')
        let fetchedProjects: Project[] = []
        let fetchedMessages: Message[] = []
        
        // Fetch projects
        const projectsResponse = await fetch(`${API_URL}/projects`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json()
          fetchedProjects = projectsData.projects || []
          setProjects(fetchedProjects)
        }

        // Fetch messages
        const messagesResponse = await fetch(`${API_URL}/messages`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json()
          fetchedMessages = messagesData.messages || []
          setMessages(fetchedMessages)
        }

        // Calculate stats from fetched payloads to avoid stale state values
        const activeProjects = fetchedProjects.filter(p => p.status === 'in-progress' || p.status === 'planning').length
        const totalMessages = fetchedMessages.length
        const unreadMessages = fetchedMessages.filter(m => !m.isRead).length
        const totalBudget = fetchedProjects.reduce((sum, p) => sum + (p.budget || 0), 0)

        setStats({
          activeProjects,
          totalMessages,
          unreadMessages,
          totalBudget
        })

      } catch (error) {
        logger.error('Error fetching dashboard data', error as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'planning': return 'bg-yellow-100 text-yellow-800'
      case 'review': return 'bg-purple-100 text-purple-800'
      case 'on-hold': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Enhanced Loading Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white shadow-brand-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <div>
              <h1 className="text-2xl font-bold">Loading your dashboard...</h1>
              <p className="text-primary-100 mt-1">Fetching your latest project information</p>
            </div>
          </div>
        </div>

        {/* Loading Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-gray-200 rounded-lg loading-shimmer"></div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <div className="h-4 bg-gray-200 rounded loading-shimmer mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded loading-shimmer"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Add safety check for user object
  if (!user) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white shadow-brand-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <div>
              <h1 className="text-2xl font-bold">Loading your dashboard...</h1>
              <p className="text-primary-100 mt-1">Please wait while we load your information</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white shadow-brand-lg relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4">
            <Sparkles className="h-8 w-8 text-white animate-pulse" />
          </div>
          <div className="absolute bottom-4 left-4">
            <BarChart3 className="h-6 w-6 text-white animate-bounce-brand" />
          </div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold flex items-center space-x-2">
                <span>Welcome back, {user.name?.split(' ')[0] || 'User'}!</span>
                <Sparkles className="h-6 w-6 text-yellow-300 animate-bounce" />
              </h1>
              <p className="text-primary-100 mt-2 text-lg">
                Here's what's happening with your projects at North Head Digital.
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="text-primary-200 text-sm">{user.company || 'NHD Client'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-primary-200" />
                  <span className="text-primary-200 text-sm">{stats.activeProjects} active projects</span>
                </div>
              </div>
            </div>
          </div>
          
          {user.role === 'client' && (
            <div className="mt-4 p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
              <p className="text-primary-100 text-sm">
                💡 <strong>Quick tip:</strong> You can view your assigned projects, messages from our team, and update your profile using the navigation menu.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Projects Card */}
        <div className="card p-6 hover-lift group">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 group-hover:scale-110 transition-transform duration-300">
                <FolderOpen className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Active Projects
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.activeProjects}
                  </div>
                  <div className="ml-2 flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-600 ml-1">Active</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Messages Card */}
        <div className="card p-6 hover-lift group">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600 group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Messages
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalMessages}
                  </div>
                  {stats.unreadMessages > 0 ? (
                    <div className="ml-2 flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1"></div>
                      <span className="text-xs text-red-600 font-medium">{stats.unreadMessages} unread</span>
                    </div>
                  ) : (
                    <div className="ml-2 flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-600 ml-1">All read</span>
                    </div>
                  )}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Total Investment Card */}
        <div className="card p-6 hover-lift group">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Investment
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-bold text-gray-900">
                    ${stats.totalBudget.toLocaleString()}
                  </div>
                  <div className="ml-2 flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-600 ml-1">ROI</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Average Progress Card */}
        <div className="card p-6 hover-lift group">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Avg. Progress
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-bold text-gray-900">
                    {projects.length > 0 
                      ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
                      : 0}%
                  </div>
                  <div className="ml-2 flex items-center">
                    {projects.length > 0 && Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) > 75 ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-600 ml-1">On track</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        <span className="text-xs text-yellow-600 ml-1">Monitor</span>
                      </>
                    )}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Projects */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Your Projects</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {projects.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No projects yet</p>
            ) : (
              projects.slice(0, 4).map((project) => (
                <div key={project._id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <FolderOpen className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {project.name}
                    </p>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Progress: {project.progress}%</span>
                        <span>Due: {formatDate(project.endDate)}</span>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Messages</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No messages yet</p>
            ) : (
              messages.slice(0, 4).map((message) => (
                <div key={message._id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <MessageSquare className={`h-5 w-5 ${message.isRead ? 'text-gray-400' : 'text-primary-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {message.subject}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {message.content}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-400">
                        From {message.senderName} • {formatDate(message.createdAt)}
                      </span>
                      {!message.isRead && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="card p-8 shadow-brand">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary-500" />
            <span className="text-sm text-gray-500">Streamline your workflow</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="btn-secondary group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-center">
              <div className="p-2 rounded-lg bg-primary-100 group-hover:bg-primary-200 transition-colors mr-3">
                <MessageSquare className="h-5 w-5 text-primary-600" />
              </div>
              <span className="font-medium">Send Message</span>
            </div>
          </button>
          <button className="btn-secondary group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-center">
              <div className="p-2 rounded-lg bg-secondary-100 group-hover:bg-secondary-200 transition-colors mr-3">
                <FolderOpen className="h-5 w-5 text-secondary-600" />
              </div>
              <span className="font-medium">View Projects</span>
            </div>
          </button>
          <button className="btn-secondary group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-center">
              <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors mr-3">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <span className="font-medium">Schedule Meeting</span>
            </div>
          </button>
          <button className="btn-secondary group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-center">
              <div className="p-2 rounded-lg bg-accent-100 group-hover:bg-accent-200 transition-colors mr-3">
                <BarChart3 className="h-5 w-5 text-accent-600" />
              </div>
              <span className="font-medium">View Reports</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
