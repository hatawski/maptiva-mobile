import React, { useState, useRef } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, ScrollView, Image, SafeAreaView
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: 0,
    type: "welcome",
  },
  {
    id: 1,
    type: "slide",
    description: "Align your camera to the\nQR code to scan",
    mockScreen: "scanner",
  },
  {
    id: 2,
    type: "slide",
    description: "Wait for the confirmation\nthat you're checked in",
    mockScreen: "checkin",
  },
  {
    id: 3,
    type: "slide",
    description: "Check out if session is\ndone!",
    mockScreen: "checkout",
    isLast: true,
  },
];

function MockScanner() {
  return (
    <View style={mock.container}>
      <Text style={mock.title}>MAPTIVA</Text>
      <Text style={mock.subtitle}>QR Scanner</Text>
      <View style={mock.frame}>
        <View style={[mock.corner, { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 }]} />
        <View style={[mock.corner, { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 }]} />
        <View style={[mock.corner, { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 }]} />
        <View style={[mock.corner, { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 }]} />
      </View>
      <View style={mock.bottomBar}>
        <Ionicons name="help-circle-outline" size={20} color="#fff" />
        <View style={mock.qrBtn}>
          <Ionicons name="qr-code-outline" size={24} color="#fff" />
        </View>
        <Ionicons name="menu" size={20} color="#fff" />
      </View>
    </View>
  );
}

function MockCheckin() {
  return (
    <View style={mock.container}>
      <Text style={mock.title}>MAPTIVA</Text>
      <View style={mock.checkinCard}>
        <View style={mock.checkCircle}>
          <Ionicons name="checkmark" size={28} color="#00b894" />
        </View>
        <Text style={mock.checkinTitle}>CHECK-IN{"\n"}SUCCESSFUL</Text>
        <Text style={mock.pcText}>PC - 16</Text>
        <TouchableOpacity style={mock.goBackBtn}>
          <Text style={mock.goBackText}>Go back</Text>
        </TouchableOpacity>
      </View>
      <View style={mock.bottomBar}>
        <Ionicons name="help-circle-outline" size={20} color="#fff" />
        <View style={mock.qrBtn}>
          <Ionicons name="qr-code-outline" size={24} color="#fff" />
        </View>
        <Ionicons name="menu" size={20} color="#fff" />
      </View>
    </View>
  );
}

function MockCheckout() {
  return (
    <View style={mock.container}>
      <Text style={mock.title}>MAPTIVA</Text>
      <View style={mock.checkoutCard}>
        <View style={mock.logoCircle}>
          <Text style={mock.logoText}>M</Text>
        </View>
        <Text style={mock.checkinTimeText}>Checked in at 5:05 AM{"\n"}September 7, 2025</Text>
        <TouchableOpacity style={mock.checkoutBtn}>
          <Text style={mock.checkoutBtnText}>Check Out</Text>
        </TouchableOpacity>
      </View>
      <View style={mock.bottomBar}>
        <Ionicons name="help-circle-outline" size={20} color="#fff" />
        <View style={mock.qrBtn}>
          <Ionicons name="qr-code-outline" size={24} color="#fff" />
        </View>
        <Ionicons name="menu" size={20} color="#fff" />
      </View>
    </View>
  );
}

