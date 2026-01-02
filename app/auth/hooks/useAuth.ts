"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as authService from "../lib/auth.service";

export const useAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // ================= LOGIN =================
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError("");

    try {
      const result = await authService.loginWithEmail(email, password);
      const token = await result.user.getIdToken();
      localStorage.setItem("authToken", token);
      router.push("/user");
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // ================= SIGNUP =================
  const signup = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    setLoading(true);
    setError("");

    try {
      const result = await authService.signUpWithEmail(
        email,
        password,
        firstName,
        lastName
      );
      const token = await result.user.getIdToken();
      localStorage.setItem("authToken", token);
      router.push("/user");
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Signup failed";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // ================= GOOGLE LOGIN =================
  const loginWithGoogle = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await authService.loginWithGoogle();
      const token = await result.user.getIdToken();
      localStorage.setItem("authToken", token);
      router.push("/dashboard");
      return { success: true };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Google login failed";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // ================= FORGOT PASSWORD =================
  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError("");

    try {
      await authService.sendPasswordReset(email);
      return { success: true, message: "Reset email sent" };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Reset failed";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGOUT =================
  const logout = async () => {
    setLoading(true);
    setError("");

    try {
      await authService.logout();
      router.push("/auth/login");
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Logout failed";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    signup,
    loginWithGoogle,
    forgotPassword,
    logout,
    loading,
    error,
    setError,
  };
};
