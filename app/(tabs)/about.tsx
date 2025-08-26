import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bus, MapPin, Heart, Info } from 'lucide-react-native';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Bus size={48} color="#14B8A6" />
          <Text style={styles.title}>Metro Map</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.section}>
            
            {/* Full-width image */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: 'https://res.cloudinary.com/dohsmiakm/image/upload/v1756142607/metro_map_n3d10p.jpg' }}
                style={styles.featureImage}
                resizeMode="cover"
              />
            </View>

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
  // Image styles
  imageContainer: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  featureImage: {
    width: '100%',
    height: 680,
    borderRadius: 8,
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