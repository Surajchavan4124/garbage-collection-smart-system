
import { MapPin, User, CheckCircle, Clock } from 'lucide-react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, G } from 'react-native-svg';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { API_URL } from '../../config';
import CustomAlert from '../../components/CustomAlert';

export default function HomeScreen() {
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [employeeName, setEmployeeName] = useState("Employee");
  const [displayLocation, setDisplayLocation] = useState("Loading...");

  // Custom Alert State
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: "", message: "", type: "success" as 'success' | 'error' });

  const [stats, setStats] = useState({
    location: "Loading...",
    ward: "Loading...",
    total: 0,
    completed: 0,
    pending: 0
  });

  // Design Colors
  const PRIMARY = "#6B5BFF";
  const CARD_BG = "#F1F5F9";

  const handleToggleDuty = async (val: boolean) => {
    try {
      setIsAvailable(val);
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/attendance/availability`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ available: val })
      });

      if (!response.ok) {
        setIsAvailable(!val); // Revert on failure
      }
    } catch (error) {
      console.error("Failed to toggle duty", error);
      setIsAvailable(!val);
    }
  };

  const fetchLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setDisplayLocation(stats.location || "Location Disabled");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      let reverseGeo = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      if (reverseGeo && reverseGeo.length > 0) {
        const addr = reverseGeo[0];
        const place = [addr.name, addr.district, addr.city].filter(Boolean).join(", ");
        setDisplayLocation(place || stats.location);
      }
    } catch (error) {
      console.error("Location Error:", error);
      setDisplayLocation(stats.location);
    }
  };

  const fetchStats = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setEmployeeName(user.name || "Employee");
      }

      if (!token) return;

      const response = await fetch(`${API_URL}/attendance/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (response.ok) {
        setStats(data);
        if (data.present !== undefined) {
          setIsAvailable(data.present);
        }
        // Fallback or combine with static location
        if (displayLocation === "Loading...") {
          setDisplayLocation(data.location || "Panchayat Area");
        }
      }
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
      fetchLocation();
    }, [])
  );

  // Donut Chart Component
  const percentComplete = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
  const strokeDasharray = 251; // 2 * PI * 40
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentComplete) / 100;

  const DonutChart = () => (
    <Svg height="100" width="100" viewBox="0 0 100 100">
      <G rotation="-90" origin="50, 50">
        <Circle cx="50" cy="50" r="40" stroke="#E2E8F0" strokeWidth="15" fill="none" />
        <Circle cx="50" cy="50" r="40" stroke={PRIMARY} strokeWidth="15" fill="none"
          strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
      </G>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: PRIMARY }}>{Math.round(percentComplete)}%</Text>
      </View>
    </Svg>
  );

  return (
    <SafeAreaView className="flex-1 bg-white px-5">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>

        {/* 1. Header & Profile */}
        <View className="mt-6 mb-6">
          <View className="flex-row items-center mb-6">
            <MapPin size={20} color="#475569" strokeWidth={2.5} />
            <Text className="text-slate-600 font-bold text-lg ml-2 flex-1" numberOfLines={1}>
              {displayLocation}
            </Text>
          </View>

          <View className="flex-row items-center">
            <View className="w-16 h-16 rounded-full bg-purple-100 items-center justify-center mr-4">
              <User size={32} color={PRIMARY} fill={PRIMARY} />
            </View>
            <View>
              <Text className="text-xl font-bold text-slate-800">{employeeName}</Text>
              <Text className="text-slate-500 font-medium">Garbage Collector</Text>
            </View>
          </View>
        </View>

        {/* 2. Controls */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-base font-bold text-slate-800">Available On Duty</Text>
              <Text className={`text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-slate-400'}`}>
                {isAvailable ? 'Active' : 'off'}
              </Text>
            </View>
            <Switch
              trackColor={{ false: '#E2E8F0', true: PRIMARY }}
              thumbColor={'white'}
              onValueChange={handleToggleDuty}
              value={isAvailable}
            />
          </View>

          {/* Start Scanning Button */}
          <TouchableOpacity
            onPress={() => {
              if (!isAvailable) {
                setAlertConfig({
                  title: "Off Duty",
                  message: "Please toggle 'Available On Duty' on your dashboard to start scanning.",
                  type: "error"
                });
                setAlertVisible(true);
              } else {
                router.push("/(tabs)/scan" as any);
              }
            }}
            className="w-full h-14 rounded-xl flex-row items-center justify-center shadow-lg"
            style={{ backgroundColor: PRIMARY }}
          >
            <Text className="text-white font-bold text-lg mr-2 uppercase tracking-wide">Start Scanning</Text>
          </TouchableOpacity>
        </View>

        {/* 3. Performance Cards */}
        <View>
          <Text className="text-lg font-bold text-slate-900 mb-4">My Performance (Today)</Text>

          {/* MAIN STATS ROW */}
          <View className="flex-row gap-4 mb-4">
            <View className="flex-1 rounded-xl p-4 bg-purple-50 border border-purple-100 items-center">
              <Text className="text-slate-500 font-medium text-xs uppercase mb-1">Routes Collected</Text>
              <Text className="text-3xl font-bold text-purple-700">{stats.completed}/{stats.total}</Text>
            </View>
            <View className="flex-1 rounded-xl p-4 bg-orange-50 border border-orange-100 items-center">
              <Text className="text-slate-500 font-medium text-xs uppercase mb-1">Pending</Text>
              <Text className="text-3xl font-bold text-orange-600">{stats.pending}</Text>
            </View>
          </View>

          {/* PROGRESS CARD */}
          <View className="rounded-xl p-5 flex-row justify-between items-center" style={{ backgroundColor: CARD_BG }}>
            <View className="space-y-2 flex-1 mr-4">
              <Text className="font-bold text-slate-700 mb-2">Completion Status</Text>
              <View className="flex-row items-center gap-2 mb-1">
                <CheckCircle size={16} color={PRIMARY} />
                <Text className="text-slate-600 font-medium">{stats.completed} Routes Collected</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Clock size={16} color="#F59E0B" />
                <Text className="text-slate-600 font-medium">{stats.pending} Routes Pending</Text>
              </View>
            </View>
            <DonutChart />
          </View>
        </View>
      </ScrollView>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  );
}