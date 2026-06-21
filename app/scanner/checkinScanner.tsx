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

    const scannedValue = data.trim();
    let pc_name = "";

    // ✅ Fix: Check if it's our new secure hyphenated format "checkin-[token]-[PC_NAME]"
    if (scannedValue.startsWith("checkin-")) {
      const parts = scannedValue.split("-");
      pc_name = parts[parts.length - 1]; // Grabs the last piece (e.g., "PC01")
    } else if (scannedValue.startsWith("PC")) {
      // Direct legacy sticker fallback (e.g., "PC01")
      pc_name = scannedValue;
    }

    // Double check that we actually isolated a valid PC workstation string
    if (!pc_name.startsWith("PC")) {
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

    // ✅ Hand over the parsed PC name to your transactional loading gateway
    router.replace({
      pathname: "/scanner/checkinLoading",
      params: { pc_name: pc_name },
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