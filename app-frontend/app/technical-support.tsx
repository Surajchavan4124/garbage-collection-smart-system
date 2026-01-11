import { useRouter } from 'expo-router';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react-native';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TechnicalSupportScreen() {
  const router = useRouter();

  // Design Colors
  const PRIMARY_COLOR = "#6B5BFF";

  const handleConnect = () => {
    Alert.alert("Connecting...", "Initiating connection with technical support team...", [
      { text: "OK", onPress: () => console.log("Connected") }
    ]);
  };

  const handleImageUpload = () => {
    Alert.alert("Upload", "Opening image picker...");
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      
      {/* 1. Header */}
      <View className="flex-row items-center mt-4 mb-10">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#334155" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800 uppercase tracking-widest flex-1 text-center mr-8">
          Technical Support
        </Text>
      </View>

      <View className="flex-1">
        
        {/* 2. Upload Image Section */}
        <TouchableOpacity 
          className="flex-row items-center mb-8 border border-slate-200 rounded-lg overflow-hidden h-14"
          activeOpacity={0.8}
          onPress={handleImageUpload}
        >
          {/* Icon Box */}
          <View className="bg-slate-200 w-14 h-full items-center justify-center border-r border-slate-200">
            <ImageIcon size={24} color="#64748B" />
          </View>
          
          {/* Text Area */}
          <View className="flex-1 px-4 bg-white justify-center h-full">
             <Text className="text-slate-400 text-base font-medium">
               Upload Image if any
             </Text>
          </View>
        </TouchableOpacity>

        {/* 3. Connect Now Button */}
        <TouchableOpacity
          className="w-full h-14 rounded-lg justify-center items-center shadow-md"
          style={{ backgroundColor: PRIMARY_COLOR }}
          activeOpacity={0.8}
          onPress={handleConnect}
        >
          <Text className="text-white font-bold text-lg uppercase tracking-wide">
            Connect Now
          </Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}