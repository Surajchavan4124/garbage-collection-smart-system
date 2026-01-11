import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
const router = useRouter();
  // Design Colors
  const PRIMARY_COLOR = "#6B5BFF";

  // Handle Camera Permissions
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
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

  // Handle Barcode Scanned
  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    Alert.alert("Bin Scanned!", `Data: ${data}`, [
      { text: "OK", onPress: () => setScanned(false) }
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      
      {/* 1. Header */}
      <View className="items-center mt-20">
        <Text className="text-4xl font-bold text-slate-800 uppercase tracking-widest">
          Scan
        </Text>
      </View>

      {/* 2. Camera View Container */}
      <View className="flex-1 items-center justify-center -mt-60"> 
        {/* The Grey/Camera Box */}
        <View className="w-72 h-72 bg-slate-100 rounded-lg overflow-hidden border border-slate-300 relative justify-center items-center">
          
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
          />
          
          {/* Overlay Text "Capture QR" (Visible only if camera is off or loading) */}
          <View className="absolute pointer-events-none">
             <Text className="text-slate-500 font-medium text-sm opacity-50">
               Capture QR
             </Text>
          </View>
          
          {/* Scanning Frame Marker (Visual Aid) */}
          <View className="w-48 h-48 border-2 border-white/50 rounded-lg" />
        </View>

        {/* 3. Report Issue Button */}
        <TouchableOpacity
          className="mt-12 w-72 h-14 rounded-lg justify-center items-center shadow-sm"
          style={{ backgroundColor: PRIMARY_COLOR }}
          activeOpacity={0.8}
          onPress={() => router.push("/report")}
        >
          <Text className="text-white font-bold text-base">
            Report Issue with Dustbin
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}