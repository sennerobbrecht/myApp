import { useState } from "react";
import { Text, View } from "react-native";
import Dashboard from "../components/Dashboard";
import OverlayButton from "../components/OverlayButton";

export default function Index() {
  const [isDashboardVisible, setDashboardVisible] = useState(false);

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

      {/* FIXED: Removed 'onClose' as it is not a valid prop for Dashboard */}
      <Dashboard visible={isDashboardVisible}>
        <Text>Dashboard</Text>
      </Dashboard>
    </View>
  );
}
