import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from "@expo/vector-icons";
import { useRegistration } from '../contexts/RegistrationContext';

export default function Signup({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const { updateRegistrationData } = useRegistration();
  const insets = useSafeAreaInsets();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateInputs = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters";
    }

    if (!emailOrPhone.trim()) {
      newErrors.emailOrPhone = "Email or phone is required";
    } else if (!validateEmail(emailOrPhone) && !validatePhone(emailOrPhone)) {
      newErrors.emailOrPhone = "Enter valid email or 10-digit phone";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreeToTerms) {
      newErrors.terms = "You must agree to terms & conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = () => {
    if (!validateInputs()) {
      return;
    }

    // Store data in context
    const signupData = {
      full_name: fullName.trim(),
      password: password,
    };

    // Add email or phone based on input
    if (validateEmail(emailOrPhone)) {
      signupData.email = emailOrPhone.trim();
    } else if (validatePhone(emailOrPhone)) {
      signupData.phone = emailOrPhone.trim();
    }

    updateRegistrationData(signupData);
    navigation.navigate("AgeGender");
  };

  const isFormValid = 
    fullName.length >= 3 && 
    emailOrPhone.length > 0 && 
    password.length >= 6 && 
    confirmPassword.length >= 6 && 
    password === confirmPassword && 
    agreeToTerms;

  const renderInputField = (label, value, onChangeText, placeholder, secureTextEntry, onShowHide, errorKey, icon) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputWrapper,
        focusedField === errorKey && styles.inputWrapperFocused,
        errors[errorKey] && styles.inputWrapperError
      ]}>
        <Feather 
          name={icon} 
          size={18} 
          color={focusedField === errorKey ? "#1dd1a1" : "#6a6a7a"} 
          strokeWidth={2} 
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#6a6a7a"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          onFocus={() => setFocusedField(errorKey)}
          onBlur={() => setFocusedField(null)}
        />
        {value.length > 0 && onShowHide && (
          <TouchableOpacity onPress={onShowHide}>
            <Feather 
              name={secureTextEntry ? "eye-off" : "eye"} 
              size={18} 
              color="#6a6a7a" 
              strokeWidth={2}
            />
          </TouchableOpacity>
        )}
        {value.length > 0 && !onShowHide && (
          <TouchableOpacity onPress={() => onChangeText("")}>
            <Feather name="x" size={18} color="#6a6a7a" />
          </TouchableOpacity>
        )}
      </View>
      {errors[errorKey] && (
        <Text style={styles.errorText}>
          <Feather name="alert-circle" size={12} /> {errors[errorKey]}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        {/* Header */}
        <View style={[styles.header]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sign Up</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Logo Icon */}
          <View style={styles.iconSection}>
            <View style={styles.iconCircle}>
              <Feather name="user-plus" size={60} color="#1a1a2e" strokeWidth={1.5} />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join NutriScan to start your health journey
          </Text>

          {/* Full Name Input */}
          {renderInputField(
            "Full Name",
            fullName,
            setFullName,
            "Enter your full name",
            false,
            null,
            "fullName",
            "user"
          )}

          {/* Email/Phone Input */}
          {renderInputField(
            "Email or Phone",
            emailOrPhone,
            setEmailOrPhone,
            "Enter email or 10-digit phone",
            false,
            null,
            "emailOrPhone",
            "mail"
          )}

          {/* Password Input */}
          {renderInputField(
            "Password",
            password,
            setPassword,
            "Create a strong password",
            !showPassword,
            () => setShowPassword(!showPassword),
            "password",
            "lock"
          )}

          {/* Confirm Password Input */}
          {renderInputField(
            "Confirm Password",
            confirmPassword,
            setConfirmPassword,
            "Re-enter your password",
            !showConfirmPassword,
            () => setShowConfirmPassword(!showConfirmPassword),
            "confirmPassword",
            "lock"
          )}

          {/* Terms & Conditions */}
          <View style={styles.termsContainer}>
            <TouchableOpacity 
              style={styles.checkbox}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              {agreeToTerms ? (
                <Feather name="check-square" size={20} color="#1dd1a1" strokeWidth={2} />
              ) : (
                <Feather name="square" size={20} color="#6a6a7a" strokeWidth={2} />
              )}
            </TouchableOpacity>
            <View style={styles.termsText}>
              <Text style={styles.termsLabel}>I agree to the </Text>
              <TouchableOpacity>
                <Text style={styles.termsLink}>Terms & Conditions</Text>
              </TouchableOpacity>
              <Text style={styles.termsLabel}> and </Text>
              <TouchableOpacity>
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </View>
          {errors.terms && (
            <Text style={styles.errorText}>
              <Feather name="alert-circle" size={12} /> {errors.terms}
            </Text>
          )}

          {/* Signup Button */}
          <TouchableOpacity
            style={[styles.button, isFormValid ? styles.buttonActive : styles.buttonInactive]}
            onPress={handleSignup}
            disabled={!isFormValid}
          >
            <Text style={styles.buttonText}>Next</Text>
            <Feather name="arrow-right" size={18} color="#1a1a2e" strokeWidth={2.5} />
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.or}>or</Text>
            <View style={styles.divider} />
          </View>

          {/* Social Signup */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}>f</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Feather name="apple" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    marginBottom: 18,
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
  inputWrapperFocused: {
    borderColor: "#1dd1a1",
    backgroundColor: "#151a28",
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
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 10,
  },
  checkbox: {
    marginTop: 2,
  },
  termsText: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  termsLabel: {
    fontSize: 13,
    color: "#a0a0a0",
    lineHeight: 20,
  },
  termsLink: {
    fontSize: 13,
    color: "#1dd1a1",
    fontWeight: "600",
    lineHeight: 20,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    gap: 10,
    marginBottom: 20,
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
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#2a3040",
  },
  or: {
    marginHorizontal: 12,
    color: "#a0a0a0",
    fontSize: 13,
    fontWeight: "600",
  },
  socialContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    marginBottom: 24,
  },
  socialButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1f2e",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a3040",
  },
  socialIcon: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "700",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#a0a0a0",
    fontSize: 14,
  },
  loginLink: {
    color: "#1dd1a1",
    fontSize: 14,
    fontWeight: "700",
  },
});