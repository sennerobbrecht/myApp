import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type TabOption = "Mood Tracker" | "Routines" | "Focus Mode";

interface NavProps {
  activeTab: TabOption;
  onTabSelect: (tab: TabOption) => void;
}

export default function Nav({ activeTab, onTabSelect }: NavProps) {
  // Removed safe area insets since this is now inside the dashboard content flow

  const tabs: { name: TabOption; icon: keyof typeof Ionicons.glyphMap }[] = [
    { name: "Focus Mode", icon: "scan-outline" },
    { name: "Routines", icon: "list-outline" },
    { name: "Mood Tracker", icon: "happy-outline" },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        // Switch to filled icon if active (stripping '-outline')
        const iconName = isActive
          ? (tab.icon.replace("-outline", "") as keyof typeof Ionicons.glyphMap)
          : tab.icon;

        return (
          <TouchableOpacity
            key={tab.name}
            style={[
              styles.pill,
              isActive ? styles.pillActive : styles.pillInactive,
            ]}
            onPress={() => onTabSelect(tab.name)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={iconName}
              size={18}
              color={isActive ? "#fff" : "#666"}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.label,
                {
                  color: isActive ? "#fff" : "#666",
                  fontWeight: isActive ? "600" : "500",
                },
              ]}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between", // Distribute pills evenly or use 'center'
    alignItems: "center",
    paddingVertical: 10,
    gap: 8, // Adds space between pills (React Native 0.71+)
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30, // Makes it a pill shape
    flex: 1, // Ensures they share the width roughly equally
  },
  pillActive: {
    backgroundColor: "#000",
  },
  pillInactive: {
    backgroundColor: "#F0F0F0", // Light grey for inactive
  },
  label: {
    fontSize: 12,
  },
});
