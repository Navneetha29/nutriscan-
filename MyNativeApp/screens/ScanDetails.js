import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from '@react-navigation/native';
import apiService from '../services/api';

export default function ScanDetails() {
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { scanId } = route.params;

  useEffect(() => {
    loadScanDetails();
  }, []);

  const loadScanDetails = async () => {
    try {
      const response = await apiService.get(`/scan/${scanId}`);
      
      if (response.success) {
        setScan(response.data);
      } else {
        throw new Error(response.message || 'Failed to load scan details');
      }
    } catch (error) {
      console.error('Load scan details error:', error);
      Alert.alert('Error', 'Failed to load scan details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  // Safe data access helpers
  const getIngredients = () => {
    if (!scan) return [];
    if (Array.isArray(scan.ingredients)) return scan.ingredients;
    if (typeof scan.ingredients === 'string') return [scan.ingredients];
    return [];
  };

  const getHealthRecommendations = () => {
    return scan?.health_recommendations || {};
  };

  const getCautions = () => {
    if (!scan) return [];
    if (Array.isArray(scan.cautions)) return scan.cautions;
    return [];
  };

  const getAlternativeProducts = () => {
    if (!scan) return [];
    if (Array.isArray(scan.alternative_products)) return scan.alternative_products;
    return [];
  };

  const getSuitableAges = () => {
    if (!scan?.suitable_ages) return {};
    return scan.suitable_ages;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, { marginTop: insets.top }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Details</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1dd1a1" />
          <Text style={styles.loadingText}>Loading scan details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!scan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, { marginTop: insets.top }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Details</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={50} color="#ff6b6b" />
          <Text style={styles.errorText}>Scan not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { marginTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Product Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Overview</Text>
          <View style={styles.productCard}>
            <Text style={styles.productName}>{scan.product_name}</Text>
            <View style={styles.dateRow}>
              <View style={styles.dateItem}>
                <MaterialIcons name="event" size={16} color="#1dd1a1" />
                <Text style={styles.dateLabel}>Manufactured: {formatDate(scan.manufacturing_date)}</Text>
              </View>
              <View style={styles.dateItem}>
                <MaterialIcons name="event-available" size={16} color="#1dd1a1" />
                <Text style={styles.dateLabel}>Expires: {formatDate(scan.expiry_date)}</Text>
              </View>
            </View>
            <Text style={styles.scanDate}>
              Scanned on {formatDate(scan.created_at)}
            </Text>
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
                {scan.shelf_life || 'Not specified'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="eco" size={20} color="#1dd1a1" />
              <Text style={styles.infoLabel}>Vegan Friendly</Text>
              <Text style={styles.infoValue}>
                {scan.vegan_friendly ? 'Yes' : 'No'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="people" size={20} color="#1dd1a1" />
              <Text style={styles.infoLabel}>Age Suitable</Text>
              <Text style={styles.infoValue}>
                {Object.entries(getSuitableAges())
                  .filter(([age, suitable]) => suitable && age !== 'reason')
                  .map(([age]) => age.replace('_', ' '))
                  .join(', ') || 'All ages'}
              </Text>
            </View>
          </View>
          {getSuitableAges().reason && (
            <Text style={styles.ageReason}>
              {getSuitableAges().reason}
            </Text>
          )}
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

        {/* Extracted Text */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Extracted Text</Text>
          {scan.extracted_text_front && (
            <View style={styles.textCard}>
              <Text style={styles.textCardTitle}>Front Package Text</Text>
              <Text style={styles.extractedText}>
                {scan.extracted_text_front}
              </Text>
            </View>
          )}
          {scan.extracted_text_back && (
            <View style={styles.textCard}>
              <Text style={styles.textCardTitle}>Back Package Text</Text>
              <Text style={styles.extractedText}>
                {scan.extracted_text_back}
              </Text>
            </View>
          )}
        </View>

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
                    {getHealthRecommendations().suitable.join(', ')}
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
                    {getHealthRecommendations().not_suitable.join(', ')}
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
        {scan.analysis_result && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detailed Analysis</Text>
            <View style={styles.analysisCard}>
              <Text style={styles.analysisText}>
                {scan.analysis_result}
              </Text>
            </View>
          </View>
        )}

        {/* Note */}
        <View style={styles.noteBox}>
          <MaterialIcons name="info" size={16} color="#1dd1a1" />
          <Text style={styles.noteText}>
            This analysis was generated based on the product packaging information and your health profile
          </Text>
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
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#a0a0a0',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ff6b6b',
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
    marginBottom: 12,
  },
  dateRow: {
    gap: 8,
    marginBottom: 8,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateLabel: {
    fontSize: 14,
    color: "#a0a0a0",
  },
  scanDate: {
    fontSize: 12,
    color: "#6a6a7a",
    fontStyle: 'italic',
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
  ageReason: {
    fontSize: 12,
    color: "#a0a0a0",
    fontStyle: 'italic',
    marginTop: 8,
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
  textCard: {
    backgroundColor: "#1a1f2e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  textCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  extractedText: {
    fontSize: 12,
    color: "#a0a0a0",
    lineHeight: 16,
    fontStyle: 'italic',
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
  noteBox: {
    flexDirection: "row",
    backgroundColor: "#1a2a3a",
    borderRadius: 12,
    padding: 16,
    gap: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#1dd1a1",
  },
  noteText: {
    fontSize: 13,
    color: "#a0a0a0",
    flex: 1,
    lineHeight: 18,
  },
});