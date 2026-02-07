import { ArrowRight, Recycle, Truck, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-100 py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Cleaner Cities, <br />
              <span className="text-green-600">Smarter Future</span>
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              Join the revolution in waste management. Track collections, report issues, and contribute to a healthier environment with our smart monitoring system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/register" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-green-600 hover:bg-green-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Register Household <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link to="/complaint" className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition shadow hover:shadow-md">
                Report Issue
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 relative">
             <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
             <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
             <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            <img 
              src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
              alt="Clean City" 
              className="relative rounded-2xl shadow-2xl z-10"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose SmartWaste?</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              We leverage technology to ensure every bin is collected and every concern is addressed using real-time tracking and accountability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <Truck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Live Tracking</h3>
              <p className="text-gray-600">
                Monitor garbage collection vehicles in real-time and ensure verified attendance of sanitation workers.
              </p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Recycle size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Eco-Friendly</h3>
              <p className="text-gray-600">
                Promoting segregation at source and efficient route management to reduce carbon footprint.
              </p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6">
                <MapPin size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Citizen Reporting</h3>
              <p className="text-gray-600">
                Empowering citizens to report missed bins, illegal dumping, or other civic issues instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 py-20">
        <div className="max-w-5xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Ready to make a difference?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of households contributing to a cleaner, safer city. Register your household today.
          </p>
          <Link to="/register" className="inline-block px-8 py-4 bg-white text-green-600 font-bold rounded-full hover:bg-gray-100 transition shadow-lg">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
