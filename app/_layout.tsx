import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Dynamic folder groups */}
      <Stack.Screen name="auth" />
      <Stack.Screen name="(tabs)" />

      {/* Main Full-Screen pages */}
      <Stack.Screen name="homeChecked" />
      <Stack.Screen name="report" />
      
      {/* Seamless Slide-up Bottom Sheets */}
      <Stack.Screen 
        name="settings" 
        options={{ 
          presentation: "transparentModal",
          animation: "slide_from_bottom" 
        }} 
      />
    </Stack>
  );
}