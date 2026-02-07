import { Link } from "react-router-dom";
import { User, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-green-600 flex items-center gap-2">
              <span className="text-3xl">♻️</span> SmartWaste
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-green-600 font-medium transition">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-green-600 font-medium transition">About</Link>
            <Link to="/register" className="text-gray-700 hover:text-green-600 font-medium transition">Register Household</Link>
            <Link to="/complaint" className="text-gray-700 hover:text-green-600 font-medium transition">Report Issue</Link>
            <Link to="/login" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm">
              Login
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-green-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded-md">Home</Link>
            <Link to="/about" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded-md">About</Link>
            <Link to="/register" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded-md">Register Household</Link>
            <Link to="/complaint" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded-md">Report Issue</Link>
            <Link to="/login" className="block px-3 py-2 text-green-600 font-medium hover:bg-green-50 rounded-md">Login</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
