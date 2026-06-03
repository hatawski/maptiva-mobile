import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#00b894",   // Your signature emerald green
        tabBarInactiveTintColor: "#b2bec3", // Muted slate gray
        tabBarStyle: {
          backgroundColor: "#062743",       // Dark dashboard card color
          borderTopWidth: 0,
          elevation: 8,
          height: 60,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}