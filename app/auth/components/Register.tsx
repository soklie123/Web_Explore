"use client"
import type React from "react"
import { useState } from "react"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { FcGoogle } from "react-icons/fc"
import { useAuth } from "../hooks/useAuth"
import { validationRules } from "../lib/validation"

export default function SignUpPage() {
  const router = useRouter()
  const { signup, loginWithGoogle, loading, error, setError } = useAuth()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validateField = (name: string, value: string) => {
    let error = ""

    if (name === "firstName") {
      error = validationRules.firstName.validate(value)
    } else if (name === "lastName") {
      error = validationRules.lastName.validate(value)
    } else if (name === "email") {
      error = validationRules.email.validate(value)
    } else if (name === "password") {
      error = validationRules.password.validate(value)
      // Update confirmPassword error if it exists
      if (fieldErrors.confirmPassword && formData.confirmPassword) {
        const confirmError = validationRules.confirmPassword.validate(formData.confirmPassword, value)
        setFieldErrors((prev) => ({ ...prev, confirmPassword: confirmError }))
      }
    } else if (name === "confirmPassword") {
      error = validationRules.confirmPassword.validate(value, formData.password)
    } else if (name === "username") {
      error = validationRules.username.validate(value)
    }

    setFieldErrors((prev) => ({ ...prev, [name]: error }))
    return error
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // Validate on change for better UX
    validateField(name, value)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    validateField(name, value)
  }

  const handleSignUp = async () => {
    setError("")

    // Validate all fields before submission
    const newErrors = {
      firstName: validationRules.firstName.validate(formData.firstName),
      lastName: validationRules.lastName.validate(formData.lastName),
      email: validationRules.email.validate(formData.email),
      password: validationRules.password.validate(formData.password),
      confirmPassword: validationRules.confirmPassword.validate(formData.confirmPassword, formData.password),
      username: validationRules.username.validate(formData.username),
    }

    setFieldErrors(newErrors)
    await signup(formData.email, formData.password, formData.firstName, formData.lastName)
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 to-blue-600 flex-col items-center justify-center p-8">
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

      {/* Right form section */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <button onClick={() => router.back()} className="mb-8 text-gray-600 hover:text-gray-800 hidden lg:block">
            <ArrowLeft size={24} />
          </button>

          <div className="lg:bg-transparent">
            <h1 className="text-3xl font-bold text-blue-600 text-center mb-2">Sign-Up</h1>
            <p className="text-gray-500 text-center mb-8 text-sm">
              Join now and discover amazing facts about countries worldwide!
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">First name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="First name"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-colors ${
                      fieldErrors.firstName
                        ? "border-red-300 focus:ring-red-500 bg-red-50"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    disabled={loading}
                  />
                  {fieldErrors.firstName && <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Last name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Last name"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-colors ${
                      fieldErrors.lastName
                        ? "border-red-300 focus:ring-red-500 bg-red-50"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    disabled={loading}
                  />
                  {fieldErrors.lastName && <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Username (optional)</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Username"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-colors ${
                    fieldErrors.username
                      ? "border-red-300 focus:ring-red-500 bg-red-50"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  disabled={loading}
                />
                {fieldErrors.username && <p className="text-red-500 text-xs mt-1">{fieldErrors.username}</p>}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Email"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-colors ${
                    fieldErrors.email
                      ? "border-red-300 focus:ring-red-500 bg-red-50"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  disabled={loading}
                />
                {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Password"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 pr-12 text-sm transition-colors ${
                      fieldErrors.password
                        ? "border-red-300 focus:ring-red-500 bg-red-50"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Confirm password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Confirm password"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 pr-12 text-sm transition-colors ${
                      fieldErrors.confirmPassword
                        ? "border-red-300 focus:ring-red-500 bg-red-50"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              <button
                onClick={handleSignUp}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full disabled:opacity-50 transition-colors mt-6"
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <button
              onClick={loginWithGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-full disabled:opacity-50 transition-colors"
            >
              <FcGoogle size={18} />
              Sign up with Google
            </button>

            <div className="text-center mt-6">
              <span className="text-gray-600 text-sm">Already have an account? </span>
              <button
                // onClick={() => router.push("/auth/login")}
                onClick={() => router.push("/auth")}
                className="text-blue-500 hover:text-blue-600 font-medium text-sm"
                disabled={loading}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
