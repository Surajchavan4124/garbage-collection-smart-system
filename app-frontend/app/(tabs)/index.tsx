import { MapPin, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, G } from 'react-native-svg';

export default function HomeScreen() {
  const [isAvailable, setIsAvailable] = useState(false);
  
  // Design Colors
  const PRIMARY = "#6B5BFF";
  const CARD_BG = "#F1F5F9"; 

  // Donut Chart Component
  const DonutChart = () => (
    <Svg height="100" width="100" viewBox="0 0 100 100">
      <G rotation="-90" origin="50, 50">
        <Circle cx="50" cy="50" r="40" stroke="#E2E8F0" strokeWidth="15" fill="none" />
        <Circle cx="50" cy="50" r="40" stroke={PRIMARY} strokeWidth="15" fill="none" 
          strokeDasharray="150 251" strokeLinecap="round" />
        <Circle cx="50" cy="50" r="40" stroke="#38BDF8" strokeWidth="15" fill="none" 
          strokeDasharray="60 251" strokeDashoffset="-160" strokeLinecap="round" />
      </G>
      <Circle cx="50" cy="50" r="25" fill={CARD_BG} /> 
    </Svg>
  );

  return (
    <SafeAreaView className="flex-1 bg-white px-5">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        
        {/* 1. Header & Profile */}
        <View className="mt-6 mb-6">
          <View className="flex-row items-center mb-6">
            <MapPin size={20} color="#475569" strokeWidth={2.5} />
            <Text className="text-slate-600 font-bold text-lg ml-2">Navelim</Text>
          </View>

          <View className="flex-row items-center">
            <View className="w-16 h-16 rounded-full bg-purple-100 items-center justify-center mr-4">
              <User size={32} color={PRIMARY} fill={PRIMARY} />
            </View>
            <View>
              <Text className="text-xl font-bold text-slate-800">Employee Name</Text>
              <Text className="text-slate-500 font-medium">Garbage Collector</Text>
            </View>
          </View>
        </View>

        {/* 2. Controls */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-base font-bold text-slate-800">Available On Duty</Text>
              <Text className={`text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-slate-400'}`}>
                {isAvailable ? 'Active' : 'off'}
              </Text>
            </View>
            <Switch
              trackColor={{ false: '#E2E8F0', true: PRIMARY }}
              thumbColor={'white'}
              onValueChange={() => setIsAvailable(!isAvailable)}
              value={isAvailable}
            />
          </View>

          <TouchableOpacity 
            className="w-full h-14 rounded-xl items-center justify-center mb-3 shadow-sm"
            style={{ backgroundColor: PRIMARY }}
            activeOpacity={0.9}
          >
            <Text className="text-white font-bold text-lg uppercase tracking-wider">Check In</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="w-full h-14 rounded-xl items-center justify-center border-2"
            style={{ borderColor: PRIMARY }}
            activeOpacity={0.7}
          >
            <Text className="font-bold text-lg uppercase tracking-wider" style={{ color: PRIMARY }}>
              Check Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* 3. Performance Cards */}
        <View>
          <Text className="text-lg font-bold text-slate-900 mb-4">My Performance</Text>

          <View className="rounded-xl p-5 mb-4 flex-row justify-between items-center" style={{ backgroundColor: CARD_BG }}>
            <Text className="text-slate-600 font-semibold text-base">Total Locations Collected</Text>
            <Text className="text-5xl font-bold text-slate-800">15</Text>
          </View>

          <View className="rounded-xl p-5 flex-row justify-between items-center" style={{ backgroundColor: CARD_BG }}>
            <View className="space-y-2">
              <Text className="font-bold text-slate-700 mb-2">Waste type collected</Text>
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 bg-green-500 rounded-sm" />
                <Text className="text-slate-600 text-xs font-medium">Dry Waste</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 bg-blue-400 rounded-sm" />
                <Text className="text-slate-600 text-xs font-medium">Wet Waste</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 bg-red-400 rounded-sm" />
                <Text className="text-slate-600 text-xs font-medium">Hazardous Waste</Text>
              </View>
            </View>
            <DonutChart />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}