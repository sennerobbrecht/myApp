import { addDays, addWeeks, format, startOfWeek, subWeeks } from "date-fns";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
    LayoutAnimation,
    Platform,
    StyleSheet,
    UIManager,
    View,
} from "react-native";
import { NestableScrollContainer } from "react-native-draggable-flatlist";
import DateStrip from "./DateStrip";
import RoutineSection from "./RoutineSection";
import { RoutineSectionData, Task } from "./types";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Mock Data (English) ---
const INITIAL_SECTIONS: RoutineSectionData[] = [
  {
    id: "morning",
    title: "Morning Routine",
    timeRange: "07:00",
    timeEstimate: "30 min",
    xpBonus: 10,
    collapsed: false,
    tasks: [
      {
        id: "m1",
        title: "Brush Teeth",
        duration: "3 min",
        xp: 15,
        completed: false,
        icon: "sparkles",
      },
      {
        id: "m2",
        title: "Shower",
        duration: "10 min",
        xp: 10,
        completed: false,
        icon: "water",
      },
      {
        id: "m3",
        title: "Get Dressed",
        duration: "5 min",
        xp: 5,
        completed: false,
        icon: "shirt",
      },
      {
        id: "m4",
        title: "Breakfast",
        duration: "30 min",
        xp: 30,
        completed: false,
        icon: "cafe",
      },
    ],
  },
  {
    id: "evening",
    title: "Evening Routine",
    timeRange: "18:00",
    timeEstimate: "45 min",
    xpBonus: 15,
    collapsed: true,
    tasks: [
      {
        id: "e1",
        title: "Homework",
        duration: "30 min",
        xp: 20,
        completed: false,
        icon: "book",
      },
      {
        id: "e2",
        title: "Pack Bag",
        duration: "5 min",
        xp: 5,
        completed: false,
        icon: "briefcase",
      },
    ],
  },
  {
    id: "bedtime",
    title: "Bedtime",
    timeRange: "20:30",
    timeEstimate: "20 min",
    xpBonus: 20,
    collapsed: true,
    tasks: [
      {
        id: "b1",
        title: "Brush Teeth",
        duration: "3 min",
        xp: 15,
        completed: false,
        icon: "sparkles",
      },
      {
        id: "b2",
        title: "Pajamas On",
        duration: "5 min",
        xp: 5,
        completed: false,
        icon: "shirt",
      },
      {
        id: "b3",
        title: "Read Book",
        duration: "15 min",
        xp: 10,
        completed: false,
        icon: "moon",
      },
    ],
  },
];

export default function Routines() {
  const [history, setHistory] = useState<Record<string, RoutineSectionData[]>>(
    {},
  );
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }), // Monday start
  );
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Helper to get formatted date key (yyyy-MM-dd)
  const getDateKey = (date: Date) => format(date, "yyyy-MM-dd");

  // Get sections for a specific date, or default to initial state
  const getSectionsForDate = (date: Date): RoutineSectionData[] => {
    const key = getDateKey(date);
    if (history[key]) {
      return history[key];
    }
    // Deep copy initial sections to avoid mutation
    return JSON.parse(JSON.stringify(INITIAL_SECTIONS));
  };

  const currentSections = getSectionsForDate(selectedDate);

  // Helper to update history for the current date
  const updateSections = (
    updater: (prev: RoutineSectionData[]) => RoutineSectionData[],
  ) => {
    const key = getDateKey(selectedDate);
    const newSections = updater(currentSections);
    setHistory((prev) => ({
      ...prev,
      [key]: newSections,
    }));
  };

  // Generate the 7 days for the currently visible week
  const weekDays = Array.from({ length: 7 }).map((_, i) =>
    addDays(currentWeekStart, i),
  );

  const toggleTask = (sectionId: string, taskId: string) => {
    updateSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          tasks: section.tasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t,
          ),
        };
      }),
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const toggleSectionCollapse = (sectionId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    updateSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, collapsed: !s.collapsed } : s,
      ),
    );
  };

  const onDragEnd = (sectionId: string, data: Task[]) => {
    updateSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, tasks: data } : s)),
    );
  };

  const changeWeek = (direction: "prev" | "next") => {
    setCurrentWeekStart((prev) =>
      direction === "next" ? addWeeks(prev, 1) : subWeeks(prev, 1),
    );
  };

  return (
    <View style={styles.container}>
      <DateStrip
        weekDays={weekDays}
        currentWeekStart={currentWeekStart}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onChangeWeek={changeWeek}
      />

      <NestableScrollContainer
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {currentSections.map((section) => (
          <RoutineSection
            key={section.id}
            section={section}
            onToggleCollapse={toggleSectionCollapse}
            onDragEnd={onDragEnd}
            onToggleTask={toggleTask}
          />
        ))}
      </NestableScrollContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
});
