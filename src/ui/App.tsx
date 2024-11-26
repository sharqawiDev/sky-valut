import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getRecaptchaVerifier, signInWithEmailLink } from "firebase/auth";
import "./App.scss";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router";
import { auth } from "../constants";
import { useEffect } from "react";
function App() {
  const navigate = useNavigate();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log(user);
      if (user) navigate("home");
    });
  }, [auth, navigate]);
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
