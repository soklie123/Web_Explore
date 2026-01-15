// Form validation utility functions
export const validationRules = {
  firstName: {
    validate: (value: string) => {
      if (!value.trim()) return "First name is required"
      if (value.length < 2) return "First name must be at least 2 characters"
      if (value.length > 50) return "First name must not exceed 50 characters"
      return ""
    },
  },
  lastName: {
    validate: (value: string) => {
      if (!value.trim()) return "Last name is required"
      if (value.length < 2) return "Last name must be at least 2 characters"
      if (value.length > 50) return "Last name must not exceed 50 characters"
      return ""
    },
  },
  email: {
    validate: (value: string) => {
      if (!value.trim()) return "Email is required"
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) return "Please enter a valid email address"
      return ""
    },
  },
  password: {
    validate: (value: string) => {
      if (!value) return "Password is required"
      if (value.length < 8) return "Password must be at least 8 characters"
      if (value.length > 128) return "Password must not exceed 128 characters"
      if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter"
      if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter"
      if (!/[0-9]/.test(value)) return "Password must contain at least one number"
      return ""
    },
  },
  confirmPassword: {
    validate: (value: string, password: string) => {
      if (!value) return "Please confirm your password"
      if (value !== password) return "Passwords do not match"
      return ""
    },
  },
  username: {
    validate: (value: string) => {
      if (!value.trim()) return ""
      if (value.length < 3) return "Username must be at least 3 characters"
      if (value.length > 30) return "Username must not exceed 30 characters"
      if (!/^[a-zA-Z0-9_-]+$/.test(value)) return "Username can only contain letters, numbers, underscores, and hyphens"
      return ""
    },
  },
}
