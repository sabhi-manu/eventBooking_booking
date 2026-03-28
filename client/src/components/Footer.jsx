// components/Footer.jsx
import { Link } from "react-router-dom";
import { FaTicketAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white mt-16">
      
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Logo & About */}
        <div>
          <div className="flex items-center gap-2 text-xl font-semibold mb-3">
            <FaTicketAlt className="text-yellow-400" />
            Eventora
          </div>
          <p className="text-gray-400 text-sm">
            Discover and book amazing events around you.  
            From concerts to tech meetups — all in one place.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <div className="flex flex-col gap-2 text-gray-400 text-sm">
            <Link to="/" className="hover:text-yellow-400 transition">
              Home
            </Link>
            <Link to="/events" className="hover:text-yellow-400 transition">
              Events
            </Link>
            <Link to="/dashboard" className="hover:text-yellow-400 transition">
              Dashboard
            </Link>
            <Link to="/create" className="hover:text-yellow-400 transition">
              Create Event
            </Link>
          </div>
        </div>

        {/* Contact / Info */}
        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          <p className="text-gray-400 text-sm">
            📧 support@eventora.com
          </p>
          <p className="text-gray-400 text-sm mt-1">
            📍 India
          </p>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 text-center py-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} Eventora. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;