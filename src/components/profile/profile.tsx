import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/authcontext'
import { API_URL } from '../../utils/apiconfig'
import logger from '../../utils/logger'
import { 
  User, 
  Mail, 
  Building2, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3,
  Save,
  X,
  Camera,
  Bell,
  Shield,
  Key,
  Globe
} from 'lucide-react'

const PROFILE_PREFERENCES_KEY = 'nhd_profile_preferences'

interface NotificationPreferences {
  email: boolean
  sms: boolean
  push: boolean
  marketing: boolean
}

interface SecurityPreferences {
  twoFactor: boolean
  sessionTimeout: string
}

interface ProfileFormData {
  name: string
  email: string
  company: string
  phone: string
  address: string
  website: string
  timezone: string
  notifications: NotificationPreferences
  security: SecurityPreferences
}

interface ProfileUser {
  name?: string
  email?: string
  company?: string
  phone?: string
  address?: string
  website?: string
  timezone?: string
}

const defaultPreferences: { notifications: NotificationPreferences; security: SecurityPreferences } = {
  notifications: {
    email: true,
    sms: false,
    push: true,
    marketing: false
  },
  security: {
    twoFactor: false,
    sessionTimeout: '24 hours'
  }
}

const getStoredPreferences = () => {
  if (typeof window === 'undefined') {
    return defaultPreferences
  }

  try {
    const raw = localStorage.getItem(PROFILE_PREFERENCES_KEY)
    if (!raw) return defaultPreferences

    const parsed = JSON.parse(raw)
    return {
      notifications: {
        ...defaultPreferences.notifications,
        ...(parsed.notifications || {})
      },
      security: {
        ...defaultPreferences.security,
        ...(parsed.security || {})
      }
    }
  } catch {
    return defaultPreferences
  }
}

const buildFormData = (currentUser: ProfileUser | null | undefined): ProfileFormData => {
  const preferences = getStoredPreferences()

  return {
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    company: currentUser?.company || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    website: currentUser?.website || '',
    timezone: currentUser?.timezone || 'America/New_York',
    notifications: preferences.notifications,
    security: preferences.security
  }
}

export default function Profile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>(() => buildFormData(user))

  useEffect(() => {
    setFormData(buildFormData(user))
  }, [user])

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, any>),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSave = async () => {
    if (!user?.id) {
      logger.error('Cannot save profile without an authenticated user')
      return
    }

    try {
      const token = localStorage.getItem('nhd_auth_token')
      const response = await fetch(`${API_URL}/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          address: formData.address,
          website: formData.website,
          timezone: formData.timezone
        })
      })
      
      if (response.ok) {
        localStorage.setItem(PROFILE_PREFERENCES_KEY, JSON.stringify({
          notifications: formData.notifications,
          security: formData.security
        }))
        localStorage.setItem('nhd_user_data', JSON.stringify({
          ...user,
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          address: formData.address,
          website: formData.website,
          timezone: formData.timezone
        }))

        setIsEditing(false)
      } else {
        logger.error('Failed to save profile', new Error(`HTTP ${response.status}`))
      }
    } catch (error) {
      logger.error('Error saving profile', error as Error)
    }
  }

  const handleCancel = () => {
    setFormData(buildFormData(user))
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button onClick={handleCancel} className="btn-secondary">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button onClick={handleSave} className="btn-primary">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="btn-primary">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card p-6 text-center">
            <div className="relative inline-block">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-24 w-24 rounded-full mx-auto"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-300 mx-auto flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-600" />
                </div>
              )}
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-white border-2 border-gray-300 rounded-full p-2 hover:bg-gray-50">
                  <Camera className="h-4 w-4 text-gray-600" />
                </button>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mt-4">{formData.name || user?.name}</h2>
            <p className="text-gray-600">{formData.company || user?.company}</p>
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Active Client
              </span>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Recently'}</p>
              <p>Last login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently'}</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="input"
                  />
                ) : (
                  <div className="flex items-center text-gray-900">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    {formData.name}
                  </div>
                )}
              </div>
              <div>
                <label className="label">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="input"
                  />
                ) : (
                  <div className="flex items-center text-gray-900">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {formData.email}
                  </div>
                )}
              </div>
              <div>
                <label className="label">Company</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="input"
                  />
                ) : (
                  <div className="flex items-center text-gray-900">
                    <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                    {formData.company}
                  </div>
                )}
              </div>
              <div>
                <label className="label">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="input"
                  />
                ) : (
                  <div className="flex items-center text-gray-900">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {formData.phone}
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="label">Address</label>
                {isEditing ? (
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="input"
                    rows={2}
                  />
                ) : (
                  <div className="flex items-start text-gray-900">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                    {formData.address}
                  </div>
                )}
              </div>
              <div>
                <label className="label">Website</label>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="input"
                  />
                ) : (
                  <div className="flex items-center text-gray-900">
                    <Globe className="h-4 w-4 mr-2 text-gray-400" />
                    <a href={formData.website} className="text-primary-600 hover:text-primary-700">
                      {formData.website}
                    </a>
                  </div>
                )}
              </div>
              <div>
                <label className="label">Timezone</label>
                {isEditing ? (
                  <select
                    value={formData.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                    className="input"
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                ) : (
                  <div className="flex items-center text-gray-900">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {formData.timezone.replace('_', ' ')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notification Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifications.email}
                    onChange={(e) => handleInputChange('notifications.email', e.target.checked)}
                    className="sr-only peer"
                    disabled={!isEditing}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
                  <p className="text-sm text-gray-500">Receive urgent updates via SMS</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifications.sms}
                    onChange={(e) => handleInputChange('notifications.sms', e.target.checked)}
                    className="sr-only peer"
                    disabled={!isEditing}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-500">Receive notifications in your browser</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifications.push}
                    onChange={(e) => handleInputChange('notifications.push', e.target.checked)}
                    className="sr-only peer"
                    disabled={!isEditing}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Marketing Communications</p>
                  <p className="text-sm text-gray-500">Receive newsletters and promotional content</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifications.marketing}
                    onChange={(e) => handleInputChange('notifications.marketing', e.target.checked)}
                    className="sr-only peer"
                    disabled={!isEditing}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.security.twoFactor}
                    onChange={(e) => handleInputChange('security.twoFactor', e.target.checked)}
                    className="sr-only peer"
                    disabled={!isEditing}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <div>
                <label className="label">Session Timeout</label>
                {isEditing ? (
                  <select
                    value={formData.security.sessionTimeout}
                    onChange={(e) => handleInputChange('security.sessionTimeout', e.target.value)}
                    className="input"
                  >
                    <option value="1 hour">1 hour</option>
                    <option value="8 hours">8 hours</option>
                    <option value="24 hours">24 hours</option>
                    <option value="7 days">7 days</option>
                  </select>
                ) : (
                  <div className="flex items-center text-gray-900">
                    <Key className="h-4 w-4 mr-2 text-gray-400" />
                    {formData.security.sessionTimeout}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
