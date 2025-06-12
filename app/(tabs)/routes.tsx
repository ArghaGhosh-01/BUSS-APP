import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Bus, MapPin } from 'lucide-react-native';
import busData from '@/data/busRoutes.json';

interface BusData {
  number: string;
  name: string;
  type: string;
  route: string[];
  landmarks: string[];
}

export default function RoutesScreen() {
  const [searchText, setSearchText] = useState('');
  const [filteredBuses, setFilteredBuses] = useState<BusData[]>(busData.buses);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredBuses(busData.buses);
    } else {
      const filtered = busData.buses.filter((bus: BusData) =>
        bus.number.toLowerCase().includes(text.toLowerCase()) ||
        bus.name.toLowerCase().includes(text.toLowerCase()) ||
        bus.route.some(stop => stop.toLowerCase().includes(text.toLowerCase()))
      );
      setFilteredBuses(filtered);
    }
  };

  const renderBusCard = (bus: BusData, index: number) => (
    <View key={index} style={styles.busCard}>
      <View style={styles.busHeader}>
        <View style={styles.busNumberContainer}>
          <Text style={styles.busNumber}>{bus.number}</Text>
          <Text style={[
            styles.busType,
            bus.type === 'AC' ? styles.acType : styles.regularType
          ]}>
            {bus.type}
          </Text>
        </View>
        <Text style={styles.busName}>{bus.name}</Text>
      </View>

      <View style={styles.routeContainer}>
        <Text style={styles.routeTitle}>Route:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.routeStops}>
            {bus.route.map((stop, stopIndex) => (
              <View key={stopIndex} style={styles.stopContainer}>
                <View style={styles.stopDot} />
                <Text style={styles.stopText}>{stop}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {bus.landmarks.length > 0 && (
        <View style={styles.landmarksContainer}>
          <Text style={styles.landmarksTitle}>Near Landmarks:</Text>
          <Text style={styles.landmarksText}>
            {bus.landmarks.join(' • ')}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>All Bus Routes</Text>
        <Text style={styles.subtitle}>Browse all available bus routes</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by bus number, route name, or stop"
            value={searchText}
            onChangeText={handleSearch}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Bus size={24} color="#14B8A6" />
          <Text style={styles.statNumber}>{filteredBuses.length}</Text>
          <Text style={styles.statLabel}>Routes</Text>
        </View>
        <View style={styles.statItem}>
          <MapPin size={24} color="#F97316" />
          <Text style={styles.statNumber}>{busData.majorStops.length}</Text>
          <Text style={styles.statLabel}>Major Stops</Text>
        </View>
      </View>

      <ScrollView
        style={styles.routesScroll}
        showsVerticalScrollIndicator={false}
      >
        {filteredBuses.map((bus, index) => renderBusCard(bus, index))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  routesScroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  busCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  busHeader: {
    marginBottom: 12,
  },
  busNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  busNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginRight: 8,
  },
  busType: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  acType: {
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
  },
  regularType: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },
  busName: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  routeContainer: {
    marginBottom: 12,
  },
  routeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  routeStops: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stopContainer: {
    alignItems: 'center',
    marginRight: 20,
  },
  stopDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#14B8A6',
    marginBottom: 4,
  },
  stopText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    width: 80,
  },
  landmarksContainer: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  landmarksTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  landmarksText: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 16,
  },
});