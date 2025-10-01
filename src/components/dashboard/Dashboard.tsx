import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { API_URL } from '../../utils/apiConfig'
import logger from '../../utils/logger'
import {
  Calendar,
  DollarSign,
  TrendingUp,
  FolderOpen,
  MessageSquare
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
        
        // Fetch projects
        const projectsResponse = await fetch(`${API_URL}/projects`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json()
          setProjects(projectsData.projects)
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
          setMessages(messagesData.messages)
        }

        // Calculate stats
        const activeProjects = projects.filter(p => p.status === 'in-progress' || p.status === 'planning').length
        const totalMessages = messages.length
        const unreadMessages = messages.filter(m => !m.isRead).length
        const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0)

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
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold">Loading your dashboard...</h1>
          <p className="text-primary-100 mt-1">Fetching your latest project information</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-primary-100 mt-1">
          Here's what's happening with your projects at North Head Digital.
        </p>
        <p className="text-primary-200 text-sm mt-2">
          {user?.company} • {stats.activeProjects} active projects
        </p>
        {user?.role === 'client' && (
          <p className="text-primary-200 text-xs mt-1">
            You can view your assigned projects, messages from our team, and update your profile.
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FolderOpen className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Active Projects
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.activeProjects}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageSquare className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Messages
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.totalMessages}
                  </div>
                  {stats.unreadMessages > 0 && (
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                      {stats.unreadMessages} unread
                    </div>
                  )}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Investment
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    ${stats.totalBudget.toLocaleString()}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Avg. Progress
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {projects.length > 0 
                      ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
                      : 0}%
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

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="btn-secondary">
            <MessageSquare className="h-5 w-5 mr-2" />
            Send Message
          </button>
          <button className="btn-secondary">
            <FolderOpen className="h-5 w-5 mr-2" />
            View Projects
          </button>
          <button className="btn-secondary">
            <Calendar className="h-5 w-5 mr-2" />
            Schedule Meeting
          </button>
          <button className="btn-secondary">
            <TrendingUp className="h-5 w-5 mr-2" />
            View Reports
          </button>
        </div>
      </div>
    </div>
  )
}