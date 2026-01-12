'use client'

import { useEffect, useState } from 'react'
import { LogOut, Edit2, Mail, Calendar, MapPin, User, Camera, Save, X } from 'lucide-react'
import { onAuthStateChanged, updateProfile, signOut, User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/app/auth/lib/firebase'

interface Profile {
  firstName: string
  lastName: string
  gender: string
  username: string
  email: string
  bio: string
  location: string
  joinedDate: string
  avatar: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile>({
    firstName: '',
    lastName: '',
    gender: '',
    username: '',
    email: '',
    bio: '',
    location: '',
    joinedDate: '',
    avatar: ''
  })

  const [isEditing, setIsEditing] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [loading, setLoading] = useState(true)

  // ================= FETCH USER INFO =================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      if (user) {
        const displayName = user.displayName || ''
        const nameParts = displayName.split(' ')

        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
        const firestoreData = docSnap.exists() ? docSnap.data() : {}

        setProfile({
          firstName: firestoreData?.firstName || nameParts[0] || '',
          lastName: firestoreData?.lastName || nameParts.slice(1).join(' ') || '',
          email: user.email || '',
          avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
          username: firestoreData?.username || displayName.replace(/\s+/g, '').toLowerCase() || 'user',
          joinedDate: new Date(user.metadata.creationTime || '').toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          }),
          gender: firestoreData?.gender || '',
          bio: firestoreData?.bio || '',
          location: firestoreData?.location || ''
        })
        setLoading(false)
      } else {
        router.push('/auth')
      }
    })

    return () => unsubscribe()
  }, [router])

  // ================= SAVE CHANGES =================
  const handleSave = async () => {
    if (!auth.currentUser) return

    try {
      await updateProfile(auth.currentUser, {
        displayName: `${profile.firstName} ${profile.lastName}`.trim(),
        photoURL: profile.avatar
      })

      await setDoc(
        doc(db, 'users', auth.currentUser.uid),
        {
          firstName: profile.firstName,
          lastName: profile.lastName,
          bio: profile.bio,
          gender: profile.gender,
          location: profile.location,
          username: profile.username,
          avatar: profile.avatar
        },
        { merge: true }
      )

      setIsEditing(false)
    } catch (err) {
      console.error(err)
      alert('Failed to save profile!')
    }
  }

  // ================= LOGOUT =================
  const handleLogout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem('authToken')
      localStorage.removeItem('userRole')
      router.push('/auth')
    } catch (err) {
      console.error(err)
      alert('Failed to logout. Please try again.')
    }
  }

  // ================= HANDLE INPUT CHANGES =================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Cover Photo */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 rounded-t-3xl overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-b-3xl shadow-2xl -mt-20 relative">
          <div className="px-6 md:px-10 pt-6 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-36 h-36 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-emerald-100 ring-4 ring-blue-50">
                    <img
                      src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=default`}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full text-white shadow-lg hover:bg-blue-700 transition">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Name & Info */}
                <div className="text-center sm:text-left space-y-2">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="text-gray-500 text-lg">@{profile.username}</p>
                  <div className="flex flex-wrap gap-4 justify-center sm:justify-start text-sm text-gray-600">
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span>{profile.email}</span>
                    </div>
                    {profile.location && (
                      <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span>Joined {profile.joinedDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-end">
                {!isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Edit2 className="w-4 h-4" /> Edit Profile
                    </button>
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="flex items-center gap-2 px-6 py-3 text-red-600 border-2 border-red-600 rounded-full hover:bg-red-50 transition-all transform hover:scale-105"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg transform hover:scale-105"
                    >
                      <Save className="w-4 h-4" /> Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2 px-6 py-3 text-gray-700 border-2 border-gray-300 rounded-full hover:bg-gray-50 transition-all transform hover:scale-105"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Bio Section */}
            {(profile.bio || isEditing) && (
              <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl border border-blue-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">About Me</h3>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none transition"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-700 text-lg leading-relaxed">{profile.bio || 'No bio yet'}</p>
                )}
              </div>
            )}

            {/* Personal Info Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-blue-600" />
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-md border border-blue-100 hover:shadow-xl transition-all">
                  <label className="text-sm text-gray-500 font-semibold uppercase tracking-wider block mb-2">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      placeholder="First Name"
                    />
                  ) : (
                    <p className="text-gray-800 font-semibold text-xl">{profile.firstName || 'Not set'}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-6 shadow-md border border-emerald-100 hover:shadow-xl transition-all">
                  <label className="text-sm text-gray-500 font-semibold uppercase tracking-wider block mb-2">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                      placeholder="Last Name"
                    />
                  ) : (
                    <p className="text-gray-800 font-semibold text-xl">{profile.lastName || 'Not set'}</p>
                  )}
                </div>

                {/* Username */}
                <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-md border border-purple-100 hover:shadow-xl transition-all">
                  <label className="text-sm text-gray-500 font-semibold uppercase tracking-wider block mb-2">
                    Username
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={profile.username}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                      placeholder="Username"
                    />
                  ) : (
                    <p className="text-gray-800 font-semibold text-xl">@{profile.username}</p>
                  )}
                </div>

                {/* Gender */}
                <div className="bg-gradient-to-br from-white to-pink-50 rounded-2xl p-6 shadow-md border border-pink-100 hover:shadow-xl transition-all">
                  <label className="text-sm text-gray-500 font-semibold uppercase tracking-wider block mb-2">
                    Gender
                  </label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  ) : (
                    <p className="text-gray-800 font-semibold text-xl">{profile.gender || 'Not set'}</p>
                  )}
                </div>

                {/* Location */}
                <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-6 shadow-md border border-orange-100 hover:shadow-xl transition-all md:col-span-2">
                  <label className="text-sm text-gray-500 font-semibold uppercase tracking-wider block mb-2">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={profile.location}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                      placeholder="City, Country"
                    />
                  ) : (
                    <p className="text-gray-800 font-semibold text-xl">{profile.location || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md transform transition-all">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Logout</h2>
              <p className="text-gray-600 mb-8">Are you sure you want to logout from your account?</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-6 py-3 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setShowLogoutModal(false)
                    await handleLogout()
                  }}
                  className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}