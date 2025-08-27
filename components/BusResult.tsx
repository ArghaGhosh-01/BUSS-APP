import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Bus, MapPin, Clock, Star, ArrowRight, Route } from 'lucide-react-native';

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

interface BusResultProps {
  bus?: BusData;
  indirectRoute?: IndirectRoute;
  sourceStop: string;
  destinationStop: string;
  onAddToFavorites: (bus: BusData) => void;
  isIndirect?: boolean;
}

export default function BusResult({
  bus,
  indirectRoute,
  sourceStop,
  destinationStop,
  onAddToFavorites,
  isIndirect = false,
}: BusResultProps) {
  const getTypeStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case 'yellow':
        return styles.yellowType;
      case 'orange':
        return styles.orangeType;
      case 'purple':
        return styles.purpleType;
      case 'blue':
        return styles.blueType;
      case 'green':
        return styles.greenType;
      case 'pink':
        return styles.pinkType;
      default:
        return styles.yellowType;
    }
  };

  const getTypeText = (type: string) => {
    switch (type.toLowerCase()) {
      case 'yellow':
        return 'Yellow Line';
      case 'orange':
        return 'Orange Line';
      case 'purple':
        return 'Purple Line';
      case 'blue':
        return 'Blue Line';
      case 'green':
        return 'Green Line';
      case 'pink':
        return 'Pink Line';
      default:
        return 'Yellow Line';
    }
  };

  if (isIndirect && indirectRoute) {
    return (
      <View style={styles.container}>
        <View style={styles.indirectHeader}>
          <View style={styles.indirectBadge}>
            <Route size={16} color="#F97316" />
            <Text style={styles.indirectBadgeText}>Indirect Route</Text>
          </View>
          <Text style={styles.transferText}>
            Transfer at: {indirectRoute.transferPoint}
          </Text>
        </View>

        <View style={styles.indirectRouteContainer}>
          {/* First Bus */}
          <View style={styles.busSegment}>
            <View style={styles.busHeader}>
              <View style={styles.busInfo}>
                <View style={styles.busNumberContainer}>
                  <Text style={styles.busNumber}>{indirectRoute.firstBus.number}</Text>
                  <Text style={[styles.busType, getTypeStyle(indirectRoute.firstBus.type)]}>
                    {getTypeText(indirectRoute.firstBus.type)}
                  </Text>
                </View>
                <Text style={styles.busName}>{indirectRoute.firstBus.name}</Text>
              </View>
            </View>
            <Text style={styles.segmentDescription}>
              Board at: {sourceStop} → Get off at: {indirectRoute.transferPoint}
            </Text>
          </View>

          <View style={styles.transferIndicator}>
            <Text style={styles.transferText}>Transfer</Text>
            <ArrowRight size={20} color="#6B7280" />
          </View>

          {/* Second Bus */}
          <View style={styles.busSegment}>
            <View style={styles.busHeader}>
              <View style={styles.busInfo}>
                <View style={styles.busNumberContainer}>
                  <Text style={styles.busNumber}>{indirectRoute.secondBus.number}</Text>
                  <Text style={[styles.busType, getTypeStyle(indirectRoute.secondBus.type)]}>
                    {getTypeText(indirectRoute.secondBus.type)}
                  </Text>
                </View>
                <Text style={styles.busName}>{indirectRoute.secondBus.name}</Text>
              </View>
            </View>
            <Text style={styles.segmentDescription}>
              Board at: {indirectRoute.transferPoint} → Get off at: {destinationStop}
            </Text>
          </View>
        </View>

        <View style={styles.routeInfo}>
          <View style={styles.routeItem}>
            <Clock size={16} color="#6B7280" />
            <Text style={styles.routeText}>
              Approximately {indirectRoute.totalStops} total stops
            </Text>
          </View>
          <View style={styles.routeItem}>
            <MapPin size={16} color="#F97316" />
            <Text style={styles.routeText}>
              1 transfer required
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (!bus) return null;

  const sourceIndex = bus.route.findIndex(stop => 
    stop.toLowerCase().includes(sourceStop.toLowerCase())
  );
  const destIndex = bus.route.findIndex(stop => 
    stop.toLowerCase().includes(destinationStop.toLowerCase())
  );

  const isValidRoute = sourceIndex !== -1 && destIndex !== -1 && sourceIndex !== destIndex;
  const boardingPoint = sourceIndex !== -1 ? bus.route[sourceIndex] : sourceStop;

  // Determine if we need to reverse the route for display
  const shouldReverse = sourceIndex > destIndex;
  const displayRoute = shouldReverse ? [...bus.route].reverse() : bus.route;
  
  // Find the new indices after potential reversal
  const displaySourceIndex = shouldReverse 
    ? displayRoute.findIndex(stop => stop.toLowerCase().includes(sourceStop.toLowerCase()))
    : sourceIndex;
    
  const displayDestIndex = shouldReverse 
    ? displayRoute.findIndex(stop => stop.toLowerCase().includes(destinationStop.toLowerCase()))
    : destIndex;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.busInfo}>
          <View style={styles.busNumberContainer}>
            <Text style={styles.busNumber}>{bus.number}</Text>
            <Text style={[styles.busType, getTypeStyle(bus.type)]}>
              {getTypeText(bus.type)}
            </Text>
          </View>
          <Text style={styles.busName}>{bus.name}</Text>
        </View>
      </View>

      <View style={styles.routeInfo}>
        <View style={styles.routeItem}>
          <MapPin size={16} color="#14B8A6" />
          <Text style={styles.routeText}>Board at: {boardingPoint}</Text>
        </View>
        {isValidRoute && (
          <View style={styles.routeItem}>
            <Clock size={16} color="#6B7280" />
            <Text style={styles.routeText}>
              {Math.abs(destIndex - sourceIndex)} stops away
            </Text>
          </View>
        )}
      </View>

      <View style={styles.routeContainer}>
        <Text style={styles.routeTitle}>Complete Route:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.routeStops}>
            {displayRoute.map((stop, index) => {
              const isSource = index === displaySourceIndex;
              const isDest = index === displayDestIndex;
              const isBetween = isValidRoute && 
                ((displaySourceIndex < displayDestIndex && index > displaySourceIndex && index < displayDestIndex) ||
                 (displaySourceIndex > displayDestIndex && index < displaySourceIndex && index > displayDestIndex));

              return (
                <View key={index} style={styles.stopContainer}>
                  <View style={[
                    styles.stopDot,
                    isSource && styles.sourceDot,
                    isDest && styles.destDot,
                    isBetween && styles.betweenDot,
                  ]} />
                  <Text style={[
                    styles.stopText,
                    (isSource || isDest) && styles.highlightedStop,
                  ]}>
                    {stop}
                  </Text>
                </View>
              );
            })}
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
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  busInfo: {
    flex: 1,
  },
  busNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  busNumber: {
    fontSize: 20,
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
  yellowType: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  orangeType: {
    backgroundColor: '#FFEDD5',
    color: '#9A3412',
  },
  purpleType: {
    backgroundColor: '#EDE9FE',
    color: '#5B21B6',
  },
  blueType: {
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
  },
  greenType: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
  },
  pinkType: {
    backgroundColor: '#FCE7F3',
    color: '#9D174D',
  },
  busName: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  favoriteButton: {
    padding: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
  },
  routeInfo: {
    marginBottom: 16,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  routeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
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
    backgroundColor: '#D1D5DB',
    marginBottom: 4,
  },
  sourceDot: {
    backgroundColor: '#14B8A6',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  destDot: {
    backgroundColor: '#F97316',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  betweenDot: {
    backgroundColor: '#60A5FA',
  },
  stopText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    width: 80,
  },
  highlightedStop: {
    color: '#111827',
    fontWeight: '600',
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
  // Indirect route styles
  indirectHeader: {
    marginBottom: 16,
  },
  indirectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  indirectBadgeText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#F97316',
  },
  transferText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  indirectRouteContainer: {
    marginBottom: 16,
  },
  busSegment: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  segmentDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    fontStyle: 'italic',
  },
  transferIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
});