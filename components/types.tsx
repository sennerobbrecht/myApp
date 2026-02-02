import { Ionicons } from "@expo/vector-icons";

export type Task = {
  id: string;
  title: string;
  duration: string;
  xp: number;
  completed: boolean;
  icon: keyof typeof Ionicons.glyphMap;
};

export type RoutineSectionData = {
  id: string;
  title: string;
  timeRange: string;
  timeEstimate: string;
  xpBonus: number;
  tasks: Task[];
  collapsed: boolean;
};
