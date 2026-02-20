import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Switch, 
  TextInput, 
  Alert, 
  ActivityIndicator 
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from "@expo/vector-icons";
import { useRegistration } from '../contexts/RegistrationContext';
import apiService from '../services/api';

export default function HealthProfileScreen({ navigation }) {
  const [healthConditions, setHealthConditions] = useState({
    diabetes: false,
    highBloodPressure: false,
    nutAllergy: false,
    lactoseIntolerance: false,
    celiacDisease: false,
    heartDisease: false,
  });
  const [loading, setLoading] = useState(false);

  const insets = useSafeAreaInsets();
  const { getRegistrationData, clearRegistrationData } = useRegistration();

  const conditions = [
    { key: "diabetes", label: "Diabetes", icon: "droplet" },
    { key: "highBloodPressure", label: "High Blood Pressure", icon: "heart" },
    { key: "nutAllergy", label: "Food Allergy (Nuts)", icon: "alert-triangle" },
    { key: "lactoseIntolerance", label: "Lactose Intolerance", icon: "coffee" },
    { key: "celiacDisease", label: "Celiac Disease", icon: "wheat" },
    { key: "heartDisease", label: "Heart Disease", icon: "heart-pulse" },
  ];

  const toggleCondition = (key) => {
    setHealthConditions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCreateAccount = async () => {
    setLoading(true);

    try {
      // Get all stored registration data
      const registrationData = getRegistrationData();

      // Prepare final data for submission
      const finalData = {
        ...registrationData,
        health_conditions: {
          diabetes: healthConditions.diabetes,
          high_blood_pressure: healthConditions.highBloodPressure,
          nut_allergy: healthConditions.nutAllergy,
          lactose_intolerance: healthConditions.lactoseIntolerance,
          celiac_disease: healthConditions.celiacDisease,
          heart_disease: healthConditions.heartDisease,
        }
      };

      console.log("Submitting registration data:", finalData);

      // Make API call to register user with all data
      const response = await apiService.post('/auth/register', finalData);

      if (response.success) {
        // Clear registration data
        clearRegistrationData();
        
        Alert.alert(
          "Success!",
          "Your account has been created successfully!",
          [
            {
              text: "Get Started",
              onPress: () => navigation.navigate("Home")
            }
          ]
        );
      } else {
        Alert.alert("Registration Failed", response.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      let errorMessage = "Network error. Please check your connection.";
      if (error.message.includes("User with this email already exists")) {
        errorMessage = "An account with this email already exists.";
      } else if (error.message.includes("User with this phone number already exists")) {
        errorMessage = "An account with this phone number already exists.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Registration Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { marginTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
          <Feather name="arrow-left" size={24} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Dots */}
      <View style={styles.progressContainer}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={[styles.dot, styles.activeDot]} />
        <View style={[styles.dot, styles.activeDot]} />
      </View>

      {/* Scrollable Content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Icon */}
        <View style={styles.iconSection}>
          <View style={styles.iconCircle}>
            <Feather name="activity" size={60} color="#1a1a2e" strokeWidth={1.5} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Health Profile</Text>
        <Text style={styles.subtitle}>
          Select any health conditions that apply to you (optional)
        </Text>

        {/* Search Box (optional) */}
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color="#6a6a7a" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conditions..."
            placeholderTextColor="#6a6a7a"
            editable={!loading}
          />
        </View>

        {/* Conditions List */}
        <View style={styles.conditionsContainer}>
          {conditions.map((condition) => (
            <TouchableOpacity
              key={condition.key}
              style={[
                styles.conditionItem,
                healthConditions[condition.key] && styles.conditionItemSelected
              ]}
              onPress={() => toggleCondition(condition.key)}
              disabled={loading}
            >
              <View style={styles.conditionLeft}>
                <View style={[
                  styles.conditionIconBox,
                  healthConditions[condition.key] && styles.conditionIconBoxSelected
                ]}>
                  <Feather
                    name={condition.icon}
                    size={20}
                    color={healthConditions[condition.key] ? "#1a1a2e" : "#1dd1a1"}
                  />
                </View>
                <Text style={styles.conditionLabel}>{condition.label}</Text>
              </View>
              <Switch
                value={healthConditions[condition.key]}
                onValueChange={() => toggleCondition(condition.key)}
                trackColor={{ false: "#2a3040", true: "#1dd1a1" }}
                thumbColor={healthConditions[condition.key] ? "#fff" : "#6a6a7a"}
                disabled={loading}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Feather name="info" size={16} color="#1dd1a1" />
          <Text style={styles.infoText}>
            This information helps us provide personalized health insights and warnings based on your specific needs.
          </Text>
        </View>
      </ScrollView>

      {/* Create Account Button */}
      <TouchableOpacity
        style={[styles.button, styles.buttonActive, loading && styles.buttonDisabled]}
        onPress={handleCreateAccount}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#1a1a2e" />
        ) : (
          <>
            <Text style={styles.buttonText}>Create Account</Text>
            <Feather name="arrow-right" size={18} color="#1a1a2e" strokeWidth={2.5} />
          </>
        )}
      </TouchableOpacity>
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
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2a3040",
  },
  activeDot: {
    backgroundColor: "#1dd1a1",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  iconSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#1dd1a1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1dd1a1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#a0a0a0",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1f2e",
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: "#1a1f2e",
    gap: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#fff",
  },
  conditionsContainer: {
    gap: 12,
  },
  conditionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1a1f2e",
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: "#2a3040",
  },
  conditionItemSelected: {
    backgroundColor: "#1f2a3a",
    borderColor: "#1dd1a1",
  },
  conditionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  conditionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#0f1419",
    justifyContent: "center",
    alignItems: "center",
  },
  conditionIconBoxSelected: {
    backgroundColor: "#1dd1a1",
  },
  conditionLabel: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#1a2a3a",
    borderRadius: 12,
    padding: 14,
    gap: 10,
    marginTop: 24,
    borderLeftWidth: 3,
    borderLeftColor: "#1dd1a1",
  },
  infoText: {
    fontSize: 13,
    color: "#a0a0a0",
    flex: 1,
    lineHeight: 18,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    gap: 10,
    marginBottom: 50,
    shadowColor: "#1dd1a1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  buttonActive: {
    backgroundColor: "#1dd1a1",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#1a1a2e",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});