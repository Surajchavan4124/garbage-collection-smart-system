import React, { useEffect, useRef } from 'react';
import { Animated, Text, View, Platform } from 'react-native';
import { XCircle, CheckCircle, AlertCircle } from 'lucide-react-native';

interface ToastProps {
    visible: boolean;
    message: string;
    type?: 'success' | 'error' | 'warning';
    onDismiss: () => void;
}

export default function Toast({ visible, message, type = 'error', onDismiss }: ToastProps) {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            // Auto-hide after 5 seconds
            const timer = setTimeout(() => {
                handleDismiss();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    const handleDismiss = () => {
        Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            onDismiss();
        });
    };

    if (!visible) return null;

    const getBackgroundColor = () => {
        switch (type) {
            case 'success': return 'bg-green-500';
            case 'warning': return 'bg-orange-500';
            default: return 'bg-red-500';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={24} color="white" />;
            case 'warning': return <AlertCircle size={24} color="white" />;
            default: return <XCircle size={24} color="white" />;
        }
    }

    return (
        <Animated.View
            style={{
                opacity,
                position: 'absolute',
                top: Platform.OS === 'ios' ? 60 : 40,
                left: 20,
                right: 20,
                zIndex: 9999, // Ensure it's on top of everything
                elevation: 5 // Android shadow/elevation
            }}
            className={`${getBackgroundColor()} rounded-xl p-4 flex-row items-center shadow-lg`}
        >
            {getIcon()}
            <Text className="flex-1 text-white font-medium ml-3 text-base">
                {message}
            </Text>
        </Animated.View>
    );
}
