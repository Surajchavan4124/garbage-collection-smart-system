import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Truck } from 'lucide-react-native';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
            <View className="items-center mb-12">
                <View className="w-24 h-24 bg-purple-100 rounded-full items-center justify-center mb-6">
                    <Truck size={48} color="#6B5BFF" />
                </View>
                <Text className="text-3xl font-bold text-slate-800 text-center mb-2">
                    Garbage Collection
                </Text>
                <Text className="text-slate-500 text-center text-lg">
                    Smart Management System
                </Text>
            </View>

            <View className="w-full gap-4">
                <TouchableOpacity
                    className="w-full py-4 bg-purple-600 rounded-xl items-center shadow-lg shadow-purple-200"
                    activeOpacity={0.8}
                    onPress={() => router.push('/(auth)/login')}
                >
                    <Text className="text-white font-bold text-lg">Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="w-full py-4 bg-white border-2 border-purple-600 rounded-xl items-center"
                    activeOpacity={0.7}
                    onPress={() => router.push('/(auth)/register')}
                >
                    <Text className="text-purple-600 font-bold text-lg">New Registration</Text>
                </TouchableOpacity>
            </View>

            <View className="absolute bottom-10 flex-row items-center">
                <MapPin size={16} color="#94A3B8" />
                <Text className="text-slate-400 ml-2">Smart City Initiative</Text>
            </View>
        </SafeAreaView>
    );
}
