import { Link, useLocation } from "react-router-dom";
import { Menu, X, Leaf, MapPin } from "lucide-react";
import { useState } from "react";
import { usePanchayat } from "../context/PanchayatContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedPanchayat, changePanchayat } = usePanchayat();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "text-green-600 font-bold" : "text-gray-700 hover:text-green-600 font-medium";
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-green-600 p-2 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">EcoSyz</span>
          </Link>

          {/* Location / Panchayat Selector */}
          <button 
            onClick={changePanchayat}
            className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 hover:bg-green-100 rounded-full border border-green-200 transition text-sm text-green-800"
          >
            <MapPin className="w-4 h-4" />
            <span className="font-semibold">{selectedPanchayat ? selectedPanchayat.name : "Select Panchayat"}</span>
          </button>

          {/* Desktop Menu */}        
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`${isActive("/")} transition`}>Home</Link>
            <Link to="/about" className={`${isActive("/about")} transition`}>About</Link>
            <Link to="/segregation" className={`${isActive("/segregation")} transition`}>Segregation Guide</Link>
            <Link to="/complaint" className={`${isActive("/complaint")} transition`}>Report Issue</Link>
            <div className="flex items-center gap-3">
              <Link to="/register" className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition shadow-sm font-medium">
                Register
              </Link>
              <Link to="/login" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm">
                Login
              </Link>
            </div>
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
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded-md" style={location.pathname === "/" ? { color: "#16a34a", fontWeight: "bold", backgroundColor: "#f0fdf4" } : {}}>Home</Link>
            <Link to="/about" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded-md" style={location.pathname === "/about" ? { color: "#16a34a", fontWeight: "bold", backgroundColor: "#f0fdf4" } : {}}>About</Link>
            <Link to="/segregation" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded-md" style={location.pathname === "/segregation" ? { color: "#16a34a", fontWeight: "bold", backgroundColor: "#f0fdf4" } : {}}>Segregation Guide</Link>
            <Link to="/complaint" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded-md" style={location.pathname === "/complaint" ? { color: "#16a34a", fontWeight: "bold", backgroundColor: "#f0fdf4" } : {}}>Report Issue</Link>
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
              <Link to="/register" className="block px-3 py-2 border border-green-600 text-green-600 text-center rounded-md font-medium">Register Household</Link>
              <Link to="/login" className="block px-3 py-2 bg-green-600 text-white text-center rounded-md font-medium">Login</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
