import React, { useEffect } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Alert
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";

const API_BASE = "http://50.0.14.185:5000";

export default function CheckInSuccess() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const pcName = params.pc_name as string || "PC01";
  const checkedInAt = params.checked_in_at as string || "";

  // ✅ Listen for force checkout or logout from web
  useEffect(() => {
    let socket: any;

    const setupSocket = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      const parsed = JSON.parse(storedUser || "{}");
      if (!parsed?.id) return;

      socket = io(API_BASE, {
        transports: ["websocket"],
        autoConnect: true,
        forceNew: true
      });

      socket.on("connect", () => {
        socket.emit("join_mobile", { student_id: parsed.id });
      });

      // ✅ If PC gets freed (force checkout, logout, shutdown)
      // go back to home
      socket.on("pc_locked", () => {
        Alert.alert(
          "Session Ended",
          "Your PC session has ended.",
          [{ text: "OK", onPress: () => router.replace("/home") }]
        );
      });
    };

    setupSocket();
    return () => { if (socket) socket.disconnect(); };
  }, []);

  const handleCheckout = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const parsed = JSON.parse(storedUser || "{}");

      const res = await fetch(`${API_BASE}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ student_id: parsed.id }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Checked Out", "You have been checked out successfully!");
        router.replace("/home");
      } else {
        Alert.alert("Failed", data.message || "Checkout failed");
      }
    } catch (err) {
      Alert.alert("Error", "Cannot connect to server");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.circle}>
          <Ionicons name="checkmark" size={52} color="#00b894" />
        </View>

        <Text style={styles.title}>CHECK-IN SUCCESSFUL</Text>

        <Text style={styles.pcName}>
          {pcName.replace("PC", "PC - ")}
        </Text>

        {checkedInAt ? (
          <Text style={styles.time}>Checked in at {checkedInAt}</Text>
        ) : null}

        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>Check Out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => router.replace("/home")}
        >
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#041C32",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#0d2137",
    borderRadius: 20,
    padding: 36,
    alignItems: "center",
    width: "90%",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  circle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#00b894",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
    textAlign: "center",
  },
  pcName: {
    color: "#00d4a0",
    fontSize: 26,
    fontWeight: "bold",
  },
  time: {
    color: "#b2bec3",
    fontSize: 13,
    marginTop: 4,
  },
  checkoutBtn: {
    backgroundColor: "#e74c3c",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 16,
    width: "100%",
    alignItems: "center",
  },
  checkoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  homeBtn: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 8,
    width: "100%",
    alignItems: "center",
  },
  homeBtnText: {
    color: "#b2bec3",
    fontSize: 14,
  },
});