export default function TutorialScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      const next = currentSlide + 1;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      setCurrentSlide(next);
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem("tutorial_done", "true");
    router.replace("/home");
  };

  const handleDone = async () => {
    await AsyncStorage.setItem("tutorial_done", "true");
    router.replace("/home");
  };

  const handleScroll = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentSlide(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {/* SLIDE 0 — Welcome */}
        <View style={[styles.slide, { width }]}>
          <View style={styles.welcomeContent}>
            <View style={styles.logoCircleBig}>
              <Text style={styles.logoLetterBig}>M</Text>
              <Text style={styles.logoLetterA}>A</Text>
            </View>
            <Text style={styles.welcomeApp}>MAPTIVA</Text>
            <Text style={styles.welcomeTitle}>Welcome to{"\n"}
              <Text style={styles.welcomeTitleGreen}>MAPTIVA</Text>
            </Text>
            <Text style={styles.welcomeSubtitle}>
              Smart and easy computer{"\n"}seat lab
            </Text>
          </View>
          <TouchableOpacity style={styles.startBtn} onPress={handleNext}>
            <Text style={styles.startBtnText}>Start tutorial</Text>
          </TouchableOpacity>
        </View>

        {/* SLIDES 1-3 */}
        {slides.slice(1).map((slide, i) => (
          <View key={slide.id} style={[styles.slide, { width }]}>
            {/* Phone mockup */}
            <View style={styles.phoneMockup}>
              <View style={styles.phoneNotch} />
              {slide.mockScreen === "scanner" && <MockScanner />}
              {slide.mockScreen === "checkin" && <MockCheckin />}
              {slide.mockScreen === "checkout" && <MockCheckout />}
            </View>

            {/* Description */}
            <Text style={styles.slideDesc}>{slide.description}</Text>

            {/* Button */}
            {slide.isLast ? (
              <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
                <Text style={styles.doneBtnText}>Done</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
                <Text style={styles.skipBtnText}>Skip</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Dot indicators */}
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              currentSlide === i && styles.dotActive
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const mock = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#062743",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  title: { color: "#00d4a0", fontSize: 13, fontWeight: "bold", letterSpacing: 1 },
  subtitle: { color: "#b2bec3", fontSize: 10, marginTop: 2 },
  frame: {
    width: 100,
    height: 100,
    position: "relative",
    marginVertical: 10,
  },
  corner: {
    position: "absolute",
    width: 16,
    height: 16,
    borderColor: "#00d4a0",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#00b894",
    width: "100%",
    paddingVertical: 8,
    borderRadius: 10,
  },
  qrBtn: {
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 20,
    marginTop: -10,
  },
  checkinCard: {
    backgroundColor: "#0d2137",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 6,
    width: "90%",
  },
  checkCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#00b894",
    justifyContent: "center",
    alignItems: "center",
  },
  checkinTitle: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  pcText: { color: "#00d4a0", fontSize: 14, fontWeight: "bold" },
  goBackBtn: {
    borderWidth: 1,
    borderColor: "#b2bec3",
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 14,
  },
  goBackText: { color: "#b2bec3", fontSize: 10 },
  checkoutCard: {
    backgroundColor: "#0d2137",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 8,
    width: "90%",
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#00b894",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: { color: "white", fontSize: 24, fontWeight: "bold" },
  checkinTimeText: {
    color: "#b2bec3",
    fontSize: 9,
    textAlign: "center",
  },
  checkoutBtn: {
    backgroundColor: "#e74c3c",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 20,
  },
  checkoutBtnText: { color: "white", fontSize: 10, fontWeight: "bold" },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#041C32",
  },
  slide: {
    height: height,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingBottom: 80,
  },
  welcomeContent: {
    alignItems: "center",
    gap: 12,
    marginBottom: 40,
  },
  logoCircleBig: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  logoLetterBig: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#00b894",
    lineHeight: 80,
  },
  logoLetterA: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#1a8a7a",
    lineHeight: 70,
    marginLeft: -8,
  },
  welcomeApp: {
    fontSize: 14,
    color: "#00d4a0",
    letterSpacing: 3,
    fontWeight: "bold",
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    lineHeight: 36,
  },
  welcomeTitleGreen: {
    color: "#00d4a0",
    fontSize: 28,
    fontWeight: "bold",
  },
  welcomeSubtitle: {
    color: "#b2bec3",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  startBtn: {
    borderWidth: 1.5,
    borderColor: "white",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  startBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  phoneMockup: {
    width: width * 0.55,
    height: height * 0.45,
    backgroundColor: "#000",
    borderRadius: 36,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#1a3a5c",
    marginBottom: 30,
    padding: 4,
  },
  phoneNotch: {
    width: 60,
    height: 8,
    backgroundColor: "#000",
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: 4,
  },
  slideDesc: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 24,
    fontWeight: "500",
  },
  skipBtn: {
    backgroundColor: "#1a4a7a",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  skipBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  doneBtn: {
    backgroundColor: "#1a4a7a",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  doneBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  dotActive: {
    backgroundColor: "#00d4a0",
    width: 20,
  },
});