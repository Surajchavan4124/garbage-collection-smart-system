import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// Using Safe Area Context as requested previously
import { useRouter } from "expo-router";
import { Leaf } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  // Design Constants
  const PRIMARY_COLOR = "#6B5BFF"; // Vibrant Purple
  const BORDER_COLOR = "#D1D1D1";  // Light Gray for inputs

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center px-8" // approx 30px padding
      >
        
        {/* --- 1. Branding & Header --- */}
        <View className="items-center mb-10 mt-40">
          {/* Circular Logo Container */}
          <View className="w-24 h-24 rounded-full border-2 border-slate-100 items-center justify-center bg-slate-50 mb-6">
            <Leaf size={40} color="#1E293B" fill="#1E293B" /> 
            {/* Dark Navy/Charcoal Icon color */}
          </View>
          
          {/* Title */}
          <Text className="text-4xl font-bold text-center text-[#1E293B]">
            Login
          </Text>
        </View>


        {/* --- 2. Input Fields & OTP Logic --- */}
        
        {/* Username Row */}
        <View className="flex-row items-center mb-5 gap-3">
          <TextInput
            className="flex-1 h-14 border rounded-lg px-4 text-base bg-white text-slate-800"
            style={{ borderColor: BORDER_COLOR }}
            placeholder="Username/ mobile"
            placeholderTextColor="#9CA3AF"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
          />
          
          {/* Get OTP Button */}
          <TouchableOpacity
            className="h-14 px-4 rounded-lg justify-center items-center shadow-sm"
            style={{ backgroundColor: PRIMARY_COLOR }}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-sm uppercase">
              Get OTP
            </Text>
          </TouchableOpacity>
        </View>

        {/* OTP Field */}
        <TextInput
          className="w-full h-14 border rounded-lg px-4 mb-8 text-base bg-white text-slate-800"
          style={{ borderColor: BORDER_COLOR }}
          placeholder="Enter OTP"
          placeholderTextColor="#9CA3AF"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
        />


        {/* --- 3. Action Buttons --- */}

        {/* Primary Login Button */}
        <TouchableOpacity
          className="w-full h-14 rounded-lg justify-center items-center mb-4 shadow-sm"
          style={{ backgroundColor: PRIMARY_COLOR }}
          activeOpacity={0.9}
          onPress={() => router.replace("/(tabs)" as any)}
        >
          <Text className="text-white font-bold text-lg uppercase tracking-wide">
            Login
          </Text>
        </TouchableOpacity>

        {/* Secondary Registration Button */}
        <TouchableOpacity
          className="w-full h-14 border rounded-lg justify-center items-center"
          style={{ 
            borderColor: PRIMARY_COLOR,
            backgroundColor: 'white' // Explicit white background
          }}
          activeOpacity={0.7}
        >
          <Text
            className="font-bold text-base uppercase tracking-wide"
            style={{ color: PRIMARY_COLOR }}
          >
            New Registration
          </Text>
        </TouchableOpacity>


        {/* --- 4. Footer --- */}
        <View className="mt-auto mb-6 items-center">
          <TouchableOpacity>
            <Text className="text-blue-600 underline font-medium text-base">
              Facing any issue ? Contact Support
            </Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}