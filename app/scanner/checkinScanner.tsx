import React, { useEffect } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Alert } from "react-native";

export default function CheckInScanner() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { qrData, studentId } = params;
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  if (!permission?.granted) return null;

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    try {
      const res = await fetch("https://<YOUR_NGROK_URL>/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrData: data, studentId }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        router.replace({
          pathname: "./checkinLoading",
          params: { qrData: data },
        });
      } else {
        Alert.alert("Error", result.message || "Reservation failed");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to reserve PC");
    }
  };

  return (
    <CameraView
      style={{ flex: 1 }}
      barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      onBarcodeScanned={handleBarcodeScanned}
    />
  );
}