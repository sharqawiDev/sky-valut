export const Signup = () => {
  return (
    <div className="signup-page">
      <h1>Sign Up</h1>
      <form className="signup-form">
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
        <input
          className="input"
          type="password"
          placeholder="Confirm your password"
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};
