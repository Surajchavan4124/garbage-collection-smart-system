const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          About SmartWaste
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Transforming waste management through transparency, technology, and community participation.
        </p>
      </div>

      <div className="mt-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-green-500 rounded-md shadow-lg">
                    {/* Icon */}
                    <span className="text-white text-xl font-bold">01</span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Our Mission</h3>
                  <p className="mt-5 text-base text-gray-500">
                    To maintain clean and hygienic surroundings in Panchayats and Corporations by implementing a digital, accountable system for garbage collection.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-green-500 rounded-md shadow-lg">
                    <span className="text-white text-xl font-bold">02</span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">The Problem</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Traditional methods suffer from manual attendance fraud, lack of proof of collection, and unaddressed citizen complaints.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-green-500 rounded-md shadow-lg">
                    <span className="text-white text-xl font-bold">03</span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">The Solution</h3>
                  <p className="mt-5 text-base text-gray-500">
                    A QR-code based monitoring system with GPS validation, real-time dashboards for admins, and a transparent mobile app for citizens.
                  </p>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default About;
