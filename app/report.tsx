import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "http://50.0.14.185:5000";

export default function ReportPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const checkedIn = params.checked === "true";

  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!report.trim()) {
      Alert.alert("Error", "Please enter a message first.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Securely load persistent student metadata
      const storedUser = await AsyncStorage.getItem("user");
      const parsed = JSON.parse(storedUser || "{}");

      if (!parsed?.id) {
        Alert.alert("Authentication Error", "You must be logged in to submit a report.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          student_id: parsed.id,
          message: report.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", "Report submitted successfully!");
        setReport("");
        
        // ✅ Absolute path replacements to isolate state histories
        if (checkedIn) {
          router.replace("/homeChecked");
        } else {
          router.replace("/home");
        }
      } else {
        Alert.alert("Submission Failed", data.message || "Failed to submit report");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Network Error", "Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (checkedIn) {
      router.replace("/homeChecked");
    } else {
      router.replace("/home");
    }
  };

  return (
    <View style={styles.container}>
      {/* Absolute Back Escape Navigation Row */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back-outline" size={28} color="#00b894" />
      </TouchableOpacity>

      <View style={styles.card}>
        <Ionicons name="warning-outline" size={40} color="#e74c3c" style={{ marginBottom: 8 }} />
        <Text style={styles.title}>Report an Issue</Text>
        <Text style={styles.subtitle}>What went wrong with the workstation?</Text>

        <TextInput
          style={styles.input}
          placeholder="In your own words, help us understand what went wrong (hardware defect, locked screen, power issue)..."
          placeholderTextColor="#758283"
          multiline
          numberOfLines={4}
          value={report}
          onChangeText={setReport}
        />

        <TouchableOpacity
          style={[styles.button, (loading || !report.trim()) && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading || !report.trim()}
        >
          <Text style={styles.buttonText}>
            {loading ? "Submitting..." : "Submit Report"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#041C32", // Syncs seamlessly with global theme canvas
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20, // Shifted to left position matching standard UX designs
    zIndex: 10,
    padding: 5,
  },
  card: {
    backgroundColor: "#062743",
    width: "85%",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    alignItems: "center",
    elevation: 6
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    color: "#b2bec3",
    fontSize: 14,
    marginTop: 6,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#132C47",
    borderRadius: 12,
    color: "#fff",
    padding: 14,
    minHeight: 120,
    textAlignVertical: "top",
    width: "100%",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#00b894",
    borderRadius: 25,
    marginTop: 20,
    paddingVertical: 12,
    alignItems: "center",
    width: "100%",
  },
  disabledButton: {
    opacity: 0.4,
    backgroundColor: "#758283"
  },
  buttonText: {
    color: "#041C32",
    fontSize: 16,
    fontWeight: "bold",
  },
});