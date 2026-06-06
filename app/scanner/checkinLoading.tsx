import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CheckInLoading() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { pc_name } = params; // Make sure your scanner passes pc_name here

  const API_URL = "https://survive-printers-maker-chelsea.trycloudflare.com";

  useEffect(() => {
    const performCheckIn = async () => {
      try {
        // 1. Get the logged-in student's ID from storage
        const storedUser = await AsyncStorage.getItem("user");
        const parsedUser = JSON.parse(storedUser || "{}");
        
        if (!parsedUser.id) {
          Alert.alert("Error", "User session not found. Please log in again.");
          router.replace("/auth/login");
          return;
        }

        // 2. Send the reservation payload to your DietPi server
        const response = await fetch(`${API_URL}/reserve`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true" // ✅ Bypasses the ngrok interstitial warning page
          },
          body: JSON.stringify({
            student_id: parsedUser.id, // Sends database integer id
            pc_name: pc_name           // Sends scanned PC name (e.g., "PC01")
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // 3. Only route to success if the backend confirmed it!
          router.replace({
            pathname: "/scanner/checkinSuccess", 
            params: { 
              pc_name: data.pc_name, 
              checked_in_at: data.checked_in_at 
            }
          });
        } else {
          // Handle backend rejections (e.g., "PC already reserved")
          Alert.alert("Reservation Failed", data.message || "Could not reserve PC.");
          router.replace("/home");
        }
      } catch (error) {
        console.log("Check-in network error:", error);
        Alert.alert("Connection Error", "Cannot connect to the security server.");
        router.replace("/home");
      }
    };

    performCheckIn();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verifying Workstation Access...</Text>
      <ActivityIndicator size="large" color="#00b894" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#041C32" },
  title: { fontSize: 20, marginBottom: 20, color: "#fff", fontWeight: "600" },
});