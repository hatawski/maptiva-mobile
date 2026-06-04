import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(300)).current;

  const API_BASE = " https://alejandra-uncognisable-undescriptively.ngrok-free.dev";

  const [name, setName] = useState<string>("Loading...");
  const [studentCode, setStudentCode] = useState<string>("-"); // Renamed to accurately reflect institutional identity

  const firstLetter =
    typeof name === "string" && name.length > 0 ? name.charAt(0).toUpperCase() : "?";

  useEffect(() => {
    AsyncStorage.getItem("user")
      .then((data) => {
        if (data) {
          try {
            const user = JSON.parse(data);
            setName(user.name || "No Name");
            // ✅ Fix: Target student_id string code instead of raw relational primary key integer id
            setStudentCode(user.student_id || user.id || "-");
          } catch (e) {
            console.log("Failed to parse user data:", e);
          }
        }
      })
      .catch((e) => console.log("Error reading user data:", e));

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleAboutUs = () => router.push("/aboutus");

  const handleSignOut = async () => {
    try {
      // ✅ Safe cascade termination loop over local network
      const storedUser = await AsyncStorage.getItem("user");
      const parsed = JSON.parse(storedUser || "{}");
      
      if (parsed?.id) {
        await fetch(`${API_BASE}/checkout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({ student_id: parsed.id })
        });
      }
    } catch (err) {
      console.error("Checkout on signout failed:", err);
    } finally {
      // Clear persistent parameters and shift execution safely
      await AsyncStorage.removeItem("user");
      router.replace("/auth/login"); // ✅ Fix: Replaced relative jump with explicit absolute routing
    }
  };

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      router.back();
    });
  };

  return (
    <View style={styles.overlay}>
      {/* Background pressable overlay allows easy dismiss by clicking outside the card */}
      <TouchableOpacity style={StyleSheet.absoluteFillObject} activeOpacity={1} onPress={handleClose} />

      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        {/* Header Profile Section */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{firstLetter}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
              <Text style={styles.id}>{studentCode}</Text>
            </View>
          </View>

          {/* Right Menu Dismiss Toggle */}
          <TouchableOpacity onPress={handleClose} style={styles.menuButton}>
            <Ionicons name="close-circle-outline" size={28} color="#00b894" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Menu Actions */}
        <TouchableOpacity style={styles.option} onPress={handleAboutUs}>
          <Ionicons name="information-circle-outline" size={24} color="#00b894" />
          <Text style={styles.optionText}>About Us</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color="#ff3b30" />
          <Text style={[styles.optionText, { color: "#ff3b30" }]}>Sign Out Account</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(4, 28, 50, 0.7)", // Blends beautifully with your background palette
  },
  sheet: {
    backgroundColor: "#062743",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    paddingBottom: 45,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    backgroundColor: "#00b894", // Synchronized color palette
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    color: "#041C32",
    fontSize: 24,
    fontWeight: "bold",
  },
  name: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.3,
  },
  id: {
    color: "#b2bec3",
    fontSize: 14,
    marginTop: 3,
  },
  menuButton: { 
    padding: 5 
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    marginVertical: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  optionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 14,
  },
});