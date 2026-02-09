import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, Modal, ActivityIndicator, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckCircle, AlertTriangle, MapPin, Info, ArrowLeft, Scale } from 'lucide-react-native';

import { API_URL } from '../../config';
import CustomAlert from '../../components/CustomAlert';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  // Scan Data State
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null); // { scanId, bin: { ... }, message }

  // Issue Reporting State
  const [reportMode, setReportMode] = useState(false);
  const [issueType, setIssueType] = useState("");
  const [estimatedWeight, setEstimatedWeight] = useState("");

  // Custom Alert State
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: "", message: "", type: "success" as 'success' | 'error' });

  // Design Colors
  const PRIMARY_COLOR = "#6B5BFF";
  const SUCCESS_COLOR = "#10B981";
  const WARNING_COLOR = "#F59E0B";
  const ERROR_COLOR = "#EF4444";

  useEffect(() => {
    (async () => {
      if (!locationPermission?.granted) {
        await requestLocationPermission();
      }
    })();
  }, []);

  // Handle Camera Permissions
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white px-6">
        <Text className="text-lg text-center mb-4 text-slate-600">
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-purple-600 py-3 px-6 rounded-lg"
        >
          <Text className="text-white font-bold uppercase">Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned || loading) return;
    setScanned(true);
    setLoading(true);
    setEstimatedWeight("");

    try {
      // 1. Get Location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAlertConfig({ title: "Permission Denied", message: "Permission to access location was denied", type: "error" });
        setAlertVisible(true);
        setLoading(false);
        setScanned(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      // 2. Get User Token
      const token = await AsyncStorage.getItem("token");
      const userStr = await AsyncStorage.getItem("user");
      if (!token || !userStr) {
        setAlertConfig({ title: "Error", message: "User not logged in", type: "error" });
        setAlertVisible(true);
        setLoading(false);
        return;
      }
      const user = JSON.parse(userStr);

      // 3. Call Scan API
      const response = await fetch(`${API_URL}/attendance/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          labourId: user.id, // Ensure this matches backend expectation
          dustbinId: data,
          lat: location.coords.latitude,
          lng: location.coords.longitude
        })
      });

      const resData = await response.json();

      if (response.ok) {
        setScanResult(resData);
        setModalVisible(true);
      } else {
        setAlertConfig({ title: "Scan Failed", message: resData.message || "Unknown error", type: "error" });
        setAlertVisible(true);
        setScanned(false);
      }

    } catch (error) {
      console.error(error);
      setAlertConfig({ title: "Error", message: "Failed to process scan", type: "error" });
      setAlertVisible(true);
      setScanned(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: 'collected' | 'issue') => {
    if (!scanResult?.scanId) return;

    // Validation for Issue Reporting
    if (action === 'issue' && !issueType) {
      setAlertConfig({ title: "Required", message: "Please select an issue type", type: "error" });
      setAlertVisible(true);
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/attendance/update-action`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          scanId: scanResult.scanId,
          action,
          issueDescription: action === 'issue' ? issueType : undefined,
          estimatedWeight: action === 'collected' ? estimatedWeight : undefined
        })
      });

      const resData = await response.json();

      if (response.ok) {
        setAlertConfig({
          title: "Success",
          message: action === 'collected' ? "Bin Collected!" : "Issue Reported!",
          type: "success"
        });
        setAlertVisible(true);
        closeModal();
      } else {
        setAlertConfig({ title: "Error", message: resData.message || "Failed to update status", type: "error" });
        setAlertVisible(true);
      }

    } catch (error) {
      setAlertConfig({ title: "Error", message: "Network error", type: "error" });
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setScanned(false);
    setScanResult(null);
    setReportMode(false);
    setIssueType("");
    setEstimatedWeight("");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">

      {/* 1. Header */}
      <View className="items-center mt-10 mb-4">
        <Text className="text-3xl font-bold text-slate-800 uppercase tracking-widest">
          Scan Bin
        </Text>
        <Text className="text-slate-500 text-sm">Align QR code within frame</Text>
      </View>

      {/* 2. Camera View Container */}
      <View className="flex-1 items-center justify-center -mt-20">
        <View className="w-72 h-72 bg-slate-100 rounded-2xl overflow-hidden border-4 border-slate-200 relative justify-center items-center shadow-lg">
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
          />

          {/* Scanning Frame Marker */}
          <View className="w-56 h-56 border-2 border-white/70 rounded-lg absolute" />

          {loading && (
            <View className="absolute inset-0 bg-black/50 justify-center items-center">
              <ActivityIndicator size="large" color={PRIMARY_COLOR} />
              <Text className="text-white mt-2 font-bold">Processing...</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          className="mt-8 px-6 py-3 bg-slate-100 rounded-full"
          onPress={() => setScanned(false)}
        >
          <Text className="text-slate-600 font-medium">Tap to Reset Camera</Text>
        </TouchableOpacity>
      </View>

      {/* RESULT MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-white rounded-t-3xl p-6 min-h-[50%]">

            {/* Modal Header */}
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-2xl font-bold text-slate-800">
                {reportMode ? "Report Issue" : "Bin Details"}
              </Text>
              <TouchableOpacity onPress={closeModal} className="p-2 bg-slate-100 rounded-full">
                <Text className="text-slate-500 font-bold">✕</Text>
              </TouchableOpacity>
            </View>

            {/* Bin Info (Always Visible) */}
            {!reportMode && scanResult?.bin && (
              <View className="bg-slate-50 p-4 rounded-xl mb-6 space-y-3 border border-slate-100">
                <View className="flex-row items-center">
                  <Info size={20} color={PRIMARY_COLOR} />
                  <Text className="ml-3 text-slate-600 font-medium">ID: </Text>
                  <Text className="text-slate-900 font-bold">{scanResult.bin.binCode || scanResult.bin._id.substring(0, 8)}</Text>
                </View>
                <View className="flex-row items-center">
                  <MapPin size={20} color={PRIMARY_COLOR} />
                  <Text className="ml-3 text-slate-600 font-medium">Location: </Text>
                  <Text className="text-slate-900 font-bold">{scanResult.bin.location}</Text>
                </View>
                <View className="flex-row items-center">
                  <CheckCircle size={20} color={PRIMARY_COLOR} />
                  <Text className="ml-3 text-slate-600 font-medium">Type: </Text>
                  <Text className="text-slate-900 font-bold capitalize">{scanResult.bin.type}</Text>
                </View>

                {scanResult.message && (
                  <View className="mt-2 bg-green-100 p-2 rounded-lg">
                    <Text className="text-green-800 text-center font-medium">{scanResult.message}</Text>
                  </View>
                )}
              </View>
            )}

            {/* ACTION BUTTONS */}
            {!reportMode ? (
              <View className="gap-4">
                <View className="mb-4">
                  <Text className="text-slate-600 font-medium mb-2">Estimated Waste (in kgs)</Text>
                  <View className="flex-row items-center bg-slate-100 rounded-xl px-4 py-3 border border-slate-200">
                    <Scale size={20} color={PRIMARY_COLOR} />
                    <TextInput
                      className="flex-1 ml-3 text-slate-800 font-bold"
                      placeholder="Enter weight (e.g. 10.5)"
                      keyboardType="numeric"
                      value={estimatedWeight}
                      onChangeText={setEstimatedWeight}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  className="w-full py-4 rounded-xl flex-row justify-center items-center shadow-sm"
                  style={{ backgroundColor: SUCCESS_COLOR }}
                  onPress={() => handleAction('collected')}
                >
                  <CheckCircle color="white" size={24} />
                  <Text className="text-white font-bold text-lg ml-2">Bin Collected Successfully</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="w-full py-4 rounded-xl flex-row justify-center items-center border-2 border-slate-200"
                  onPress={() => setReportMode(true)}
                >
                  <AlertTriangle color={WARNING_COLOR} size={24} />
                  <Text className="text-slate-700 font-bold text-lg ml-2">Report Issue with Dustbin</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* REPORT ISSUE FORM */
              <View>
                <TouchableOpacity onPress={() => setReportMode(false)} className="flex-row items-center mb-4">
                  <ArrowLeft size={20} color="#64748B" />
                  <Text className="text-slate-500 ml-2 font-medium">Back to options</Text>
                </TouchableOpacity>

                <Text className="text-slate-600 mb-4 font-medium">Select the issue type:</Text>

                <View className="gap-3 mb-6">
                  {["Waste not segregated", "Hazardous waste", "Civic issues (illegal dumpings)"].map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => setIssueType(opt)}
                      className={`p-4 rounded-xl border flex-row justify-between items-center ${issueType === opt ? 'bg-purple-50 border-purple-500' : 'bg-white border-slate-200'}`}
                    >
                      <Text className={`font-semibold ${issueType === opt ? 'text-purple-700' : 'text-slate-700'}`}>{opt}</Text>
                      {issueType === opt && <View className="w-4 h-4 rounded-full bg-purple-600" />}
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  className="w-full py-4 rounded-xl flex-row justify-center items-center shadow-sm"
                  style={{ backgroundColor: ERROR_COLOR, opacity: issueType ? 1 : 0.5 }}
                  disabled={!issueType}
                  onPress={() => handleAction('issue')}
                >
                  <Text className="text-white font-bold text-lg ml-2">Submit Report</Text>
                </TouchableOpacity>

              </View>
            )}

          </View>
        </View>
      </Modal>

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