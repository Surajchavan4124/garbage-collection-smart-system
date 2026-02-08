import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-green-400">EcoSyz</h3>
            <p className="text-gray-400 text-sm">
              Empowering communities with smart, digital, and transparent waste management solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/" className="hover:text-green-400 transition">Home</a></li>
              <li><a href="/about" className="hover:text-green-400 transition">About Us</a></li>
              <li><a href="/register" className="hover:text-green-400 transition">Register</a></li>
              <li><a href="/complaint" className="hover:text-green-400 transition">Track Complaint</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-green-400" />
                <span>123 Green Street, Smart City</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-green-400" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-green-400" />
                <span>support@ecosyz.com</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition transform hover:scale-110">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition transform hover:scale-110">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition transform hover:scale-110">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} EcoSyz. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
