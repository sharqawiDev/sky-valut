import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router";
import firebaseApp from "../constants";

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const auth = getAuth(firebaseApp);


  const handleSignUp = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => navigate("/home"))
      .catch((e) => alert(e.message));
  };

  const isValid =
    /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email) &&
    password.length > 3 &&
    password === confirmPassword;

  return (
    <div className="signup-page">
      <h1>Sign Up</h1>
      <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
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
          onClick={() => handleSignUp()}
          disabled={!isValid}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};
