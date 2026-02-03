import { useState } from "react";
import { View, StyleSheet } from "react-native";

import Dashboard from "../components/Dashboard";
import Nav, { TabOption } from "../components/Nav";
import OverlayButton from "../components/OverlayButton";
import Routines from "../components/Routines";
import Monster3D from "../components/Monster3D";

export default function Index() {
  const [isDashboardVisible, setDashboardVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<TabOption>("Routines");

  return (
    <View style={styles.root}>

      {/* 🧌 3D MONSTER = BASISLAAG (HOMESCREEN) */}
      <Monster3D />

      {/* 🔘 DASHBOARD KNOP (OVERLAY) */}
      <View style={styles.overlay}>
        <OverlayButton
          title="Dashboard"
          onPress={() => setDashboardVisible(!isDashboardVisible)}
          isOpen={isDashboardVisible}
        />
      </View>

      {/* 📊 DASHBOARD OVERLAY */}
      <Dashboard visible={isDashboardVisible}>
        <Nav
          activeTab={activeTab}
          onTabSelect={setActiveTab}
        />

        <View style={styles.dashboardContent}>
          {activeTab === "Routines" && <Routines />}
        </View>
      </Dashboard>

    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  // UI die boven het monster ligt
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10, // ✅ Android-proof
  },

  dashboardContent: {
    flex: 1,
  },
}); 
