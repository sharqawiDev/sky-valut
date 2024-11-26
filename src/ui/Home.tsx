import { auth } from "../constants";
import "./App.scss";
export const Home = () => {
  const { currentUser, name, signOut } = auth;
  return (
    <div className="home-page">
      <div className="home-page__header">
        <p>Welcome, user</p>
        <button>Sign Out</button>
      </div>
    </div>
  );
};
