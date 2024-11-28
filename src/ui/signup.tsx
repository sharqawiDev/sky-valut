import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signOut } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router";
import firebaseApp from "../constants";

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState(""); // New state for display name
  const navigate = useNavigate();
  const auth = getAuth(firebaseApp);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Create a user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user profile to add display name
      await updateProfile(user, {
        displayName: displayName,
      });

      // Send a verification email to the user
      await sendEmailVerification(user);

      // Sign out the user immediately after sign-up
      await signOut(auth);

      // Navigate to the login page immediately after signing out
      navigate("/login");

      // Show the alert after navigation
      alert("A verification email has been sent. Please verify your email to log in.");
    } catch (e) {
      alert("Error during sign up: " + e.message);
    }
  };

  const isValid =
    /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email) &&
    password.length > 3 &&
    password === confirmPassword &&
    displayName.trim().length > 0;

  return (
    <div className="signup-page">
      <h1>Sign Up</h1>
      <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
        <input
          value={displayName}
          className="input"
          type="text"
          placeholder="Enter your display name"
          required
          onChange={(v) => setDisplayName(v.target.value)}
        />
        <input
          value={email}
          className="input"
          type="email"
          placeholder="Enter your email"
          required
          onChange={(v) => setEmail(v.target.value)}
        />
        <input
          value={password}
          className="input"
          type="password"
          placeholder="Enter your password"
          required
          onChange={(v) => setPassword(v.target.value)}
        />
        <input
          value={confirmPassword}
          className="input"
          type="password"
          placeholder="Confirm your password"
          required
          onChange={(v) => setConfirmPassword(v.target.value)}
        />
        <button
          type="submit"
          onClick={handleSignUp}
          disabled={!isValid}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};
