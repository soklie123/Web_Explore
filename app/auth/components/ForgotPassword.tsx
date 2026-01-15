'use client'
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword, loading, error, setError } = useAuth();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    const result = await forgotPassword(email);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => router.push('/auth/login'), 3000);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Blue background with illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 items-center justify-center p-12">
        <div className="text-center">
          {/* Illustration placeholder */}
          <div className="mb-8 flex justify-center">
            <div className="w-56 h-56 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              <svg className="w-40 h-40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="50" r="15" fill="#3b82f6" />
                <rect x="70" y="70" width="60" height="50" fill="#3b82f6" rx="4" />
                <rect x="75" y="75" width="50" height="30" fill="#ffffff" />
                <rect x="80" y="85" width="15" height="4" fill="#3b82f6" />
                <rect x="80" y="92" width="15" height="4" fill="#3b82f6" />
                <rect x="80" y="99" width="15" height="4" fill="#3b82f6" />
                <path
                  d="M 100 120 Q 80 130 70 145"
                  stroke="#ef4444"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 100 120 Q 120 130 130 145"
                  stroke="#ef4444"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">Welcome to Country Explorer</h2>
          <p className="text-blue-100 text-lg">
            Sign up and start discovering countries around the world with Country Explorer!
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <button onClick={() => router.back()} className="mb-8 text-gray-600 hover:text-gray-800">
            <ArrowLeft size={24} />
          </button>

          <div>
            <h1 className="text-4xl font-bold text-blue-600 text-center mb-3">Forgot Password</h1>
            <p className="text-gray-500 text-center mb-8">
              Enter your email to receive a password reset link
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                Password reset email sent! Check your inbox.
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  disabled={loading}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !email}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full disabled:opacity-50 transition-colors mt-6"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>

            <div className="text-center mt-6">
              <button
                // onClick={() => router.push("/auth/login")}
                onClick={() => router.push("/auth")}
                className="text-blue-500 hover:text-blue-600 font-medium"
                disabled={loading}
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}