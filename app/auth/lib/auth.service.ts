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
import { auth, db } from "./firebase";
import { FirebaseError } from "firebase/app";
import { doc, setDoc, getDoc } from "firebase/firestore";

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
      const displayName = `${firstName || ""} ${lastName || ""}`.trim();
      await updateProfile(userCredential.user, { displayName });
    }

    // Set default role "user" in Firestore
    await setUserRole(userCredential.user.uid, "user", { firstName, lastName });

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

    // Create Firestore doc if new user
    const docRef = doc(db, "users", result.user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      const displayName = result.user.displayName || "";
      const [firstName, ...lastNameParts] = displayName.split(" ");
      const lastName = lastNameParts.join(" ");
      await setUserRole(result.user.uid, "user", { firstName, lastName });
    }

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
    localStorage.removeItem("authToken");
  } catch {
    throw new Error("Failed to logout");
  }
};

// ========== GET USER TOKEN ==========
export const getUserToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) return await user.getIdToken();
  return null;
};

// ========== SET ROLE ==========
export const setUserRole = async (
  uid: string,
  role: "user" | "admin",
  extraData?: { firstName?: string; lastName?: string }
) => {
  await setDoc(
    doc(db, "users", uid),
    { role, ...extraData },
    { merge: true }
  );
};

// ========== GET ROLE ==========
export const getUserRole = async (uid: string): Promise<"user" | "admin"> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return docSnap.data()?.role || "user";
  return "user";
};

// ========== ERROR MESSAGES ==========
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/invalid-email": return "Invalid email address format";
    case "auth/user-not-found": return "No account found with this email";
    case "auth/wrong-password": return "Incorrect password";
    case "auth/email-already-in-use": return "Email is already registered";
    case "auth/weak-password": return "Password is too weak (min 6 characters)";
    case "auth/too-many-requests": return "Too many failed attempts. Try again later";
    case "auth/popup-closed-by-user": return "Login cancelled";
    case "auth/popup-blocked": return "Popup blocked. Allow popups for this site";
    case "auth/network-request-failed": return "Network error. Check connection";
    default: return "An error occurred. Please try again";
  }
};
