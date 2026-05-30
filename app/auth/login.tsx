import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");

  const API_URL = "https://maptiva-backend.onrender.com";

  const handleLogin = async () => {
  if (!studentId || !password) {
    Alert.alert("Error", "Please fill in all fields");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id: studentId, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Save correct info in AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify({
  name: data.name,
  id: data.id,          // ← integer id for database relations
  student_id: data.student_id,  // ← student number for display
}));

      Alert.alert("Success", "Login successful");
      router.push("../home");
    } else {
      Alert.alert("Login Failed", data.message);
    }
  } catch (error) {
    console.log("Login error:", error);
    Alert.alert("Error", "Cannot connect to server");
  }
};

  return (
    <View style={styles.container}>
      <Image source={require("./assets/images/logo.png")} style={styles.logo} resizeMode="contain" />

      <View style={styles.tab}>
        <Text style={styles.tabText}>Student</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.title}>Log In</Text>

        <TextInput
          style={styles.input}
          placeholder="Student ID"
          placeholderTextColor="#9AA0A6"
          value={studentId}
          onChangeText={setStudentId}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#9AA0A6"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

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