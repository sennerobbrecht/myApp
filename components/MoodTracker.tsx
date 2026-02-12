import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Mood = "happy" | "calm" | "okay" | "tired" | "stressed" | "upset";

const MOODS: { id: Mood; label: string; color: string; emoji: string }[] = [
  { id: "happy", label: "Happy", color: "#FFD97D", emoji: "😊" },
  { id: "calm", label: "Calm", color: "#B9E6A8", emoji: "😌" },
  { id: "okay", label: "Okay", color: "#A8D8F0", emoji: "😐" },
  { id: "tired", label: "Tired", color: "#D4B8E8", emoji: "😴" },
  { id: "stressed", label: "Stressed", color: "#FFB88C", emoji: "😟" },
  { id: "upset", label: "Upset", color: "#FF9B9B", emoji: "😠" },
];

const REASONS = [
  "School",
  "Friends",
  "Homework",
  "Family",
  "Tired",
  "Something else",
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<Set<string>>(
    new Set(),
  );
  const [customReason, setCustomReason] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const toggleReason = (reason: string) => {
    const updated = new Set(selectedReasons);
    if (updated.has(reason)) {
      updated.delete(reason);
    } else {
      updated.add(reason);
    }
    setSelectedReasons(updated);
  };

  const saveMood = () => {
    if (selectedMood) {
      setSubmitted(true);
      // Could log mood + reasons here
      const reasons = Array.from(selectedReasons).map((r) =>
        r === "Something else" ? customReason || r : r,
      );
      console.log("Mood saved:", selectedMood, reasons);
      // Reset after a short delay for UX
      setTimeout(() => {
        setSelectedMood(null);
        setSelectedReasons(new Set());
        setCustomReason("");
        setSubmitted(false);
      }, 1500);
    }
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.submittedContainer}>
        <View style={styles.submittedContent}>
          <Text style={styles.submittedTitle}>Thanks for sharing!</Text>

          <Text style={styles.submittedSubtitle}>
            We&apos;ve saved your mood.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>How do you feel right now?</Text>

        <Text style={styles.subtitle}>
          There&apos;s no right or wrong answer.
        </Text>

        {/* Mood Grid */}
        <View style={styles.moodGrid}>
          {MOODS.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodCard,
                selectedMood === mood.id
                  ? styles.moodCardSelectedBlue
                  : styles.moodCardGray,
              ]}
              onPress={() => setSelectedMood(mood.id)}
              activeOpacity={0.8}
            >
              <View style={styles.moodCardInner}>
                <Text
                  style={[
                    styles.moodEmoji,
                    selectedMood === mood.id
                      ? styles.moodEmojiSelected
                      : styles.moodEmojiGray,
                  ]}
                >
                  {mood.emoji}
                </Text>
                <Text
                  style={[
                    styles.moodLabel,
                    selectedMood === mood.id
                      ? styles.moodLabelSelected
                      : styles.moodLabelGray,
                  ]}
                >
                  {mood.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {selectedMood && (
          <>
            <Text style={styles.whyLabel}>Want to say why?</Text>

            {/* Reason Chips */}
            <View style={styles.reasonsContainer}>
              {REASONS.map((reason) => (
                <TouchableOpacity
                  key={reason}
                  onPress={() => toggleReason(reason)}
                  style={[
                    styles.reasonChip,
                    selectedReasons.has(reason) && styles.reasonChipSelected,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.reasonText,
                      selectedReasons.has(reason) && styles.reasonTextSelected,
                    ]}
                  >
                    {reason}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedReasons.has("Something else") && (
              <View style={styles.customReasonWrap}>
                <TextInput
                  style={styles.customReasonInput}
                  placeholder="Write your reason..."
                  placeholderTextColor="#9aa6bd"
                  value={customReason}
                  onChangeText={setCustomReason}
                />
              </View>
            )}

            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveMood}
              activeOpacity={0.85}
            >
              <Text style={styles.saveButtonText}>Save mood</Text>
            </TouchableOpacity>
            <Text style={styles.changeNote}>You can change this later.</Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 20 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 28,
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 10,
  },
  moodCard: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: 16,
    margin: "2.5%",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  moodCardGray: {
    backgroundColor: "#f3f4f6",
  },
  moodCardSelectedBlue: {
    backgroundColor: "#1b63d6",
  },
  moodCardInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  moodCardSelected: {
    transform: [{ scale: 1.1 }],
  },
  moodEmoji: {
    fontSize: 48,
    marginBottom: 4,
  },
  moodEmojiGray: { opacity: 0.8 },
  moodEmojiSelected: { color: "#ffffff", opacity: 1 },
  moodLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2d3e50",
  },
  moodLabelGray: { color: "#6b7280" },
  moodLabelSelected: { color: "#ffffff" },
  whyLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginTop: 0,
    marginBottom: 12,
  },
  reasonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 18,
  },
  reasonChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#b8c5d6",
    backgroundColor: "#fff",
    margin: 6,
  },
  reasonChipSelected: {
    backgroundColor: "#1b63d6",
    borderColor: "#1b63d6",
  },
  reasonText: {
    fontSize: 14,
    color: "#5d7a92",
    fontWeight: "600",
  },
  reasonTextSelected: {
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#1b63d6",
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "800",
    fontSize: 16,
  },
  changeNote: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 13,
    marginBottom: 20,
  },
  customReasonWrap: { marginHorizontal: 20, marginBottom: 12 },
  customReasonInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    color: "#243243",
  },
  submittedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  submittedContent: { alignItems: "center" },
  submittedTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  submittedSubtitle: {
    fontSize: 16,
    color: "#ffffff",
  },
});
