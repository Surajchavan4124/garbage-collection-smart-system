import { MapPin, Mic, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MapScreen() {
  const [search, setSearch] = useState('');

  // Mock Data for "Near Duty Location"
  const locations = [
    { id: 1, title: 'location site a 10 m away' },
    { id: 2, title: 'location site a 10 m away' },
    { id: 3, title: 'location site a 10 m away' },
  ];

  // Default Region (Navelim, Goa coordinates or generic)
  const initialRegion = {
    latitude: 15.2632, 
    longitude: 73.9676,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-5">
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* 1. Header */}
        <View className="items-center mt-2 mb-6">
          <Text className="text-xl font-bold text-slate-800 uppercase tracking-widest">
            Map
          </Text>
        </View>

        {/* 2. Search Bar */}
        <View className="flex-row items-center border border-slate-300 rounded-lg px-3 h-14 bg-white mb-6 shadow-sm">
          <Search size={20} color="#64748B" />
          <TextInput
            className="flex-1 ml-3 text-base text-slate-800"
            placeholder="search for location" // Fixed typo from 'loaction'
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
          <Mic size={20} color="#64748B" />
        </View>

        {/* 3. Map View Container */}
        <View className="w-full h-80 rounded-xl overflow-hidden border border-slate-200 mb-6 relative bg-slate-100">
          <MapView 
            style={{ width: '100%', height: '100%' }}
            initialRegion={initialRegion}
          >
            {/* Example Marker for Navelim */}
            <Marker 
              coordinate={initialRegion}
              title="Navelim"
              description="Duty Area"
            />
          </MapView>
          
          {/* "Navelim" Text Overlay (To match screenshot style) */}
          <View className="absolute bottom-4 left-0 right-0 items-center">
            <Text className="text-slate-800 font-bold text-lg tracking-widest uppercase bg-white/80 px-4 py-1 rounded-md overflow-hidden">
              Navelim
            </Text>
          </View>
        </View>

        {/* 4. Near Duty Location List */}
        <View>
          <Text className="text-base font-semibold text-slate-600 mb-4 ml-1">
            near duty location
          </Text>

          {locations.map((loc) => (
            <TouchableOpacity 
              key={loc.id}
              className="flex-row items-center border border-slate-200 rounded-lg p-4 mb-3 bg-white shadow-sm"
              activeOpacity={0.7}
            >
              <View className="mr-4">
                 {/* Dark location pin icon */}
                 <MapPin size={24} color="#334155" fill="#334155" />
              </View>
              <Text className="text-slate-700 font-medium text-base">
                {loc.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}