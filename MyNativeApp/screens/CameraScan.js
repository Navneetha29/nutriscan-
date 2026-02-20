import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import apiService from '../services/api';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { readAsStringAsync } from 'expo-file-system/legacy';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CameraScan() {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [productName, setProductName] = useState('');
  const [currentStep, setCurrentStep] = useState('front');
  const [extractingText, setExtractingText] = useState(false);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [showManufacturingPicker, setShowManufacturingPicker] = useState(false);
  const [showExpiryPicker, setShowExpiryPicker] = useState(false);
  const [manufacturingDate, setManufacturingDate] = useState(new Date());
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [isAnalyzing, setIsAnalyzing] = useState(false); // Add this state

  // Date picker handlers
  const onManufacturingDateChange = (event, selectedDate) => {
    setShowManufacturingPicker(false);
    if (selectedDate) {
      setManufacturingDate(selectedDate);
    }
  };

  const onExpiryDateChange = (event, selectedDate) => {
    setShowExpiryPicker(false);
    if (selectedDate) {
      setExpiryDate(selectedDate);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Extract text using Free OCR.space API
  const extractTextWithOCR = async (imageUri) => {
    try {
      setExtractingText(true);

      // Read file and convert to base64
      let base64Image;
      try {
        base64Image = await readAsStringAsync(imageUri, {
          encoding: 'base64',
        });
      } catch (e) {
        // Fallback: fetch and convert to base64
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const reader = new FileReader();
        base64Image = await new Promise((resolve, reject) => {
          reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }

      // Create FormData for OCR.space API
      const formData = new FormData();
      formData.append('base64Image', `data:image/jpeg;base64,${base64Image}`);
      formData.append('language', 'eng');
      formData.append('isOverlayRequired', 'false');
      formData.append('OCREngine', '2'); // OCR Engine 2 is better for complex text

      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        headers: {
          'apikey': 'helloworld', // Free API key
        },
        body: formData,
      });

      const data = await response.json();

      if (data.IsErroredOnProcessing) {
        console.error('OCR error:', data.ErrorMessage);
        Alert.alert('OCR Error', data.ErrorMessage || 'Failed to extract text');
        return '';
      }

      const ocrText = data.ParsedResults?.[0]?.ParsedText || '';
      console.log('📝 OCR Extracted Text:', ocrText);

      if (!ocrText) {
        console.log('No text detected in image');
        return '';
      }

      return ocrText.trim();

    } catch (error) {
      console.error('OCR extraction error:', error);
      Alert.alert('Error', 'Failed to process image with OCR');
      return '';
    } finally {
      setExtractingText(false);
    }
  };

  const takePicture = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'Camera permission is needed to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take picture');
    }
  };

  const pickFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'Gallery permission is needed to pick images');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  const processImage = async (imageUri) => {
    try {
      if (currentStep === 'front') {
        setFrontImage(imageUri);

        // Extract text from front image
        try {
          const extractedText = await extractTextWithOCR(imageUri);
          if (extractedText.trim()) {
            setFrontText(extractedText);

            // Try to auto-detect product name from front text
            const detectedName = detectProductName(extractedText);
            if (detectedName) {
              setProductName(detectedName);
            }
          }
        } catch (ocrError) {
          console.log('OCR failed, continuing without text extraction');
        }

        // Move to back step after front is done
        Alert.alert('Front Image Captured', 'Now please capture the back image of the product');
        setCurrentStep('back');
      } else if (currentStep === 'back') {
        setBackImage(imageUri);

        // Extract text from back image
        try {
          const extractedText = await extractTextWithOCR(imageUri);
          if (extractedText.trim()) {
            setBackText(extractedText);
          }
        } catch (ocrError) {
          console.log('OCR failed, continuing without text extraction');
        }

        // Move to dates step after back is done
        Alert.alert('Back Image Captured', 'Now please enter the product details');
        setCurrentStep('dates');
      }
    } catch (error) {
      console.error('Image processing error:', error);
      Alert.alert('Error', 'Failed to process image');
    }
  };

  const detectProductName = (text) => {
    if (!text) return '';

    const lines = text.split('\n').filter(line => line.trim().length > 0);

    if (lines.length > 0) {
      const firstLine = lines[0].trim();

      const commonLabels = [
        'nutrition facts', 'ingredients', 'allergens', 'serving size',
        'calories', 'total fat', 'cholesterol', 'sodium', 'total carbohydrate',
        'protein', 'vitamin', 'minerals', 'percent daily value', 'net weight',
        'manufactured', 'packed', 'best before', 'expiry'
      ];

      const isCommonLabel = commonLabels.some(label =>
        firstLine.toLowerCase().includes(label)
      );

      if (!isCommonLabel && firstLine.length > 2 && firstLine.length < 50) {
        return firstLine;
      }

      if (lines.length > 1 && lines[1].trim().length > 2 && lines[1].trim().length < 50) {
        return lines[1].trim();
      }
    }

    return '';
  };

  const retakePicture = () => {
    if (currentStep === 'back') {
      // Retake back image - go back to back step
      setBackImage(null);
      setBackText('');
      setCurrentStep('back');
    } else if (currentStep === 'dates') {
      // Retake back image - go back to back step
      setCurrentStep('back');
      setBackImage(null);
      setBackText('');
    } else if (currentStep === 'front') {
      // Retake front image - stay on front step
      setFrontImage(null);
      setFrontText('');
      setProductName('');
      setCurrentStep('front');
    }
  };

  const proceedToAnalysis = () => {
    // Prevent duplicate submissions
    if (isAnalyzing) {
      console.log('🛑 Analysis already in progress, skipping duplicate call');
      return;
    }

    if (!productName.trim()) {
      Alert.alert('Error', 'Please enter the product name');
      return;
    }

    setIsAnalyzing(true); // Set analyzing state

    // Format dates for backend
    const formatDateForBackend = (date) => {
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    };

    // Send data to backend using apiService
    sendDataToBackend({
      frontText: frontText.trim(),
      backText: backText.trim(),
      productName: productName.trim(),
      manufacturingDate: formatDateForBackend(manufacturingDate),
      expiryDate: formatDateForBackend(expiryDate),
    });
  };

  const sendDataToBackend = async (data) => {
    try {
      setExtractingText(true);
      Alert.alert('Processing', 'Analyzing your product...');

      // Check if user is authenticated
      const isAuthenticated = await apiService.isAuthenticated();
      if (!isAuthenticated) {
        Alert.alert('Authentication Required', 'Please log in to analyze products');
        setExtractingText(false);
        setIsAnalyzing(false); // Reset analyzing state
        navigation.navigate('Login');
        return;
      }

      console.log('🔍 Sending analysis request...');

      // Use ONLY apiService - remove any direct fetch calls
      const result = await apiService.post('/scan/analyze', {
        frontText: data.frontText,
        backText: data.backText,
        productName: data.productName,
        manufacturingDate: data.manufacturingDate,
        expiryDate: data.expiryDate,
      });

      console.log('✅ Backend response received:', result);

      if (result.success) {
        setExtractingText(false);
        setIsAnalyzing(false); // Reset analyzing state
        Alert.alert('Success', 'Product analysis completed!');
        
        // Navigate to results screen with scan data
        navigation.navigate('ScanAnalysis', {
          scanData: result.data,
          productName: data.productName,
        });
      } else {
        throw new Error(result.message || 'Analysis failed');
      }
    } catch (error) {
      console.error('❌ Analysis error:', error);
      
      if (error.message.includes('401') || error.message.includes('token')) {
        Alert.alert('Session Expired', 'Please log in again');
        await apiService.removeToken();
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', error.message || 'Failed to analyze product');
      }
      
      setExtractingText(false);
      setIsAnalyzing(false); // Reset analyzing state
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={[styles.step, currentStep === 'front' && styles.stepActive]} />
      <View style={[styles.step, currentStep === 'back' && styles.stepActive]} />
      <View style={[styles.step, currentStep === 'dates' && styles.stepActive]} />
    </View>
  );

  const renderScanStep = () => {
    if (currentStep === 'front' || currentStep === 'back') {
      const displayImage = currentStep === 'front' ? frontImage : backImage;
      
      return (
        <View style={styles.cameraContainer}>
          <View style={styles.cameraPlaceholder}>
            <View style={styles.scanFrame}>
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />
            </View>

            {displayImage || extractingText ? (
              <View style={styles.previewContainer}>
                {extractingText ? (
                  <>
                    <ActivityIndicator size="large" color="#1dd1a1" />
                    <Text style={styles.progressText}>Extracting text...</Text>
                  </>
                ) : (
                  <>
                    <Image
                      source={{ uri: displayImage }}
                      style={styles.previewImage}
                    />
                    <Text style={styles.previewText}>
                      {currentStep === 'front' ? 'Front image captured' : 'Back image captured'}
                    </Text>
                  </>
                )}
              </View>
            ) : (
              <MaterialIcons name="photo-camera" size={80} color="#6a6a7a" style={styles.cameraIcon} />
            )}
          </View>

          <Text style={styles.scanInstruction}>
            {currentStep === 'front'
              ? 'Take a photo of the product front (showing product name)'
              : 'Now take a photo of the back (showing ingredients and nutrition)'
            }
          </Text>

          {frontText && currentStep === 'back' && (
            <View style={styles.extractedTextPreview}>
              <Text style={styles.extractedTextTitle}>Extracted Text from Front:</Text>
              <Text style={styles.extractedText} numberOfLines={3}>
                {frontText}
              </Text>
            </View>
          )}
        </View>
      );
    }

    if (currentStep === 'dates') {
      return (
        <ScrollView contentContainerStyle={styles.datesContainer}>
          <Text style={styles.sectionTitle}>Product Information</Text>

          {/* Product Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Product Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter product name"
              placeholderTextColor="#6a6a7a"
              value={productName}
              onChangeText={setProductName}
            />
            {frontText && (
              <TouchableOpacity
                style={styles.suggestionButton}
                onPress={() => {
                  const detectedName = detectProductName(frontText);
                  if (detectedName) {
                    setProductName(detectedName);
                  }
                }}
              >
                <Text style={styles.suggestionText}>
                  {detectProductName(frontText) ? 'Auto-fill detected name' : 'Try auto-detection'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Manufacturing Date */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Manufacturing Date *</Text>
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => setShowManufacturingPicker(true)}
            >
              <Text style={styles.dateInputText}>
                {formatDate(manufacturingDate)}
              </Text>
              <MaterialIcons name="calendar-today" size={20} color="#1dd1a1" />
            </TouchableOpacity>
            {showManufacturingPicker && (
              <DateTimePicker
                value={manufacturingDate}
                mode="date"
                display="default"
                onChange={onManufacturingDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          {/* Expiry Date */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Expiry Date *</Text>
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => setShowExpiryPicker(true)}
            >
              <Text style={styles.dateInputText}>
                {formatDate(expiryDate)}
              </Text>
              <MaterialIcons name="calendar-today" size={20} color="#1dd1a1" />
            </TouchableOpacity>
            {showExpiryPicker && (
              <DateTimePicker
                value={expiryDate}
                mode="date"
                display="default"
                onChange={onExpiryDateChange}
                minimumDate={manufacturingDate}
              />
            )}
          </View>

          {/* Extracted Text Preview */}
          <View style={styles.textPreviewSection}>
            <Text style={styles.sectionTitle}>Extracted Text</Text>

            <View style={styles.textPreviewCard}>
              <Text style={styles.textPreviewLabel}>Front (Product Name):</Text>
              <Text style={styles.textPreview} numberOfLines={4}>
                {frontText || 'No text extracted - you can still proceed with manual entry'}
              </Text>
            </View>

            <View style={styles.textPreviewCard}>
              <Text style={styles.textPreviewLabel}>Back (Ingredients):</Text>
              <Text style={styles.textPreview} numberOfLines={6}>
                {backText || 'No text extracted - you can still proceed with manual entry'}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }
  };

  const renderControls = () => {
    if (currentStep === 'front' || currentStep === 'back') {
      const hasImage = currentStep === 'front' ? frontImage : backImage;
      
      return (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.secondaryButton, (!hasImage || extractingText) && styles.buttonDisabledSecondary]}
            onPress={retakePicture}
            disabled={!hasImage || extractingText}
          >
            <MaterialIcons name="refresh" size={20} color="#fff" />
            <Text style={styles.secondaryButtonText}>Retake</Text>
          </TouchableOpacity>

          <View style={styles.mainButtons}>
            <TouchableOpacity
              style={[styles.galleryButton, extractingText && styles.buttonDisabledGallery]}
              onPress={pickFromGallery}
              disabled={extractingText}
            >
              <MaterialIcons name="photo-library" size={20} color="#1dd1a1" />
              <Text style={styles.galleryButtonText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.captureButton, extractingText && styles.buttonDisabledCapture]}
              onPress={takePicture}
              disabled={extractingText}
            >
              {extractingText ? (
                <ActivityIndicator size="small" color="#1a1a2e" />
              ) : (
                <MaterialIcons name="photo-camera" size={28} color="#1a1a2e" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.placeholder} />
        </View>
      );
    }

    if (currentStep === 'dates') {
      return (
        <View style={styles.datesControls}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentStep('back')}
          >
            <MaterialIcons name="arrow-back" size={20} color="#1dd1a1" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.analyzeButton, (!productName || isAnalyzing) && styles.buttonDisabled]}
            onPress={proceedToAnalysis}
            disabled={!productName || isAnalyzing}
          >
            {isAnalyzing ? (
              <ActivityIndicator size="small" color="#1a1a2e" />
            ) : (
              <>
                <Text style={styles.analyzeButtonText}>Analyze Product</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#1a1a2e" />
              </>
            )}
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { marginTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentStep === 'front' ? 'Scan Front' :
            currentStep === 'back' ? 'Scan Back' : 'Enter Details'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Main Content */}
      {renderScanStep()}

      {/* Controls */}
      <View style={styles.controls}>
        {renderControls()}
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
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 20,
  },
  step: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2a3040',
  },
  stepActive: {
    backgroundColor: '#1dd1a1',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cameraPlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: "#1a1f2e",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#2a3040",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'rgba(29, 209, 161, 0.3)',
    backgroundColor: 'transparent',
    position: 'absolute',
  },
  cornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#1dd1a1',
  },
  cornerTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#1dd1a1',
  },
  cornerBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#1dd1a1',
  },
  cornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#1dd1a1',
  },
  cameraIcon: {
    opacity: 0.5,
  },
  previewContainer: {
    alignItems: 'center',
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 10,
  },
  previewText: {
    color: '#1dd1a1',
    fontSize: 14,
    fontWeight: '600',
  },
  progressText: {
    color: '#1dd1a1',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  scanInstruction: {
    color: '#a0a0a0',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  extractedTextPreview: {
    backgroundColor: '#1a1f2e',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
  },
  extractedTextTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  extractedText: {
    color: '#a0a0a0',
    fontSize: 12,
    lineHeight: 16,
  },
  datesContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#1a1f2e",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    borderWidth: 2,
    borderColor: "#2a3040",
  },

  dateInput: {
    backgroundColor: "#1a1f2e",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#2a3040",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInputText: {
    color: "#fff",
    fontSize: 16,
  },
  suggestionButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(29, 209, 161, 0.1)',
    borderRadius: 6,
  },
  suggestionText: {
    color: '#1dd1a1',
    fontSize: 12,
    fontWeight: '600',
  },
  helpBox: {
    flexDirection: "row",
    backgroundColor: "#1a2a3a",
    borderRadius: 12,
    padding: 16,
    gap: 10,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: "#1dd1a1",
  },
  helpText: {
    fontSize: 13,
    color: "#a0a0a0",
    flex: 1,
    lineHeight: 18,
  },
  textPreviewSection: {
    marginTop: 20,
  },
  textPreviewCard: {
    backgroundColor: "#1a1f2e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  textPreviewLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  textPreview: {
    fontSize: 12,
    color: "#a0a0a0",
    lineHeight: 16,
  },
  controls: {
    padding: 20,
    paddingBottom: 40,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    opacity: 0.7,
  },
  buttonDisabledSecondary: {
    opacity: 0.3,
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  mainButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  galleryButton: {
    alignItems: 'center',
    padding: 12,
  },
  buttonDisabledGallery: {
    opacity: 0.3,
  },
  galleryButtonText: {
    color: '#1dd1a1',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1dd1a1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: "#1dd1a1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  buttonDisabledCapture: {
    opacity: 0.5,
  },
  placeholder: {
    width: 60,
  },
  datesControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
  },
  backButtonText: {
    color: '#1dd1a1',
    fontSize: 16,
    fontWeight: '600',
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#1dd1a1",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
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
  },
});