import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";

const API_BASE = "https://alejandra-uncognisable-undescriptively.ngrok-free.dev".trim();

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkTutorial = async () => {
      const done = await AsyncStorage.getItem("tutorial_done");
      if (!done) {
        router.replace("/tutorial");
      }
    };
    checkTutorial();
  }, []);

  // ✅ Listen for admin approval via socket
  useEffect(() => {
    let socket: any;

    const setupSocket = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      const parsed = JSON.parse(storedUser || "{}");
      if (!parsed?.id) return;

      // Initialize Socket connection with fallback protocols and ngrok skip headers
      socket = io(API_BASE, {
        transports: ["websocket", "polling"],
        autoConnect: true,
        forceNew: true,
        extraHeaders: {
          "ngrok-skip-browser-warning": "true"
        }
      });

      socket.on("connect", () => {
        // ✅ Join mobile room
        socket.emit("join_mobile", { student_id: parsed.id });
        console.log("Mobile joined room successfully:", parsed.id);
      });

      // ✅ Log any connection bugs to the terminal debugger
      socket.on("connect_error", (err: any) => {
        console.log("Mobile Socket Connection Error:", err.message);
      });

      // ✅ When admin accepts permission request
      socket.on("pc_unlocked_mobile", (data: any) => {
        router.replace({
          pathname: "./scanner/checkinSuccess" as any,
          params: {
            pc_name: data.pc_name || "PC01",
            checked_in_at: data.checked_in_at || ""
          }
        });
      });
    };

    setupSocket();
    return () => { 
      if (socket) socket.disconnect(); 
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/report?checked=false")}
        >
          <Ionicons name="alert-circle-outline" size={28} color="#00b894" />
        </TouchableOpacity>
      </View>

      <View style={styles.centerContent}>
        <Text style={styles.title}>MAPTIVA</Text>
        <Text style={styles.subtitle}>{new Date().toDateString()}</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("../scanner/UnifiedScanner")}
        >
          <Text style={styles.loginText}>Log-In</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("../tutorial")}
        >
          <Ionicons name="help-circle-outline" size={30} color="#00b894" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.qrButton}
          onPress={() => router.push("../scanner/UnifiedScanner")}
        >
          <Ionicons name="qr-code-outline" size={36} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("../settings")}
        >
          <MaterialIcons name="menu" size={30} color="#00b894" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#041C32", paddingTop: 40 },
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
  title: { fontSize: 28, fontWeight: "bold", color: "#00b894", letterSpacing: 1 },
  subtitle: { fontSize: 16, color: "#b2bec3", marginVertical: 10 },
  loginButton: {
    backgroundColor: "#00b894",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 15,
  },
  loginText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#062743",
    paddingVertical: 12,
  },
  navItem: { padding: 5 },
  qrButton: {
    backgroundColor: "#00b894",
    padding: 18,
    borderRadius: 40,
    marginTop: -25,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
});