import { Link } from "react-router";
import { DEFAULT_PFP_URL } from "../utils/profile.js";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { logout } from "../services/auth.js";

const Header = () => {
  const [user, setUser] = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
    <header className="navbar px-4">
      {/* logo */}
      <h1 className="fw-bold">tunez</h1>

      {user ? (
        // user profile picture and controls
        <nav className="nav align-items-center">
          <p className="mb-0 me-2">{user.username}</p>
          <img
            src={user.profilePicture || DEFAULT_PFP_URL}
            className="rounded"
            alt="my profile picture"
            width="35px"
            height="35px"
          />
          <div className="dropdown dropstart">
            <button
              className="btn dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            ></button>
            <div className="dropdown-menu">
              <button className="btn w-100" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </div>
        </nav>
      ) : (
        // sign up or login nav
        <nav className="nav">
          <button className="btn btn-light me-2">
            <Link
              to="/signup"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Sign Up
            </Link>
          </button>
          <button className="btn btn-primary">
            <Link
              to="/login"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Log In
            </Link>
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;
