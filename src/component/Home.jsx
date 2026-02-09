import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { committeeMembers } from '../config';

/* ================= IMAGE SLIDES ================= */
const slides = [
    { image: '/images/imgg1.png' },
    { image: '/images/imgg.png' },
    { image: '/images/img3.png' }
];

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
};

const HomePage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    /* ================= AUTO PLAY ================= */
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    /* ================= MEMBER CARD ================= */
    const MemberCard = ({ member }) => (
        <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="
                relative p-8 rounded-2xl
                bg-white/60 backdrop-blur-xl
                border border-white/40
                shadow-lg hover:shadow-2xl
                hover:-translate-y-1 transition-all
                flex flex-col items-center text-center
            "
        >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-600 to-emerald-400" />

            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Users className="w-12 h-12 text-green-700" />
            </div>

            <p className="text-lg font-bold text-gray-900">
                {member.name}
            </p>

            <p className="text-sm text-green-700 font-medium mb-3">
                {member.designation}
            </p>

            <div className="px-4 py-2 rounded-lg bg-white border border-green-200">
                <p className="text-sm text-gray-700">
                    📞 {member.contact}
                </p>
            </div>
        </motion.div>
    );

    return (
        <div className="bg-gradient-to-b from-green-50 via-white to-green-100">

            {/* ================= GRID-BASED IMAGE CAROUSEL ================= */}
            <section className="w-full py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="relative grid place-items-center overflow-hidden rounded-3xl shadow-2xl bg-black aspect-[16/9]">

                        {/* Image */}
                        <motion.img
                            key={currentSlide}
                            src={slides[currentSlide].image}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 w-full h-full object-cover"
                            alt="Carousel Slide"
                        />

                        {/* Soft overlay */}
                        <div className="absolute inset-0 bg-black/10" />

                        {/* Controls */}
                        <button
                            onClick={() =>
                                setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
                            }
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20
                                       w-10 h-10 rounded-full bg-white/90 text-green-800
                                       hover:bg-white grid place-items-center"
                        >
                            ❮
                        </button>

                        <button
                            onClick={() =>
                                setCurrentSlide((prev) => (prev + 1) % slides.length)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20
                                       w-10 h-10 rounded-full bg-white/90 text-green-800
                                       hover:bg-white grid place-items-center"
                        >
                            ❯
                        </button>

                        {/* Dots */}
                        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-3 z-20">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentSlide(i)}
                                    className={`w-3 h-3 rounded-full ${
                                        i === currentSlide
                                            ? 'bg-emerald-400 scale-110'
                                            : 'bg-white/70'
                                    } transition`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= METRICS ================= */}
            <section className="container mx-auto px-6 py-20">
                <div className="text-center mb-16">
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
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="
                                bg-white rounded-2xl p-8 text-center
                                border border-green-300
                                shadow-lg hover:-translate-y-1 transition
                            "
                        >
                            <p className="text-4xl font-extrabold text-green-700 mb-2">
                                {item.value}
                            </p>
                            <p className="text-gray-600 font-medium">
                                {item.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ================= COMMITTEE ================= */}
            <section className="container mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-green-900">
                        Committee Members
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Officials supervising cleanliness initiatives
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {committeeMembers.map((member, i) => (
                        <MemberCard key={i} member={member} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
