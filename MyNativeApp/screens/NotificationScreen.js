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
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import apiService from '../services/api';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await apiService.get('/notifications?limit=50');
      
      if (response.success) {
        setNotifications(response.data);
      } else {
        throw new Error(response.message || 'Failed to load notifications');
      }
    } catch (error) {
      console.error('Load notifications error:', error);
      Alert.alert('Error', 'Failed to load notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

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

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
    loadUnreadCount();
  };

  const markAsRead = async (notificationId) => {
    try {
      await apiService.patch(`/notifications/${notificationId}/read`);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Mark as read error:', error);
      Alert.alert('Error', 'Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiService.patch('/notifications/read-all');
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
      
      Alert.alert('Success', 'All notifications marked as read');
    } catch (error) {
      console.error('Mark all as read error:', error);
      Alert.alert('Error', 'Failed to mark notifications as read');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await apiService.delete(`/notifications/${notificationId}`);
      
      // Update local state
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      
      // Update unread count if needed
      const deletedNotif = notifications.find(n => n.id === notificationId);
      if (deletedNotif && !deletedNotif.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Delete notification error:', error);
      Alert.alert('Error', 'Failed to delete notification');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'alert':
        return <MaterialIcons name="error" size={20} color="#ff6b6b" />;
      case 'warning':
        return <MaterialIcons name="warning" size={20} color="#ffa726" />;
      case 'success':
        return <MaterialIcons name="check-circle" size={20} color="#1dd1a1" />;
      default:
        return <MaterialIcons name="info" size={20} color="#4fc3f7" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'alert':
        return '#ff6b6b';
      case 'warning':
        return '#ffa726';
      case 'success':
        return '#1dd1a1';
      default:
        return '#4fc3f7';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, { marginTop: insets.top }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1dd1a1" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
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
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Unread Count Badge */}
      {unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </Text>
        </View>
      )}

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
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="notifications-off" size={60} color="#6a6a7a" />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyText}>
              You're all caught up! We'll notify you about product expiries and important updates.
            </Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <View 
              key={notification.id} 
              style={[
                styles.notificationCard,
                !notification.is_read && styles.unreadCard
              ]}
            >
              <View style={styles.notificationHeader}>
                <View style={styles.notificationTitleRow}>
                  {getTypeIcon(notification.type)}
                  <Text style={styles.notificationTitle}>
                    {notification.title}
                  </Text>
                </View>
                <Text style={styles.notificationTime}>
                  {formatDate(notification.created_at)}
                </Text>
              </View>

              <Text style={styles.notificationMessage}>
                {notification.message}
              </Text>

              {notification.product_name && (
                <View style={styles.productInfo}>
                  <MaterialIcons name="inventory" size={14} color="#a0a0a0" />
                  <Text style={styles.productName}>
                    Product: {notification.product_name}
                  </Text>
                </View>
              )}

              <View style={styles.notificationActions}>
                {!notification.is_read && (
                  <TouchableOpacity 
                    style={styles.readButton}
                    onPress={() => markAsRead(notification.id)}
                  >
                    <MaterialIcons name="check" size={16} color="#1dd1a1" />
                    <Text style={styles.readButtonText}>Mark Read</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => deleteNotification(notification.id)}
                >
                  <MaterialIcons name="delete-outline" size={16} color="#ff6b6b" />
                </TouchableOpacity>
              </View>
            </View>
          ))
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
  markAllText: {
    color: '#1dd1a1',
    fontSize: 14,
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: '#1a2a3a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#1dd1a1',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 8,
  },
  unreadBadgeText: {
    color: '#1dd1a1',
    fontSize: 12,
    fontWeight: '600',
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#a0a0a0',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  notificationCard: {
    backgroundColor: "#1a1f2e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
  },
  unreadCard: {
    borderLeftColor: '#1dd1a1',
    backgroundColor: '#1a2a3a',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    flex: 1,
  },
  notificationTime: {
    fontSize: 12,
    color: "#6a6a7a",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#a0a0a0",
    lineHeight: 20,
    marginBottom: 12,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  productName: {
    fontSize: 12,
    color: "#a0a0a0",
    fontStyle: 'italic',
  },
  notificationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(29, 209, 161, 0.1)',
    borderRadius: 6,
  },
  readButtonText: {
    color: '#1dd1a1',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 6,
  },
});