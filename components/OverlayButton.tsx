import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";

export default function OverlayButton({
  title,
  onPress,
  isOpen, // <--- 1. Accept the state from the parent
}: {
  title: string;
  onPress: () => void;
  isOpen: boolean; // <--- 2. Define the type using boolean (true/false)
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: 10,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 5,
        maxWidth: "30%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: 10,
      }}
    >
      <Text>{title}</Text>

      {/* 3. Logic: If open, show UP arrow. If closed, show DOWN arrow. */}
      <Ionicons
        name={isOpen ? "chevron-up-outline" : "chevron-down-outline"}
        size={24}
        color="black"
      />
    </TouchableOpacity>
  );
}
