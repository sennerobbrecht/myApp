import { useState } from "react";
import { View } from "react-native";
import Dashboard from "../components/Dashboard";
import Nav, { TabOption } from "../components/Nav"; // 1. Import TabOption
import OverlayButton from "../components/OverlayButton";

export default function Index() {
  const [isDashboardVisible, setDashboardVisible] = useState(false);
  // 2. Add state to track the active tab
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
        {/* 3. Pass the required props to Nav */}
        <Nav activeTab={activeTab} onTabSelect={setActiveTab} />
      </Dashboard>
    </View>
  );
}
