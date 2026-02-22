import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
  Alert, StyleSheet, Text, TouchableOpacity, View, Modal,
  ActivityIndicator, TextInput, Animated, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckCircle, AlertTriangle, MapPin, Info, ArrowLeft, Scale, Scan, X } from 'lucide-react-native';
import CustomAlert from '../../components/CustomAlert';
import { request } from '../../utils/api';

const PRIMARY = '#6B5BFF';
const GREEN = '#22c55e';
const ORANGE = '#F59E0B';
const RED = '#EF4444';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [reportMode, setReportMode] = useState(false);
  const [issueType, setIssueType] = useState('');
  const [estimatedWeight, setEstimatedWeight] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '', type: 'success' as 'success' | 'error' });
  const router = useRouter();

  // Pulse animation for the scan ring
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    let anim: Animated.CompositeAnimation;
    if (!scanned && !loading) {
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.06, duration: 900, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        ])
      );
      anim.start();
    } else {
      pulse.setValue(1);
    }
    return () => anim?.stop();
  }, [scanned, loading]);

  useEffect(() => {
    (async () => { if (!locationPermission?.granted) await requestLocationPermission(); })();
  }, []);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0f0a2e', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }} edges={['top']}>
        <Scan size={56} color={PRIMARY} />
        <Text style={{ color: 'white', fontSize: 20, fontWeight: '700', textAlign: 'center', marginTop: 20, marginBottom: 10 }}>
          Camera Access Needed
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 32, lineHeight: 22 }}>
          We need camera access to scan bin QR codes.
        </Text>
        <TouchableOpacity onPress={requestPermission} style={{
          backgroundColor: PRIMARY, paddingHorizontal: 32, paddingVertical: 14,
          borderRadius: 14, shadowColor: PRIMARY, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
        }}>
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleBarCodeScanned = async ({ data }: { type: string; data: string }) => {
    if (scanned || loading) return;
    setScanned(true); setLoading(true); setEstimatedWeight('');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAlertConfig({ title: 'Permission Denied', message: 'Location access is required to scan bins.', type: 'error' });
        setAlertVisible(true); setLoading(false); setScanned(false); return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) { setScanned(false); setLoading(false); return; }
      const user = JSON.parse(userStr);
      const res = await request('/attendance/scan', {
        method: 'POST',
        body: JSON.stringify({ labourId: user.id, dustbinId: data, lat: location.coords.latitude, lng: location.coords.longitude }),
      });
      const resData = await res.json();
      if (res.ok) { setScanResult(resData); setModalVisible(true); }
      else {
        setAlertConfig({ title: 'Scan Failed', message: resData.message || 'Unknown error', type: 'error' });
        setAlertVisible(true); setScanned(false);
      }
    } catch {
      setAlertConfig({ title: 'Error', message: 'Failed to process scan', type: 'error' });
      setAlertVisible(true); setScanned(false);
    } finally { setLoading(false); }
  };

  const handleAction = async (action: 'collected' | 'issue') => {
    if (!scanResult?.scanId) return;
    if (action === 'issue' && !issueType) {
      setAlertConfig({ title: 'Required', message: 'Please select an issue type', type: 'error' });
      setAlertVisible(true); return;
    }
    setLoading(true);
    try {
      const res = await request('/attendance/update-action', {
        method: 'PUT',
        body: JSON.stringify({ scanId: scanResult.scanId, action, issueDescription: action === 'issue' ? issueType : undefined, estimatedWeight: action === 'collected' ? estimatedWeight : undefined }),
      });
      const resData = await res.json();
      if (res.ok) {
        setAlertConfig({ title: 'Success ✓', message: action === 'collected' ? 'Bin marked as collected!' : 'Issue reported successfully!', type: 'success' });
        setAlertVisible(true); closeModal();
      } else {
        setAlertConfig({ title: 'Error', message: resData.message || 'Failed to update status', type: 'error' });
        setAlertVisible(true);
      }
    } catch {
      setAlertConfig({ title: 'Error', message: 'Network error', type: 'error' });
      setAlertVisible(true);
    } finally { setLoading(false); }
  };

  const closeModal = () => { setModalVisible(false); setScanned(false); setScanResult(null); setReportMode(false); setIssueType(''); setEstimatedWeight(''); };

  const ISSUES = ['Waste not segregated', 'Hazardous waste', 'Civic issues (illegal dumping)', 'Bin damaged/missing'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f0a2e' }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0a2e" />

      {/* Header */}
      <View style={{ alignItems: 'center', paddingTop: 24, paddingBottom: 16 }}>
        <Text style={{ color: 'white', fontSize: 26, fontWeight: '800', letterSpacing: 2 }}>SCAN BIN</Text>
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>Align the QR code within the frame</Text>
      </View>

      {/* Camera Area */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* Outer glow ring */}
        <Animated.View style={{
          width: 300, height: 300, borderRadius: 24,
          borderWidth: 2, borderColor: scanned ? GREEN : 'rgba(107,91,255,0.6)',
          transform: [{ scale: pulse }],
          shadowColor: scanned ? GREEN : PRIMARY, shadowOpacity: 0.5, shadowRadius: 20,
          overflow: 'hidden',
        }}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          />

          {/* Corner markers */}
          {[{ top: 12, left: 12 }, { top: 12, right: 12 }, { bottom: 12, left: 12 }, { bottom: 12, right: 12 }].map((pos, i) => (
            <View key={i} style={[{ position: 'absolute', width: 28, height: 28, borderColor: 'white', borderRadius: 4 }, pos,
            { borderTopWidth: i < 2 ? 3 : 0, borderBottomWidth: i >= 2 ? 3 : 0, borderLeftWidth: i === 0 || i === 2 ? 3 : 0, borderRightWidth: i === 1 || i === 3 ? 3 : 0 }
            ]} />
          ))}

          {/* Loading overlay */}
          {loading && (
            <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color={PRIMARY} />
              <Text style={{ color: 'white', marginTop: 10, fontWeight: '600' }}>Processing…</Text>
            </View>
          )}
        </Animated.View>

        {/* Reset button */}
        <TouchableOpacity
          onPress={() => { setScanned(false); setLoading(false); }}
          style={{
            marginTop: 32, paddingHorizontal: 28, paddingVertical: 12,
            backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 50,
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
            flexDirection: 'row', alignItems: 'center', gap: 8,
          }}
        >
          <Scan size={16} color="rgba(255,255,255,0.7)" />
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>Tap to Reset</Text>
        </TouchableOpacity>
      </View>

      {/* ── Result Bottom Sheet Modal ─────────────── */}
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={closeModal}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, minHeight: '55%' }}>

            {/* Drag handle */}
            <View style={{ width: 40, height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />

            {/* Modal Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#1e293b' }}>
                {reportMode ? '⚠️ Report Issue' : '✅ Bin Scanned'}
              </Text>
              <TouchableOpacity onPress={closeModal} style={{ padding: 8, backgroundColor: '#f1f5f9', borderRadius: 10 }}>
                <X size={18} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Bin Info */}
            {!reportMode && scanResult?.bin && (
              <View style={{ backgroundColor: '#f8fafc', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#e2e8f0' }}>
                {[
                  { icon: Info, label: 'Bin Code', value: scanResult.bin.binCode || '—' },
                  { icon: MapPin, label: 'Location', value: scanResult.bin.location || '—' },
                  { icon: CheckCircle, label: 'Type', value: scanResult.bin.type || 'General' },
                ].map(({ icon: Icon, label, value }) => (
                  <View key={label} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <Icon size={18} color={PRIMARY} />
                    <Text style={{ color: '#64748b', marginLeft: 10, fontSize: 14 }}>{label}: </Text>
                    <Text style={{ color: '#1e293b', fontWeight: '700', fontSize: 14, flex: 1 }}>{value}</Text>
                  </View>
                ))}
              </View>
            )}

            {!reportMode ? (
              <View style={{ gap: 12 }}>
                {/* Weight Input */}
                <View style={{ backgroundColor: '#f8fafc', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#e2e8f0', flexDirection: 'row', alignItems: 'center' }}>
                  <Scale size={20} color={PRIMARY} />
                  <TextInput
                    style={{ flex: 1, marginLeft: 12, fontSize: 15, color: '#1e293b', fontWeight: '600' }}
                    placeholder="Estimated weight (kg)"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    value={estimatedWeight}
                    onChangeText={setEstimatedWeight}
                  />
                </View>

                {/* Collected */}
                <TouchableOpacity
                  onPress={() => handleAction('collected')}
                  style={{ backgroundColor: GREEN, borderRadius: 14, paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowColor: GREEN, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}>
                  <CheckCircle size={22} color="white" />
                  <Text style={{ color: 'white', fontWeight: '800', fontSize: 16, marginLeft: 10 }}>Bin Collected ✓</Text>
                </TouchableOpacity>

                {/* Report Issue */}
                <TouchableOpacity
                  onPress={() => setReportMode(true)}
                  style={{ borderRadius: 14, paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fde68a', backgroundColor: '#fffbeb' }}>
                  <AlertTriangle size={22} color={ORANGE} />
                  <Text style={{ color: ORANGE, fontWeight: '700', fontSize: 15, marginLeft: 10 }}>Report an Issue</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <TouchableOpacity onPress={() => setReportMode(false)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                  <ArrowLeft size={18} color="#64748b" />
                  <Text style={{ color: '#6b7280', marginLeft: 8, fontWeight: '600' }}>Back</Text>
                </TouchableOpacity>
                <Text style={{ color: '#475569', fontWeight: '600', marginBottom: 12 }}>Select issue type:</Text>
                <View style={{ gap: 10, marginBottom: 20 }}>
                  {ISSUES.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => setIssueType(opt)}
                      style={{ padding: 14, borderRadius: 12, borderWidth: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderColor: issueType === opt ? PRIMARY : '#e2e8f0', backgroundColor: issueType === opt ? '#eef2ff' : 'white' }}>
                      <Text style={{ fontWeight: '600', color: issueType === opt ? PRIMARY : '#374151', flex: 1 }}>{opt}</Text>
                      {issueType === opt && <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: PRIMARY, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 12, fontWeight: '800' }}>✓</Text>
                      </View>}
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  onPress={() => handleAction('issue')}
                  disabled={!issueType}
                  style={{ borderRadius: 14, paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: issueType ? RED : '#fca5a5' }}>
                  <Text style={{ color: 'white', fontWeight: '800', fontSize: 16 }}>Submit Report</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <CustomAlert visible={alertVisible} title={alertConfig.title} message={alertConfig.message} type={alertConfig.type} onClose={() => setAlertVisible(false)} />
    </SafeAreaView>
  );
}