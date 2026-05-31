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

  // Animation
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

  // Permission
  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission]);

  if (!permission) return <Text>Requesting camera permission...</Text>;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>No camera access</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={{ color: "#4EF0C3", marginTop: 10 }}>
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 🔒 SAFE SCANNER
  const handleQRScan = async ({ data }: { data: string }) => {
    if (lockRef.current) return;

    lockRef.current = true;
    setScanned(true);

    try {
      Alert.alert("Scanned", data);

      // OPTIONAL: navigate
      // router.push({ pathname: "/nextPage", params: { data } });

    } catch (err) {
      console.log(err);
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

      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="information-circle-outline" size={24} color="#fff" />
          <Text style={styles.title}>MAPTIVA</Text>
        </View>

        {/* Frame */}
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
            Align the QR code within the frame
          </Text>
        </View>

        {/* Bottom bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity>
            <Ionicons name="help-circle-outline" size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.qrButton}>
            <Ionicons name="qr-code-outline" size={36} color="#fff" />
          </TouchableOpacity>

          {/* RESET BUTTON (IMPORTANT ADDITION) */}
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