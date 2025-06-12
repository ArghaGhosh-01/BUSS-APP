import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchForm from '@/components/SearchForm';
import BusResult from '@/components/BusResult';
import busData from '@/data/busRoutes.json';
import { Bus, Route, Info } from 'lucide-react-native';

interface BusData {
  number: string;
  name: string;
  type: string;
  route: string[];
  landmarks: string[];
}

interface IndirectRoute {
  firstBus: BusData;
  secondBus: BusData;
  transferPoint: string;
  totalStops: number;
}

export default function HomeScreen() {
  const [searchResults, setSearchResults] = useState<BusData[]>([]);
  const [indirectRoutes, setIndirectRoutes] = useState<IndirectRoute[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState({ source: '', destination: '' });

  const findDirectRoutes = (source: string, destination: string): BusData[] => {
    return busData.buses.filter((bus: BusData) => {
      const hasSource = bus.route.some(stop => 
        stop.toLowerCase().includes(source.toLowerCase())
      );
      const hasDestination = bus.route.some(stop => 
        stop.toLowerCase().includes(destination.toLowerCase())
      );
      
      return hasSource && hasDestination;
    });
  };

  const findIndirectRoutes = (source: string, destination: string): IndirectRoute[] => {
    const indirectRoutes: IndirectRoute[] = [];
    const maxIndirectRoutes = 3; // Limit to prevent too many results

    // Find buses that contain the source
    const sourceBuses = busData.buses.filter((bus: BusData) =>
      bus.route.some(stop => stop.toLowerCase().includes(source.toLowerCase()))
    );

    // Find buses that contain the destination
    const destBuses = busData.buses.filter((bus: BusData) =>
      bus.route.some(stop => stop.toLowerCase().includes(destination.toLowerCase()))
    );

    // Find common stops between source and destination buses
    for (const sourceBus of sourceBuses) {
      for (const destBus of destBuses) {
        if (sourceBus.number === destBus.number) continue; // Skip same bus

        // Find common stops
        const commonStops = sourceBus.route.filter(stop =>
          destBus.route.includes(stop)
        );

        for (const transferPoint of commonStops) {
          // Check if the transfer point is after source in sourceBus
          const sourceIndex = sourceBus.route.findIndex(stop =>
            stop.toLowerCase().includes(source.toLowerCase())
          );
          const transferIndexInSource = sourceBus.route.indexOf(transferPoint);
          
          // Check if the transfer point is before destination in destBus
          const destIndex = destBus.route.findIndex(stop =>
            stop.toLowerCase().includes(destination.toLowerCase())
          );
          const transferIndexInDest = destBus.route.indexOf(transferPoint);

          // Validate the route makes sense
          const validSourceToTransfer = sourceIndex !== -1 && transferIndexInSource > sourceIndex;
          const validTransferToDest = destIndex !== -1 && transferIndexInDest < destIndex;

          if (validSourceToTransfer && validTransferToDest) {
            const totalStops = (transferIndexInSource - sourceIndex) + (destIndex - transferIndexInDest);
            
            // Check if this combination already exists
            const exists = indirectRoutes.some(route =>
              route.firstBus.number === sourceBus.number &&
              route.secondBus.number === destBus.number &&
              route.transferPoint === transferPoint
            );

            if (!exists && indirectRoutes.length < maxIndirectRoutes) {
              indirectRoutes.push({
                firstBus: sourceBus,
                secondBus: destBus,
                transferPoint,
                totalStops,
              });
            }
          }
        }
      }
    }

    // Sort by total stops (shorter routes first)
    return indirectRoutes.sort((a, b) => a.totalStops - b.totalStops);
  };

  const handleSearch = (source: string, destination: string) => {
    // Find direct routes first
    const directResults = findDirectRoutes(source, destination);
    
    // If no direct routes, find indirect routes
    let indirectResults: IndirectRoute[] = [];
    if (directResults.length === 0) {
      indirectResults = findIndirectRoutes(source, destination);
    }

    setSearchResults(directResults);
    setIndirectRoutes(indirectResults);
    setIsSearched(true);
    setSearchQuery({ source, destination });
  };

  const handleAddToFavorites = (bus: BusData) => {
    Alert.alert(
      'Added to Favorites',
      `Bus ${bus.number} has been added to your favorites!`,
      [{ text: 'OK' }]
    );
  };

  const totalResults = searchResults.length + indirectRoutes.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Bus size={32} color="#14B8A6" />
        <Text style={styles.title}>Kolkata Bus Finder</Text>
        <Text style={styles.subtitle}>Find the best bus routes in the city</Text>
      </View>

      <SearchForm
        onSearch={handleSearch}
        suggestions={busData.majorStops}
      />

      {isSearched && (
        <View style={styles.resultsContainer}>
          {searchResults.length > 0 ? (
            <View>
              <Text style={styles.resultsTitle}>
                Found {searchResults.length} direct route{searchResults.length > 1 ? 's' : ''}
              </Text>
              <View style={styles.directBadge}>
                <Bus size={16} color="#14B8A6" />
                <Text style={styles.directBadgeText}>Direct Routes</Text>
              </View>
            </View>
          ) : indirectRoutes.length > 0 ? (
            <View>
              <Text style={styles.resultsTitle}>
                No direct routes found
              </Text>
              <View style={styles.indirectInfo}>
                <Info size={16} color="#F97316" />
                <Text style={styles.indirectInfoText}>
                  Showing {indirectRoutes.length} indirect route{indirectRoutes.length > 1 ? 's' : ''} with transfers
                </Text>
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.resultsTitle}>No routes found</Text>
              <Text style={styles.noResults}>
                Try searching with different locations or check spelling.
              </Text>
            </View>
          )}
        </View>
      )}

      <ScrollView
        style={styles.resultsScroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Direct Routes */}
        {searchResults.map((bus, index) => (
          <BusResult
            key={`direct-${index}`}
            bus={bus}
            sourceStop={searchQuery.source}
            destinationStop={searchQuery.destination}
            onAddToFavorites={handleAddToFavorites}
          />
        ))}

        {/* Indirect Routes */}
        {searchResults.length === 0 && indirectRoutes.map((indirectRoute, index) => (
          <BusResult
            key={`indirect-${index}`}
            indirectRoute={indirectRoute}
            sourceStop={searchQuery.source}
            destinationStop={searchQuery.destination}
            onAddToFavorites={handleAddToFavorites}
            isIndirect={true}
          />
        ))}
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
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  directBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  directBadgeText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#14B8A6',
  },
  indirectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  indirectInfoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#F97316',
    fontWeight: '500',
    flex: 1,
  },
  noResults: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  resultsScroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
});