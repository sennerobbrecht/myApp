import { useState } from "react";
import { View } from "react-native";
import Dashboard from "../components/Dashboard";
import OverlayButton from "../components/OverlayButton";

export default function Index() {
  const [isDashboardVisible, setDashboardVisible] = useState(false);

  const toggleDashboard = () => {
    setDashboardVisible(!isDashboardVisible); // Shortcut: sets it to the opposite of what it is
  };

  return (
    <View style={{ flex: 1 }}>
      <OverlayButton
        title="Dashboard"
        onPress={toggleDashboard}
        isOpen={isDashboardVisible} // <--- Pass the state here!
      />

      <Dashboard visible={isDashboardVisible} onClose={toggleDashboard} />
    </View>
  );
}
