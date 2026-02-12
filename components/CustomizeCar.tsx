import React, { useState } from "react";
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

const { width } = Dimensions.get("window");

type Item = {
  id: string;
  emoji: string;
  requiredLevel: number;
};

type Category = "Hats" | "Sunglasses" | "Jewelry" | "Monster Skin";

type Props = {
  level: number;
};

export default function Carousel({ level }: Props) {
  const [activeCategory, setActiveCategory] =
    useState<Category>("Hats");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const dataMap: Record<Category, Item[]> = {
    Hats: [
      { id: "1", emoji: "🎩", requiredLevel: 1 }, // always unlocked
      { id: "2", emoji: "🧢", requiredLevel: 3 },
      { id: "3", emoji: "👑", requiredLevel: 6 },
      { id: "4", emoji: "🎓", requiredLevel: 9 },
      { id: "5", emoji: "⛑️", requiredLevel: 12 },
    ],
    Sunglasses: [
      { id: "1", emoji: "🕶️", requiredLevel: 5 },
      { id: "2", emoji: "😎", requiredLevel: 7 },
      { id: "3", emoji: "🥽", requiredLevel: 11 },
      { id: "4", emoji: "👓", requiredLevel: 14 },
      { id: "5", emoji: "🕶", requiredLevel: 18 },
    ],
    Jewelry: [
      { id: "1", emoji: "💍", requiredLevel: 10 },
      { id: "2", emoji: "📿", requiredLevel: 15 },
      { id: "3", emoji: "💎", requiredLevel: 20 },
      { id: "4", emoji: "🪙", requiredLevel: 25 },
      { id: "5", emoji: "🔗", requiredLevel: 30 },
    ],
    "Monster Skin": [
      { id: "1", emoji: "🧌", requiredLevel: 2 },
      { id: "2", emoji: "👹", requiredLevel: 8 },
      { id: "3", emoji: "👺", requiredLevel: 13 },
      { id: "4", emoji: "👾", requiredLevel: 17 },
      { id: "5", emoji: "🤖", requiredLevel: 22 },
    ],
  };

  const data = dataMap[activeCategory];

  const categories: Category[] = [
    "Hats",
    "Sunglasses",
    "Jewelry",
    "Monster Skin",
  ];

  return (
    <View style={styles.wrapper}>
      {/* 🔹 CATEGORY SELECTOR */}
      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryBox,
              activeCategory === cat && styles.activeCategory,
            ]}
            onPress={() => {
              setActiveCategory(cat);
              setSelectedItem(null);
            }}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === cat &&
                  styles.activeCategoryText,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🔥 CAROUSEL */}
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => {
          const isLocked = level < item.requiredLevel;
          const isSelected = selectedItem === item.id;

          return (
            <TouchableOpacity
              disabled={isLocked}
              onPress={() => setSelectedItem(item.id)}
              style={[
                styles.card,
                isSelected && styles.selectedCard,
                isLocked && styles.lockedCard,
              ]}
            >
              {/* 🔒 LOCK */}
              {isLocked && (
                <View style={styles.lockOverlay}>
                  <Text style={styles.lockText}>🔒</Text>
                  <Text style={styles.levelText}>
                    Level {item.requiredLevel}
                  </Text>
                </View>
              )}

              {/* ✅ CHECKMARK */}
              {isSelected && !isLocked && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}

              <Text style={styles.emoji}>{item.emoji}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 12,
  },

  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 16,
  },

  categoryBox: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#eee",
  },

  activeCategory: {
    backgroundColor: "#333",
  },

  categoryText: {
    fontSize: 12,
  },

  activeCategoryText: {
    color: "white",
    fontWeight: "600",
  },

  card: {
    width: width * 0.6,
    height: 150,
    marginHorizontal: 8,
    borderRadius: 16,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    overflow: "hidden",
  },

  selectedCard: {
    borderWidth: 3,
    borderColor: "black",
  },

  lockedCard: {
    opacity: 0.5,
  },

  emoji: {
    fontSize: 48,
  },

  checkmark: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "green",
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },

  checkText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  lockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  lockText: {
    fontSize: 32,
  },

  levelText: {
    marginTop: 4,
    fontWeight: "600",
  },
});
