import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function AboutUs() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      
      {/* 🟢 TOP HEADER CARD SECTION */}
      <View style={styles.headerCard}>
        {/* Back Button positioned cleanly in the upper left safety margin */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={26} color="#00B7A8" />
        </TouchableOpacity>

        <View style={styles.headerInner}>
          <View style={styles.logoWrapper}>
            {/* Split font styling mimics your graphic logo directly in native text */}
            <Text style={styles.logoM}>M<Text style={styles.logoA}>A</Text></Text>
            <View style={styles.logoTextContainer}>
              <Text style={styles.title}>MAPTIVA</Text>
              <Text style={styles.tagline}>we make it easy.</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ⚪ SCROLLABLE BODY CONTENT */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Computer Lab Seat Tracker</Text>
        
        <Text style={styles.paragraph}>
          <Text style={styles.brandHighlight}>Maptiva</Text> is a student developed seat tracking system designed to make computer lab management accurate and effortless.
        </Text>
        
        <Text style={styles.paragraph}>
          We created <Text style={styles.brandHighlight}>Maptiva</Text> to solve a common problem: manual paper logs that cause errors or misplaced blame when something goes wrong. With Maptiva, each student's seat is tracked in real time through QR code scanning, ensuring transparency and accountability for everyone.
        </Text>

        {/* 📦 MISSION BLOCK CARD */}
        <View style={styles.infoCard}>
          <Text style={styles.cardHeading}>MISSION</Text>
          <Text style={styles.cardText}>
            To make seat tracking smarter, fairer, and more reliable for students and schools.
          </Text>
        </View>

        {/* 📦 VISION BLOCK CARD */}
        <View style={styles.infoCard}>
          <Text style={styles.cardHeading}>VISION</Text>
          <Text style={styles.cardText}>
            A connected and transparent school community powered by technology.
          </Text>
        </View>
      </ScrollView>

      {/* 🔵 FIXED BOTTOM OVERVIEW STRIP */}
      <View style={styles.footerStrip}>
        <Text style={styles.footerTitle}>Overview</Text>
        <Text style={styles.footerHeading}>About Us</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  /* Header card with curved bottom edge profile */
  headerCard: {
    width: "100%",
    backgroundColor: "#001e24",
    paddingTop: 55,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderBottomWidth: 5,
    borderBottomColor: "#00B7A8",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 55,
    zIndex: 10,
    padding: 5,
  },
  headerInner: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  logoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoM: {
    fontSize: 52,
    fontWeight: "900",
    color: "#00B7A8",
    fontStyle: "italic",
  },
  logoA: {
    color: "#aaece6",
  },
  logoTextContainer: {
    flexDirection: "column",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#aaece6",
    letterSpacing: 1.5,
  },
  tagline: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "300",
    marginTop: 2,
  },
  /* Body content text containment container */
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 120, // Pad out bottom space so items don't hit the absolute footer panel
    alignItems: "center",
  },
  sectionTitle: {
    color: "#00B7A8",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  paragraph: {
    color: "#2c4146",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 18,
  },
  brandHighlight: {
    color: "#006fa3",
    fontWeight: "700",
  },
  /* Card framing layout matching your mobile screenshot specs */
  infoCard: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#b2d8d8",
    borderRadius: 10,
    padding: 16,
    marginTop: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeading: {
    fontSize: 15,
    fontWeight: "800",
    color: "#005566",
    letterSpacing: 1,
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    color: "#334e55",
    lineHeight: 19,
    fontWeight: "400",
  },
  /* Absolute positioned horizontal bottom status deck bar */
  footerStrip: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#01141c",
    paddingVertical: 18,
    paddingHorizontal: 25,
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  footerTitle: {
    color: "#90afc2",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  footerHeading: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 2,
  },
});