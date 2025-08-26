import { Tabs } from 'expo-router';
import { Bus, MapPin, Info, Bookmark, Train, TrainFront, TrainTrack, TrainFrontTunnelIcon, TrainTrackIcon, MapIcon, Route } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#14B8A6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingTop: 5,
          paddingBottom: 5,
          height: 75,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Find Metro',
          tabBarIcon: ({ size, color }) => (
            <TrainFront size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="routes"
        options={{
          title: 'Routes',
          tabBarIcon: ({ size, color }) => (
            <Route size={size} color={color} strokeWidth={2}/>
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'Map',
          tabBarIcon: ({ size, color }) => (
            <MapIcon size={size} color={color} strokeWidth={2}/>
          ),
        }}
      />
    </Tabs>
  );
}