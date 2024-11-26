import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router";
import { auth } from "../constants";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => navigate("/home"))
      .catch((e) => alert(e.message));
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
        <a href="#" id="forgot-password">
          Forgot my password?
        </a>
      </p>
    </div>
  );
};
