import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
    User, Mail, Lock, Home, MapPin, Phone, Upload,
    FileText, CheckCircle2, ChevronRight, Leaf, ArrowLeft, Eye, EyeOff
} from 'lucide-react';
import api from '../api/axios';
import { usePanchayat } from '../context/PanchayatContext';
import Breadcrumb from './shared/Breadcrumb';
import Footer from './shared/Footer';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45 } })
};

/* ─── Defined OUTSIDE RegisterPage so React never remounts it on state change ─── */
const InputField = ({ label, icon: Icon, type = 'text', value, onChange, placeholder, required = false }) => (
    <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <div className="relative">
            {Icon && (
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Icon className="w-4 h-4 text-gray-400" />
                </span>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="input-field"
                style={Icon ? { paddingLeft: '2.5rem' } : {}}
            />
        </div>
    </div>
);

const RegisterPage = ({ navigate }) => {
    const { selectedPanchayat } = usePanchayat();

    const [form, setForm] = useState({
        ownerName: '',
        email: '',
        mobile: '',
        houseNumber: '',
        ward: '',
        address: '',
        pincode: '',
    });
    const [wards, setWards] = useState([]);
    const [identityFile, setIdentityFile] = useState(null);
    const [premisesFile, setPremisesFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchingWards, setFetchingWards] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Fetch wards whenever panchayat changes
    React.useEffect(() => {
        if (selectedPanchayat?._id) {
            const fetchWards = async () => {
                setFetchingWards(true);
                try {
                    const res = await api.get(`/wards/public?panchayatId=${selectedPanchayat._id}`);
                    setWards(res.data);
                    // Reset ward field if current choice is not in new list
                    setForm(p => ({ ...p, ward: '' }));
                } catch (err) {
                    console.error('Error fetching wards:', err);
                    toast.error('Could not fetch wards for the selected Panchayat.');
                } finally {
                    setFetchingWards(false);
                }
            };
            fetchWards();
        } else {
            setWards([]);
        }
    }, [selectedPanchayat]);

    const update = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedPanchayat?._id) {
            toast.error('Please select your Panchayat first from the top bar.');
            return;
        }
        if (!form.ownerName || !form.mobile || !form.houseNumber || !form.ward || !form.address) {
            toast.error('Please fill in all required fields.');
            return;
        }
        if (form.mobile.length < 10) {
            toast.error('Please enter a valid 10-digit mobile number.');
            return;
        }
        if (!identityFile) {
            toast.error('Please upload your Identity Proof document (Aadhaar, Passport, or Voter ID).');
            return;
        }
        if (!premisesFile) {
            toast.error('Please upload your Premises Proof document (Electricity bill or Rent agreement).');
            return;
        }

        setLoading(true);
        try {
            const data = new FormData();
            Object.entries(form).forEach(([k, v]) => data.append(k, v));
            data.append('panchayatId', selectedPanchayat._id);
            if (identityFile) data.append('identity', identityFile);
            if (premisesFile) data.append('premises', premisesFile);

            const res = await api.post('/households/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                setSubmitted(true);
                toast.success('Registration submitted successfully!');
            } else {
                toast.error(res.data.message || 'Registration failed.');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not connect to server. Try again.');
        } finally {
            setLoading(false);
        }
    };


    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--surface-2)' }}>
                <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="card p-12 max-w-md w-full text-center"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">
                        Registration Submitted!
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                        Your registration request for <span className="font-semibold text-gray-800">{selectedPanchayat?.name}</span> is under review. The Panchayat admin will approve it shortly.
                    </p>
                    <p className="text-xs text-gray-400 mb-8">You will be able to log in once your account is approved.</p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={() => navigate('home')} className="btn-primary px-6 py-2.5 text-sm">
                            Back to Home
                        </button>
                        <button onClick={() => navigate('login-household')} className="btn-outline px-6 py-2.5 text-sm">
                            Try Login
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ background: 'var(--surface-2)' }}>
            <div className="max-w-3xl mx-auto px-4 py-10">
                <Breadcrumb path={[{ label: 'Register', view: null }]} navigate={navigate} />

                {/* Header */}
                <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 border border-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Leaf className="w-7 h-7 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                        Household <span className="gradient-text">Registration</span>
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Register your household under{' '}
                        <span className="font-semibold text-green-700">
                            {selectedPanchayat ? selectedPanchayat.name : 'your Panchayat'}
                        </span>
                    </p>
                </motion.div>

                {!selectedPanchayat && (
                    <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible"
                        className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-sm flex items-center gap-3">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>Please select your <strong>Panchayat</strong> from the top bar before registering.</span>
                    </motion.div>
                )}

                <motion.form
                    variants={fadeUp}
                    custom={2}
                    initial="hidden"
                    animate="visible"
                    onSubmit={handleSubmit}
                    className="card p-8 space-y-6"
                >
                    {/* Personal Info */}
                    <div>
                        <h2 className="text-base font-display font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                            Personal Information
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <InputField label="Full Name (Owner)" icon={User} value={form.ownerName} onChange={update('ownerName')} placeholder="Enter full name" required />
                            <InputField label="Email Address" icon={Mail} type="email" value={form.email} onChange={update('email')} placeholder="Enter email (optional)" />
                            <InputField label="Mobile Number" icon={Phone} type="tel" value={form.mobile} onChange={update('mobile')} placeholder="10-digit mobile number" required />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <h2 className="text-base font-display font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                            Address Details
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <InputField label="House Number" icon={Home} value={form.houseNumber} onChange={update('houseNumber')} placeholder="Enter house number" required />
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                    Area / Ward<span className="text-red-500 ml-0.5">*</span>
                                </label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                    </span>
                                    <select
                                        value={form.ward}
                                        onChange={update('ward')}
                                        className="input-field appearance-none pl-10 pr-10"
                                        disabled={fetchingWards || !selectedPanchayat}
                                    >
                                        <option value="">{fetchingWards ? 'Loading wards...' : 'Select Ward'}</option>
                                        {wards.map(w => (
                                            <option key={w._id} value={w.name}>{w.name}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                        <ChevronRight className="w-4 h-4 rotate-90" />
                                    </div>
                                </div>
                            </div>
                            <InputField label="Pincode" icon={MapPin} value={form.pincode} onChange={update('pincode')} placeholder="Enter pincode" />
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                    Full Address<span className="text-red-500 ml-0.5">*</span>
                                </label>
                                <textarea
                                    value={form.address}
                                    onChange={update('address')}
                                    rows={2}
                                    placeholder="Street, Area, City..."
                                    className="input-field resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Document Uploads */}
                    <div>
                        <h2 className="text-base font-display font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                            Upload Documents
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {/* Identity */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                    Identity Proof<span className="text-red-500 ml-0.5">*</span>
                                </label>
                                <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-5 cursor-pointer transition-all group ${
                                    identityFile ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-green-400 hover:bg-green-50'
                                }`}>
                                    <Upload className={`w-6 h-6 mb-2 transition-colors ${identityFile ? 'text-green-500' : 'text-gray-400 group-hover:text-green-500'}`} />
                                    <span className={`text-sm font-medium transition-colors ${identityFile ? 'text-green-700' : 'text-gray-600 group-hover:text-green-700'}`}>
                                        {identityFile ? identityFile.name : 'Choose file'}
                                    </span>
                                    <span className="text-xs text-gray-400 mt-1">Aadhaar, Passport, Voter ID</span>
                                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setIdentityFile(e.target.files[0])} className="hidden" />
                                </label>
                            </div>
                            {/* Premises */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                    Premises Proof<span className="text-red-500 ml-0.5">*</span>
                                </label>
                                <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-5 cursor-pointer transition-all group ${
                                    premisesFile ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-green-400 hover:bg-green-50'
                                }`}>
                                    <Upload className={`w-6 h-6 mb-2 transition-colors ${premisesFile ? 'text-green-500' : 'text-gray-400 group-hover:text-green-500'}`} />
                                    <span className={`text-sm font-medium transition-colors ${premisesFile ? 'text-green-700' : 'text-gray-600 group-hover:text-green-700'}`}>
                                        {premisesFile ? premisesFile.name : 'Choose file'}
                                    </span>
                                    <span className="text-xs text-gray-400 mt-1">Electricity bill, Rent agreement</span>
                                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setPremisesFile(e.target.files[0])} className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Panchayat chip */}
                    {selectedPanchayat && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200 text-sm text-green-800">
                            <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                            Registering under: <strong>{selectedPanchayat.name}</strong>
                        </div>
                    )}

                    {/* Submit */}
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={loading}
                        className="btn-primary w-full py-3.5 text-base disabled:opacity-60"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2 justify-center">
                                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Submitting...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 justify-center">
                                <CheckCircle2 className="w-5 h-5" /> Register
                            </span>
                        )}
                    </motion.button>

                    <p className="text-center text-sm text-gray-500">
                        Already registered?{' '}
                        <button type="button" onClick={() => navigate('login-household')} className="text-green-700 font-semibold hover:underline">
                            Login here
                        </button>
                    </p>
                </motion.form>
            </div>
            <Footer navigate={navigate} />
        </div>
    );
};

export default RegisterPage;
