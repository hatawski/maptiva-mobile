import React, { useEffect, useRef, useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Alert, View } from "react-native";

export default function CheckInScanner() {
  const router = useRouter();
  const { studentId } = useLocalSearchParams();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const lockRef = useRef(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission?.granted) {
    return <View />;
  }

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    // 🔒 Prevent multiple triggers
    if (lockRef.current) return;
    lockRef.current = true;
    setScanned(true);

    try {
      const res = await fetch("https://<YOUR_NGROK_URL>/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qrData: data,
          studentId,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        router.replace({
          pathname: "../checkinLoading",
          params: { qrData: data },
        });
      } else {
        Alert.alert("Error", result.message || "Reservation failed");
        lockRef.current = false;
        setScanned(false);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to reserve PC");
      lockRef.current = false;
      setScanned(false);
    }
  };

  return (
    <CameraView
      style={{ flex: 1 }}
      barcodeScannerSettings={{
        barcodeTypes: ["qr"],
      }}
      onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
    />
  );
}