import { BlurView } from "expo-blur";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// It accepts 'children' now!
interface DashboardProps {
  visible: boolean;
  children?: React.ReactNode;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Dashboard({ visible, children }: DashboardProps) {
  const insets = useSafeAreaInsets();
  const TOP_OFFSET = insets.top + 5;
  const translateY = useSharedValue(-SCREEN_HEIGHT);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.quad),
      });
    } else {
      translateY.value = withTiming(-SCREEN_HEIGHT, {
        duration: 300,
        easing: Easing.in(Easing.quad),
      });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    // Wrapper creates a "Mask" starting at TOP_OFFSET
    // overflow: hidden ensures the sheet is invisible until it slides "into" this frame
    <View style={[styles.maskContainer, { top: TOP_OFFSET }]}>
      <Animated.View style={[styles.sheet, animatedStyle]}>
        <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
          <View
            style={[
              styles.contentContainer,
              {
                paddingBottom: insets.bottom,
                backgroundColor: "rgba(0,0,0,0.5)",
              },
            ]}
          >
            {children}
          </View>
        </BlurView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  maskContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    // This allows the sheet to "emerge" from the top edge of this container
    overflow: "hidden",
    zIndex: -1,
  },
  sheet: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    borderRadius: 24,
    // Border radius needs one more overflow clip to work on the BlurView
    overflow: "hidden",

    // Shadow only shows if we have space, but masking might cut top shadow.
    // Usually fine for this effect.
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  blurContainer: {
    flex: 1,
    width: "100%",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
});
