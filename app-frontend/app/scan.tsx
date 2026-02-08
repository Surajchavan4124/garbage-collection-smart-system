import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { CameraView, Camera } from "expo-camera";
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScanScreen() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const getPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getPermissions();
    }, []);

    const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
        setScanned(true);
        // TODO: Verify different QR types (Bin vs Depot/Check-In)
        Alert.alert(
            "QR Code Scanned",
            `Type: ${type}\nData: ${data}`,
            [
                {
                    text: "OK",
                    onPress: () => {
                        // For now, if checking in, mock success and go back
                        setScanned(false);
                        router.back();
                    }
                }
            ]
        );
    };

    if (hasPermission === null) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-black">
                <Text className="text-white">Requesting camera permission...</Text>
            </SafeAreaView>
        );
    }
    if (hasPermission === false) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-black">
                <Text className="text-white mb-4">No access to camera</Text>
                <Button title="Allow Camera" onPress={() => Camera.requestCameraPermissionsAsync()} />
                <Button title="Go Back" onPress={() => router.back()} />
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            />

            {/* Overlay */}
            <SafeAreaView style={styles.overlay}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Scan QR Code</Text>
                </View>

                <View style={styles.scanRegion}>
                    <View style={styles.cornerTL} />
                    <View style={styles.cornerTR} />
                    <View style={styles.cornerBL} />
                    <View style={styles.cornerBR} />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.instruction}>Align QR code within the frame</Text>
                </View>
            </SafeAreaView>

            {scanned && (
                <View style={styles.rescanContainer}>
                    <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    overlay: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        padding: 10,
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    scanRegion: {
        width: 250,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        marginBottom: 40,
    },
    instruction: {
        color: 'white',
        fontSize: 16,
        opacity: 0.8,
    },
    rescanContainer: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
    },
    // Corners
    cornerTL: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 40,
        height: 40,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderColor: '#6B5BFF'
    },
    cornerTR: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 40,
        height: 40,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderColor: '#6B5BFF'
    },
    cornerBL: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 40,
        height: 40,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderColor: '#6B5BFF'
    },
    cornerBR: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 40,
        height: 40,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderColor: '#6B5BFF'
    },
});
