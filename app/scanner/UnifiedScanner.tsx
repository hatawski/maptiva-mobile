import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const FRAME_SIZE = 250;

const API_BASE = " https://alejandra-uncognisable-undescriptively.ngrok-free.dev";

export default function UnifiedScanner() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const lockRef = useRef(false); // 🔒 Fixed: Added synchronous thread lock
  const scanAnim = useRef(new Animated.Value(0)).current;

  // Scanner Laser Loop Animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: FRAME_SIZE - 4, duration: 2000, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission]);

  if (!permission) return <Text style={styles.fallbackText}>Requesting camera permission...</Text>;
  
  if (!permission.granted)
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>No camera access</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={{ color: "#00b894", marginTop: 10, fontWeight: "bold" }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );

  // ✅ SINGLE handleQRScan — Routed cleanly with a structural lock
  const handleQRScan = ({ data }: { data: string }) => {
    if (lockRef.current) return; 
    lockRef.current = true;
    setScanned(true);

    const cleanData = data.trim();

    if (cleanData.startsWith("checkin-")) {
      handleCheckInQR(cleanData);
    } else {
      // Treat everything else as a web interface login token
      handleLoginQR(cleanData);
    }
  };

  // ✅ Login QR — updates authorization logs via DietPi Flask Backend
  const handleLoginQR = async (token: string) => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const parsed = JSON.parse(storedUser || "{}");

      if (!parsed?.student_id) {
        Alert.alert("Authentication Required", "Please log in to your mobile app first.");
        resetScanner();
        return;
      }

      const res = await fetch(`${API_BASE}/qr-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          token,
          student_id: parsed.student_id, // Emits standard student string payload
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", "Web application authentication successful!", [
          { text: "OK", onPress: () => router.replace("/home") }
        ]);
      } else {
        Alert.alert("Authentication Failed", data.message || "Invalid or expired token.");
        resetScanner();
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Network Error", "Cannot reach the security server.");
      resetScanner();
    }
  };

  // ✅ Check-in QR — processes local workstation allocation
  const handleCheckInQR = async (qrData: string) => {
    try {
      const user = await AsyncStorage.getItem("user");
      const parsed = JSON.parse(user || "{}");

      if (!parsed?.id) {
        Alert.alert("Session Error", "User session expired. Please log in again.");
        router.replace("/auth/login");
        return;
      }

      // Parse computer code out of string context e.g., "checkin-PC01" -> "PC01"
      const parts = qrData.split("-");
      const pc_name = parts[parts.length - 1];

      const res = await fetch(`${API_BASE}/reserve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          student_id: parsed.id, // Emits backend primary key constraint tracking
          pc_name: pc_name,
        }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        Alert.alert("Server Error", "Unexpected terminal parsing failure.");
        resetScanner();
        return;
      }

      const result = await res.json();

      if (res.ok) {
        router.replace({
          pathname: "/scanner/checkinSuccess",
          params: {
            pc_name: result.pc_name || pc_name,
            checked_in_at: result.checked_in_at || ""
          }
        });
      } else {
        Alert.alert("Check-in Denied", result.message || "Workstation is currently unavailable.");
        resetScanner();
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Network Error", "Failed to communicate with workstation environment.");
      resetScanner();
    }
  };

  // Helper routine to reuse code locks cleanly
  const resetScanner = () => {
    lockRef.current = false;
    setScanned(false);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleQRScan}
      />
      <View style={styles.overlay}>
        {/* Header Block */}
        <View style={styles.header}>
          <Ionicons name="information-circle-outline" size={24} color="#fff" />
          <Text style={styles.title}>MAPTIVA</Text>
        </View>

        {/* Viewfinder Target Matrix */}
        <View style={styles.frameContainer}>
          <View style={styles.frame}>
            <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanAnim }] }]} />
          </View>
          <Text style={styles.frameText}>Align Login or Workstation QR code</Text>
        </View>

        {/* Unified Bottom Dock */}
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={() => router.replace("/home")}>
            <Ionicons name="home-outline" size={26} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.qrButton}>
            <Ionicons name="qr-code-outline" size={36} color="#fff" />
          </View>

          <TouchableOpacity onPress={resetScanner}>
            <MaterialIcons name="refresh" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#041C32" },
  fallbackText: { textAlign: "center", color: "#fff", marginTop: 50 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
  },
  title: { color: "#00b894", fontSize: 28, fontWeight: "bold", marginTop: 10, letterSpacing: 1 },
  frameContainer: {
    alignItems: "center",
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderWidth: 2,
    borderColor: "#00b894",
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "flex-start",
  },
  scanLine: {
    height: 2,
    width: "100%",
    backgroundColor: "#00b894",
  },
  frameText: { color: "#A3B3C3", marginTop: 12, fontWeight: "500", fontSize: 14 },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#062743", 
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  qrButton: {
    backgroundColor: "#00b894", 
    padding: 16,
    borderRadius: 40,
    marginTop: -20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});