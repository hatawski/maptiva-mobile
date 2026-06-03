import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const FRAME_SIZE = 250;

export default function LoginScanner() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const lockRef = useRef(false);

  const scanAnim = useRef(new Animated.Value(0)).current;

  // Animation Loop
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: FRAME_SIZE - 4,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Permission Request
  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission]);

  if (!permission) return <Text style={styles.centerText}>Requesting camera permission...</Text>;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>No camera access</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={{ color: "#4EF0C3", marginTop: 10, fontWeight: "bold" }}>
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 🔒 SECURE AUTOMATED ROUTING GATEWAY
  const handleQRScan = async ({ data }: { data: string }) => {
    if (lockRef.current) return;

    lockRef.current = true;
    setScanned(true);

    try {
      const scannedToken = data.trim();

      // Basic validation: ensure it's a valid data string before hitting the network
      if (!scannedToken) {
        Alert.alert("Invalid Code", "Scanned QR data is empty.", [
          { text: "Try Again", onPress: () => { lockRef.current = false; setScanned(false); } }
        ]);
        return;
      }

      // ✅ Route token forward to a loading screen to process the handshake
      router.replace({
        pathname: "/scanner/checkinLoading",
        params: { pc_name: scannedToken },
      });

    } catch (err) {
      console.log("Scanner routing error:", err);
      lockRef.current = false;
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

      {/* Overlay Frame HUD */}
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="information-circle-outline" size={24} color="#fff" />
          <Text style={styles.title}>MAPTIVA</Text>
        </View>

        {/* Frame Target Box */}
        <View style={styles.frameContainer}>
          <View style={styles.frame}>
            <Animated.View
              style={[
                styles.scanLine,
                { transform: [{ translateY: scanAnim }] },
              ]}
            />
          </View>
          <Text style={styles.frameText}>
            Align the computer's QR code within the frame
          </Text>
        </View>

        {/* Bottom Menu Panel */}
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={() => router.push("/home")}>
            <Ionicons name="home-outline" size={28} color="#fff" />
          </TouchableOpacity>

          <View style={styles.qrButton}>
            <Ionicons name="qr-code-outline" size={36} color="#fff" />
          </View>

          {/* RESET BUTTON */}
          <TouchableOpacity
            onPress={() => {
              setScanned(false);
              lockRef.current = false;
            }}
          >
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
  centerText: { textAlign: "center", marginTop: 50, color: "#fff" },
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
  frameText: { color: "#A3B3C3", marginTop: 10, fontSize: 14, fontWeight: "500" },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#062743", // Changed from raw green to match your dark dashboard theme
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  qrButton: {
    backgroundColor: "#00b894", // Changed to match your mint/cyan system profile
    padding: 16,
    borderRadius: 40,
    marginTop: -20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});