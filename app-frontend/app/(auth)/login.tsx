import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { Leaf, Check, X, ChevronDown } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';
import CustomAlert from '../../components/CustomAlert';

export default function LoginScreen() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);

  // Panchayat State
  const [panchayats, setPanchayats] = useState<any[]>([]);
  const [selectedPanchayatId, setSelectedPanchayatId] = useState("");
  const [showPanchayatModal, setShowPanchayatModal] = useState(false);

  // OTP Timer State
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Custom Alert State
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: "", message: "", type: "success" }); // type: success | error

  // Design Constants
  const PRIMARY_COLOR = "#6B5BFF"; // Vibrant Purple
  const BORDER_COLOR = "#D1D1D1";  // Light Gray for inputs

  // Fetch Panchayats on Load
  useEffect(() => {
    fetchPanchayats();
  }, []);

  // OTP Countdown Timer Logic
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && showOtpInput) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer, showOtpInput]);

  const startResendTimer = () => {
    setTimer(30);
    setCanResend(false);
  };

  const fetchPanchayats = async () => {
    try {
      const response = await fetch(`${API_URL}/panchayat`);
      const data = await response.json();
      if (response.ok) {
        setPanchayats(data);
      } else {
        showAlert("Error", "Failed to load Panchayats", "error");
      }
    } catch (error) {
      console.error("Failed to fetch panchayats", error);
      showAlert("Connection Error", "Could not connect to server. Ensure you are on the same Wi-Fi.", "error");
    }
  };

  const showAlert = (title: string, message: string, type: "success" | "error" = "success") => {
    setAlertConfig({ title, message, type });
    setAlertVisible(true);
  };

  const handleSendOtp = async () => {
    if (!selectedPanchayatId) {
      showAlert("Required", "Please select your Panchayat", "error");
      return;
    }
    if (mobile.length < 10) {
      showAlert("Invalid Number", "Please enter a valid 10-digit mobile number", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile,
          type: 'employee',
          panchayatId: selectedPanchayatId
        })
      });
      const data = await response.json();

      if (response.ok) {
        setShowOtpInput(true);
        startResendTimer(); // Start 30s timer
        // Show OTP in the success alert for easy testing
        const msg = data.otp ? `OTP Sent! Your code is: ${data.otp}` : (data.message || "OTP Sent!");
        showAlert("Success", msg, "success");
      } else {
        showAlert("Error", data.message || "Failed to send OTP", "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Error", "Network request failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) {
      showAlert("Invalid OTP", "Please enter valid OTP", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile,
          otp,
          type: 'employee',
          panchayatId: selectedPanchayatId
        })
      });
      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));

        showAlert("Success", "Login Successful", "success");
        setTimeout(() => {
          setAlertVisible(false);
          router.replace("/(tabs)" as any);
        }, 1000); // Wait for alert
      } else {
        showAlert("Error", data.message || "Invalid OTP", "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Error", "Network request failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const selectedPanchayatName = panchayats.find((p: any) => p._id === selectedPanchayatId)?.name || "Select Panchayat";

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center px-8"
      >

        {/* --- 1. Branding & Header --- */}
        <View className="items-center mb-10 mt-10">
          <View className="w-24 h-24 rounded-full border-2 border-slate-100 items-center justify-center bg-slate-50 mb-6">
            <Leaf size={40} color="#1E293B" fill="#1E293B" />
          </View>
          <Text className="text-4xl font-bold text-center text-[#1E293B]">
            Login
          </Text>
        </View>


        {/* --- 2. Input Fields --- */}

        {/* Panchayat Custom Dropdown Trigger */}
        {!showOtpInput && (
          <TouchableOpacity
            onPress={() => setShowPanchayatModal(true)}
            className="mb-5 h-14 border rounded-lg px-4 bg-white flex-row items-center justify-between"
            style={{ borderColor: BORDER_COLOR }}
          >
            <Text className={`text-base font-medium ${selectedPanchayatId ? 'text-slate-800' : 'text-slate-700'}`}>
              {selectedPanchayatName}
            </Text>
            <ChevronDown size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}

        {/* Username Row */}
        <View className="flex-row items-center mb-5 gap-3">
          <TextInput
            className="flex-1 h-14 border rounded-lg px-4 text-base bg-white text-slate-800"
            style={{ borderColor: BORDER_COLOR }}
            placeholder="Mobile Number"
            placeholderTextColor="#9CA3AF"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            editable={!showOtpInput}
          />

          {/* Get OTP Button */}
          {!showOtpInput && (
            <TouchableOpacity
              className="h-14 px-4 rounded-lg justify-center items-center shadow-sm"
              style={{ backgroundColor: PRIMARY_COLOR, opacity: loading ? 0.7 : 1 }}
              activeOpacity={0.8}
              onPress={handleSendOtp}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="white" /> : (
                <Text className="text-white font-bold text-sm uppercase">
                  Get OTP
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* OTP Field */}
        {showOtpInput && (
          <View>
            <TextInput
              className="w-full h-14 border rounded-lg px-4 mb-4 text-base bg-white text-slate-800"
              style={{ borderColor: BORDER_COLOR }}
              placeholder="Enter OTP"
              placeholderTextColor="#9CA3AF"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
            />

            <View className="flex-row justify-between items-center mb-6">
              {canResend ? (
                <TouchableOpacity onPress={handleSendOtp}>
                  <Text className="text-[#6B5BFF] font-bold">Resend OTP?</Text>
                </TouchableOpacity>
              ) : (
                <Text className="text-slate-500 font-medium">Resend OTP in {timer}s</Text>
              )}

              <TouchableOpacity onPress={() => setShowOtpInput(false)}>
                <Text className="text-slate-500 font-medium text-right">Change Number?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className="w-full h-14 rounded-lg justify-center items-center mb-4 shadow-sm"
              style={{ backgroundColor: PRIMARY_COLOR, opacity: loading ? 0.7 : 1 }}
              activeOpacity={0.9}
              onPress={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="white" /> : (
                <Text className="text-white font-bold text-lg uppercase tracking-wide">
                  Login
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}


        {/* --- Footer --- */}
        <View className="mt-auto mb-6 items-center">
          <TouchableOpacity>
            <Text className="text-blue-600 underline font-medium text-base">
              Facing any issue ? Contact Support
            </Text>
          </TouchableOpacity>
        </View>

        {/* --- CUSTOM MODALS --- */}

        {/* 1. Panchayat Selection Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showPanchayatModal}
          onRequestClose={() => setShowPanchayatModal(false)}
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl p-6 h-[50%]">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-slate-800">Select Panchayat</Text>
                <TouchableOpacity onPress={() => setShowPanchayatModal(false)} className="p-2 bg-slate-100 rounded-full">
                  <X size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={panchayats}
                keyExtractor={(item: any) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className={`p-4 mb-3 rounded-xl border flex-row justify-between items-center ${selectedPanchayatId === item._id ? 'bg-purple-50 border-purple-200' : 'bg-white border-slate-100'}`}
                    onPress={() => {
                      setSelectedPanchayatId(item._id);
                      setShowPanchayatModal(false);
                    }}
                  >
                    <Text className={`text-base font-semibold ${selectedPanchayatId === item._id ? 'text-purple-700' : 'text-slate-700'}`}>
                      {item.name}
                    </Text>
                    {selectedPanchayatId === item._id && <Check size={20} color={PRIMARY_COLOR} />}
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={<Text className="text-center text-slate-400 mt-10">No Panchayats Found</Text>}
              />
            </View>
          </View>
        </Modal>

        {/* 2. Custom Alert Modal */}
        <CustomAlert
          visible={alertVisible}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type as 'success' | 'error'}
          onClose={() => setAlertVisible(false)}
        />

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}