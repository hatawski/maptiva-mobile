import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "https://maptiva-backend.onrender.com";

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

      // ✅ Get logged in user
      const storedUser = await AsyncStorage.getItem("user");
      console.log("stored user:", storedUser); // check what's stored
      const parsed = JSON.parse(storedUser || "{}");

      if (!parsed?.id) {
        Alert.alert("Error", "You must be logged in to submit a report.");
        setLoading(false);
        return;
      }

      // ✅ Single fetch call only
      const res = await fetch(`${API_BASE}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({
          student_id: parsed.id,
          message: report,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", "Report submitted successfully!");
        setReport("");
        if (checkedIn) {
          router.push(".../homeChecked");
        } else {
          router.push(".../home");
        }
      } else {
        Alert.alert("Failed", data.message || "Failed to submit report");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (checkedIn) {
      router.push(".../homeChecked");
    } else {
      router.push(".../home");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back-outline" size={28} color="#00ADEF" />
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.title}>Report</Text>
        <Text style={styles.subtitle}>What went wrong?</Text>

        <TextInput
          style={styles.input}
          placeholder="In your own words, help us understand what went wrong."
          placeholderTextColor="#777"
          multiline
          value={report}
          onChangeText={setReport}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Submitting..." : "Submit"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00131A",
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 5,
  },
  card: {
    backgroundColor: "#0D1C22",
    width: "85%",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    alignItems: "center",
  },
  icon: {
    fontSize: 28,
    color: "#00ADEF",
    alignSelf: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    color: "#bbb",
    marginTop: 8,
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#0F2C35",
    borderRadius: 12,
    color: "#fff",
    padding: 12,
    minHeight: 90,
    textAlignVertical: "top",
    width: "100%",
  },
  button: {
    backgroundColor: "#00B7A8",
    borderRadius: 10,
    marginTop: 20,
    paddingVertical: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});