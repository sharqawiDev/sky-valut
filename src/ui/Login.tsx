import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router";
import firebaseApp from "../constants";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const navigate = useNavigate();
  const auth = getAuth(firebaseApp);
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => navigate("/home"))
      .catch((e) => alert(e.message));
  };

  const handleForgotPassword = () => {
    if (resetEmail) {
      sendPasswordResetEmail(auth, resetEmail)
        .then(() => {
          alert("Password reset email sent! Please check your inbox.");
          setShowForgotPassword(false);
        })
        .catch((e) => {
          alert(e.message);
        });
    } else {
      alert("Please enter your email address to receive the password reset link.");
    }
  };

  const isValid =
    /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email) && password.length > 3;

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form className="login-form" onSubmit={(e) => e.preventDefault()}>
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
        <button type="submit" onClick={() => handleLogin()} disabled={!isValid}>
          Login
        </button>
      </form>
      <p>
        <a
          href="#"
          id="forgot-password"
          onClick={() => setShowForgotPassword(true)}
        >
          Forgot my password?
        </a>
      </p>

      {showForgotPassword && (
        <div className="forgot-password-popup">
          <div className="popup-content">
            <h2>Reset Password</h2>
            <input
              value={resetEmail}
              className="input"
              type="email"
              placeholder="Enter your email"
              required
              onChange={(v) => setResetEmail(v.target.value)}
            />
            <button onClick={() => handleForgotPassword()}>Submit</button>
            <button onClick={() => setShowForgotPassword(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};
