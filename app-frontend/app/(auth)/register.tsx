import React, { useState, useEffect } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, RefreshCw } from "lucide-react-native"; // User icon requested
import Dropdown from "../../components/Dropdown";

// Replace with your local IP
// Replace with your local IP
const API_URL = 'http://192.168.0.131:5000/api';

export default function RegisterScreen() {
    const router = useRouter();

    const [panchayatList, setPanchayatList] = useState<{ label: string; value: string }[]>([]);
    const [panchayatName, setPanchayatName] = useState("");
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");

    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    // Colors
    const RED_REFRESH = "#EF4444";
    const GREEN_LIGHT = "#86EFAC";
    const GREEN_DARK = "#16A34A";

    // Fetch Panchayats on Mount
    useEffect(() => {
        fetchPanchayats();
    }, []);

    const fetchPanchayats = async () => {
        try {
            const response = await fetch(`${API_URL}/panchayat`);
            const data = await response.json();
            if (response.ok) {
                const uniqueNames = Array.from(new Set(data.map((p: any) => p.name)));
                const list = uniqueNames.map((name) => ({ label: name as string, value: name as string }));
                setPanchayatList(list);
            }
        } catch (error) {
            console.error("Failed to fetch panchayats", error);
        }
    };

    const handleRefresh = () => {
        setPanchayatName("");
        setMobile("");
        setOtp("");
        setOtpSent(false);
    };

    const handleRegister = async () => {
        if (!otpSent) {
            // Step 1: Send OTP
            if (!mobile || !panchayatName) {
                Alert.alert("Error", "Please select Panchayat and enter Mobile");
                return;
            }

            setLoading(true);
            try {
                // Call Backend Send OTP with type='register'
                const response = await fetch(`${API_URL}/auth/send-otp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        mobile,
                        panchayatName,
                        type: 'register' // Important flag
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    setOtpSent(true);
                    Alert.alert("OTP Sent", "Code sent to backend terminal!");
                } else {
                    Alert.alert("Error", data.message || "Failed to send OTP");
                }
            } catch (error) {
                Alert.alert("Error", "Network request failed. Check server.");
            } finally {
                setLoading(false);
            }

        } else {
            // Step 2: Submit Registration
            if (otp.length < 4) {
                Alert.alert("Error", "Enter Valid OTP");
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/auth/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        mobile,
                        otp,
                        panchayatName,
                        // Name is optional now or handled by backend
                        name: "Employee"
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    Alert.alert("Success", "Registration Successful!");
                    router.replace('/(auth)/login');
                } else {
                    Alert.alert("Registration Failed", data.message || "Unknown error");
                }

            } catch (error) {
                Alert.alert("Error", "Network request failed");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 px-8 justify-center">

                <View className="items-center mb-10">
                    <View className="w-24 h-24 bg-purple-50 rounded-full items-center justify-center mb-4 border-2 border-purple-100">
                        {/* CHANGED ICON TO USER/PERSON */}
                        <User size={40} color="#6B5BFF" />
                    </View>
                    <Text className="text-3xl font-bold text-slate-800">Registration</Text>
                    <Text className="text-slate-500 mt-2">Join your Panchayat</Text>
                </View>

                <View className="space-y-4">
                    {/* Panchayat Dropdown */}
                    <View>
                        <Text className="text-slate-600 mb-2 ml-1 font-medium">Panchayat Name</Text>
                        {!otpSent ? (
                            <Dropdown
                                data={panchayatList}
                                value={panchayatName}
                                onChange={setPanchayatName}
                                placeholder="Select Panchayat"
                            />
                        ) : (
                            <View className="h-14 border border-slate-200 rounded-xl px-4 bg-slate-100 justify-center">
                                <Text className="text-slate-500">{panchayatName}</Text>
                            </View>
                        )}
                    </View>

                    {/* Mobile Input */}
                    <View>
                        <Text className="text-slate-600 mb-2 ml-1 font-medium">Mobile Number</Text>
                        <TextInput
                            className="h-14 border border-slate-200 rounded-xl px-4 bg-slate-50 text-base"
                            placeholder="10-digit Mobile"
                            keyboardType="phone-pad"
                            value={mobile}
                            onChangeText={setMobile}
                            maxLength={10}
                            editable={!otpSent}
                        />
                    </View>

                    {otpSent && (
                        <View>
                            <Text className="text-slate-600 mb-2 ml-1 font-medium">Enter OTP</Text>
                            <TextInput
                                className="h-14 border border-slate-200 rounded-xl px-4 bg-slate-50 text-base"
                                placeholder="OTP"
                                keyboardType="number-pad"
                                value={otp}
                                onChangeText={setOtp}
                                maxLength={6}
                            />
                        </View>
                    )}
                </View>

                <View className="flex-row mt-10 gap-4">
                    <TouchableOpacity
                        className="flex-1 h-14 rounded-xl items-center justify-center shadow-sm"
                        style={{ backgroundColor: RED_REFRESH }}
                        onPress={handleRefresh}
                    >
                        <Text className="text-white font-bold text-lg">Refresh</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-1 h-14 rounded-xl items-center justify-center shadow-sm"
                        style={{ backgroundColor: loading ? GREEN_DARK : GREEN_LIGHT }}
                        activeOpacity={0.8}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="white" /> : (
                            <Text className={`font-bold text-lg ${loading ? 'text-white' : 'text-green-900'}`}>{otpSent ? 'Submit' : 'Get OTP'}</Text>
                        )}
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
