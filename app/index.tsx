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
import Car from "../components/CustomizeCar";

const XP_PER_LEVEL = 100;

export default function Index() {
  const [isDashboardVisible, setDashboardVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<TabOption>("Routines");

  const [level, setLevel] = useState(1);
  const [currentXP, setCurrentXP] = useState(0);

  const addXP = (amount: number) => {
    let newLevel = level;
    let newXP = currentXP + amount;

    while (newXP >= XP_PER_LEVEL) {
      newXP -= XP_PER_LEVEL;
      newLevel++;
    }

    while (newXP < 0) {
      if (newLevel > 1) {
        newXP += XP_PER_LEVEL;
        newLevel--;
      } else {
        newXP = 0;
        break;
      }
    }

    setLevel(newLevel);
    setCurrentXP(newXP);
  };

  return (
    <View style={styles.root}>
      {/* 🧌 Monster */}
      <Monster3D />

      {/* ⭐ XP BAR */}
      {!isDashboardVisible && (
        <View style={styles.xpContainer}>
          <XPBar
            level={level}
            currentXP={currentXP}
            maxXP={XP_PER_LEVEL}
          />
        </View>
      )}

      {/* 🚗 CARROUSEL VOLLEDIG ONDERAAN */}
      {!isDashboardVisible && (
        <View style={styles.carouselContainer}>
         <Car level={level} />

        </View>
      )}

      {/* 🔘 Dashboard knop bovenaan */}
      <View style={styles.topOverlay}>
        <OverlayButton
          title="Dashboard"
          onPress={() => setDashboardVisible(!isDashboardVisible)}
          isOpen={isDashboardVisible}
        />
      </View>

      {/* 📊 Dashboard */}
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

  topOverlay: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    zIndex: 20,
    alignItems: "center",
  },


  xpContainer: {
    position: "absolute",
    bottom: 140,
    left: 20,
    right: 20,
  },

  
  carouselContainer: {
    position: "absolute",
    top: 120, 
    left: 0,
    right: 0,
  },

  dashboardContent: {
    flex: 1,
  },
});
