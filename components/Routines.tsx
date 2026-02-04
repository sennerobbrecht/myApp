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

type RoutinesProps = {
  onGainXP: (xp: number) => void;
};


const INITIAL_SECTIONS: RoutineSectionData[] = [
  {
    id: "morning",
    title: "Morning Routine",
    timeRange: "07:00",
    timeEstimate: "30 min",
    xpBonus: 10,
    collapsed: false,
    tasks: [
      { id: "m1", title: "Brush Teeth", duration: "3 min", xp: 15, completed: false, icon: "sparkles" },
      { id: "m2", title: "Shower", duration: "10 min", xp: 10, completed: false, icon: "water" },
      { id: "m3", title: "Get Dressed", duration: "5 min", xp: 5, completed: false, icon: "shirt" },
      { id: "m4", title: "Breakfast", duration: "30 min", xp: 30, completed: false, icon: "cafe" },
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
      { id: "e1", title: "Homework", duration: "30 min", xp: 20, completed: false, icon: "book" },
      { id: "e2", title: "Pack Bag", duration: "5 min", xp: 5, completed: false, icon: "briefcase" },
    ],
  },
];

export default function Routines({ onGainXP }: RoutinesProps) {
  const [history, setHistory] = useState<Record<string, RoutineSectionData[]>>(
    {}
  );
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDateKey = (date: Date) => format(date, "yyyy-MM-dd");

  const getSectionsForDate = (date: Date): RoutineSectionData[] => {
    const key = getDateKey(date);
    return history[key]
      ? history[key]
      : JSON.parse(JSON.stringify(INITIAL_SECTIONS));
  };

  const currentSections = getSectionsForDate(selectedDate);

  const updateSections = (
    updater: (prev: RoutineSectionData[]) => RoutineSectionData[]
  ) => {
    const key = getDateKey(selectedDate);
    setHistory((prev) => ({
      ...prev,
      [key]: updater(currentSections),
    }));
  };

  const weekDays = Array.from({ length: 7 }).map((_, i) =>
    addDays(currentWeekStart, i)
  );

  const toggleTask = (sectionId: string, taskId: string) => {
    let gainedXP = 0;

    updateSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;

        return {
          ...section,
          tasks: section.tasks.map((t) => {
            if (t.id !== taskId) return t;

            if (!t.completed) {
              gainedXP += t.xp;
            }

            return { ...t, completed: !t.completed };
          }),
        };
      })
    );

    if (gainedXP > 0) {
      onGainXP(gainedXP);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const toggleSectionCollapse = (sectionId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    updateSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, collapsed: !s.collapsed } : s
      )
    );
  };

  const onDragEnd = (sectionId: string, data: Task[]) => {
    updateSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, tasks: data } : s))
    );
  };

  const changeWeek = (direction: "prev" | "next") => {
    setCurrentWeekStart((prev) =>
      direction === "next" ? addWeeks(prev, 1) : subWeeks(prev, 1)
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

      <NestableScrollContainer showsVerticalScrollIndicator={false}>
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
