import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Dashboard from "../components/Dashboard";
import Monster3D from "../components/Monster3D";
import Nav, { TabOption } from "../components/Nav";
import OverlayButton from "../components/OverlayButton";
import Routines from "../components/Routines";
<<<<<<< HEAD
=======
import XPBar from "../components/XpBar";

const XP_PER_LEVEL = 100;
>>>>>>> origin/xp-bar

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
<<<<<<< HEAD
      {/* 🧌 3D MONSTER = BASISLAAG (HOMESCREEN) */}

      {/* 🔘 DASHBOARD KNOP (OVERLAY) */}
=======
      {/* 🔘 DASHBOARD KNOP */}
>>>>>>> origin/xp-bar
      <View style={styles.overlay}>
        <OverlayButton
          title="Dashboard"
          onPress={() => setDashboardVisible(!isDashboardVisible)}
          isOpen={isDashboardVisible}
        />
      </View>

<<<<<<< HEAD
      <Monster3D />

      {/* 📊 DASHBOARD OVERLAY */}
=======
      {/* 📊 DASHBOARD */}
>>>>>>> origin/xp-bar
      <Dashboard visible={isDashboardVisible}>
        <Nav activeTab={activeTab} onTabSelect={setActiveTab} />

        <View style={styles.dashboardContent}>
          {activeTab === "Routines" && (
            <Routines onGainXP={addXP} />
          )}
        </View>
      </Dashboard>
<<<<<<< HEAD
=======

      {/* ⭐ XP BAR (alleen als dashboard dicht is) */}
      {!isDashboardVisible && (
        <View style={styles.xpOverlay}>
          <XPBar
            level={level}
            currentXP={currentXP}
            maxXP={XP_PER_LEVEL}
          />
        </View>
      )}
>>>>>>> origin/xp-bar
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
<<<<<<< HEAD
=======
  xpOverlay: {
    position: "absolute",
    bottom: 650,
    left: 20,
    right: 20,
    zIndex: 20,
  },
>>>>>>> origin/xp-bar
});
