import { useNavigate } from "react-router";
import { signOut } from "firebase/auth";
import firebaseApp from "../constants";
import "./App.scss";
import { getAuth } from "firebase/auth";
export const Home = () => {
  const auth = getAuth(firebaseApp);
  const { currentUser } = auth;
  const navigate = useNavigate();
  const handleSignOut = () => {
    signOut(auth).then(() => navigate("/", { replace: true }));
  };
  return (
    <div className="home-page">
      <div className="home-page__header">
        <p>Welcome, {currentUser?.displayName || currentUser?.email}</p>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </div>
  );
};
