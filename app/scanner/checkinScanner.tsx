import React, { useEffect, useRef, useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { Alert, View, StyleSheet } from "react-native";

export default function CheckInScanner() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const lockRef = useRef(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission?.granted) {
    return <View style={styles.fallback} />;
  }

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    // 🔒 Prevent multiple rapid frames from triggering simultaneously
    if (lockRef.current) return;
    lockRef.current = true;
    setScanned(true);

    // Expected format from scanned sticker/screen: e.g., "PC01" or "PC15"
    const scannedValue = data.trim();

    if (!scannedValue.startsWith("PC")) {
      Alert.alert("Invalid QR", "This QR code is not a valid MAPTIVA Workstation identifier.", [
        {
          text: "Try Again",
          onPress: () => {
            lockRef.current = false;
            setScanned(false);
          }
        }
      ]);
      return;
    }

    // ✅ Hand over the scanned PC name to the transactional loading gateway
    router.replace({
      pathname: "/scanner/checkinLoading",
      params: { pc_name: scannedValue },
    });
  };

  return (
    <CameraView
      style={StyleSheet.absoluteFillObject}
      barcodeScannerSettings={{
        barcodeTypes: ["qr"],
      }}
      onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
    />
  );
}

const styles = StyleSheet.create({
  fallback: { flex: 1, backgroundColor: "#041C32" }
});