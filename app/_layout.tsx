import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Auth screens */}
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/signup" />

      {/* Scanner screens */}
      <Stack.Screen name="scanner/loginScanner" />
      <Stack.Screen name="scanner/checkinScanner" />
      <Stack.Screen name="scanner/checkinLoading" />
      <Stack.Screen name="scanner/checkinSuccess" />

      {/* Other screens */}
      <Stack.Screen name="home" />
      <Stack.Screen name="homeChecked" />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="report" />
      <Stack.Screen name="aboutus" />
      
    </Stack>
  );
}
