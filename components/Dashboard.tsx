import React, { useEffect } from "react";
import {
    LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
    UIManager,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Enable animations on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface DashboardProps {
  visible: boolean;
  onClose: () => void;
}

export default function Dashboard({ visible, onClose }: DashboardProps) {
  // This triggers the "Slide" animation whenever 'visible' changes
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [visible]);

  const insets = useSafeAreaInsets();
  // If not visible, we return null so it renders nothing (and collapses)
  if (!visible) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* The Dashboard Content */}
      <View style={styles.window}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.text}>I am sliding out from the button!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // This allows the view to sit nicely in the layout
    flex: 1,
    alignItems: "center",
    width: "100%",
    marginTop: 10, // Small gap between button and dashboard
  },
  window: {
    flex: 1,
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    // Shadows for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  text: {
    textAlign: "center",
    marginBottom: 20,
  },
});
