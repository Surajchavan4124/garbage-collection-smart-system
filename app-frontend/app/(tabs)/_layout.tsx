import { Tabs } from 'expo-router';
import { Home, MapPin, MoreHorizontal, PlaySquare, QrCode } from 'lucide-react-native';

export default function TabLayout() {
  const PRIMARY_COLOR = "#6B5BFF";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: PRIMARY_COLOR,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: -5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      {/* We use null components as placeholders for tabs not built yet */}
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <MapPin size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color }) => <QrCode size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tutorial"
        options={{
          title: 'Tutorial',
          tabBarIcon: ({ color }) => <PlaySquare size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => <MoreHorizontal size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}