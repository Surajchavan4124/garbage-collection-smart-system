import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mic } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function FeedbackScreen() {
  const router = useRouter();
  const [feedback, setFeedback] = useState('');

  // Design Colors
  const PRIMARY_COLOR = "#6B5BFF";

  const handleSubmit = () => {
    if (!feedback.trim()) {
      Alert.alert("Empty Feedback", "Please describe your feedback before submitting.");
      return;
    }
    Alert.alert("Thank You", "Your feedback has been submitted successfully!", [
      { text: "OK", onPress: () => router.back() }
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      
      {/* 1. Header */}
      <View className="flex-row items-center mt-4 mb-8">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#334155" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800 uppercase tracking-widest flex-1 text-center mr-8">
          Feedback
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* 2. Feedback Input Box */}
        <View className="border border-slate-300 rounded-lg h-64 p-4 mb-8 relative bg-white shadow-sm">
          <TextInput
            className="flex-1 text-base text-slate-800 text-start"
            placeholder="Describe feedback"
            placeholderTextColor="#94A3B8"
            multiline={true}
            textAlignVertical="top" // Ensures text starts at the top left
            value={feedback}
            onChangeText={setFeedback}
          />
          {/* Mic Icon positioned top-right inside the box */}
          <TouchableOpacity className="absolute top-4 right-4">
            <Mic size={22} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* 3. Submit Button */}
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