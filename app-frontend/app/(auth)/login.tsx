import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Leaf } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dropdown from "../../components/Dropdown";
import Toast from "../../components/Toast";

// CONSTANTS
// Replace with your local IP
const API_URL = 'http://192.168.0.131:5000/api';

export default function LoginScreen() {
  const router = useRouter();

  // State
  const [panchayatList, setPanchayatList] = useState<{ label: string; value: string }[]>([]);
  const [panchayatName, setPanchayatName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Toast State
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('error');

  // Colors
  const PRIMARY_COLOR = "#6B5BFF";
  const BORDER_COLOR = "#D1D1D1";

  // Fetch Panchayats on Mount
  useEffect(() => {
    fetchPanchayats();
  }, []);

  const fetchPanchayats = async () => {
    try {
      const response = await fetch(`${API_URL}/panchayat`);
      const data = await response.json();
      if (response.ok) {
        // Map to Dropdown format and Deduplicate
        const uniqueNames = Array.from(new Set(data.map((p: any) => p.name)));
        const list = uniqueNames.map((name) => ({ label: name as string, value: name as string }));
        setPanchayatList(list);
      }
    } catch (error) {
      console.error("Failed to fetch panchayats", error);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'error') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handleSendOtp = async () => {
    // Admin Bypass
    if (mobile === "1111111111") {
      // Allow
    } else {
      if (!mobile || !panchayatName) {
        showToast("Please select Panchayat and enter Mobile Number", "error");
        return;
      }
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, panchayatName }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        showToast("OTP sent successfully!", "success");
      } else {
        if (data.message === "Mobile number not registered under that panchayat name") {
          showToast("Mobile number not registered under that panchayat name", "error");
        } else {
          showToast(data.message || "Failed to send OTP", "error");
        }
      }
    } catch (error) {
      showToast("Network Error: Unable to connect", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!otp || otp.length < 4) {
      showToast("Please enter a valid OTP", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) await AsyncStorage.setItem("token", data.token);
        if (data.user) await AsyncStorage.setItem("user", JSON.stringify(data.user));

        showToast("Login Successful!", "success");
        setTimeout(() => router.replace("/(tabs)"), 1000);
      } else {
        showToast(data.message || "Invalid OTP", "error");
      }
    } catch (error) {
      showToast("Network Error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onDismiss={() => setToastVisible(false)}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center px-8"
      >
        {/* Header */}
        <View className="items-center mb-10 mt-20">
          <View className="w-24 h-24 rounded-full border-2 border-slate-100 items-center justify-center bg-slate-50 mb-6">
            <Leaf size={40} color="#1E293B" fill="#1E293B" />
          </View>
          <Text className="text-4xl font-bold text-[#1E293B]">Login</Text>
        </View>

        {/* Inputs */}
        {!otpSent && (
          <View className="mb-5">
            <Dropdown
              data={panchayatList}
              value={panchayatName}
              onChange={setPanchayatName}
              placeholder="Select Panchayat"
            />
          </View>
        )}

        <View className="flex-row items-center mb-5 gap-3">
          <TextInput
            className="flex-1 h-14 border rounded-xl px-4 text-base bg-white text-slate-800"
            style={{ borderColor: BORDER_COLOR }}
            placeholder="Mobile Number"
            placeholderTextColor="#9CA3AF"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            maxLength={10}
            editable={!otpSent}
          />
          {!otpSent && (
            <TouchableOpacity
              className="h-14 px-4 rounded-xl justify-center items-center shadow-sm"
              style={{ backgroundColor: PRIMARY_COLOR, opacity: loading ? 0.7 : 1 }}
              onPress={handleSendOtp}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold uppercase">Get OTP</Text>}
            </TouchableOpacity>
          )}
        </View>

        {otpSent && (
          <View className="mb-4">
            <TextInput
              className="w-full h-14 border rounded-xl px-4 text-base bg-white text-slate-800"
              style={{ borderColor: BORDER_COLOR }}
              placeholder="Enter OTP"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
            />
            <TouchableOpacity onPress={() => setOtpSent(false)} className="mt-2 text-right">
              <Text className="text-blue-600 font-medium text-right">Change Mobile Number</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Login Button */}
        {otpSent && (
          <TouchableOpacity
            className="w-full h-14 rounded-xl justify-center items-center shadow-sm"
            style={{ backgroundColor: PRIMARY_COLOR, opacity: loading ? 0.7 : 1 }}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg uppercase">Login</Text>}
          </TouchableOpacity>
        )}

        {/* Footer */}
        <View className="mt-auto mb-6 items-center">
          {/* Registration removed as per requirement */}
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}