import { useRouter } from 'expo-router';
import { ArrowLeft, Image as ImageIcon, Mic } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RaiseQueryScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  // Design Colors
  const PRIMARY_COLOR = "#6B5BFF";

  const handleSubmit = () => {
    if (!query.trim()) {
      Alert.alert("Missing Information", "Please describe your issue before submitting.");
      return;
    }
    Alert.alert("Success", "Your query has been submitted to the supervisor.", [
      { text: "OK", onPress: () => router.back() }
    ]);
  };

  const handleImageUpload = () => {
    Alert.alert("Upload", "Opening image picker...");
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      
      {/* 1. Header */}
      <View className="flex-row items-center mt-4 mb-8">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#334155" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800 uppercase tracking-widest flex-1 text-center mr-8">
          Raise Query/Issue
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* 2. Description Input Box */}
        <View className="border border-slate-300 rounded-lg h-64 p-4 mb-6 relative bg-white">
          <TextInput
            className="flex-1 text-base text-slate-800 text-start"
            placeholder="Describe Query/Issue"
            placeholderTextColor="#94A3B8"
            multiline={true}
            textAlignVertical="top" // Ensures text starts at the top
            value={query}
            onChangeText={setQuery}
          />
          {/* Mic Icon positioned top-right inside the box */}
          <TouchableOpacity className="absolute top-4 right-4">
            <Mic size={22} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* 3. Image Upload Row */}
        <TouchableOpacity 
          className="flex-row items-center mb-8 border border-slate-200 rounded-lg overflow-hidden"
          activeOpacity={0.8}
          onPress={handleImageUpload}
        >
          {/* Icon Box */}
          <View className="bg-slate-200 w-14 h-14 items-center justify-center">
            <ImageIcon size={24} color="#64748B" />
          </View>
          
          {/* Text Area */}
          <View className="flex-1 px-4 bg-white h-14 justify-center">
             <Text className="text-slate-400 text-base font-medium">
               Upload Image if any
             </Text>
          </View>
        </TouchableOpacity>

        {/* 4. Submit Button */}
        <TouchableOpacity
          className="w-full h-14 rounded-lg justify-center items-center shadow-md"
          style={{ backgroundColor: PRIMARY_COLOR }}
          activeOpacity={0.8}
          onPress={handleSubmit}
        >
          <Text className="text-white font-bold text-lg uppercase tracking-wide">
            Submit
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}