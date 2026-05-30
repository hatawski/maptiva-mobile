import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeChecked() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // ✅ Get the user's name and ID from the loginScanner screen
  const name = params.name || "Unknown User";
  const idNumber = params.idNumber || "N/A";

  const handleCheckout = async () => {
  Alert.alert(
    "Confirm Check-out",
    "Are you sure you want to lock this PC?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, Check Out",
        onPress: async () => {
          try {
            const res = await fetch("http://<BACKEND_IP>:5000/checkout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ student_id: idNumber }), // send student ID
            });

            if (res.ok) {
              Alert.alert("Checked Out", "PC has been successfully checked out.");
              router.replace("/home");
            } else {
              const err = await res.json();
              Alert.alert("Error", err.message || "Checkout failed.");
            }
          } catch (error: any) {
            console.error("Checkout error:", error);
            Alert.alert("Error", error.message || "Network error.");
          }
        },
      },
    ]
  );
};

  return (
    <View style={styles.container}>
      {/* Top icons */}
      <View style={styles.topBar}>
        {/* Report button */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() =>
            router.push({
              pathname: "/report",
              params: { checked: "true", name, idNumber },
            })
          }
        >
          <Ionicons name="alert-circle-outline" size={28} color="#333" />
        </TouchableOpacity>

        {/* Help button */}
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="help-circle-outline" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View style={styles.centerContent}>
        <Text style={styles.title}>PC In Use</Text>
        <Text style={styles.subtitle}>{name}</Text>
        <Text style={styles.subtext}>{idNumber}</Text>

        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>Check Out</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom navigation */}
      <View style={styles.bottomNav}>
        {/* Help */}
        <TouchableOpacity
    style={styles.navItem}
    onPress={() => router.push("/home")} // navigate to main home screen
  >
    <Ionicons name="home-outline" size={30} color="#666" />
  </TouchableOpacity>

        {/* QR Scanner */}
        <TouchableOpacity
          style={styles.qrButton}
          onPress={() => router.push("../scanner/loginScanner")}
        >
          <Ionicons name="qr-code-outline" size={36} color="white" />
        </TouchableOpacity>

        {/* ⚙️ Settings */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            router.push({
              pathname: "../settings",
              params: { name, idNumber },
            })
          }
        >
          <MaterialIcons name="menu" size={30} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", paddingTop: 40 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  iconButton: { padding: 5 },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 10 },
  subtitle: { fontSize: 18, color: "#444", marginBottom: 5 },
  subtext: { fontSize: 14, color: "#777", marginBottom: 20 },
  checkoutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  checkoutText: { color: "white", fontSize: 18, fontWeight: "600" },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  navItem: { padding: 5 },
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
