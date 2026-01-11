import { Mic, Play, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TutorialScreen() {
  const [search, setSearch] = useState('');

  // Mock Data for Tutorials
  const tutorials = [
    {
      id: 1,
      title: 'Praeterea, ex culpa non invenies unum aut non accusatis unum.',
      duration: '5:30',
    },
    {
      id: 2,
      title: 'Praeterea, ex culpa non invenies unum aut non accusatis unum.',
      duration: '3:45',
    },
    {
      id: 3,
      title: 'Guide to Waste Segregation techniques.',
      duration: '8:12',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white px-5">
      
      {/* 1. Header */}
      <View className="items-center mt-4 mb-6">
        <Text className="text-xl font-bold text-slate-800 uppercase tracking-widest">
          Tutorials
        </Text>
      </View>

      {/* 2. Search Bar */}
      <View className="flex-row items-center border border-slate-300 rounded-lg px-3 h-14 bg-white mb-6 shadow-sm">
        <Search size={22} color="#64748B" />
        <TextInput
          className="flex-1 ml-3 text-base text-slate-800"
          placeholder="search for tutorials"
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity>
          <Mic size={22} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* 3. Video List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {tutorials.map((video) => (
          <View 
            key={video.id} 
            className="mb-6 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm"
          >
            {/* Video Thumbnail Placeholder */}
            <TouchableOpacity 
              activeOpacity={0.9}
              className="w-full h-48 bg-slate-200 items-center justify-center relative"
            >
              {/* Play Button Circle */}
              <View className="w-16 h-16 bg-black/30 rounded-full items-center justify-center backdrop-blur-sm">
                 <Play size={32} color="white" fill="white" style={{ marginLeft: 4 }} />
              </View>
            </TouchableOpacity>

            {/* Video Title/Description */}
            <View className="p-4">
              <Text className="text-slate-700 text-base leading-6 font-medium">
                {video.title}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

    </SafeAreaView>
  );
}