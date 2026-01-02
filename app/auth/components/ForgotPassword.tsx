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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button onClick={() => router.back()} className="mb-8 text-gray-600 hover:text-gray-800">
          <ArrowLeft size={24} />
        </button>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-blue-600 text-center mb-2">Forgot Password</h1>
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

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !email}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className="text-center mt-6">
            <button
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
  );
}