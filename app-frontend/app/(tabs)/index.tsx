import { MapPin, User, ChevronRight, CheckCircle, Clock, Map as MapIcon } from 'lucide-react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, G } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = "http://192.168.0.131:5000/api";

export default function HomeScreen() {
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dashboard State
  const [stats, setStats] = useState({
    ward: "Loading...",
    panchayatName: "",
    employeeName: "",
    total: 0,
    completed: 0,
    pending: 0
  });

  const [user, setUser] = useState<any>(null);

  const fetchDashboardData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));

      if (!token) return;

      const response = await fetch(`${API_URL}/attendance/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardData();
  }, []);

  // Design Colors
  const PRIMARY = "#6B5BFF";
  const CARD_BG = "#F1F5F9";

  // Donut Chart Component
  const DonutChart = () => {
    const total = stats.total || 1; // Prevent division by zero
    const collected = stats.completed;
    const percentage = (collected / total) * 100;
    const circumference = 2 * Math.PI * 40; // 251.32
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <Svg height="100" width="100" viewBox="0 0 100 100">
        <G rotation="-90" origin="50, 50">
          <Circle cx="50" cy="50" r="40" stroke="#E2E8F0" strokeWidth="15" fill="none" />
          <Circle
            cx="50" cy="50" r="40"
            stroke={PRIMARY}
            strokeWidth="15"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
        <View className='absolute inset-0 justify-center items-center'>
          <Text className="text-xs font-bold text-slate-600">{Math.round(percentage)}%</Text>
        </View>
      </Svg>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-5">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PRIMARY]} tintColor={PRIMARY} />
        }
      >

        {/* 1. Header & Profile */}
        <View className="mt-6 mb-6">
          <View className="flex-row items-center mb-6">
            <MapPin size={20} color="#475569" strokeWidth={2.5} />
            <Text className="text-slate-600 font-bold text-lg ml-2">
              {stats.panchayatName || "Loading..."}
            </Text>
          </View>

          <View className="flex-row items-center">
            <View className="w-16 h-16 rounded-full bg-purple-100 items-center justify-center mr-4">
              <User size={32} color={PRIMARY} fill={PRIMARY} />
            </View>
            <View>
              <Text className="text-xl font-bold text-slate-800">{stats.employeeName || user?.name || "Employee"}</Text>
              <Text className="text-slate-500 font-medium">{user?.role || "Garbage Collector"}</Text>
            </View>
          </View>
        </View>

        {/* Today's Route Card */}
        <View className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 relative overflow-hidden">
          <View className="absolute right-0 top-0 bg-purple-100 px-3 py-1 rounded-bl-xl">
            <Text className="text-purple-700 text-xs font-bold uppercase">Assigned Route</Text>
          </View>

          <View className="flex-row items-center mb-3 mt-1">
            <MapIcon size={20} color="#64748B" />
            <Text className="text-xl font-bold text-slate-800 ml-2">
              {stats.ward || "No Route Assigned"}
            </Text>
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-slate-500 text-xs font-medium uppercase tracking-wider">Bins Collected</Text>
              <Text className="text-2xl font-bold text-slate-800">
                {stats.completed}<Text className="text-slate-400 text-lg">/{stats.total}</Text>
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-slate-500 text-xs font-medium uppercase tracking-wider">Pending</Text>
              <Text className="text-2xl font-bold text-orange-500">{stats.pending}</Text>
            </View>
          </View>

          <TouchableOpacity
            className="w-full h-12 bg-white border border-purple-100 rounded-xl flex-row items-center justify-center"
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/map' as any)}
          >
            <Text className="text-purple-600 font-bold mr-2">View Full Route Map</Text>
            <ChevronRight size={16} color="#9333EA" />
          </TouchableOpacity>
        </View>

        {/* 2. Controls */}
        <View className="mb-6">
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
            className="w-full h-14 rounded-xl items-center justify-center mb-3 shadow-sm bg-purple-600"
            activeOpacity={0.9}
            onPress={() => router.push('/scan' as any)}
          >
            <Text className="text-white font-bold text-lg uppercase tracking-wider">Start Scanning</Text>
          </TouchableOpacity>

        </View>

        {/* 3. Performance Cards */}
        <View>
          <Text className="text-lg font-bold text-slate-900 mb-4">My Performance</Text>

          <View className="rounded-xl p-5 mb-4 flex-row justify-between items-center" style={{ backgroundColor: CARD_BG }}>
            <Text className="text-slate-600 font-semibold text-base">Total Locations Collected</Text>
            <Text className="text-5xl font-bold text-slate-800">{stats.completed}</Text>
          </View>

          <View className="rounded-xl p-5 flex-row justify-between items-center" style={{ backgroundColor: CARD_BG }}>
            <View className="space-y-2">
              <Text className="font-bold text-slate-700 mb-2">Completion Rate</Text>
              <Text className='text-3xl font-bold text-slate-800'>
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </Text>
            </View>
            <DonutChart />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView >
  );
}