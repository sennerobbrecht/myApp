import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Temporary placeholder for Monster3D to avoid 3D/GL errors while
// the rest of the app is being developed. Replace with the real
// 3D component when dependencies are ready.
export default function Monster3D() {
  // Render an empty placeholder with the same size so layout remains
  // but avoid displaying the "disabled" text.
  return <View style={styles.container} pointerEvents="none" />;
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#888",
  },
});
