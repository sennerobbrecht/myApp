import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Dashboard from "../components/Dashboard";
import Nav, { TabOption } from "../components/Nav";
import OverlayButton from "../components/OverlayButton";
import Routines from "../components/Routines"; // Import the new component

export default function Index() {
  const [isDashboardVisible, setDashboardVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<TabOption>("Routines");

  const toggleDashboard = () => {
    setDashboardVisible(!isDashboardVisible);
  };

  return (
    <View style={{ flex: 1 }}>
      <OverlayButton
        title="Dashboard"
        onPress={toggleDashboard}
        isOpen={isDashboardVisible}
      />

      <Dashboard visible={isDashboardVisible}>
        {/* Nav is now the header */}
        <Nav activeTab={activeTab} onTabSelect={setActiveTab} />

        {/* Content Area */}
        <View style={styles.content}>
          {activeTab === "Routines" && <Routines />}
          {/* Add placeholders for other tabs if needed */}
        </View>
      </Dashboard>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginTop: 10,
  },
});
