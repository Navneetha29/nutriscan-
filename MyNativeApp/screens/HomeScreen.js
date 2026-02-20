import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  Alert 
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import apiService from '../services/api';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUnreadCount();
    
    // Refresh count when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadUnreadCount();
    });

    return unsubscribe;
  }, [navigation]);

  const loadUnreadCount = async () => {
    try {
      const response = await apiService.get('/notifications/unread-count');
      if (response.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Load unread count error:', error);
    }
  };

  const handleCameraScan = () => {
    navigation.navigate("CameraScan");
  };

  const handleGalleryScan = () => {
    navigation.navigate("GalleryScan");
  };

  const handleProfile = () => {
    navigation.navigate("Profile");
  };

  const handleHistory = () => {
    navigation.navigate("ScanHistory");
  };

  const handleNotifications = () => {
    navigation.navigate("NotificationScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Profile and History */}
      <View style={[styles.header, { marginTop: insets.top }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>NutriScan</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={handleNotifications}>
            <View style={styles.notificationIcon}>
              <Feather name="bell" size={22} color="#fff" strokeWidth={2} />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleHistory}>
            <Feather name="history" size={22} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleProfile}>
            <Feather name="user" size={22} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeIcon}>
            <Feather name="home" size={40} color="#1a1a2e" strokeWidth={1.5} />
          </View>
          <Text style={styles.welcomeTitle}>Welcome to NutriScan</Text>
          <Text style={styles.welcomeSubtitle}>
            Scan your food to get detailed nutritional information and health insights
          </Text>
        </View>

        {/* Scan Options Section */}
        <View style={styles.scanSection}>
          <Text style={styles.sectionTitle}>Scan Food</Text>
          <Text style={styles.sectionSubtitle}>
            Choose how you want to scan your food items
          </Text>

          {/* Camera Scan Button */}
          <TouchableOpacity style={styles.scanButton} onPress={handleCameraScan}>
            <View style={styles.scanButtonIcon}>
              <Feather name="camera" size={32} color="#1a1a2e" strokeWidth={1.5} />
            </View>
            <View style={styles.scanButtonContent}>
              <Text style={styles.scanButtonTitle}>Scan with Camera</Text>
              <Text style={styles.scanButtonDescription}>
                Take a photo of your food using camera
              </Text>
            </View>
            <Feather name="arrow-right" size={20} color="#1dd1a1" />
          </TouchableOpacity>

          {/* Gallery Scan Button */}
          <TouchableOpacity style={styles.scanButton} onPress={handleGalleryScan}>
            <View style={styles.scanButtonIcon}>
              <Feather name="image" size={32} color="#1a1a2e" strokeWidth={1.5} />
            </View>
            <View style={styles.scanButtonContent}>
              <Text style={styles.scanButtonTitle}>Scan from Gallery</Text>
              <Text style={styles.scanButtonDescription}>
                Choose a food photo from your gallery
              </Text>
            </View>
            <Feather name="arrow-right" size={20} color="#1dd1a1" />
          </TouchableOpacity>
        </View>

        {/* Recent Scans Section */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>
            <TouchableOpacity onPress={handleHistory}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.emptyState}>
            <Feather name="camera" size={50} color="#6a6a7a" strokeWidth={1} />
            <Text style={styles.emptyStateTitle}>No scans yet</Text>
            <Text style={styles.emptyStateText}>
              Start by scanning your first food item
            </Text>
          </View>
        </View>

        {/* Health Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Health Tips</Text>
          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Feather name="heart" size={20} color="#1dd1a1" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Stay Hydrated</Text>
              <Text style={styles.tipText}>
                Drink plenty of water throughout the day for better digestion
              </Text>
            </View>
          </View>
          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Feather name="apple" size={20} color="#1dd1a1" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Eat More Fruits</Text>
              <Text style={styles.tipText}>
                Include fresh fruits in your diet for essential vitamins
              </Text>
            </View>
          </View>
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
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1dd1a1",
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    padding: 8,
    position: 'relative',
  },
  notificationIcon: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff6b6b',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0f1419',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  welcomeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1dd1a1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#1dd1a1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#a0a0a0",
    textAlign: "center",
    lineHeight: 20,
  },
  scanSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#a0a0a0",
    marginBottom: 20,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1f2e",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#2a3040",
  },
  scanButtonIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1dd1a1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  scanButtonContent: {
    flex: 1,
  },
  scanButtonTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  scanButtonDescription: {
    fontSize: 13,
    color: "#a0a0a0",
    lineHeight: 18,
  },
  recentSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: "#1dd1a1",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#1a1f2e",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#2a3040",
    borderStyle: "dashed",
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateText: {
    fontSize: 13,
    color: "#a0a0a0",
    textAlign: "center",
  },
  tipsSection: {
    marginBottom: 20,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#1a2a3a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#1dd1a1",
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(29, 209, 161, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: "#a0a0a0",
    lineHeight: 18,
  },
});