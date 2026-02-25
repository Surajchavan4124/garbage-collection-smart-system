import React, { useState, useEffect } from 'react';
import { Users, Zap, Globe, Clock, CheckCircle, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { committeeMembers, contactMembers } from '../config';
import Button from './shared/Button';
import Footer from './shared/Footer';

// ✅ IMPORT IMAGES FROM src/assets
import img1 from '../assets/imgg1.png';
import img2 from '../assets/imgg.png';
import img3 from '../assets/img3.png';

const slides = [
    { image: img1 },
    { image: img2 },
    { image: img3 }
];

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
};

const features = [
    { icon: <Globe className="w-8 h-8" />, title: 'Easy Scheduling', desc: 'Schedule pickups at convenient times' },
    { icon: <Zap className="w-8 h-8" />, title: 'Real-time Tracking', desc: 'Track your waste collection in real-time' },
    { icon: <Clock className="w-8 h-8" />, title: '24/7 Service', desc: 'Available round the clock for support' },
    { icon: <CheckCircle className="w-8 h-8" />, title: 'Quality Assurance', desc: 'Eco-friendly and certified processes' },
];

const HomePage = ({ navigate }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const MemberCard = ({ member }) => (
        <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative p-8 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col items-center text-center"
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

    const FeatureCard = ({ feature, delay }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all border border-green-100"
        >
            <div className="text-green-600 mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
        </motion.div>
    );

    return (
        <div className="bg-gradient-to-b from-green-50 via-white to-green-100 min-h-screen">

            {/* ================= CAROUSEL ================= */}
            <section className="w-full py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="relative grid place-items-center overflow-hidden rounded-3xl shadow-2xl bg-black aspect-[16/9]">

                        <motion.img
                            key={currentSlide}
                            src={slides[currentSlide].image}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 w-full h-full object-cover"
                            alt="Carousel Slide"
                        />

                        <div className="absolute inset-0 bg-black/10" />

                        {/* Controls */}
                        <button
                            onClick={() =>
                                setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
                            }
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 text-green-800 hover:bg-white grid place-items-center transition"
                        >
                            ❮
                        </button>

                        <button
                            onClick={() =>
                                setCurrentSlide((prev) => (prev + 1) % slides.length)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 text-green-800 hover:bg-white grid place-items-center transition"
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

            {/* ================= FEATURES SECTION ================= */}
            <section className="w-full py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Our door-to-door garbage collection system provides convenient, reliable, and eco-friendly waste management solutions.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, i) => (
                            <FeatureCard key={i} feature={feature} delay={i * 0.1} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= CTA SECTION ================= */}
            <section className="w-full py-16 px-4 bg-gradient-to-r from-green-600 to-emerald-500">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Get Started?
                        </h2>
                        <p className="text-lg text-white/90 mb-8">
                            Join thousands of satisfied customers managing their waste responsibly.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={() => navigate('registration-household')}
                                className="bg-white text-green-600 hover:bg-white/90"
                            >
                                Register As Household
                            </Button>
                            <Button
                                outline
                                onClick={() => navigate('registration-company')}
                                className="text-white border-white hover:bg-white/20"
                            >
                                Register As Company
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ================= COMMITTEE SECTION ================= */}
            <section className="w-full py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Leadership</h2>
                        <p className="text-lg text-gray-600">
                            Meet the dedicated committee members guiding our mission.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {committeeMembers.map((member, i) => (
                            <MemberCard key={i} member={member} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= STATS SECTION ================= */}
            <section className="w-full py-20 px-4 bg-green-100/50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: '50K+', label: 'Active Users' },
                            { number: '100%', label: 'Eco-Friendly' },
                            { number: '24/7', label: 'Support Available' },
                            { number: '500+', label: 'Areas Covered' }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-4xl font-bold text-green-600 mb-2">{stat.number}</h3>
                                <p className="text-gray-600 font-medium">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= FOOTER ================= */}
            <Footer navigate={navigate} />
        </div>
    );
};

export default HomePage;