'use client'
import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from "react-icons/fc";
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, loading, error, setError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    await login(email, password);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
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
                {/* Simple illustration of a person with a phone */}
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
            <h1 className="text-4xl font-bold text-blue-600 text-center mb-3">Login</h1>
            <p className="text-gray-500 text-center mb-8">
              Log in to start discovering countries, cultures, and history
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
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
                  onKeyPress={handleKeyPress}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 transition-colors"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                    disabled={loading}
                  />
                  <span className="ml-2 text-sm text-gray-700">Remember me</span>
                </label>
                <button 
                  onClick={() => router.push("/auth/forgot")}
                  className="text-sm text-blue-500 hover:text-blue-600"
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading || !email || !password}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full disabled:opacity-50 transition-colors mt-6"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or</span>
              </div>
            </div>

            <button
              onClick={loginWithGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-full disabled:opacity-50 transition-colors"
            >
              <FcGoogle size={20} />
              Login with Google
            </button>

            <div className="text-center mt-6">
              <span className="text-gray-600">Don&apos;t have an account? </span>
              <button 
                onClick={() => router.push("/auth/signup")}
                className="text-blue-500 hover:text-blue-600 font-medium"
                disabled={loading}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}