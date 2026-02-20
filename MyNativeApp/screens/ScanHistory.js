import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import apiService from '../services/api';

export default function ScanHistory() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useEffect(() => {
    loadScanHistory();
  }, []);

  const loadScanHistory = async () => {
    try {
      setError(null);
      const response = await apiService.get('/scan/history?limit=20');
      
      if (response.success) {
        setScans(response.data);
      } else {
        throw new Error(response.message || 'Failed to load scan history');
      }
    } catch (error) {
      console.error('Load scan history error:', error);
      setError(error.message);
      Alert.alert('Error', 'Failed to load scan history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadScanHistory();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const getStatusColor = (productName) => {
    // Simple color coding based on product name length (you can customize this)
    const colors = ['#1dd1a1', '#54a0ff', '#ff9ff3', '#f368e0', '#ff6b6b', '#48dbfb'];
    const index = productName.length % colors.length;
    return colors[index];
  };

  const handleScanPress = (scan) => {
    navigation.navigate('ScanDetails', { scanId: scan.id });
  };

  const handleDeleteScan = async (scanId, productName) => {
    Alert.alert(
      'Delete Scan',
      `Are you sure you want to delete the scan for "${productName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await apiService.delete(`/scan/${scanId}`);
              if (response.success) {
                // Remove from local state
                setScans(prev => prev.filter(scan => scan.id !== scanId));
                Alert.alert('Success', 'Scan deleted successfully');
              } else {
                throw new Error(response.message || 'Failed to delete scan');
              }
            } catch (error) {
              console.error('Delete scan error:', error);
              Alert.alert('Error', 'Failed to delete scan');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, { marginTop: insets.top }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan History</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1dd1a1" />
          <Text style={styles.loadingText}>Loading your scan history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { marginTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan History</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Feather name="refresh-cw" size={20} color="#1dd1a1" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1dd1a1']}
            tintColor="#1dd1a1"
          />
        }
      >
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{scans.length}</Text>
            <Text style={styles.statLabel}>Total Scans</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {scans.filter(scan => scan.vegan_friendly).length}
            </Text>
            <Text style={styles.statLabel}>Vegan</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {scans.filter(scan => 
                scan.suitable_ages && 
                scan.suitable_ages.above_18 && 
                scan.suitable_ages.below_18
              ).length}
            </Text>
            <Text style={styles.statLabel}>All Ages</Text>
          </View>
        </View>

        {/* Scan List */}
        {scans.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="camera" size={60} color="#6a6a7a" />
            <Text style={styles.emptyStateTitle}>No scans yet</Text>
            <Text style={styles.emptyStateText}>
              Your scanned food products will appear here
            </Text>
            <TouchableOpacity 
              style={styles.scanButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.scanButtonText}>Start Scanning</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.scansList}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>
            {scans.map((scan) => (
              <TouchableOpacity
                key={scan.id}
                style={styles.scanCard}
                onPress={() => handleScanPress(scan)}
                onLongPress={() => handleDeleteScan(scan.id, scan.product_name)}
              >
                <View style={styles.scanCardHeader}>
                  <View style={styles.productInfo}>
                    <View 
                      style={[
                        styles.productIcon,
                        { backgroundColor: getStatusColor(scan.product_name) }
                      ]}
                    >
                      <Feather name="package" size={16} color="#fff" />
                    </View>
                    <View style={styles.productDetails}>
                      <Text style={styles.productName} numberOfLines={1}>
                        {scan.product_name}
                      </Text>
                      <Text style={styles.scanDate}>
                        {formatDate(scan.created_at)}
                      </Text>
                    </View>
                  </View>
                  <Feather name="chevron-right" size={18} color="#6a6a7a" />
                </View>

                <View style={styles.scanCardBody}>
                  {/* Ingredients Preview */}
                  <Text style={styles.ingredientsPreview} numberOfLines={2}>
                    {Array.isArray(scan.ingredients) 
                      ? scan.ingredients.slice(0, 3).join(', ')
                      : 'Ingredients analysis available'
                    }
                  </Text>

                  {/* Quick Stats */}
                  <View style={styles.quickStats}>
                    <View style={styles.statTag}>
                      <Feather 
                        name="leaf" 
                        size={12} 
                        color={scan.vegan_friendly ? '#1dd1a1' : '#6a6a7a'} 
                      />
                      <Text style={[
                        styles.statTagText,
                        scan.vegan_friendly && styles.statTagActive
                      ]}>
                        Vegan
                      </Text>
                    </View>
                    
                    <View style={styles.statTag}>
                      <Feather name="clock" size={12} color="#6a6a7a" />
                      <Text style={styles.statTagText}>
                        {scan.shelf_life || 'N/A'}
                      </Text>
                    </View>

                    {scan.cautions && scan.cautions.length > 0 && (
                      <View style={[styles.statTag, styles.cautionTag]}>
                        <Feather name="alert-triangle" size={12} color="#ff6b6b" />
                        <Text style={[styles.statTagText, styles.cautionText]}>
                          {scan.cautions.length} caution{scan.cautions.length > 1 ? 's' : ''}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Load More Button (if needed) */}
        {scans.length >= 20 && (
          <TouchableOpacity style={styles.loadMoreButton}>
            <Text style={styles.loadMoreText}>Load More</Text>
          </TouchableOpacity>
        )}
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: "#1a1f2e",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1dd1a1",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#a0a0a0",
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#a0a0a0",
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  scanButton: {
    backgroundColor: "#1dd1a1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  scanButtonText: {
    color: "#1a1a2e",
    fontSize: 16,
    fontWeight: "700",
  },
  scansList: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
  },
  scanCard: {
    backgroundColor: "#1a1f2e",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2a3040",
  },
  scanCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  productIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 2,
  },
  scanDate: {
    fontSize: 12,
    color: "#6a6a7a",
  },
  scanCardBody: {
    // Additional scan details
  },
  ingredientsPreview: {
    fontSize: 13,
    color: "#a0a0a0",
    lineHeight: 18,
    marginBottom: 12,
  },
  quickStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#0f1419",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statTagText: {
    fontSize: 11,
    color: "#6a6a7a",
    fontWeight: '600',
  },
  statTagActive: {
    color: "#1dd1a1",
  },
  cautionTag: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  cautionText: {
    color: "#ff6b6b",
  },
  loadMoreButton: {
    backgroundColor: "#1a1f2e",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#2a3040",
  },
  loadMoreText: {
    color: "#1dd1a1",
    fontSize: 14,
    fontWeight: "600",
  },
});