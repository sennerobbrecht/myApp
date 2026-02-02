import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NestableDraggableFlatList } from "react-native-draggable-flatlist";
import TaskRow from "./TaskRow";
import { RoutineSectionData, Task } from "./types";

interface RoutineSectionProps {
  section: RoutineSectionData;
  onToggleCollapse: (id: string) => void;
  onDragEnd: (id: string, data: Task[]) => void;
  onToggleTask: (sectionId: string, taskId: string) => void;
}

// Helper to parse "X min" or "X hr" to minutes
const parseDuration = (duration: string): number => {
  const match = duration.match(/(\d+)/);
  return match ? parseInt(match[0], 10) : 0;
};

// Helper to format minutes back to string
const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
};

export default function RoutineSection({
  section,
  onToggleCollapse,
  onDragEnd,
  onToggleTask,
}: RoutineSectionProps) {
  const completedCount = section.tasks.filter((t) => t.completed).length;
  const totalCount = section.tasks.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  // Calculate total duration dynamically
  const totalDurationString = useMemo(() => {
    const totalMinutes = section.tasks.reduce(
      (acc, task) => acc + parseDuration(task.duration),
      0,
    );
    return formatDuration(totalMinutes);
  }, [section.tasks]);

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity
        style={[
          styles.headerCard,
          section.collapsed && styles.headerCardCollapsed,
        ]}
        onPress={() => onToggleCollapse(section.id)}
        activeOpacity={0.8}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerIconContainer}>
            <Ionicons
              name={
                section.id === "evening"
                  ? "moon-outline"
                  : section.id === "bedtime"
                    ? "bed-outline"
                    : "sunny-outline"
              }
              size={22}
              color="#000"
            />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{section.title}</Text>
            <Text style={styles.headerSubtitle}>
              {section.timeRange} • {totalDurationString} • {completedCount}/
              {totalCount}
            </Text>
          </View>
          {section.xpBonus > 0 && (
            <View style={styles.xpBadge}>
              <Text style={styles.xpText}>+{section.xpBonus} XP</Text>
            </View>
          )}
        </View>

        {!section.collapsed && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progress * 100}%` },
                ]}
              />
            </View>
          </View>
        )}
      </TouchableOpacity>

      {!section.collapsed && (
        <View style={styles.taskList}>
          <NestableDraggableFlatList
            data={section.tasks}
            keyExtractor={(item) => item.id}
            onDragEnd={({ data }) => onDragEnd(section.id, data)}
            renderItem={(params) => (
              <TaskRow
                {...params}
                onToggle={(taskId) => onToggleTask(section.id, taskId)}
              />
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 12,
    marginHorizontal: 0, // Utilize full width
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000", // Stark black border for wireframe look
    borderRadius: 16,
    overflow: "hidden",
  },
  headerCard: {
    backgroundColor: "#fff",
    padding: 16,
  },
  headerCardCollapsed: {
    //
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIconContainer: {
    width: 38,
    height: 38,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  xpBadge: {
    backgroundColor: "#f0f0f0", // Gray
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  xpText: {
    color: "#000", // Black text
    fontSize: 11,
    fontWeight: "700",
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: "#eee",
    borderRadius: 0,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#000", // Black fill
  },
  taskList: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});
