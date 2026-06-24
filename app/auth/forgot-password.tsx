import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "https://nav-reflected-pic-blank.trycloudflare.com";

  // Step 1: Tell Flask to email an OTP pin code
  const handleRequestOtp = async () => {
    if (!email) {
      Alert.alert("Error", "Please provide your email address.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      Alert.alert("Verification", data.message);
      if (response.ok) setStep(2);
    } catch (error) {
      Alert.alert("Network Error", "Cannot reach recovery server.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Validate OTP and save new password
  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all recovery fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
        body: JSON.stringify({ email, otp, new_password: newPassword }),
      });
      const data = await response.json();
      Alert.alert("System Sync", data.message);
      if (response.ok) {
        router.push("../auth/login"); // Redirect back to login screen on pass
      }
    } catch (error) {
      Alert.alert("Network Error", "Password modification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formBox}>
        <Text style={styles.title}>Account Recovery</Text>

        {step === 1 ? (
          <View>
            <Text style={styles.infoText}>Enter your registered email address to receive a 6-digit verification pin.</Text>
            <TextInput
              placeholder="School Email Address"
              placeholderTextColor="#b0b0b0"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity style={styles.button} onPress={handleRequestOtp} disabled={loading}>
              {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Send Code</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={styles.infoText}>Enter the code sent to {email} along with your new account password choice.</Text>
            <TextInput
              placeholder="6-Digit OTP Code"
              placeholderTextColor="#b0b0b0"
              keyboardType="number-pad"
              maxLength={6}
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
            />
            <TextInput
              placeholder="New Password"
              placeholderTextColor="#b0b0b0"
              secureTextEntry
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              placeholder="Confirm New Password"
              placeholderTextColor="#b0b0b0"
              secureTextEntry
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
              {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Update Password</Text>}
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setStep(1)} style={{ marginTop: 15 }}>
              <Text style={[styles.link, { textAlign: 'center' }]}>Back to step 1</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.signupText}>
          Remember your details?{" "}
          <Text style={styles.link} onPress={() => router.push("../auth/login")}>Login.</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#06182d", alignItems: "center", justifyContent: "center" },
  formBox: { backgroundColor: "#0b2a4a", padding: 20, borderRadius: 10, width: "85%", shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 10, elevation: 10 },
  title: { color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  infoText: { color: "#b0b0b0", fontSize: 13, textAlign: "center", marginBottom: 15, lineHeight: 18 },
  input: { backgroundColor: "#1c3b5c", color: "#fff", padding: 10, borderRadius: 20, marginBottom: 15, textAlign: "center" },
  button: { backgroundColor: "#18d6b3", padding: 12, borderRadius: 20, alignItems: "center", marginTop: 5 },
  buttonText: { color: "#000", fontWeight: "bold" },
  signupText: { color: "#fff", textAlign: "center", marginTop: 20 },
  link: { color: "#18d6b3", fontWeight: "bold" },
});