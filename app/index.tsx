import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Dashboard from "../components/Dashboard";
import Focus from "../components/Focus";
import Monster3D from "../components/Monster3D";
import MoodTracker from "../components/MoodTracker";
import Nav, { TabOption } from "../components/Nav";
import OverlayButton from "../components/OverlayButton";
import Routines from "../components/Routines";
import XPBar from "../components/XpBar";

// XP required per level (temporary constant)
const XP_PER_LEVEL = 100;

export default function Index() {
  const [isDashboardVisible, setDashboardVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<TabOption>("Routines");

  // ⭐ XP STATE
  const [level, setLevel] = useState(1);
  const [currentXP, setCurrentXP] = useState(0);

  // ➕ XP + LEVEL UP / DOWN LOGIC
  const addXP = (amount: number) => {
    // We use current state values (level, currentXP) from the closure.
    // Since this function is recreated on every render, they likely match the current UI.
    let newLevel = level;
    let newXP = currentXP + amount;

    // Handle Level Up
    while (newXP >= XP_PER_LEVEL) {
      newXP -= XP_PER_LEVEL;
      newLevel++;
    }

    // Handle Level Down
    while (newXP < 0) {
      if (newLevel > 1) {
        newXP += XP_PER_LEVEL;
        newLevel--;
      } else {
        newXP = 0; // Cap at 0 for level 1
        break;
      }
    }

    setLevel(newLevel);
    setCurrentXP(newXP);
  };

  return (
    <View style={styles.root}>
      {/* 🧌 3D MONSTER = BASISLAAG (HOMESCREEN) */}
      <View style={styles.overlay}>
        {/* 🔘 DASHBOARD KNOP (OVERLAY) */}
        <OverlayButton
          title="Dashboard"
          onPress={() => setDashboardVisible(!isDashboardVisible)}
          isOpen={isDashboardVisible}
        />

        {/* ⭐ XP BAR (Only visible if dashboard is closed) */}
        {!isDashboardVisible && (
          <View style={styles.xpContainer}>
            <XPBar level={level} currentXP={currentXP} maxXP={XP_PER_LEVEL} />
          </View>
        )}
      </View>

      <Monster3D />

      {/* 📊 DASHBOARD OVERLAY */}
      <Dashboard visible={isDashboardVisible}>
        <Nav activeTab={activeTab} onTabSelect={setActiveTab} />

        <View style={styles.dashboardContent}>
          {activeTab === "Routines" && <Routines onGainXP={addXP} />}
          {activeTab === "Focus Mode" && <Focus />}
          {activeTab === "Mood Tracker" && <MoodTracker />}
        </View>
      </Dashboard>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    zIndex: 10,
    alignItems: "center", // Center the items
  },
  xpContainer: {
    marginTop: 10,
    width: "100%",
  },
  dashboardContent: {
    flex: 1,
  },
});
