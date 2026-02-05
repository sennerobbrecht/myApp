import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Dashboard from "../components/Dashboard";
import Monster3D from "../components/Monster3D";
import Nav, { TabOption } from "../components/Nav";
import OverlayButton from "../components/OverlayButton";
import Routines from "../components/Routines";
import Focus from "../components/Focus";
import MoodTracker from "../components/MoodTracker";

// XP required per level (temporary constant)
const XP_PER_LEVEL = 100;

export default function Index() {
  const [isDashboardVisible, setDashboardVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<TabOption>("Routines");

  // ⭐ XP STATE
  const [level, setLevel] = useState(1);
  const [currentXP, setCurrentXP] = useState(0);

  // ➕ XP + LEVEL UP LOGICA
  const addXP = (xp: number) => {
    setCurrentXP((prevXP) => {
      let totalXP = prevXP + xp;
      let levelsGained = Math.floor(totalXP / XP_PER_LEVEL);

      if (levelsGained > 0) {
        setLevel((prev) => prev + levelsGained);
        totalXP = totalXP % XP_PER_LEVEL;
      }

      return totalXP;
    });
  };

  return (
    <View style={styles.root}>
      {/* 🧌 3D MONSTER = BASISLAAG (HOMESCREEN) */}

      {/* 🔘 DASHBOARD KNOP (OVERLAY) */}
      <View style={styles.overlay}>
        <OverlayButton
          title="Dashboard"
          onPress={() => setDashboardVisible(!isDashboardVisible)}
          isOpen={isDashboardVisible}
        />
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
    left: 0,
    right: 0,
    zIndex: 10,
  },
  dashboardContent: {
    flex: 1,
  },
});
