import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { API_URL } from '../../utils/apiConfig'
import { 
  FolderOpen, 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Pause,
  Eye,
  Download,
  MessageSquare,
  DollarSign,
  Plus,
  Send
} from 'lucide-react'

interface Project {
  _id: string
  name: string
  description: string
  status: string
  progress: number
  startDate: string
  endDate: string
  budget?: number
  priority: string
  deliverables?: Array<{
    name: string
    description?: string
    dueDate: string
    status: string
  }>
  teamMembers?: Array<{
    name: string
    role: string
    email: string
  }>
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-5 w-5 text-green-600" />
    case 'in-progress':
      return <Clock className="h-5 w-5 text-blue-600" />
    case 'planning':
      return <Pause className="h-5 w-5 text-yellow-600" />
    case 'review':
      return <AlertCircle className="h-5 w-5 text-purple-600" />
    case 'on-hold':
      return <Pause className="h-5 w-5 text-gray-600" />
    default:
      return <Clock className="h-5 w-5 text-gray-600" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'in-progress':
      return 'bg-blue-100 text-blue-800'
    case 'planning':
      return 'bg-yellow-100 text-yellow-800'
    case 'review':
      return 'bg-purple-100 text-purple-800'
    case 'on-hold':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
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

export default function Projects() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [requestForm, setRequestForm] = useState({
    name: '',
    description: '',
    budget: '',
    timeline: '',
    priority: 'medium'
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('nhd_auth_token')
        const response = await fetch(`${API_URL}/projects`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setProjects(data.projects)
        } else {
          console.error('Failed to fetch projects')
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const handleRequestProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSubmitting(true)
    try {
      const token = localStorage.getItem('nhd_auth_token')
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subject: `New Project Request: ${requestForm.name}`,
          content: `Project Request Details:
          
Project Name: ${requestForm.name}
Description: ${requestForm.description}
Budget: ${requestForm.budget}
Timeline: ${requestForm.timeline}
Priority: ${requestForm.priority}

Please review this project request and let me know if you need any additional information.`,
          clientId: user.id,
          priority: requestForm.priority,
          category: 'project-request'
        })
      })

      if (response.ok) {
        setShowRequestModal(false)
        setRequestForm({
          name: '',
          description: '',
          budget: '',
          timeline: '',
          priority: 'medium'
        })
        alert('Project request sent successfully! We\'ll review it and get back to you soon.')
      } else {
        const errorData = await response.json()
        console.error('Failed to send project request:', errorData.message)
        alert('Failed to send project request. Please try again.')
      }
    } catch (error) {
      console.error('Error sending project request:', error)
      alert('Error sending project request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600">Loading your projects...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Your Projects</h1>
          <p className="text-gray-600">Track and manage your active projects</p>
        </div>
        <button 
          onClick={() => setShowRequestModal(true)}
          className="btn-primary"
        >
          <Plus className="h-5 w-5 mr-2" />
          Request New Project
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="card p-12 text-center">
          <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-4">Your projects will appear here once they're created.</p>
          <button 
            onClick={() => setShowRequestModal(true)}
            className="btn-primary"
          >
            <Plus className="h-5 w-5 mr-2" />
            Request New Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <div key={project._id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(project.status)}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                  {project.priority}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4">{project.description}</p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(project.startDate)} - {formatDate(project.endDate)}
                </div>
                {project.teamMembers && project.teamMembers.length > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {project.teamMembers.length} team members
                  </div>
                )}
                {project.budget && (
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    ${project.budget.toLocaleString()} budget
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button 
                  className="btn-secondary flex-1"
                  onClick={() => setSelectedProject(project._id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </button>
                <button className="btn-ghost">
                  <MessageSquare className="h-4 w-4" />
                </button>
                <button className="btn-ghost">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-lg bg-white">
            {(() => {
              const project = projects.find(p => p._id === selectedProject)
              if (!project) return null

              return (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
                      <p className="text-gray-600">{project.description}</p>
                    </div>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Project Info */}
                    <div className="lg:col-span-2 space-y-6">
                      {project.deliverables && project.deliverables.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Project Timeline</h3>
                          <div className="space-y-4">
                            {project.deliverables.map((deliverable, index) => (
                              <div key={`deliverable-${index}-${deliverable.name}`} className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                  {getStatusIcon(deliverable.status)}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{deliverable.name}</p>
                                  {deliverable.description && (
                                    <p className="text-xs text-gray-500">{deliverable.description}</p>
                                  )}
                                  <p className="text-xs text-gray-500">Due: {formatDate(deliverable.dueDate)}</p>
                                </div>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deliverable.status)}`}>
                                  {deliverable.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Project Details Sidebar */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Project Details</h3>
                        <div className="space-y-3">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                              {project.status}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Progress</dt>
                            <dd className="mt-1 text-sm text-gray-900">{project.progress}%</dd>
                          </div>
                          {project.budget && (
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Budget</dt>
                              <dd className="mt-1 text-sm text-gray-900">${project.budget.toLocaleString()}</dd>
                            </div>
                          )}
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Timeline</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {formatDate(project.startDate)} - {formatDate(project.endDate)}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Priority</dt>
                            <dd className={`mt-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                              {project.priority}
                            </dd>
                          </div>
                        </div>
                      </div>

                      {project.teamMembers && project.teamMembers.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Team Members</h3>
                          <div className="space-y-2">
                            {project.teamMembers.map((member, index) => (
                              <div key={`member-${index}-${member.name}`} className="flex items-center space-x-2">
                                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-600">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-900">{member.name}</span>
                                  <p className="text-xs text-gray-500">{member.role}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <button className="btn-primary flex-1">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Team
                        </button>
                        <button className="btn-secondary">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* Project Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Request New Project</h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleRequestProject} className="space-y-4">
              <div>
                <label htmlFor="projectName" className="label">Project Name</label>
                <input
                  type="text"
                  id="projectName"
                  className="input"
                  value={requestForm.name}
                  onChange={(e) => setRequestForm({...requestForm, name: e.target.value})}
                  placeholder="Enter project name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="projectDescription" className="label">Description</label>
                <textarea
                  id="projectDescription"
                  className="input"
                  value={requestForm.description}
                  onChange={(e) => setRequestForm({...requestForm, description: e.target.value})}
                  placeholder="Describe your project requirements"
                  rows={4}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="projectBudget" className="label">Budget (Optional)</label>
                <input
                  type="text"
                  id="projectBudget"
                  className="input"
                  value={requestForm.budget}
                  onChange={(e) => setRequestForm({...requestForm, budget: e.target.value})}
                  placeholder="e.g., $5,000 - $10,000"
                />
              </div>
              
              <div>
                <label htmlFor="projectTimeline" className="label">Timeline (Optional)</label>
                <input
                  type="text"
                  id="projectTimeline"
                  className="input"
                  value={requestForm.timeline}
                  onChange={(e) => setRequestForm({...requestForm, timeline: e.target.value})}
                  placeholder="e.g., 2-3 months, ASAP"
                />
              </div>
              
              <div>
                <label htmlFor="projectPriority" className="label">Priority</label>
                <select
                  id="projectPriority"
                  className="input"
                  value={requestForm.priority}
                  onChange={(e) => setRequestForm({...requestForm, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowRequestModal(false)} 
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
                      Send Request
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