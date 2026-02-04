import { View, Text, StyleSheet } from "react-native";

type XPBarProps = {
  level: number;
  currentXP: number;
  maxXP: number;
};

export default function XPBar({ level, currentXP, maxXP }: XPBarProps) {
  const progress = Math.min(currentXP / maxXP, 1) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.level}>Level {level}</Text>
        <Text style={styles.xpText}>
          {currentXP} / {maxXP} XP
        </Text>
      </View>

      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  level: {
    fontWeight: "700",
    fontSize: 16,
  },

  xpText: {
    fontSize: 14,
    color: "#555",
  },

  barBackground: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    backgroundColor: "#555",
  },
});
