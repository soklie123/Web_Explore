'use client'

import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '@/app/auth/lib/firebase'

export default function LogoutButton() {
  const [showModal, setShowModal] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut(auth)
      window.location.href = '/auth/login'
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      {/* Logout Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-6 py-2.5 text-red-600 border-2 border-red-600 rounded-full hover:bg-red-50 transition"
      >
        <LogOut className="w-4 h-4" /> Logout
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-80">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
