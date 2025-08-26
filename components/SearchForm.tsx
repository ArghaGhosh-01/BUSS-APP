import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
} from 'react-native';
import { Search, MapPin, ArrowUpDown, X } from 'lucide-react-native';

interface SearchFormProps {
  onSearch: (source: string, destination: string) => void;
  suggestions: string[];
}

export default function SearchForm({ onSearch, suggestions }: SearchFormProps) {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [activeField, setActiveField] = useState<'source' | 'destination' | null>(null);
  const [suggestionAnimation] = useState(new Animated.Value(0));

  const handleSourceChange = (text: string) => {
    setSource(text);
    if (text.length > 0) {
      const filtered = suggestions.filter(s => 
        s.toLowerCase().includes(text.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setFilteredSuggestions(filtered);
      setActiveField('source');
      setShowSourceSuggestions(true);
      setShowDestSuggestions(false);
      animateSuggestions(true);
    } else {
      hideSuggestions();
    }
  };

  const handleDestinationChange = (text: string) => {
    setDestination(text);
    if (text.length > 0) {
      const filtered = suggestions.filter(s => 
        s.toLowerCase().includes(text.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setFilteredSuggestions(filtered);
      setActiveField('destination');
      setShowDestSuggestions(true);
      setShowSourceSuggestions(false);
      animateSuggestions(true);
    } else {
      hideSuggestions();
    }
  };

  const animateSuggestions = (show: boolean) => {
    Animated.timing(suggestionAnimation, {
      toValue: show ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const hideSuggestions = () => {
    animateSuggestions(false);
    setTimeout(() => {
      setShowSourceSuggestions(false);
      setShowDestSuggestions(false);
      setActiveField(null);
    }, 200);
  };

  const selectSuggestion = (suggestion: string) => {
    if (activeField === 'source') {
      setSource(suggestion);
    } else if (activeField === 'destination') {
      setDestination(suggestion);
    }
    hideSuggestions();
  };

  const clearField = (field: 'source' | 'destination') => {
    if (field === 'source') {
      setSource('');
    } else {
      setDestination('');
    }
    hideSuggestions();
  };

  const swapLocations = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
    hideSuggestions();
  };

  const handleSearch = () => {
    if (source.trim() && destination.trim()) {
      hideSuggestions();
      onSearch(source.trim(), destination.trim());
    }
  };

  const renderSuggestionItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => selectSuggestion(item)}
      activeOpacity={0.7}
    >
      <MapPin size={16} color="#14B8A6" />
      <Text style={styles.suggestionText}>{item}</Text>
    </TouchableOpacity>
  );

  const showSuggestions = showSourceSuggestions || showDestSuggestions;

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={[
          styles.inputWrapper,
          activeField === 'source' && styles.inputWrapperActive
        ]}>
          <MapPin size={20} color="#14B8A6" />
          <TextInput
            style={styles.input}
            placeholder="From (Source)"
            value={source}
            onChangeText={handleSourceChange}
            onFocus={() => {
              if (source.length > 0) {
                handleSourceChange(source);
              }
            }}
            placeholderTextColor="#9CA3AF"
          />
          {source.length > 0 && (
            <TouchableOpacity
              onPress={() => clearField('source')}
              style={styles.clearButton}
            >
              <X size={16} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity style={styles.swapButton} onPress={swapLocations}>
          <ArrowUpDown size={20} color="#6B7280" />
        </TouchableOpacity>
        
        <View style={[
          styles.inputWrapper,
          activeField === 'destination' && styles.inputWrapperActive
        ]}>
          <MapPin size={20} color="#F97316" />
          <TextInput
            style={styles.input}
            placeholder="To (Destination)"
            value={destination}
            onChangeText={handleDestinationChange}
            onFocus={() => {
              if (destination.length > 0) {
                handleDestinationChange(destination);
              }
            }}
            placeholderTextColor="#9CA3AF"
          />
          {destination.length > 0 && (
            <TouchableOpacity
              onPress={() => clearField('destination')}
              style={styles.clearButton}
            >
              <X size={16} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showSuggestions && (
        <Animated.View
          style={[
            styles.suggestionContainer,
            {
              opacity: suggestionAnimation,
              transform: [{
                translateY: suggestionAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 0],
                })
              }]
            }
          ]}
        >
          <View style={styles.suggestionHeader}>
            <Text style={styles.suggestionHeaderText}>
              {activeField === 'source' ? 'Select Source' : 'Select Destination'}
            </Text>
            <TouchableOpacity onPress={hideSuggestions}>
              <X size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={filteredSuggestions}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={renderSuggestionItem}
            style={styles.suggestionList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </Animated.View>
      )}

      <TouchableOpacity 
        style={[
          styles.searchButton,
          (!source.trim() || !destination.trim()) && styles.searchButtonDisabled
        ]} 
        onPress={handleSearch}
        disabled={!source.trim() || !destination.trim()}
      >
        <Search size={20} color="#FFFFFF" />
        <Text style={styles.searchButtonText}>Find Metro</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    position: 'relative',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputWrapperActive: {
    borderColor: '#14B8A6',
    shadowColor: '#14B8A6',
    shadowOpacity: 0.2,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  clearButton: {
    padding: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginLeft: 8,
  },
  swapButton: {
    alignSelf: 'center',
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginVertical: 4,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#14B8A6',
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#14B8A6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  searchButtonDisabled: {
    backgroundColor: '#14B8A6',
    shadowColor: '#14B8A6',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  suggestionContainer: {
    position: 'absolute',
    top: 140,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
    maxHeight: 250,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  suggestionHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  suggestionList: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  suggestionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
});