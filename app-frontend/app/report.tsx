import { useRouter } from 'expo-router';
import { ArrowLeft, Mic } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReportScreen() {
  const router = useRouter();
  const [garbageType, setGarbageType] = useState<'dry' | 'wet' | 'hazardous' | null>(null);
  const [weight, setWeight] = useState('');

  const PRIMARY_COLOR = "#6B5BFF";

  // Reusable Radio Button Component
  const RadioOption = ({ label, value }: { label: string, value: 'dry' | 'wet' | 'hazardous' }) => (
    <TouchableOpacity 
      className="flex-row items-center mb-4"
      activeOpacity={0.8}
      onPress={() => setGarbageType(value)}
    >
      <View className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${garbageType === value ? 'border-purple-600' : 'border-slate-300'}`}>
        {garbageType === value && (
          <View className="w-3 h-3 rounded-full bg-purple-600" />
        )}
      </View>
      <Text className="text-slate-700 text-base font-medium">{label}</Text>
    </TouchableOpacity>
  );

  const handleSubmit = () => {
    if (!garbageType) {
      Alert.alert("Missing Info", "Please select a garbage type.");
      return;
    }
    Alert.alert("Success", "Garbage details submitted successfully!", [
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
          Garbage Details
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* 2. Garbage Type Section */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-slate-800 mb-4">Garbage Type</Text>
          <RadioOption label="Dry" value="dry" />
          <RadioOption label="Wet" value="wet" />
          <RadioOption label="Hazardous" value="hazardous" />
        </View>

        {/* 3. Weight Input Section */}
        <View className="mb-10">
          <Text className="text-lg font-bold text-slate-800 mb-3">
            Estimated Garbage Weight (kg)
          </Text>
          <View className="flex-row items-center border border-slate-300 rounded-lg h-14 px-4 bg-white">
            <TextInput
              className="flex-1 text-base text-slate-800"
              placeholder="Type or Record voice"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
            <TouchableOpacity>
              <Mic size={22} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

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