import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const FRAME_SIZE = 250;

const API_BASE = "http://50.0.14.185:5000";

export default function UnifiedScanner() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const scanAnim = useRef(new Animated.Value(0)).current;

  
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

  if (!permission) return <Text>Requesting camera permission...</Text>;
  if (!permission.granted)
    return (
      <View style={styles.center}>
        <Text>No camera access</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={{ color: "#4EF0C3", marginTop: 10 }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );

  // ✅ SINGLE handleQRScan — no duplicate
  const handleQRScan = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    if (data.startsWith("checkin-")) {
      handleCheckInQR(data);
    } else {
      // everything else treated as login UUID token
      handleLoginQR(data);
    }
  };

  // ✅ Login QR — sends token + student_id to Flask
  const handleLoginQR = async (token: string) => {
  try {
    const storedUser = await AsyncStorage.getItem("user");
    const parsed = JSON.parse(storedUser || "{}");

    if (!parsed?.student_id) {
      Alert.alert("Error", "Please log in to your mobile app first");
      setScanned(false);
      return;
    }

    const res = await fetch(`${API_BASE}/qr-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      },
      body: JSON.stringify({
        token,
        student_id: parsed.student_id,  // ← "CA20010304" not parsed.id
      }),
    });

    const data = await res.json();

    if (res.ok) {
      Alert.alert("Success", "Browser logged in!");
      router.replace("/home");
    } else {
      Alert.alert("Failed", data.message);
      setScanned(false);
    }
  } catch (err) {
    console.error(err);
    Alert.alert("Error", "Cannot connect to server");
    setScanned(false);
  }
};

  // ✅ Check-in QR — reserves a PC
 const handleCheckInQR = async (qrData: string) => {
  try {
    const user = await AsyncStorage.getItem("user");
    const parsed = JSON.parse(user || "{}");

    if (!parsed?.id) {
      Alert.alert("Error", "User not logged in");
      setScanned(false);
      return;
    }

    const parts = qrData.split("-");
    const pc_name = parts[parts.length - 1];

    const res = await fetch(`${API_BASE}/reserve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      },
      body: JSON.stringify({
        student_id: parsed.id,
        pc_name: pc_name,
      }),
    });

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      Alert.alert("Error", "Server returned unexpected response");
      setScanned(false);
      return;
    }

    const result = await res.json();

    if (res.ok) {
      // ✅ Navigate to success screen with PC info
      router.replace({
        pathname: "/scanner/checkinSuccess" as any,
        params: {
          pc_name: result.pc_name || pc_name,
          checked_in_at: result.checked_in_at || ""
        }
      });
    } else {
      Alert.alert("Check-in Failed", result.message || "Reservation failed");
      setScanned(false);
    }
  } catch (err) {
    console.error(err);
    Alert.alert("Error", "Failed to reserve PC");
    setScanned(false);
  }
};

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleQRScan}
      />
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Ionicons name="information-circle-outline" size={24} color="#fff" />
          <Text style={styles.title}>MAPTIVA</Text>
        </View>
        <View style={styles.frameContainer}>
          <View style={styles.frame}>
            <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanAnim }] }]} />
          </View>
          <Text style={styles.frameText}>Align the QR code within the frame</Text>
        </View>
        <View style={styles.bottomBar}>
          <TouchableOpacity>
            <Ionicons name="help-circle-outline" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.qrButton}>
            <Ionicons name="qr-code-outline" size={36} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons name="menu" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Styles from your LoginScanner.tsx
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    paddingVertical: 40,
  },

  header: {
    alignItems: "center",
    marginTop: 20,
  },
  title: { color: "#4EF0C3", fontSize: 28, fontWeight: "bold", marginTop: 10 },
  subtitle: { color: "#fff", fontSize: 16 },

  frameContainer: {
    alignItems: "center",
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderWidth: 2,
    borderColor: "#4EF0C3",
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "flex-start",
  },
  scanLine: {
    height: 2,
    width: "100%",
    backgroundColor: "#4EF0C3",
  },
  frameText: { color: "#A3B3C3", marginTop: 10 },

  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1bc99b",
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  qrButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 40,
    marginTop: -20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});