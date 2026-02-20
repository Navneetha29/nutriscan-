import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

export default function GalleryScan() {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const pickImage = async (type) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      if (type === 'front') {
        setFrontImage(result.assets[0].uri);
      } else {
        setBackImage(result.assets[0].uri);
      }
    }
  };

  const analyzeImages = () => {
    if (!frontImage || !backImage) {
      Alert.alert('Error', 'Please select both front and back images');
      return;
    }

    navigation.navigate('ScanAnalysis', {
      frontImage,
      backImage,
      scanType: 'gallery'
    });
  };

  const removeImage = (type) => {
    if (type === 'front') {
      setFrontImage(null);
    } else {
      setBackImage(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { marginTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select from Gallery</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.instruction}>
          Please select both front and back images of the product
        </Text>

        {/* Front Image Selection */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Front Image</Text>
          <Text style={styles.sectionSubtitle}>Product front with name</Text>
          
          {frontImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: frontImage }} style={styles.imagePreview} />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeImage('front')}
              >
                <Feather name="x" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.imagePlaceholder}
              onPress={() => pickImage('front')}
            >
              <Feather name="camera" size={40} color="#6a6a7a" />
              <Text style={styles.placeholderText}>Tap to select front image</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Back Image Selection */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Back Image</Text>
          <Text style={styles.sectionSubtitle}>Ingredients and nutrition info</Text>
          
          {backImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: backImage }} style={styles.imagePreview} />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeImage('back')}
              >
                <Feather name="x" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.imagePlaceholder}
              onPress={() => pickImage('back')}
            >
              <Feather name="file-text" size={40} color="#6a6a7a" />
              <Text style={styles.placeholderText}>Tap to select back image</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Feather name="info" size={16} color="#1dd1a1" />
          <Text style={styles.infoText}>
            Make sure the images are clear and all text is readable for accurate analysis
          </Text>
        </View>
      </ScrollView>

      {/* Analyze Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.analyzeButton, (!frontImage || !backImage) && styles.buttonDisabled]}
          onPress={analyzeImages}
          disabled={!frontImage || !backImage}
        >
          <Text style={styles.analyzeButtonText}>Analyze Product</Text>
          <Feather name="arrow-right" size={20} color="#1a1a2e" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1419",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 100,
  },
  instruction: {
    fontSize: 16,
    color: "#a0a0a0",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  imageSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#a0a0a0",
    marginBottom: 16,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: "#1a1f2e",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#2a3040",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6a6a7a",
    fontWeight: "600",
  },
  imagePreviewContainer: {
    position: 'relative',
  },
  imagePreview: {
    height: 200,
    borderRadius: 16,
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#1a2a3a",
    borderRadius: 12,
    padding: 16,
    gap: 10,
    marginTop: 20,
    borderLeftWidth: 3,
    borderLeftColor: "#1dd1a1",
  },
  infoText: {
    fontSize: 13,
    color: "#a0a0a0",
    flex: 1,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#0f1419",
    borderTopWidth: 1,
    borderTopColor: "#2a3040",
  },
  analyzeButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1dd1a1",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 10,
    shadowColor: "#1dd1a1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  buttonDisabled: {
    backgroundColor: "#4a5568",
    opacity: 0.5,
  },
  analyzeButtonText: {
    color: "#1a1a2e",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});