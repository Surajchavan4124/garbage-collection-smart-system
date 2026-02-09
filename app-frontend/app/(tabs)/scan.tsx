import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, Modal, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// 🔹 API CONFIG
const API_URL = "http://192.168.0.131:5000/api";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  // Scanned Data State
  const [scanData, setScanData] = useState<any>(null); // Stores { scanId, bin: { ... } }
  const [showModal, setShowModal] = useState(false);
  const [reportMode, setReportMode] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  const router = useRouter();
  const PRIMARY_COLOR = "#6B5BFF";

  // 🔹 1. Request Location on Mount
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  // Handle Camera Permissions
  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white px-6">
        <Text className="text-lg text-center mb-4 text-slate-600">
          We need your permission to show the camera
        </Text>
        <TouchableOpacity onPress={requestPermission} className="bg-purple-600 py-3 px-6 rounded-lg">
          <Text className="text-white font-bold uppercase">Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // 🔹 2. Handle Barcode Scanned
  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setLoading(true);

    try {
      // Get FRESH location
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert("Error", "You are not logged in");
        setLoading(false);
        return;
      }

      // API Call to /scan
      const response = await fetch(`${API_URL}/attendance/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          labourId: (await AsyncStorage.getItem('user')) ? JSON.parse((await AsyncStorage.getItem('user'))!).id : null,
          dustbinId: data, // Assuming QR data IS the dustbin ID
          lat: currentLocation.coords.latitude,
          lng: currentLocation.coords.longitude
        })
      });

      const result = await response.json();

      if (response.ok) {
        setScanData(result); // { message, scanId, bin: { ... } }
        setShowModal(true);
      } else {
        Alert.alert("Scan Failed", result.message || "Unknown error", [
          { text: "OK", onPress: () => setScanned(false) }
        ]);
      }

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Network request failed");
      setScanned(false);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 3. Handle Actions (Collect / Report)
  const handleAction = async (action: 'collected' | 'reported') => {
    if (!scanData?.scanId) return;

    if (action === 'reported' && !reportMode) {
      setReportMode(true);
      return;
    }

    if (action === 'reported' && !selectedIssue) {
      Alert.alert("Select Issue", "Please select an issue to report.");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/attendance/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          scanId: scanData.scanId,
          action,
          issueDescription: selectedIssue || ""
        })
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", action === 'collected' ? "Bin Collected Successfully!" : "Issue Reported!");
        setShowModal(false);
        setReportMode(false);
        setSelectedIssue(null);
        setScanned(false); // Reset scanner for next bin
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update action");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">

      {/* Header */}
      <View className="items-center mt-10 mb-4">
        <Text className="text-3xl font-bold text-slate-800 uppercase tracking-widest">
          Scan Bin QR
        </Text>
        <Text className="text-slate-500 text-sm">
          Point camera at the bin's QR code
        </Text>
      </View>

      {/* Camera View */}
      <View className="flex-1 items-center justify-center -mt-20">
        <View className="w-72 h-72 bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-300 relative justify-center items-center shadow-lg">
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
          />
          {loading && (
            <View className="absolute inset-0 bg-black/50 justify-center items-center">
              <ActivityIndicator size="large" color="#fff" />
              <Text className="text-white font-bold mt-2">Processing...</Text>
            </View>
          )}
          <View className="w-56 h-56 border-2 border-white/70 rounded-lg" />
        </View>
      </View>

      {/* 🔹 ACTION MODAL */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-3xl p-6 h-[60%]">

            {/* Modal Handle */}
            <View className="self-center w-16 h-1.5 bg-slate-300 rounded-full mb-6" />

            {/* Bin Details */}
            <View className="mb-6">
              <Text className="text-center text-2xl font-bold text-slate-800 mb-1">
                Bin ID: {scanData?.bin?.binCode || "Unknown"}
              </Text>
              <Text className="text-center text-slate-600 text-base">
                Location: {scanData?.bin?.location || "Unknown"}
              </Text>
              <View className="self-center mt-2 bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-blue-700 font-semibold text-xs uppercase tracking-wider">
                  Type: {scanData?.bin?.type || "General"}
                </Text>
              </View>
            </View>

            {/* Content Switch: Collect vs Report */}
            {!reportMode ? (
              // Option 1: Main Actions
              <View className="space-y-4">
                <TouchableOpacity
                  onPress={() => handleAction('collected')}
                  className="bg-green-600 py-4 rounded-xl flex-row justify-center items-center shadow-md active:bg-green-700"
                >
                  <Ionicons name="checkmark-circle" size={24} color="white" />
                  <Text className="text-white font-bold text-lg ml-3">
                    Bin Collected Successfully
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleAction('reported')}
                  className="bg-red-100 py-4 rounded-xl flex-row justify-center items-center border border-red-200 active:bg-red-200"
                >
                  <Ionicons name="alert-circle" size={24} color="#DC2626" />
                  <Text className="text-red-600 font-bold text-lg ml-3">
                    Report Issue with Dustbin
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { setShowModal(false); setScanned(false); }} className="mt-2 py-3">
                  <Text className="text-center text-slate-500 font-medium">Cancel / Scan Again</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Option 2: Report Issues List
              <View className="flex-1">
                <View className="flex-row items-center mb-4">
                  <TouchableOpacity onPress={() => setReportMode(false)} className="p-2 -ml-2">
                    <Ionicons name="arrow-back" size={24} color="#333" />
                  </TouchableOpacity>
                  <Text className="text-xl font-bold ml-2">Select Issue</Text>
                </View>

                <ScrollView className="space-y-3">
                  {["Missed bin", "Waste not segregated", "Hazardous waste", "Civic issues (illegal dumping)"].map((issue) => (
                    <TouchableOpacity
                      key={issue}
                      onPress={() => setSelectedIssue(issue)}
                      className={`flex-row items-center p-4 rounded-xl border ${selectedIssue === issue ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white'}`}
                    >
                      <View className={`w-5 h-5 rounded-full border-2 mr-3 justify-center items-center ${selectedIssue === issue ? 'border-red-500' : 'border-slate-300'}`}>
                        {selectedIssue === issue && <View className="w-2.5 h-2.5 rounded-full bg-red-500" />}
                      </View>
                      <Text className={`text-base font-medium ${selectedIssue === issue ? 'text-red-700' : 'text-slate-700'}`}>
                        {issue}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  disabled={!selectedIssue}
                  onPress={() => handleAction('reported')}
                  className={`mt-4 py-4 rounded-xl flex-row justify-center items-center shadow-md ${!selectedIssue ? 'bg-slate-300' : 'bg-red-600'}`}
                >
                  <Text className="text-white font-bold text-lg">
                    Submit Report
                  </Text>
                </TouchableOpacity>
              </View>
            )}

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}