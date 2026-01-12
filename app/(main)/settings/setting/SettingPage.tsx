'use client'

import { useEffect, useState } from 'react'
import { 
  Shield, Bell, Globe, Moon, Lock, Trash2, 
  Check, ChevronRight, Mail, Eye, EyeOff, Save 
} from 'lucide-react'
import { onAuthStateChanged, updatePassword, deleteUser, User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { auth, db } from '../../../auth/lib/firebase'

interface Settings {
  // Account Settings
  email: string
  emailNotifications: boolean
  pushNotifications: boolean
  
  // Privacy Settings
  profileVisibility: 'public' | 'private' | 'friends'
  showEmail: boolean
  showLocation: boolean
  
  // Appearance
  theme: 'light' | 'dark' | 'auto'
  language: string
  
  // Notifications
  newFollowers: boolean
  comments: boolean
  likes: boolean
  messages: boolean
}

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'account' | 'privacy' | 'notifications' | 'appearance'>('account')
  
  // Password change
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  
  // Delete account
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  
  const [settings, setSettings] = useState<Settings>({
    email: '',
    emailNotifications: true,
    pushNotifications: true,
    profileVisibility: 'public',
    showEmail: false,
    showLocation: true,
    theme: 'light',
    language: 'en',
    newFollowers: true,
    comments: true,
    likes: true,
    messages: true
  })

  // ================= FETCH USER SETTINGS =================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        setSettings(prev => ({ ...prev, email: currentUser.email || '' }))
        
        // Fetch settings from Firestore
        const docRef = doc(db, 'settings', currentUser.uid)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          setSettings(prev => ({ ...prev, ...docSnap.data() }))
        }
        
        setLoading(false)
      } else {
        router.push('/auth')
      }
    })

    return () => unsubscribe()
  }, [router])

  // ================= SAVE SETTINGS =================
  const handleSaveSettings = async () => {
    if (!user) return
    
    setSaving(true)
    try {
      await setDoc(doc(db, 'settings', user.uid), settings, { merge: true })
      alert('Settings saved successfully!')
    } catch (error) {
      console.error(error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  // ================= CHANGE PASSWORD =================
  const handleChangePassword = async () => {
    if (!user) return
    
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }
    
    try {
      await updatePassword(user, newPassword)
      alert('Password updated successfully!')
      setShowPasswordSection(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        if ((error as { code: string }).code === 'auth/requires-recent-login') {
          alert('Please log out and log back in before changing your password')
        } else {
          alert('Failed to change password: ' + error.message)
        }
      } else {
        alert('Failed to change password')
      }
    }
  }

  // ================= DELETE ACCOUNT =================
  const handleDeleteAccount = async () => {
    if (!user) return
    
    if (deleteConfirmText !== 'DELETE') {
      alert('Please type DELETE to confirm')
      return
    }
    
    try {
      // Delete user data from Firestore
      await deleteDoc(doc(db, 'users', user.uid))
      await deleteDoc(doc(db, 'settings', user.uid))
      
      // Delete Firebase Auth account
      await deleteUser(user)
      
      localStorage.removeItem('authToken')
      localStorage.removeItem('userRole')
      router.push('/auth')
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        if ((error as { code: string }).code === 'auth/requires-recent-login') {
          alert('Please log out and log back in before deleting your account')
        } else {
          alert('Failed to delete account: ' + error.message)
        }
      } else {
        alert('Failed to delete account')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Globe }
  ] as const

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              
              {/* ACCOUNT TAB */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Account Settings</h2>
                    <p className="text-gray-600 mb-6">Manage your account information and security</p>
                  </div>

                  {/* Email (Read-only) */}
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-800 font-medium">{settings.email}</span>
                      <span className="ml-auto text-xs text-gray-500">(Cannot be changed)</span>
                    </div>
                  </div>

                  {/* Change Password */}
                  <div className="border-t border-gray-200 pt-6">
                    <button
                      onClick={() => setShowPasswordSection(!showPasswordSection)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4"
                    >
                      <Lock className="w-5 h-5" />
                      Change Password
                    </button>

                    {showPasswordSection && (
                      <div className="space-y-4 p-4 bg-blue-50 rounded-xl">
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type={showPasswords ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                            placeholder="Enter new password"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                          </label>
                          <input
                            type={showPasswords ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                            placeholder="Confirm new password"
                          />
                        </div>

                        <button
                          onClick={() => setShowPasswords(!showPasswords)}
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
                        >
                          {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          {showPasswords ? 'Hide' : 'Show'} passwords
                        </button>

                        <button
                          onClick={handleChangePassword}
                          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-semibold"
                        >
                          Update Password
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Delete Account */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                      <h3 className="text-lg font-bold text-red-700 mb-2">Danger Zone</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all font-semibold"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* PRIVACY TAB */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Privacy Settings</h2>
                    <p className="text-gray-600 mb-6">Control who can see your information</p>
                  </div>

                  {/* Profile Visibility */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Profile Visibility
                    </label>
                    <select
                      value={settings.profileVisibility}
                      onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value as never })}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    >
                      <option value="public">Public - Anyone can see</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private - Only me</option>
                    </select>
                  </div>

                  {/* Toggle Options */}
                  <div className="space-y-3">
                    <ToggleOption
                      label="Show Email on Profile"
                      description="Others can see your email address"
                      checked={settings.showEmail}
                      onChange={(checked) => setSettings({ ...settings, showEmail: checked })}
                    />
                    <ToggleOption
                      label="Show Location"
                      description="Display your location on your profile"
                      checked={settings.showLocation}
                      onChange={(checked) => setSettings({ ...settings, showLocation: checked })}
                    />
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Notification Preferences</h2>
                    <p className="text-gray-600 mb-6">Choose what updates you want to receive</p>
                  </div>

                  <div className="space-y-3">
                    <ToggleOption
                      label="Email Notifications"
                      description="Receive updates via email"
                      checked={settings.emailNotifications}
                      onChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                    />
                    <ToggleOption
                      label="Push Notifications"
                      description="Receive push notifications in browser"
                      checked={settings.pushNotifications}
                      onChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                    />
                    <ToggleOption
                      label="New Followers"
                      description="Get notified when someone follows you"
                      checked={settings.newFollowers}
                      onChange={(checked) => setSettings({ ...settings, newFollowers: checked })}
                    />
                    <ToggleOption
                      label="Comments"
                      description="Get notified about new comments"
                      checked={settings.comments}
                      onChange={(checked) => setSettings({ ...settings, comments: checked })}
                    />
                    <ToggleOption
                      label="Likes"
                      description="Get notified when someone likes your content"
                      checked={settings.likes}
                      onChange={(checked) => setSettings({ ...settings, likes: checked })}
                    />
                    <ToggleOption
                      label="Messages"
                      description="Get notified about new messages"
                      checked={settings.messages}
                      onChange={(checked) => setSettings({ ...settings, messages: checked })}
                    />
                  </div>
                </div>
              )}

              {/* APPEARANCE TAB */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Appearance</h2>
                    <p className="text-gray-600 mb-6">Customize how ExploreVista looks to you</p>
                  </div>

                  {/* Theme Selection */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Theme
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['light', 'dark', 'auto'] as const).map((theme) => (
                        <button
                          key={theme}
                          onClick={() => setSettings({ ...settings, theme })}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            settings.theme === theme
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Moon className={`w-6 h-6 mx-auto mb-2 ${
                            settings.theme === theme ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          <span className="text-sm font-medium capitalize">{theme}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Language */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="zh">中文</option>
                      <option value="ja">日本語</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-full hover:from-blue-700 hover:to-emerald-600 transition-all shadow-lg font-semibold disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Delete Account</h2>
              <p className="text-gray-600 mb-6">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Type <span className="font-bold">DELETE</span> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none mb-6"
                placeholder="Type DELETE"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeleteConfirmText('')
                  }}
                  className="flex-1 px-6 py-3 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'DELETE'}
                  className="flex-1 px-6 py-3 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Toggle Option Component
function ToggleOption({ 
  label, 
  description, 
  checked, 
  onChange 
}: { 
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void 
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{label}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-14 h-8 rounded-full transition-all ${
          checked ? 'bg-gradient-to-r from-blue-600 to-emerald-500' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}