import { useRouter } from 'expo-router';
import { Briefcase, HelpCircle, MessageSquare, Mic, Phone, Search, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MoreScreen() {
    const [search, setSearch] = useState('');
    const router = useRouter();

    // Design Colors
    const PRIMARY_COLOR = "#6B5BFF";
    const DANGER_COLOR = "#6B5BFF"; // Using the same purple for SOS based on design, can switch to Red if needed

    // Menu Items Config
    const menuItems = [
        { id: 1, title: 'Attendance Report', icon: Briefcase },
        { id: 2, title: 'Raise Query/issue', icon: HelpCircle },
        { id: 3, title: 'Feedback', icon: MessageSquare },
        { id: 4, title: 'Contact Technical Support', icon: Phone },
        { id: 5, title: 'Contact Committee', icon: Users },
    ];

    const handleSOS = () => {
        Alert.alert(
            "SOS ALERT",
            "Emergency signal sent to supervisor with your current location!",
            [{ text: "OK" }]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white px-6">

            {/* 1. Header */}
            <View className="items-center mt-4 mb-6">
                <Text className="text-xl font-bold text-slate-800 uppercase tracking-widest">
                    More
                </Text>
            </View>

            {/* 2. Search Bar */}
            <View className="flex-row items-center border border-slate-300 rounded-lg px-3 h-14 bg-white mb-8 shadow-sm">
                <Search size={22} color="#64748B" />
                <TextInput
                    className="flex-1 ml-3 text-base text-slate-800"
                    placeholder="search"
                    placeholderTextColor="#94A3B8"
                    value={search}
                    onChangeText={setSearch}
                />
                <TouchableOpacity>
                    <Mic size={22} color="#64748B" />
                </TouchableOpacity>
            </View>

            {/* 3. Menu List */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {menuItems.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        className="flex-row items-center py-4 mb-2 active:bg-slate-50"
                        activeOpacity={0.7}
                        onPress={() => {
                            if (item.title === 'Attendance Report') {
                                router.push('/attendance');
                            } else if (item.title === 'Raise Query/issue') {
                                router.push('/raise-query');
                            } else if (item.title === 'Feedback') {
                                router.push('/feedback');
                            } else if (item.title === 'Contact Technical Support') {
                                router.push('/technical-support');
                            } else if (item.title === 'Contact Committee') {
                                router.push('/contact-committee'); // <--- ADD THIS LINE
                            } else {
                                Alert.alert("Navigation", `Going to ${item.title}`);
                            }
                        }}
                    >
                        {/* Icon Column */}
                        <View className="mr-4">
                            <item.icon size={24} color="#334155" />
                        </View>

                        {/* Text Column */}
                        <Text className="flex-1 text-slate-700 text-lg font-medium">
                            {item.title}
                        </Text>

                        {/* Optional Arrow for UX */}
                        {/* <ChevronRight size={20} color="#CBD5E1" /> */}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* 4. SOS Button (Fixed at Bottom) */}
            <View className="absolute bottom-6 left-6 right-6">
                <TouchableOpacity
                    className="w-full h-14 rounded-lg justify-center items-center shadow-md"
                    style={{ backgroundColor: PRIMARY_COLOR }}
                    activeOpacity={0.9}
                    onPress={handleSOS}
                >
                    <Text className="text-white font-bold text-lg uppercase tracking-wider">
                        SOS EMERGENCY
                    </Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
}