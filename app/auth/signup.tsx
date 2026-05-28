import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignupScreen() {
  const [fullname, setFullname] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const API_URL = "https://maptiva-backend.onrender.com";

  const handleSignup = async () => {
    // Validate
    const studentIdPattern = /^CA\d+$/;
    if (!fullname || !studentId || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (!studentIdPattern.test(studentId)) {
      Alert.alert("Error", "Student ID must start with CA followed by numbers (e.g., CA202208460)");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
         },
        body: JSON.stringify({
          name: fullname,
          student_id: studentId,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
  Alert.alert("Success", "Account created successfully!", [
    {
      text: "OK",
      onPress: () => router.push("../auth/login") // ← go to login instead of home
    }
  ]);
}
      else {
        Alert.alert("Signup Failed", data.message || "Account creation failed");
      }
    } catch (error) {
      console.log("Signup error:", error);
      Alert.alert("Error", "Cannot connect to server");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/image.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.headerBox}>
        <Text style={styles.headerText}>Student</Text>
      </View>
      <View style={styles.formBox}>
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          placeholder="Full name"
          placeholderTextColor="#b0b0b0"
          style={styles.input}
          value={fullname}
          onChangeText={setFullname}
        />
        <TextInput
          placeholder="Student ID"
          placeholderTextColor="#b0b0b0"
          style={styles.input}
          value={studentId}
          onChangeText={setStudentId}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#b0b0b0"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}> Have an account?{" "} 
          <Text style={styles.link} onPress={() => router.push("../auth/login")} > Login. 
            </Text> </Text>
      </View>
    </View>
  );
}

// === KEEP YOUR ORIGINAL DESIGN STYLES ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#06182d",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  headerBox: {
    backgroundColor: "#135c5a",
    paddingVertical: 8,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginBottom: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  formBox: {
    backgroundColor: "#0b2a4a",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#1c3b5c",
    color: "#fff",
    padding: 10,
    borderRadius: 20,
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#18d6b3",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },
  signupText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
  link: {
    color: "#18d6b3",
    fontWeight: "bold",
  },
});