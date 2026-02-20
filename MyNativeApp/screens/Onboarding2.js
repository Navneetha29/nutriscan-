import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function Onboarding2({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back and skip */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Icon container */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBox}>
            <Feather name="pie-chart" size={80} color="#1a1a2e" strokeWidth={1.5} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Track Your Daily Nutrition</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          See what you consume and make healthier food choices.
        </Text>

        {/* Features */}
        <View style={styles.featuresBox}>
          <View style={styles.featureRow}>
            <View style={styles.featureIconBg}>
              <Feather name="activity" size={20} color="#1dd1a1" />
            </View>
            <Text style={styles.featureText}>Track daily intake</Text>
          </View>

          <View style={styles.featureRow}>
            <View style={styles.featureIconBg}>
              <Feather name="target" size={20} color="#1dd1a1" />
            </View>
            <Text style={styles.featureText}>Set nutrition goals</Text>
          </View>

          <View style={styles.featureRow}>
            <View style={styles.featureIconBg}>
              <Feather name="bar-chart-2" size={20} color="#1dd1a1" />
            </View>
            <Text style={styles.featureText}>View detailed reports</Text>
          </View>
        </View>

        {/* Progress dots */}
        <View style={styles.dotsContainer}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
        </View>
      </View>

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
        <Feather name="arrow-right" size={20} color="#1a1a2e" strokeWidth={2.5} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1419",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingTop: 20,
    marginTop: 16,
  },
  skip: {
    color: "#b0b0b0",
    fontSize: 13,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconBox: {
    width: 180,
    height: 180,
    borderRadius: 90,
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
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#a0a0a0",
    textAlign: "center",
    lineHeight: 22,
  },
  featuresBox: {
    width: "100%",
    backgroundColor: "#1a1f2e",
    borderRadius: 14,
    padding: 20,
    gap: 16,
    marginTop: 10,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  featureIconBg: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#0f1419",
    justifyContent: "center",
    alignItems: "center",
  },
  featureText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
    flex: 1,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#404a5a",
  },
  activeDot: {
    backgroundColor: "#1dd1a1",
    width: 24,
  },
  button: {
    backgroundColor: "#1dd1a1",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 12,
    gap: 10,
    marginBottom: 80,
    shadowColor: "#1dd1a1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  buttonText: {
    color: "#1a1a2e",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});