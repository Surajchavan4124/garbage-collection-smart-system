import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Phone, Contact } from 'lucide-react-native'; // 'Contact' represents the ID card icon
import { useRouter } from 'expo-router';

export default function ContactCommitteeScreen() {
  const router = useRouter();
  const PRIMARY_COLOR = "#6B5BFF";

  // Mock Data for Committee Members
  const members = [
    { id: 1, name: "Committee Head", phone: "+91 9999999999" },
    { id: 2, name: "Secretary", phone: "+91 9888888888" },
    { id: 3, name: "Supervisor A", phone: "+91 9777777777" },
    { id: 4, name: "Supervisor B", phone: "+91 9666666666" },
    { id: 5, name: "Coordinator", phone: "+91 9555555555" },
  ];

  const handleCall = (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Error", "Phone calls are not supported on this device/simulator");
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      
      {/* 1. Header */}
      <View className="flex-row items-center mt-4 mb-8">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#334155" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800 uppercase tracking-widest flex-1 text-center mr-8">
          Committee Members
        </Text>
      </View>

      {/* 2. Members List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {members.map((member) => (
          <View 
            key={member.id} 
            className="flex-row items-center justify-between border border-slate-200 rounded-lg p-4 mb-4 bg-white shadow-sm"
          >
            {/* Left Side: Info */}
            <View className="flex-1">
              {/* Name Row */}
              <View className="flex-row items-center mb-2">
                <Contact size={20} color="#475569" /> 
                <Text className="text-slate-700 font-bold text-lg ml-3">
                  {member.name}
                </Text>
              </View>
              
              {/* Phone Row */}
              <View className="flex-row items-center">
                <Phone size={20} color="#475569" />
                <Text className="text-slate-500 font-medium text-base ml-3">
                  {member.phone}
                </Text>
              </View>
            </View>

            {/* Right Side: Call Button */}
            <TouchableOpacity
              className="px-5 py-2 rounded-lg flex-row items-center ml-2"
              style={{ backgroundColor: PRIMARY_COLOR }}
              activeOpacity={0.8}
              onPress={() => handleCall(member.phone)}
            >
              <Phone size={18} color="white" fill="white" />
              <Text className="text-white font-bold text-base ml-2 uppercase">
                Call
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

    </SafeAreaView>
  );
}