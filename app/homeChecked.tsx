import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "https://alejandra-uncognisable-undescriptively.ngrok-free.dev".trim();

export default function HomeChecked() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // State fallbacks to ensure interface stability
  const [studentName, setStudentName] = useState("Loading User...");
  const [studentId, setStudentId] = useState("");
  const [dbId, setDbId] = useState<number | null>(null);

  // Sync user context safely from local persistence storage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setStudentName(parsed.name || "Unknown User");
          setStudentId(parsed.student_id || "N/A");
          setDbId(parsed.id || null);
        } else {
          // If params are available, use them as fallback
          if (params.name) setStudentName(params.name as string);
          if (params.idNumber) setStudentId(params.idNumber as string);
        }
      } catch (err) {
        console.error("Error reading storage:", err);
      }
    };
    fetchUserData();
  }, [params]);

  const handleCheckout = async () => {
    Alert.alert(
      "Confirm Check-out",
      "Are you sure you want to log out and lock this PC?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Check Out",
          onPress: async () => {
            try {
              // Priority parameter: Send database internal relation integer ID if available, else string ID
              const identificationPayload = dbId || studentId;

              const res = await fetch(`${API_BASE}/checkout`, {
                method: "POST",
                headers: { 
                  "Content-Type": "application/json",
                  "ngrok-skip-browser-warning": "true" // ✅ Bypasses the ngrok interstitial warning page safely
                },
                body: JSON.stringify({ student_id: identificationPayload }),
              });

              if (res.ok) {
                Alert.alert("Checked Out", "PC has been successfully checked out.");
                router.replace("/home");
              } else {
                const err = await res.json();
                Alert.alert("Error", err.message || "Checkout failed.");
              }
            } catch (error: any) {
              console.error("Checkout error:", error);
              Alert.alert("Network Error", "Cannot connect to server.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header Section */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() =>
            router.push({
              pathname: "/report",
              params: { checked: "true", name: studentName, idNumber: studentId },
            })
          }
        >
          <Ionicons name="alert-circle-outline" size={28} color="#00b894" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => router.push("/tutorial")}
        >
          <Ionicons name="help-circle-outline" size={28} color="#00b894" />
        </TouchableOpacity>
      </View>

      {/* Main Focus Status Board */}
      <View style={styles.centerContent}>
        <View style={styles.statusPulseHolder}>
          <Ionicons name="desktop-outline" size={72} color="#00b894" />
        </View>
        
        <Text style={styles.title}>Workstation Active</Text>
        <Text style={styles.subtitle}>{studentName}</Text>
        <Text style={styles.subtext}>{studentId}</Text>

        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>Check Out Session</Text>
        </TouchableOpacity>
      </View>

      {/* Synchronized Navigation Dock */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace("/home")}>
          <Ionicons name="home-outline" size={28} color="#00b894" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.qrButton}
          onPress={() => router.push("/scanner/UnifiedScanner")}
        >
          <Ionicons name="qr-code-outline" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            router.push({
              pathname: "/settings",
              params: { name: studentName, idNumber: studentId },
            })
          }
        >
          <MaterialIcons name="menu" size={30} color="#00b894" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#041C32", paddingTop: 40 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center"
  },
  iconButton: { padding: 5 },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30
  },
  statusPulseHolder: {
    marginBottom: 20,
    backgroundColor: "rgba(0, 184, 148, 0.1)",
    padding: 25,
    borderRadius: 60,
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#fff", marginBottom: 10, letterSpacing: 0.5 },
  subtitle: { fontSize: 18, color: "#00b894", fontWeight: "600", marginBottom: 4 },
  subtext: { fontSize: 14, color: "#b2bec3", marginBottom: 30 },
  checkoutButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    shadowColor: "#e74c3c",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4
  },
  checkoutText: { color: "white", fontSize: 16, fontWeight: "bold" },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#062743",
    paddingVertical: 12,
  },
  navItem: { padding: 5 },
  qrButton: {
    backgroundColor: "#00b894",
    padding: 16,
    borderRadius: 40,
    marginTop: -25,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5
  },
});