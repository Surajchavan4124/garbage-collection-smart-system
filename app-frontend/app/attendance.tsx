import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AttendanceScreen() {
  const router = useRouter();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Colors
  const PRIMARY = "#6B5BFF";
  const GREEN = "#22C55E";
  const RED = "#EF4444";

  // Mock Data for Calendar (matches your screenshot)
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Th', 'Fri', 'Sat'];
  
  // 0 = Empty, P = Present, A = Absent, N = Normal Day
  // This array mimics the grid in your design
  const calendarDays = [
    { day: '', type: 'empty' }, { day: '', type: 'empty' }, { day: '', type: 'empty' }, { day: '', type: 'empty' }, { day: '', type: 'empty' }, { day: '1', type: 'P' }, { day: '2', type: 'A' },
    { day: '1', type: 'N' }, { day: '2', type: 'N' }, { day: '3', type: 'N' }, { day: '4', type: 'N' }, { day: '5', type: 'N' }, { day: '6', type: 'P' }, { day: 'A', type: 'A' }, // Using 'A' label for 7th as per image logic or number
    { day: '8', type: 'N' }, { day: '9', type: 'N' }, { day: '10', type: 'P' }, { day: '11', type: 'N' }, { day: '12', type: 'P' }, { day: '13', type: 'P' }, { day: '14', type: 'A' },
    { day: '15', type: 'P' }, { day: '16', type: 'P' }, { day: '16', type: 'P' }, { day: '18', type: 'P' }, { day: '19', type: 'P' }, { day: '20', type: 'P' }, { day: '1A', type: 'A' },
    { day: '22', type: 'P' }, { day: '21', type: 'N' }, { day: '23', type: 'P' }, { day: '26', type: 'P' }, { day: '26', type: 'P' }, { day: '27', type: 'N' }, { day: '28', type: 'A' },
    { day: '29', type: 'P' }, { day: '28', type: 'P' }, { day: '39', type: 'P' }, { day: '30', type: 'N' }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      
      {/* 1. Header */}
      <View className="flex-row items-center mt-4 mb-6">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#334155" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800 uppercase tracking-widest flex-1 text-center mr-8">
          Attendance Report
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* 2. Calendar Card */}
        <View className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200 shadow-sm">
          
          {/* Month Navigation */}
          <View className="flex-row justify-between items-center mb-4 px-2">
            <Text className="text-lg font-bold text-slate-700">September 2025</Text>
            <View className="flex-row gap-4">
              <ChevronLeft size={24} color="#94A3B8" />
              <ChevronRight size={24} color="#94A3B8" />
            </View>
          </View>

          {/* Days Header */}
          <View className="flex-row justify-between mb-2">
            {daysOfWeek.map((day, index) => (
              <Text key={index} className={`w-10 text-center font-bold text-xs ${day === 'Sun' || day === 'Sat' ? 'text-red-400' : 'text-slate-500'}`}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View className="flex-row flex-wrap justify-between">
            {calendarDays.map((item, index) => {
              // Styling logic based on status
              let bgClass = "bg-transparent";
              let textClass = "text-slate-600";
              let borderClass = "";

              if (item.type === 'P') {
                borderClass = "border border-green-500";
                textClass = "text-green-600 font-bold";
              } else if (item.type === 'A') {
                borderClass = "border border-red-500";
                textClass = "text-red-500 font-bold";
              }

              return (
                <View key={index} className={`w-10 h-10 items-center justify-center mb-1 rounded-lg ${bgClass} ${borderClass}`}>
                  <Text className={`${textClass} text-sm`}>{item.day}</Text>
                </View>
              );
            })}
          </View>

        </View>

        {/* 3. Summary Legend */}
        <View className="mb-8">
          <View className="flex-row items-center mb-1">
             <View className="w-2 h-4 bg-green-500 mr-2 rounded-sm" />
             <Text className="text-slate-700 font-bold mr-1">P = Present:</Text>
             <Text className="text-green-600 font-bold">18</Text>
          </View>
          <View className="flex-row items-center">
             <Text className="text-slate-700 font-bold mr-1 ml-4">Total Absent:</Text>
             <Text className="text-red-500 font-bold">12</Text>
          </View>
        </View>

        {/* 4. Download Section */}
        <View>
          <Text className="text-lg font-bold text-slate-800 mb-4">Download Report</Text>
          
          <View className="flex-row justify-between items-center mb-6">
            <View className="w-[42%]">
              <Text className="text-slate-600 font-medium mb-1">From</Text>
              <TextInput 
                className="border border-slate-300 rounded-lg h-12 px-3 text-center text-slate-600 bg-white"
                placeholder="DD/MM/YYYY"
                value={fromDate}
                onChangeText={setFromDate}
              />
            </View>

            <ArrowRight size={20} color="#94A3B8" style={{ marginTop: 20 }} />

            <View className="w-[42%]">
              <Text className="text-slate-600 font-medium mb-1">To</Text>
              <TextInput 
                className="border border-slate-300 rounded-lg h-12 px-3 text-center text-slate-600 bg-white"
                placeholder="DD/MM/YYYY"
                value={toDate}
                onChangeText={setToDate}
              />
            </View>
          </View>

          {/* Download Button */}
          <TouchableOpacity
            className="w-full h-14 rounded-lg justify-center items-center border border-purple-500 bg-white"
            activeOpacity={0.7}
            onPress={() => Alert.alert("Downloading...", "Report download started.")}
          >
            <Text className="font-bold text-lg uppercase tracking-wide text-purple-600">
              Download
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}