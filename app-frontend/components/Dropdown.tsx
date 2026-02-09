import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { ChevronDown, X } from 'lucide-react-native';

interface DropdownProps {
    data: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function Dropdown({ data, value, onChange, placeholder = "Select an option" }: DropdownProps) {
    const [visible, setVisible] = useState(false);

    const selectedItem = data.find(item => item.value === value);

    const renderItem = ({ item }: { item: { label: string; value: string } }) => (
        <TouchableOpacity
            className="p-4 border-b border-gray-100 active:bg-purple-50"
            onPress={() => {
                onChange(item.value);
                setVisible(false);
            }}
        >
            <Text className={`text-base ${item.value === value ? 'text-purple-600 font-bold' : 'text-slate-700'}`}>
                {item.label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View>
            <TouchableOpacity
                className="flex-row items-center justify-between w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-4"
                onPress={() => setVisible(true)}
            >
                <Text className={`text-base ${selectedItem ? 'text-slate-800' : 'text-slate-400'}`}>
                    {selectedItem ? selectedItem.label : placeholder}
                </Text>
                <ChevronDown size={20} color="#64748B" />
            </TouchableOpacity>

            <Modal visible={visible} animationType="slide" transparent>
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl h-[60%]">
                        <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
                            <Text className="text-lg font-bold text-slate-800">{placeholder}</Text>
                            <TouchableOpacity onPress={() => setVisible(false)} className="p-2 bg-slate-100 rounded-full">
                                <X size={20} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={data}
                            keyExtractor={(item) => item.value}
                            renderItem={renderItem}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}
