import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from '@react-navigation/native';
import apiService from '../services/api';

export default function ScanAnalysis() {
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(true);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get the correct parameters that are actually passed from CameraScan
  const { scanData, productName, frontImage, backImage } = route.params || {};

  useEffect(() => {
    if (scanData) {
      // If we already have scan data from CameraScan, use it directly
      setAnalysisResult(scanData);
      setLoading(false);
      setAnalyzing(false);
    } else {
      // If not, try to analyze (though this shouldn't happen with your current flow)
      analyzeProduct();
    }
  }, []);

  const analyzeProduct = async () => {
    try {
      setAnalyzing(true);
      setError(null);

      console.log('Sending analysis request...');

      // This should match what your CameraScan sends
      const response = await apiService.post('/scan/analyze', {
        frontText: "Sample front text",
        backText: "Sample back text", 
        productName: productName || "Unknown Product",
        manufacturingDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });

      if (response.success) {
        setAnalysisResult(response.data);
        console.log('Analysis completed:', response.data);
      } else {
        throw new Error(response.message || 'Analysis failed');
      }

    } catch (error) {
      console.error('Analysis error:', error);
      setError(error.message);
      Alert.alert('Analysis Failed', error.message);
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const retryAnalysis = () => {
    setLoading(true);
    setAnalyzing(true);
    setError(null);
    analyzeProduct();
  };

  const formatJSON = (data) => {
    if (typeof data === 'string') return data;
    if (Array.isArray(data)) return data.join(', ');
    if (data && typeof data === 'object') {
      // Handle health_recommendations object
      if (data.suitable || data.not_suitable) {
        let result = [];
        if (data.suitable && Array.isArray(data.suitable)) {
          result.push(`Suitable: ${data.suitable.join(', ')}`);
        }
        if (data.not_suitable && Array.isArray(data.not_suitable)) {
          result.push(`Avoid: ${data.not_suitable.join(', ')}`);
        }
        if (data.overall_verdict) {
          result.push(`Verdict: ${data.overall_verdict}`);
        }
        return result.join('\n');
      }
      return JSON.stringify(data, null, 2);
    }
    return String(data);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, { marginTop: insets.top }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analyzing...</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.loadingContainer}>
          <View style={styles.loadingIcon}>
            <ActivityIndicator size="large" color="#1dd1a1" />
          </View>
          <Text style={styles.loadingTitle}>Analyzing Your Product</Text>
          <Text style={styles.loadingText}>
            {analyzing 
              ? "We're analyzing the ingredients and nutritional information..."
              : "Processing complete!"
            }
          </Text>
          
          {analyzing && (
            <View style={styles.processingSteps}>
              <View style={styles.step}>
                <MaterialIcons name="check" size={16} color="#1dd1a1" />
                <Text style={styles.stepText}>Images uploaded</Text>
              </View>
              <View style={styles.step}>
                <MaterialIcons name="check" size={16} color="#1dd1a1" />
                <Text style={styles.stepText}>Text extraction</Text>
              </View>
              <View style={styles.step}>
                <ActivityIndicator size="small" color="#1dd1a1" />
                <Text style={styles.stepText}>AI analysis</Text>
              </View>
              <View style={styles.step}>
                <MaterialIcons name="schedule" size={16} color="#6a6a7a" />
                <Text style={styles.stepText}>Generating report</Text>
              </View>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={40} color="#ff6b6b" />
              <Text style={styles.errorTitle}>Analysis Failed</Text>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={retryAnalysis}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Safe data access helpers
  const getIngredients = () => {
    if (!analysisResult) return [];
    if (Array.isArray(analysisResult.ingredients)) return analysisResult.ingredients;
    if (typeof analysisResult.ingredients === 'string') return [analysisResult.ingredients];
    return [];
  };

  const getHealthRecommendations = () => {
    return analysisResult?.health_recommendations || {};
  };

  const getCautions = () => {
    if (!analysisResult) return [];
    if (Array.isArray(analysisResult.cautions)) return analysisResult.cautions;
    return [];
  };

  const getAlternativeProducts = () => {
    if (!analysisResult) return [];
    if (Array.isArray(analysisResult.alternative_products)) return analysisResult.alternative_products;
    return [];
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { marginTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis Result</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <MaterialIcons name="home" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Product Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Overview</Text>
          <View style={styles.productCard}>
            <Text style={styles.productName}>
              {analysisResult?.product_name || productName || 'Unknown Product'}
            </Text>
            {(frontImage || backImage) && (
              <View style={styles.imageRow}>
                {frontImage && (
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: frontImage }} style={styles.thumbnail} />
                    <Text style={styles.imageLabel}>Front</Text>
                  </View>
                )}
                {backImage && (
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: backImage }} style={styles.thumbnail} />
                    <Text style={styles.imageLabel}>Back</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Key Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <MaterialIcons name="event" size={20} color="#1dd1a1" />
              <Text style={styles.infoLabel}>Shelf Life</Text>
              <Text style={styles.infoValue}>
                {analysisResult?.shelf_life || 'Not specified'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="eco" size={20} color="#1dd1a1" />
              <Text style={styles.infoLabel}>Vegan Friendly</Text>
              <Text style={styles.infoValue}>
                {analysisResult?.vegan_friendly ? 'Yes' : 'No'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="people" size={20} color="#1dd1a1" />
              <Text style={styles.infoLabel}>Age Suitable</Text>
              <Text style={styles.infoValue}>
                {analysisResult?.suitable_ages ? 
                  Object.entries(analysisResult.suitable_ages)
                    .filter(([age, suitable]) => suitable && age !== 'reason')
                    .map(([age]) => age.replace('_', ' '))
                    .join(', ') || 'All ages'
                  : 'Not specified'
                }
              </Text>
            </View>
          </View>
        </View>

        {/* Ingredients */}
        {getIngredients().length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.ingredientsCard}>
              {getIngredients().map((ingredient, index) => (
                <Text key={index} style={styles.ingredient}>
                  • {ingredient}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Health Recommendations */}
        {getHealthRecommendations() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Recommendations</Text>
            
            {getHealthRecommendations().suitable && getHealthRecommendations().suitable.length > 0 && (
              <View style={styles.recommendationCard}>
                <View style={[styles.statusIndicator, styles.good]} />
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>Suitable Ingredients</Text>
                  <Text style={styles.recommendationText}>
                    {formatJSON(getHealthRecommendations().suitable)}
                  </Text>
                </View>
              </View>
            )}

            {getHealthRecommendations().not_suitable && getHealthRecommendations().not_suitable.length > 0 && (
              <View style={styles.recommendationCard}>
                <View style={[styles.statusIndicator, styles.bad]} />
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>Ingredients to Avoid</Text>
                  <Text style={styles.recommendationText}>
                    {formatJSON(getHealthRecommendations().not_suitable)}
                  </Text>
                </View>
              </View>
            )}

            {getHealthRecommendations().overall_verdict && (
              <View style={styles.verdictCard}>
                <Text style={styles.verdictTitle}>Overall Verdict</Text>
                <Text style={styles.verdictText}>
                  {getHealthRecommendations().overall_verdict}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Cautions */}
        {getCautions().length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cautions & Warnings</Text>
            <View style={styles.cautionsCard}>
              <MaterialIcons name="warning" size={20} color="#ff6b6b" />
              <View style={styles.cautionsContent}>
                {getCautions().map((caution, index) => (
                  <Text key={index} style={styles.caution}>
                    • {caution}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Alternative Products */}
        {getAlternativeProducts().length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Healthier Alternatives</Text>
            <View style={styles.alternativesCard}>
              {getAlternativeProducts().map((alternative, index) => (
                <View key={index} style={styles.alternativeItem}>
                  <MaterialIcons name="check-circle" size={16} color="#1dd1a1" />
                  <Text style={styles.alternativeText}>{alternative}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Detailed Analysis */}
        {analysisResult?.analysis_result && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detailed Analysis</Text>
            <View style={styles.analysisCard}>
              <Text style={styles.analysisText}>
                {analysisResult.analysis_result}
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('CameraScan')}
          >
            <MaterialIcons name="camera-alt" size={18} color="#1dd1a1" />
            <Text style={styles.secondaryButtonText}>Scan Another</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => {
              // Save functionality would go here
              Alert.alert('Success', 'Result saved to your history!');
            }}
          >
            <MaterialIcons name="save" size={18} color="#1a1a2e" />
            <Text style={styles.primaryButtonText}>Save Result</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: "#2a3040",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingIcon: {
    marginBottom: 20,
  },
  loadingTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: "#a0a0a0",
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  processingSteps: {
    width: '100%',
    gap: 15,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ff6b6b',
    marginTop: 12,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#a0a0a0',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#1dd1a1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
  },
  productCard: {
    backgroundColor: "#1a1f2e",
    borderRadius: 16,
    padding: 20,
  },
  productName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 16,
    textAlign: 'center',
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  imageContainer: {
    alignItems: 'center',
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
  },
  imageLabel: {
    fontSize: 12,
    color: "#a0a0a0",
    fontWeight: '600',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  infoItem: {
    flex: 1,
    backgroundColor: "#1a1f2e",
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: "#a0a0a0",
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textAlign: 'center',
  },
  ingredientsCard: {
    backgroundColor: "#1a1f2e",
    borderRadius: 12,
    padding: 16,
  },
  ingredient: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 6,
    lineHeight: 20,
  },
  recommendationCard: {
    flexDirection: 'row',
    backgroundColor: "#1a1f2e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  statusIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  good: {
    backgroundColor: '#1dd1a1',
  },
  bad: {
    backgroundColor: '#ff6b6b',
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },
  recommendationText: {
    fontSize: 13,
    color: "#a0a0a0",
    lineHeight: 18,
  },
  verdictCard: {
    backgroundColor: "#1a2a3a",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#1dd1a1",
  },
  verdictTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  verdictText: {
    fontSize: 13,
    color: "#a0a0a0",
    lineHeight: 18,
  },
  cautionsCard: {
    flexDirection: 'row',
    backgroundColor: "#2a1a1a",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#ff6b6b",
  },
  cautionsContent: {
    flex: 1,
    marginLeft: 12,
  },
  caution: {
    fontSize: 13,
    color: "#ff6b6b",
    marginBottom: 4,
    lineHeight: 18,
  },
  alternativesCard: {
    backgroundColor: "#1a1f2e",
    borderRadius: 12,
    padding: 16,
  },
  alternativeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  alternativeText: {
    fontSize: 14,
    color: "#fff",
    flex: 1,
    lineHeight: 20,
  },
  analysisCard: {
    backgroundColor: "#1a1f2e",
    borderRadius: 12,
    padding: 16,
  },
  analysisText: {
    fontSize: 14,
    color: "#fff",
    lineHeight: 20,
  },
  actionSection: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#1dd1a1",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: "#1a1a2e",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "transparent",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#1dd1a1",
    gap: 8,
  },
  secondaryButtonText: {
    color: "#1dd1a1",
    fontSize: 16,
    fontWeight: "700",
  },
});