import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  UserCredential,
  updateProfile,
  signOut
} from "firebase/auth";
import { auth } from "./firebase";
import { FirebaseError } from "firebase/app";

// ========== LOGIN ==========
export const loginWithEmail = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
        throw new Error(getAuthErrorMessage(error.code));
    }
    throw new Error("Login failed");
    }
};

// ========== SIGNUP ==========
export const signUpWithEmail = async (
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    if ((firstName || lastName) && userCredential.user) {
      const displayName = `${firstName || ''} ${lastName || ''}`.trim();
      await updateProfile(userCredential.user, { displayName });
    }
    
    return userCredential;
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      throw new Error(getAuthErrorMessage(error.code));
    }
    throw new Error("Signup failed");
  }
};

// ========== GOOGLE LOGIN ==========
export const loginWithGoogle = async (): Promise<UserCredential> => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      throw new Error(getAuthErrorMessage(error.code));
    }
    throw new Error("Google login failed");
  }
};

// ========== FORGOT PASSWORD ==========
export const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      throw new Error(getAuthErrorMessage(error.code));
    }
    throw new Error("Failed to send reset email");
  }
};

// ========== LOGOUT ==========
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    localStorage.removeItem('authToken');
  }  catch {
    throw new Error("Failed to logout");
  }
};

// ========== GET USER TOKEN ==========
export const getUserToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

// ========== ERROR MESSAGES ==========
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/invalid-email":
      return "Invalid email address format";
    case "auth/user-not-found":
      return "No account found with this email";
    case "auth/wrong-password":
      return "Incorrect password";
    case "auth/invalid-credential":
      return "Invalid email or password";
    case "auth/email-already-in-use":
      return "Email is already registered";
    case "auth/weak-password":
      return "Password is too weak (minimum 6 characters)";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later";
    case "auth/popup-closed-by-user":
      return "Login cancelled";
    case "auth/popup-blocked":
      return "Popup blocked. Please allow popups for this site";
    case "auth/network-request-failed":
      return "Network error. Please check your connection";
    default:
      return "An error occurred. Please try again";
  }
};