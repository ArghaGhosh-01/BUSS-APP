import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bus, MapPin, Heart, Info } from 'lucide-react-native';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Bus size={48} color="#14B8A6" />
          <Text style={styles.title}>Kolkata Metro Finder</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This App</Text>
            <Text style={styles.sectionText}>
              Kolkata Bus Finder helps you navigate the city's public bus system with ease. 
              Find the best routes between any two locations, discover boarding points, 
              and explore complete bus route information.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featureItem}>
              <MapPin size={20} color="#14B8A6" />
              <Text style={styles.featureText}>
                Smart route finding between source and destination
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Bus size={20} color="#14B8A6" />
              <Text style={styles.featureText}>
                Complete bus route information with all stops
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Heart size={20} color="#14B8A6" />
              <Text style={styles.featureText}>
                Save your favorite routes for quick access
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Info size={20} color="#14B8A6" />
              <Text style={styles.featureText}>
                Landmarks and boarding point information
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How to Use</Text>
            <Text style={styles.sectionText}>
              1. Enter your source and destination in the search form{'\n'}
              2. Browse the list of available buses{'\n'}
              3. Check the complete route and boarding points{'\n'}
              4. Add routes to favorites for easy access
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Source</Text>
            <Text style={styles.sectionText}>
              Bus route information is compiled from official WBTC (West Bengal Transport Corporation) 
              routes and other reliable public transport sources. The app works offline and 
              doesn't require internet connectivity for basic functionality.
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Made with ❤️ for Kolkata commuters
            </Text>
            <Text style={styles.footerText}>
              © 2025 Kolkata Bus Finder
            </Text>
          </View>
        </View>
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
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
  },
  version: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 12,
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginVertical: 4,
  },
});