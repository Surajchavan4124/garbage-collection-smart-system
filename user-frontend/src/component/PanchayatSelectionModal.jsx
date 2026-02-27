import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import Button from './shared/Button';
import { MapPin } from 'lucide-react';

const PanchayatSelectionModal = ({ onSelect }) => {
    const [panchayats, setPanchayats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPanchayats = async () => {
            try {
                // Fetch active panchayats
                const response = await axios.get(`${API_BASE_URL}/panchayats?status=active`);
                setPanchayats(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch panchayats:", err);
                setError("Could not load panchayats. Please try again.");
                setLoading(false);
            }
        };

        fetchPanchayats();
    }, []);

    const handleSelect = (panchayat) => {
        // Save to localStorage
        localStorage.setItem('selectedPanchayat', JSON.stringify({
            id: panchayat._id,
            name: panchayat.name
        }));
        
        // Notify parent
        onSelect(panchayat);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl relative">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Select Your Panchayat</h2>
                    <p className="text-gray-500 mt-2 text-sm">
                        Please choose your local panchayat to view relevant schedules, statistics, and information.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center p-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
                        {error}
                    </div>
                ) : panchayats.length === 0 ? (
                    <div className="text-gray-500 text-center p-4">
                        No active panchayats found.
                    </div>
                ) : (
                    <div className="max-h-64 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                        {panchayats.map((p) => (
                            <button
                                key={p._id}
                                onClick={() => handleSelect(p)}
                                className="w-full text-left p-4 rounded-xl border-2 border-transparent hover:border-green-500 bg-gray-50 hover:bg-green-50 transition-all group flex justify-between items-center"
                            >
                                <div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-green-700">{p.name}</h3>
                                    {p.address && <p className="text-sm text-gray-500 truncate mt-1">{p.address}</p>}
                                </div>
                                <div className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    →
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PanchayatSelectionModal;
