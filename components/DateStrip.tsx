import { addDays, addWeeks, format, isSameDay } from "date-fns";
import { enUS } from "date-fns/locale";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DateStripProps {
  currentWeekStart: Date;
  selectedDate: Date;
  weekDays: Date[];
  onSelectDate: (date: Date) => void;
  onChangeWeek: (direction: "prev" | "next") => void;
}

const GAP = 6;

export default function DateStrip({
  currentWeekStart,
  selectedDate,
  onSelectDate,
  onChangeWeek,
}: DateStripProps) {
  const flatListRef = useRef<FlatList>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // We render 3 pages: [Previous Week, Current Week, Next Week]
  const pages = [-1, 0, 1];

  useEffect(() => {
    if (containerWidth > 0) {
      // Small timeout to ensure layout is ready before scrolling
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: 1, animated: false });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentWeekStart, containerWidth]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0 && Math.abs(width - containerWidth) > 1) {
      setContainerWidth(width);
    }
  };

  const renderWeek = ({ item: weekOffset }: { item: number }) => {
    const startOfWeekDate = addWeeks(currentWeekStart, weekOffset);
    const days = Array.from({ length: 7 }).map((_, i) =>
      addDays(startOfWeekDate, i),
    );

    // Calculate item width accounting for 6 gaps between 7 items
    const itemWidth = (containerWidth - 6 * GAP) / 7;

    return (
      <View style={[styles.weekContainer, { width: containerWidth }]}>
        {days.map((date) => {
          const isActive = isSameDay(date, selectedDate);
          return (
            <TouchableOpacity
              key={date.toISOString()}
              style={[
                styles.dateItem,
                { width: itemWidth },
                isActive && styles.dateItemActive,
              ]}
              onPress={() => {
                onSelectDate(date);
                Haptics.selectionAsync();
              }}
            >
              <Text style={[styles.dateDate, isActive && styles.textWhite]}>
                {format(date, "d")}
              </Text>
              <Text style={[styles.dateDay, isActive && styles.textWhite]}>
                {format(date, "MMM", { locale: enUS })}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const onMomentumScrollEnd = (event: any) => {
    if (containerWidth === 0) return;
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / containerWidth,
    );

    if (slideIndex === 0) {
      onChangeWeek("prev");
    } else if (slideIndex === 2) {
      onChangeWeek("next");
    }
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {containerWidth > 0 && (
        <FlatList
          ref={flatListRef}
          data={pages}
          renderItem={renderWeek}
          keyExtractor={(item) => item.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={1}
          getItemLayout={(_, index) => ({
            length: containerWidth,
            offset: containerWidth * index,
            index,
          })}
          onMomentumScrollEnd={onMomentumScrollEnd}
          scrollEventThrottle={16}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 90,
    width: "100%",
  },
  textWhite: {
    color: "#fff",
  },
  weekContainer: {
    flexDirection: "row",
    gap: GAP, // Use gap for spacing between items
    // No justify content needed with gap
  },
  dateItem: {
    height: 70,
    backgroundColor: "#DCDBD9",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dateItemActive: {
    backgroundColor: "#686866",
  },
  dateDay: {
    fontSize: 10,
    color: "#000",
    textTransform: "uppercase",
    marginTop: -2,
  },
  dateDate: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 0,
  },
});
