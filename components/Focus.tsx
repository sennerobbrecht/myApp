import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Monster3D from "./Monster3D";
import { RoutineSectionData, Task } from "./types";

const TASKS: Task[] = [
  { id: "f1", title: "Homework", duration: "30 min", xp: 10, completed: false, icon: "book" },
  { id: "f2", title: "Reading", duration: "15 min", xp: 8, completed: false, icon: "book" },
  { id: "f3", title: "Practice / Study", duration: "25 min", xp: 12, completed: false, icon: "musical-notes" },
  { id: "f4", title: "Creative Time", duration: "30 min", xp: 10, completed: false, icon: "color-palette" },
];

const TIME_OPTIONS = [10, 15, 25, 30];

export default function Focus() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(TASKS[1].id);
  const [selectedMinutes, setSelectedMinutes] = useState<number>(15);
  const [customMinutes, setCustomMinutes] = useState<string>("");
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(selectedMinutes * 60);

  const selectedMinutesNotPreset = (m: number) => !TIME_OPTIONS.includes(m);

  const commitCustomMinutes = () => {
    const mins = parseInt(customMinutes || "", 10);
    if (!isNaN(mins)) {
      const clamped = Math.max(1, Math.min(240, mins));
      setSelectedMinutes(clamped);
      setCustomMinutes(String(clamped));
    } else {
      setCustomMinutes("");
    }
  };

  // keep secondsLeft in sync when time selection changes while not running
  useEffect(() => {
    if (!running) setSecondsLeft(selectedMinutes * 60);
  }, [selectedMinutes, running]);

  useEffect(() => {
    if (!running) return;

    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [running]);

  const startFocus = () => {
    setSecondsLeft(selectedMinutes * 60);
    setRunning(true);
  };

  const finishFocus = () => {
    setRunning(false);
    setSecondsLeft(selectedMinutes * 60);
  };

  const minutesLeft = Math.floor(secondsLeft / 60);
  const secondsRem = secondsLeft % 60;

  const progress = useMemo(() => {
    const total = selectedMinutes * 60;
    if (total === 0) return 0;
    return 1 - secondsLeft / total;
  }, [secondsLeft, selectedMinutes]);

  if (running) {
    return (
      <SafeAreaView style={styles.runningContainer}>
        <View style={styles.topSpacer} />
        <View style={styles.centerArea}>
          <View style={styles.progressRing}>
            <Monster3D />
          </View>
          <Text style={styles.runningText}>I'm here. Take it step by step.</Text>
          <Text style={styles.timerText}>{`${String(minutesLeft).padStart(2, "0")}:${String(secondsRem).padStart(2, "0")}`}</Text>
        </View>

        <View style={styles.controls}> 
          <TouchableOpacity style={styles.finishButton} onPress={finishFocus} activeOpacity={0.8}>
            <Text style={styles.finishButtonText}>Finish Focus</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.breakLink} onPress={() => { finishFocus(); /* could trigger break flow */ }}>
            <Text style={styles.breakText}>Take a short break</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let's focus for a bit</Text>
      <Text style={styles.subtitle}>What do you want to work on?</Text>

      <FlatList
        data={TASKS}
        keyExtractor={(item) => item.id}
        style={styles.taskList}
        contentContainerStyle={{ paddingBottom: 8 }}
        renderItem={({ item }) => {
          const selected = item.id === selectedTaskId;
          return (
            <TouchableOpacity
              style={[styles.taskCard, selected && styles.taskCardSelected]}
              onPress={() => setSelectedTaskId(item.id)}
              activeOpacity={0.8}
            >
              <View style={styles.taskCardInner}>
                <View style={styles.iconWrap}>
                  <Ionicons name={item.icon as any} size={22} color="#2d2d2d" />
                </View>
                <Text style={[styles.taskTitle, selected && styles.taskTitleSelected]}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <Text style={styles.howLong}>How long do you want to focus?</Text>
      <View style={styles.timeSelectorRow}>
        {TIME_OPTIONS.map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => { setSelectedMinutes(t); setCustomMinutes(""); }}
            style={[styles.timeOption, selectedMinutes === t && styles.timeOptionSelected]}
            activeOpacity={0.8}
          >
            <Text style={[styles.timeOptionText, selectedMinutes === t && styles.timeOptionTextSelected]}>{`${t} min`}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.customRow}>
        <Text style={styles.customLabel}>Custom</Text>
        <View style={[styles.customInputWrap, selectedMinutesNotPreset(selectedMinutes) && styles.timeOptionSelected] as any}>
          <TextInput
            keyboardType="number-pad"
            returnKeyType="done"
            style={styles.customInput}
            placeholder="Minutes"
            placeholderTextColor="#9aa6bd"
            value={customMinutes}
            onChangeText={(text) => {
              const digits = text.replace(/[^0-9]/g, "");
              setCustomMinutes(digits);
            }}
            onEndEditing={() => commitCustomMinutes()}
            onSubmitEditing={() => commitCustomMinutes()}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={startFocus} activeOpacity={0.85}>
        <Text style={styles.startButtonText}>Start focus</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 8 },
  title: { fontSize: 28, fontWeight: "700", color: "#ffffff", textAlign: "center", marginTop: 6 },
  subtitle: { textAlign: "center", color: "#ffffff", marginTop: 6, marginBottom: 12 },
  taskList: { marginHorizontal: 12 },
  taskCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  taskCardSelected: {
    backgroundColor: "#e6f0ff",
    borderColor: "#7fb1ff",
    borderWidth: 1,
  },
  taskCardInner: { flexDirection: "row", alignItems: "center" },
  iconWrap: { width: 40, height: 40, borderRadius: 8, backgroundColor: "#f3f6fb", alignItems: "center", justifyContent: "center", marginRight: 12 },
  taskTitle: { fontSize: 16, color: "#243243" },
  taskTitleSelected: { color: "#1b63d6", fontWeight: "700" },
  hint: { textAlign: "center", color: "#ffffff", marginTop: 8, marginBottom: 8 },
  howLong: { textAlign: "center", color: "#ffffff", fontWeight: "700", marginTop: 20 },
  timeSelectorRow: { flexDirection: "row", justifyContent: "center", marginTop: 12, marginHorizontal: 20, marginBottom: 10 },
  timeOption: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, backgroundColor: "#fff", marginHorizontal: 6, borderWidth: 1, borderColor: "#e6eef9" },
  timeOptionSelected: { backgroundColor: "#2b86ff", borderColor: "#2b86ff" },
  timeOptionText: { color: "#243243", fontWeight: "600" },
  timeOptionTextSelected: { color: "#fff" },
  startButton: { backgroundColor: "#1b63d6", marginHorizontal: 24, paddingVertical: 14, borderRadius: 12, marginTop: 28 },
  startButtonText: { color: "#fff", textAlign: "center", fontWeight: "800", fontSize: 16 },

  customRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 8 },
  customLabel: { color: "#ffffff", marginRight: 12, fontWeight: "700" },
  customInputWrap: { borderRadius: 8, borderWidth: 1, borderColor: "#e6eef9", backgroundColor: "#fff", paddingHorizontal: 8 },
  customInput: { width: 90, height: 40, color: "#243243", fontWeight: "700", textAlign: "center" },

  runningContainer: { flex: 1, justifyContent: "space-between", alignItems: "center" },
  topSpacer: { height: 20 },
  centerArea: { alignItems: "center", flex: 1, justifyContent: "center" },
  progressRing: { width: 260, height: 260, borderRadius: 130, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(200,220,255,0.35)" },
  runningText: { marginTop: 18, fontSize: 18, color: "#ffffff" },
  timerText: { marginTop: 6, fontSize: 28, fontWeight: "700", color: "#ffffff" },
  controls: { width: "100%", alignItems: "center", paddingBottom: 28 },
  finishButton: { backgroundColor: "#bfc7cf", width: "80%", paddingVertical: 12, borderRadius: 20, alignItems: "center" },
  finishButtonText: { color: "#fff", fontWeight: "700" },
  breakLink: { marginTop: 12 },
  breakText: { color: "#ffffff", textDecorationLine: "underline" },
});
