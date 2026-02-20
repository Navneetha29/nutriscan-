import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function Onboarding1({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header with skip */}
      <View style={styles.header}>
        <Text style={styles.time}>9:38</Text>
        <TouchableOpacity>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Icon circle */}
        <View style={styles.iconCircle}>
          <Feather name="heart" size={70} color="#1a1a2e" strokeWidth={1.5} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Welcome to NutriScan+</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Your personal health companion for making informed food choices. Scan products and get instant health insights.
        </Text>

        {/* Progress dots */}
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      {/* Next button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Onboarding2")}
      >
        <Text style={styles.buttonText}>Next</Text>
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
    paddingTop: 20,
    marginTop: 16,
    paddingBottom: 0,
  },
  time: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
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
    gap: 24,
  },
  iconCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1dd1a1",
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
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 8,
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