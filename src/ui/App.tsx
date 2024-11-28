 
import {
  getAuth,
} from "firebase/auth";
import "./App.scss";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router";
import firebaseApp from "../constants";
import { useEffect, useState } from "react";
function App() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth(firebaseApp);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) navigate("home");
      else setLoading(false);
    });
  }, [auth, navigate]);
  if (loading) return <>Loading...</>;
  return (
    <div className="start-page">
      <img src={logo} />
      <h1>Welcome to SkyVault</h1>
      <div className="start-page__buttons">
        <button
          className="btn btn-login"
          onClick={() => {
            navigate("login");
          }}
        >
          Login
        </button>
        <button
          className="btn btn-signup"
          onClick={() => {
            navigate("signup");
          }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default App;
