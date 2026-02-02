import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  RenderItemParams
} from "react-native-draggable-flatlist";
import { Task } from "./types";

interface TaskRowProps extends RenderItemParams<Task> {
  onToggle: (id: string) => void;
}

export default function TaskRow({
  item,
  drag,
  isActive,
  onToggle,
}: TaskRowProps) {
  return (
    <TouchableOpacity
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        drag();
      }}
      disabled={isActive || item.completed}
      activeOpacity={1}
      style={[
        styles.taskRow,
        isActive && styles.taskRowActive,
        item.completed && styles.taskRowCompleted,
      ]}
    >
      <View style={styles.leftContainer}>
        {/* Drag Handle - Visual cue for reordering */}
        <TouchableOpacity onPressIn={drag} style={styles.dragHandle}>
          <Ionicons name="reorder-three" size={24} color="#999" />
        </TouchableOpacity>

        {/* Task Icon */}
        <Ionicons
          name={item.icon}
          size={20}
          color={item.completed ? "#999" : "#000"}
        />
      </View>

      <View style={styles.taskInfo}>
        <Text
          style={[styles.taskTitle, item.completed && styles.textStrikethrough]}
        >
          {item.title}
        </Text>
        <Text style={styles.taskTime}>{item.duration}</Text>
      </View>

      <View style={styles.taskRight}>
        <View style={[styles.xpPill, item.completed && { opacity: 0.5 }]}>
          <Ionicons
            name="star"
            size={10}
            color="#666" // Monochrome star
            style={{ marginRight: 4 }}
          />
          <Text style={styles.xpPillText}>+{item.xp}</Text>
        </View>

        <TouchableOpacity
          onPress={() => onToggle(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={item.completed ? "checkmark-circle" : "ellipse-outline"}
            size={24}
            color={item.completed ? "#000" : "#ccc"} // Black checkmark
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 0, // Utilize full width available in the list
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  taskRowActive: {
    backgroundColor: "#e5e5e5", // Darker gray for active state
    elevation: 4, // Higher shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 999,
  },
  taskRowCompleted: {
    opacity: 0.6,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  dragHandle: {
    paddingRight: 8,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 2,
  },
  textStrikethrough: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  taskTime: {
    fontSize: 12,
    color: "#888",
  },
  taskRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  xpPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpPillText: {
    color: "#444",
    fontSize: 10,
    fontWeight: "600",
  },
});
