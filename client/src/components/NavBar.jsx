import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { FaTicketAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-black text-white px-8 py-4 flex justify-between items-center shadow-md">
      
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 text-xl font-semibold hover:text-gray-300 transition">
        <FaTicketAlt className="text-yellow-400 text-2xl" />
        Eventora
      </Link>

      {/* Links */}
      <div className="flex items-center gap-6 text-sm md:text-base">
        
        {/* <Link
          to="/events"
          className="hover:text-yellow-400 transition"
        >
          Events
        </Link> */}

        {user ? (
          <>
            <Link
              to={user.role === "admin" ? "/admin" : "/dashboard"}
              className="hover:text-yellow-400 transition"
            >
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-md transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hover:text-yellow-400 transition"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-yellow-400 text-black px-4 py-1.5 rounded-md hover:bg-yellow-500 transition font-medium"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
