import { useNavigate } from "react-router";

export const Login = () => {
  const navigate = useNavigate();
  return (
    <div className="login-page">
      <h1>Login</h1>
      <form className="login-form">
        <input
          className="input"
          type="email"
          placeholder="Enter your email"
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Enter your password"
          required
        />
        <button type="submit" onClick={() => navigate("/home")}>
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
