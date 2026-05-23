import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function AboutUs() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" size={24} color="white" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.logo}>MA</Text>
        <Text style={styles.title}>MAPTIVA</Text>
        <Text style={styles.tagline}>we make it easy.</Text>

        <Text style={styles.sectionTitle}>Computer Lab Seat Tracker</Text>
        <Text style={styles.paragraph}>
          Maptiva is a student-developed seat tracking system designed to make
          computer lab management accurate and effortless.
        </Text>
        <Text style={styles.paragraph}>
          We created Maptiva to solve a common problem — manual paper logs that
          cause errors or misplaced blame when something goes wrong. With
          Maptiva, each student’s seat is tracked in real time through QR code
          scanning, ensuring transparency and accountability for everyone.
        </Text>

        <Text style={styles.subHeading}>MISSION</Text>
        <Text style={styles.paragraph}>
          To make seat tracking smarter, fairer, and more reliable for students
          and schools.
        </Text>

        <Text style={styles.subHeading}>VISION</Text>
        <Text style={styles.paragraph}>
          A connected and transparent school community powered by technology.
        </Text>

        <Text style={styles.footerTitle}>Overview</Text>
        <Text style={styles.footer}>About Us</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00131A",
    paddingTop: 50,
  },
  backButton: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  content: {
    paddingHorizontal: 25,
    paddingBottom: 50,
  },
  logo: {
    fontSize: 50,
    fontWeight: "900",
    color: "#00B7A8",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#00B7A8",
  },
  tagline: {
    color: "#9acccd",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#00B7A8",
    fontWeight: "700",
    marginBottom: 10,
  },
  paragraph: {
    color: "#ccc",
    marginBottom: 15,
    lineHeight: 20,
  },
  subHeading: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    backgroundColor: "#0A2C44",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 5,
  },
  footerTitle: {
    color: "#999",
    marginTop: 30,
  },
  footer: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
});
