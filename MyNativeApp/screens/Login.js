import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from "@expo/vector-icons";
import apiService from '../services/api';

export default function Login({ navigation }) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailPhoneFocused, setEmailPhoneFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setErrors({});

    try {
      // Prepare login data
      const loginData = {
        password: password
      };

      // Determine if input is email or phone
      if (validateEmail(emailOrPhone)) {
        loginData.email = emailOrPhone;
      } else if (validatePhone(emailOrPhone)) {
        loginData.phone = emailOrPhone;
      }

      console.log('📤 Sending login request:', { ...loginData, password: '***' });

      // Make API call
      const response = await apiService.post('/auth/login', loginData);
      
      console.log('✅ Login successful:', response);

      if (response.success) {
        // Save token to AsyncStorage
        await apiService.saveToken(response.token);
        
        // Show success message
        Alert.alert(
          "Success", 
          "Login successful!",
          [{ text: "OK", onPress: () => navigation.navigate("Home") }]
        );
      } else {
        throw new Error(response.message || 'Login failed');
      }

    } catch (error) {
      console.log('❌ Login error:', error);
      
      // Handle specific error cases
      if (error.message.includes('Invalid credentials')) {
        setErrors({ 
          general: 'Invalid email/phone or password. Please try again.' 
        });
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        setErrors({ 
          general: 'Network error. Please check your connection and try again.' 
        });
      } else {
        setErrors({ 
          general: error.message || 'Login failed. Please try again.' 
        });
      }
      
      Alert.alert("Error", errors.general || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Please contact support to reset your password.",
      [{ text: "OK" }]
    );
  };

  const isFormValid = emailOrPhone.length > 0 && password.length >= 6 && !loading;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Login</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Logo Icon */}
          <View style={styles.iconSection}>
            <View style={styles.iconCircle}>
              <Feather name="log-in" size={60} color="#1a1a2e" strokeWidth={1.5} />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to your account to track your nutrition
          </Text>

          {/* General Error */}
          {errors.general && (
            <View style={styles.generalError}>
              <Feather name="alert-triangle" size={16} color="#ff6b6b" />
              <Text style={styles.generalErrorText}>{errors.general}</Text>
            </View>
          )}

          {/* Email/Phone Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email or Phone</Text>
            <View style={[
              styles.inputWrapper,
              emailPhoneFocused && styles.inputWrapperFocused,
              errors.emailOrPhone && styles.inputWrapperError
            ]}>
              <Feather 
                name={validateEmail(emailOrPhone) ? "mail" : "phone"} 
                size={18} 
                color={emailPhoneFocused ? "#1dd1a1" : "#6a6a7a"} 
                strokeWidth={2} 
              />
              <TextInput
                style={styles.input}
                placeholder="Enter email or phone number"
                placeholderTextColor="#6a6a7a"
                keyboardType="email-address"
                autoCapitalize="none"
                value={emailOrPhone}
                onChangeText={(text) => {
                  setEmailOrPhone(text);
                  // Clear error when user starts typing
                  if (errors.emailOrPhone) {
                    setErrors(prev => ({ ...prev, emailOrPhone: '' }));
                  }
                }}
                onFocus={() => setEmailPhoneFocused(true)}
                onBlur={() => setEmailPhoneFocused(false)}
                editable={!loading}
              />
              {emailOrPhone.length > 0 && (
                <TouchableOpacity 
                  onPress={() => setEmailOrPhone("")}
                  disabled={loading}
                >
                  <Feather name="x" size={18} color="#6a6a7a" />
                </TouchableOpacity>
              )}
            </View>
            {errors.emailOrPhone && (
              <Text style={styles.errorText}>
                <Feather name="alert-circle" size={12} /> {errors.emailOrPhone}
              </Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Password</Text>
              <TouchableOpacity onPress={handleForgotPassword} disabled={loading}>
                <Text style={styles.forgotPassword}>Forgot?</Text>
              </TouchableOpacity>
            </View>
            <View style={[
              styles.inputWrapper,
              passwordFocused && styles.inputWrapperFocused,
              errors.password && styles.inputWrapperError
            ]}>
              <Feather name="lock" size={18} color={passwordFocused ? "#1dd1a1" : "#6a6a7a"} strokeWidth={2} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#6a6a7a"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  // Clear error when user starts typing
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: '' }));
                  }
                }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                editable={!loading}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <Feather 
                  name={showPassword ? "eye" : "eye-off"} 
                  size={18} 
                  color="#6a6a7a" 
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>
                <Feather name="alert-circle" size={12} /> {errors.password}
              </Text>
            )}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.button, isFormValid ? styles.buttonActive : styles.buttonInactive]}
            onPress={handleLogin}
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#1a1a2e" />
            ) : (
              <>
                <Text style={styles.buttonText}>Login</Text>
                <Feather name="arrow-right" size={18} color="#1a1a2e" strokeWidth={2.5} />
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.or}>or</Text>
            <View style={styles.divider} />
          </View>

          {/* Social Login Options */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton} disabled={loading}>
              <Text style={styles.socialIcon}>f</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} disabled={loading}>
              <Text style={styles.socialIcon}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} disabled={loading}>
              <Feather name="apple" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")} disabled={loading}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  iconSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
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
    marginBottom: 30,
  },
  generalError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b6b',
  },
  generalErrorText: {
    color: '#ff6b6b',
    marginLeft: 8,
    fontSize: 13,
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  forgotPassword: {
    fontSize: 12,
    color: "#1dd1a1",
    fontWeight: "600",
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
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    gap: 10,
    marginTop: 28,
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
    marginVertical: 24,
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
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  footerText: {
    color: "#a0a0a0",
    fontSize: 14,
  },
  signupLink: {
    color: "#1dd1a1",
    fontSize: 14,
    fontWeight: "700",
  },
});