import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  TextInput 
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from "@expo/vector-icons";
import { useRegistration } from '../contexts/RegistrationContext';

export function AgeGenderScreen({ navigation }) {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState(null);
  const [errors, setErrors] = useState({});
  const insets = useSafeAreaInsets();

  const { updateRegistrationData } = useRegistration();

  const validateInputs = () => {
    const newErrors = {};
    if (!age) {
      newErrors.age = "Age is required";
    } else if (age < 13 || age > 120) {
      newErrors.age = "Please enter a valid age (13-120)";
    }
    if (!gender) {
      newErrors.gender = "Please select a gender";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateInputs()) {
      return;
    }

    // Store data in context
    updateRegistrationData({
      age: parseInt(age),
      gender: gender
    });

    navigation.navigate("HealthProfile");
  };

  const isFormValid = age && gender;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        {/* Header */}
        <View style={[styles.header, { marginTop: insets.top }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Progress Dots */}
        <View style={styles.progressContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Icon */}
          <View style={styles.iconSection}>
            <View style={styles.iconCircle}>
              <Feather name="user" size={60} color="#1a1a2e" strokeWidth={1.5} />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Age & Gender</Text>
          <Text style={styles.subtitle}>
            Help us personalize your nutrition recommendations
          </Text>

          {/* Age Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Age</Text>
            <View style={[styles.inputWrapper, errors.age && styles.inputWrapperError]}>
              <Feather name="calendar" size={18} color="#6a6a7a" strokeWidth={2} />
              <TextInput
                style={styles.input}
                placeholder="Enter your age"
                placeholderTextColor="#6a6a7a"
                keyboardType="number-pad"
                maxLength={3}
                value={age}
                onChangeText={setAge}
              />
            </View>
            {errors.age && (
              <Text style={styles.errorText}>
                <Feather name="alert-circle" size={12} /> {errors.age}
              </Text>
            )}
          </View>

          {/* Gender Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderContainer}>
              {["Male", "Female", "Other"].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.genderButton,
                    gender === g && styles.genderButtonSelected
                  ]}
                  onPress={() => setGender(g)}
                >
                  <Feather
                    name={g === "Male" ? "user" : g === "Female" ? "user" : "help-circle"}
                    size={20}
                    color={gender === g ? "#1a1a2e" : "#6a6a7a"}
                  />
                  <Text style={[
                    styles.genderText,
                    gender === g && styles.genderTextSelected
                  ]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.gender && (
              <Text style={styles.errorText}>
                <Feather name="alert-circle" size={12} /> {errors.gender}
              </Text>
            )}
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Feather name="info" size={16} color="#1dd1a1" />
            <Text style={styles.infoText}>
              This information helps us tailor nutrition recommendations specifically for you.
            </Text>
          </View>
        </ScrollView>

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.button, isFormValid ? styles.buttonActive : styles.buttonInactive]}
          onPress={handleNext}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>Next</Text>
          <Feather name="arrow-right" size={18} color="#1a1a2e" strokeWidth={2.5} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1419",
  },
  keyboardAvoid: {
    flex: 1,
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
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1f2e",
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: "#1a1f2e",
    gap: 10,
  },
  inputWrapperError: {
    borderColor: "#ff6b6b",
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#fff",
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: "#ff6b6b",
  },
  genderContainer: {
    flexDirection: "row",
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#1a1f2e",
    borderWidth: 2,
    borderColor: "#2a3040",
    alignItems: "center",
    gap: 8,
  },
  genderButtonSelected: {
    backgroundColor: "#1dd1a1",
    borderColor: "#1dd1a1",
  },
  genderText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  genderTextSelected: {
    color: "#1a1a2e",
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
    marginBottom: 28,
    shadowColor: "#1dd1a1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  buttonActive: {
    backgroundColor: "#1dd1a1",
  },
  buttonInactive: {
    backgroundColor: "#4a5568",
    opacity: 0.5,
  },
  buttonText: {
    color: "#1a1a2e",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});