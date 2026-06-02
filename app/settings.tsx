import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(300)).current;

  const API_BASE = "http://50.0.14.185:5000";

  const [name, setName] = useState<string>("Loading...");
  const [id, setId] = useState<string>("-");

  const firstLetter =
    typeof name === "string" && name.length > 0 ? name.charAt(0).toUpperCase() : "?";

  useEffect(() => {
    AsyncStorage.getItem("user")
      .then((data) => {
        if (data) {
          try {
            const user = JSON.parse(data);
            setName(user.name || "No Name");
            setId(user.id || "-");
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
    // ✅ Auto checkout on mobile sign out
    const storedUser = await AsyncStorage.getItem("user");
    const parsed = JSON.parse(storedUser || "{}");
    
    if (parsed?.id) {
      await fetch(`${API_BASE}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({ student_id: parsed.id })
      });
    }
  } catch (err) {
    console.error("Checkout on signout failed:", err);
  } finally {
    await AsyncStorage.removeItem("user");
    router.replace("../auth/login");
  }
};

  const handleClose = () => {
    // slide down animation then close
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
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{firstLetter}</Text>
            </View>
            <View>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.id}>{id}</Text>
            </View>
          </View>

          {/* Hamburger menu on right */}
          <TouchableOpacity onPress={handleClose} style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#00B7A8" />
          </TouchableOpacity>
        </View>

        {/* Options */}
        <TouchableOpacity style={styles.option} onPress={handleAboutUs}>
          <Ionicons name="information-circle-outline" size={22} color="#00B7A8" />
          <Text style={styles.optionText}>About Us</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={22} color="#ff3b30" />
          <Text style={[styles.optionText, { color: "#ff3b30" }]}>Sign Out</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sheet: {
    backgroundColor: "#062743",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  avatar: {
    backgroundColor: "#00B7A8",
    borderRadius: 40,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  name: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  id: {
    color: "#9acccd",
    fontSize: 14,
    marginTop: 3,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  optionText: {
    color: "white",
    fontSize: 16,
    marginLeft: 12,
  },
   menuButton: { 
    padding: 5 
  },
});