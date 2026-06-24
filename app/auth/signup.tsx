import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";

export default function SignupScreen() {
  const [fullname, setFullname] = useState("");
  const [studentId, setStudentId] = useState(""); // Holds the 12-digit LRN
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const router = useRouter();

  const API_URL = "https://nav-reflected-pic-blank.trycloudflare.com";

  const handleSignup = async () => {
    // ✅ Updated Pattern: Validates exactly 12 numeric digits for standard LRN
    const lrnPattern = /^\d{12}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

    if (!fullname || !studentId || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    // ✅ Updated validation logic to enforce the 12-digit LRN
    if (!lrnPattern.test(studentId)) {
      Alert.alert("Error", "LRN must be exactly 12 digits (e.g., 102345678901)");
      return;
    }
    if (!emailPattern.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true" 
        },
        body: JSON.stringify({
          name: fullname,
          student_id: studentId, // Payload key remains 'student_id' for backend safety
          email, 
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Account created successfully!", [
          {
            text: "OK",
            onPress: () => router.push("../auth/login") 
          }
        ]);
      } else {
        Alert.alert("Signup Failed", data.message || "Account creation failed");
      }
    } catch (error) {
      console.log("Signup network request error:", error);
      Alert.alert("Error", "Cannot connect to server");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
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
        
        {/* ✅ Updated: Uses LRN placeholder, restricts typing to 12 digits, and triggers phone number pad */}
        <TextInput
          placeholder="12-Digit LRN"
          placeholderTextColor="#b0b0b0"
          style={styles.input}
          value={studentId}
          onChangeText={setStudentId}
          keyboardType="number-pad"
          maxLength={12}
        />

        <TextInput
          placeholder="School Email Address"
          placeholderTextColor="#b0b0b0"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
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
          </Text> 
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#06182d", alignItems: "center", justifyContent: "center" },
  logo: { width: 100, height: 100, marginBottom: 20 },
  headerBox: { backgroundColor: "#135c5a", paddingVertical: 8, paddingHorizontal: 40, borderRadius: 5, marginBottom: 10 },
  headerText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  formBox: { backgroundColor: "#0b2a4a", padding: 20, borderRadius: 10, width: "80%", shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 10, elevation: 10 },
  title: { color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { backgroundColor: "#1c3b5c", color: "#fff", padding: 10, borderRadius: 20, marginBottom: 15, textAlign: "center" },
  button: { backgroundColor: "#18d6b3", padding: 10, borderRadius: 20, alignItems: "center" },
  buttonText: { color: "#000", fontWeight: "bold" },
  signupText: { color: "#fff", textAlign: "center", marginTop: 10 },
  link: { color: "#18d6b3", fontWeight: "bold" },
});