import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function CheckInLoading() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { qrData } = params;

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace({ pathname: "./checkinSuccess", params: { qrData } });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checking in...</Text>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 20 },
});