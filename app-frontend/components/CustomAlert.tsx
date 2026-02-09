import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { CheckCircle, AlertCircle } from 'lucide-react-native';

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    type?: 'success' | 'error';
    onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
    visible,
    title,
    message,
    type = 'success',
    onClose
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/40 px-6">
                <View className="bg-white w-full max-w-sm rounded-2xl p-6 items-center shadow-xl">
                    <View className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {type === 'success' ? (
                            <CheckCircle size={32} color="#10B981" />
                        ) : (
                            <AlertCircle size={32} color="#EF4444" />
                        )}
                    </View>

                    <Text className="text-xl font-bold text-slate-800 mb-2 text-center">
                        {title}
                    </Text>
                    <Text className="text-slate-500 text-center mb-6 text-base leading-5">
                        {message}
                    </Text>

                    <TouchableOpacity
                        className="w-full py-3 rounded-xl items-center"
                        style={{ backgroundColor: type === 'success' ? '#10B981' : '#EF4444' }}
                        onPress={onClose}
                    >
                        <Text className="text-white font-bold text-lg">Okay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default CustomAlert;
