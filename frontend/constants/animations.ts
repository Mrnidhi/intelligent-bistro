import {
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  type WithSpringConfig,
  type WithTimingConfig,
} from "react-native-reanimated";

/* ─── Spring presets ─── */
export const SPRING_BOUNCE: WithSpringConfig = {
  damping: 12,
  stiffness: 180,
  mass: 0.8,
};

export const SPRING_SMOOTH: WithSpringConfig = {
  damping: 20,
  stiffness: 200,
  mass: 1,
};

export const SPRING_SNAPPY: WithSpringConfig = {
  damping: 16,
  stiffness: 300,
  mass: 0.6,
};

export const SPRING_GENTLE: WithSpringConfig = {
  damping: 24,
  stiffness: 120,
  mass: 1,
};

/* ─── Timing presets ─── */
export const TIMING_FAST: WithTimingConfig = {
  duration: 200,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

export const TIMING_NORMAL: WithTimingConfig = {
  duration: 350,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

export const TIMING_SLOW: WithTimingConfig = {
  duration: 500,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

/* ─── Stagger helper ─── */
export function staggerDelay(index: number, baseDelay: number = 60) {
  return index * baseDelay;
}
