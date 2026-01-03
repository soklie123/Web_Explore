"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as authService from "../lib/auth.service";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

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
      const user = result.user;

      // Get ID token
      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);

      // Fetch role from Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      const role = docSnap.exists() && docSnap.data()?.role 
      ? (docSnap.data()?.role as string).trim().toLowerCase()  // Normalize to lowercase
      : "user";

      localStorage.setItem("userRole", role);

      // Redirect based on role
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user");
      }
        
      return { success: true, role };
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
      const user = result.user;

      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);

      // Set default role in Firestore
      
      router.push("/user");
      return { success: true, role: "user" };
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
      const user = result.user;

      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      const role = docSnap.exists() && docSnap.data()?.role 
      ? (docSnap.data()?.role as string).trim() 
      : "user";
      localStorage.setItem("userRole", role); 

      if (role === "admin") router.push("/admin/dashboard");
      else router.push("/user");

      return { success: true, role };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Google login failed";
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
      localStorage.removeItem("userRole"); // remove role
      router.push("/auth");
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
