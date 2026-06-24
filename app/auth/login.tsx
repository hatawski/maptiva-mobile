import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo"; // ✅ Real-time internet connection listener

export default function Login() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");

  const API_URL = "https://nav-reflected-pic-blank.trycloudflare.com";

  // ✅ Real-time internet connection listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected === false) {
        Alert.alert(
          "No Internet Connection",
          "Maptiva requires an active internet or mobile data connection to log in. Please check your network settings.",
          [{ text: "OK" }],
          { cancelable: false } // Forces user interaction, cannot tap away to close
        );
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    // Extra security check: stop execution early if offline when pressing the login button
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      Alert.alert("Error", "No internet connection. Unable to send login request.");
      return;
    }

    if (!studentId || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true" 
        },
        body: JSON.stringify({ student_id: studentId, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("user", JSON.stringify({
          name: data.name,
          id: data.id,          
          student_id: data.student_id,  
        }));

        Alert.alert("Success", "Login successful");
        router.push("../home");
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
      }
    } catch (error) {
      console.log("Login network request error:", error);
      Alert.alert("Error", "Cannot connect to server");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />

      <View style={styles.tab}>
        <Text style={styles.tabText}>Student</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.title}>Log In</Text>

        {/* ✅ Updated: Changed placeholder to LRN, enabled number-pad, and limited input length */}
        <TextInput
          style={styles.input}
          placeholder="Enter 12-Digit LRN"
          placeholderTextColor="#9AA0A6"
          value={studentId}
          onChangeText={setStudentId}
          keyboardType="number-pad"
          maxLength={12}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#9AA0A6"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* ✅ Added Forgot Password Anchor Link Trigger Element */}
        <TouchableOpacity 
          style={styles.forgotPasswordContainer} 
          onPress={() => router.push("../auth/forgot-password")}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Don't have an account?{" "}
          <Text style={styles.link} onPress={() => router.push("../auth/signup")}>
            Sign up.
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1A2F",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },
  tab: {
    backgroundColor: "#1E4D4D",
    paddingVertical: 6,
    paddingHorizontal: 40,
    borderRadius: 6,
    marginBottom: 15,
  },
  tabText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  box: {
    backgroundColor: "#132C47",
    width: "80%",
    paddingVertical: 25,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#2A3E5C",
    color: "#fff",
    width: "80%",
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginRight: "12%",
    marginBottom: 10,
    marginTop: 2,
  },
  forgotPasswordText: {
    color: "#00E0B0",
    fontSize: 13,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  loginButton: {
    backgroundColor: "#00E0B0",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 50,
    marginTop: 10,
  },
  loginText: {
    color: "#0A1A2F",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    color: "#fff",
    marginTop: 15,
  },
  link: {
    color: "#00E0B0",
    fontWeight: "bold",
  },
});