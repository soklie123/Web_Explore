'use client'

import { useEffect, useState } from 'react'
import { User, LogOut, Edit2, Mail, Calendar, MapPin } from 'lucide-react'
import { onAuthStateChanged, updateProfile, signOut, User as FirebaseUser } from 'firebase/auth'
import { auth, db } from '@/app/auth/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

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
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: user.email || '',
          avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
          username: displayName.replace(/\s+/g, '') || 'username',
          joinedDate: new Date(user.metadata.creationTime || '').toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          }),
          gender: firestoreData?.gender || '',
          bio: firestoreData?.bio || '',
          location: firestoreData?.location || ''
        })
      }
    })

    return () => unsubscribe()
  }, [])

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
          bio: profile.bio,
          gender: profile.gender,
          location: profile.location,
          username: profile.username,
          avatar: profile.avatar
        },
        { merge: true }
      )

      alert('Profile saved successfully!')
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
      window.location.href = '/auth/login'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Cover Photo */}
        <div className="relative h-24 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-t-3xl overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-b-3xl shadow-xl -mt-16 relative">
          <div className="px-8 pt-8 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-blue-100 to-emerald-100">
                    <img
                      src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=default`}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Name & Info */}
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl font-bold text-gray-800 mb-1">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="text-gray-500 mb-2">@{profile.username}</p>
                  <div className="flex flex-wrap gap-3 justify-center sm:justify-start text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {profile.joinedDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center mt-4 md:mt-0">
                {!isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition shadow-lg hover:shadow-xl"
                    >
                      <Edit2 className="w-4 h-4" /> Edit Profile
                    </button>
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="flex items-center gap-2 px-6 py-2.5 text-red-600 border-2 border-red-600 rounded-full hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full hover:from-emerald-600 hover:to-emerald-700 transition shadow-lg"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2.5 text-gray-700 border-2 border-gray-300 rounded-full hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>

              {/* Logout Modal */}
              {showLogoutModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl shadow-lg p-6 w-80">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Confirm Logout</h2>
                    <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => setShowLogoutModal(false)}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          setShowLogoutModal(false)
                          await handleLogout()
                        }}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Personal Info Section */}
            <div className="px-8 pb-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Name */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition">
                  <span className="text-sm text-gray-400 font-medium uppercase tracking-wide">Name</span>
                  {isEditing ? (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleChange}
                        className="w-1/2 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleChange}
                        className="w-1/2 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Last Name"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-800 font-semibold text-lg mt-2">
                      {profile.firstName} {profile.lastName}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition">
                  <span className="text-sm text-gray-400 font-medium uppercase tracking-wide">Gender</span>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={handleChange}
                      className="mt-2 w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Select Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                      <option>Prefer not to say</option>
                    </select>
                  ) : (
                    <p className="text-gray-800 font-semibold text-lg mt-2">{profile.gender || 'Not set'}</p>
                  )}
                </div>

                {/* Bio */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition md:col-span-3">
                  <span className="text-sm text-gray-400 font-medium uppercase tracking-wide">Bio</span>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      rows={4}
                      className="mt-2 w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-800 font-semibold text-lg mt-2">{profile.bio || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
