import React, { useState } from 'react';
import { Users, Video, Leaf } from 'lucide-react';
import { committeeMembers } from '../config';

const HomePage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 3;

    const nextSlide = () =>
        setCurrentSlide((prev) => (prev + 1) % totalSlides);

    const prevSlide = () =>
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

    /* ================= COMMITTEE MEMBER CARD ================= */
    const MemberCard = ({ member }) => (
        <div className="
            relative bg-white p-8 rounded-2xl
            border-2 border-green-300
            shadow-[0_10px_30px_rgba(0,0,0,0.08)]
            hover:shadow-[0_18px_45px_rgba(0,0,0,0.14)]
            hover:-translate-y-1
            transition-all duration-300
            flex flex-col items-center text-center
            overflow-hidden
        ">
            {/* Eco accent bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-700 to-emerald-500" />

            {/* Icon */}
            <div className="
                w-24 h-24 rounded-full
                bg-gradient-to-br from-green-100 to-green-200
                flex items-center justify-center
                mb-4 border border-green-300
            ">
                <Users className="w-12 h-12 text-green-700" />
            </div>

            <p className="text-lg font-bold text-gray-900">
                {member.name}
            </p>

            <p className="text-sm text-green-700 font-medium mb-3">
                {member.designation}
            </p>

            <div className="px-4 py-2 rounded-lg bg-green-50 border border-green-200">
                <p className="text-sm text-gray-700">
                    📞 {member.contact}
                </p>
            </div>
        </div>
    );

    return (
        <div className="pt-10 bg-gradient-to-b from-green-50 via-white to-green-100">

            {/* ================= HERO SECTION ================= */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="
                    relative overflow-hidden rounded-2xl
                    bg-gradient-to-r from-green-700 to-green-900
                    shadow-[0_14px_40px_rgba(0,0,0,0.25)]
                ">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {[...Array(totalSlides)].map((_, i) => (
                            <div
                                key={i}
                                className="min-w-full h-[45vh] md:h-[65vh]
                                flex flex-col items-center justify-center
                                p-12 text-center text-white"
                            >
                                <Leaf className="w-24 h-24 text-emerald-300 mb-4" />

                                <h2 className="text-3xl md:text-5xl font-extrabold mb-3">
                                    Clean & Green Waste Management
                                </h2>

                                <p className="text-green-100 text-lg max-w-2xl">
                                    Government initiative for a healthier environment
                                    through smart and sustainable garbage collection.
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute top-1/2 left-4 -translate-y-1/2
                        p-3 rounded-full bg-white/90
                        text-green-800 shadow-lg hover:bg-white transition"
                    >
                        &lt;
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute top-1/2 right-4 -translate-y-1/2
                        p-3 rounded-full bg-white/90
                        text-green-800 shadow-lg hover:bg-white transition"
                    >
                        &gt;
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-5 left-0 right-0 flex justify-center space-x-2">
                        {[...Array(totalSlides)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={`w-3 h-3 rounded-full ${
                                    i === currentSlide
                                        ? 'bg-emerald-400'
                                        : 'bg-green-200'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= KEY METRICS ================= */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-14">
                    <h2 className="text-4xl font-extrabold text-green-900">
                        Environmental Impact
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Measuring cleanliness and sustainability
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {[
                        { value: '14,520+', label: 'Households Covered' },
                        { value: '6,800 Tons', label: 'Waste Collected' },
                        { value: '92%', label: 'Waste Segregation' }
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="
                                bg-white rounded-2xl p-8 text-center
                                border border-green-300
                                shadow-[0_10px_30px_rgba(0,0,0,0.08)]
                                hover:-translate-y-1
                                transition-all duration-300
                            "
                        >
                            <p className="text-4xl font-extrabold text-green-700 mb-2">
                                {item.value}
                            </p>
                            <p className="text-gray-600 font-medium">
                                {item.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= COMMITTEE MEMBERS ================= */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-green-900">
                        Committee Members
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Officials supervising cleanliness initiatives
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
                    {committeeMembers.map((member, index) => (
                        <MemberCard key={index} member={member} />
                    ))}
                </div>
            </section>

        </div>
    );
};

export default HomePage;
