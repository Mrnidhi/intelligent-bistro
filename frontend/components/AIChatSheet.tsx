import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  FadeInDown,
  FadeInUp,
  Easing,
} from "react-native-reanimated";
import { useCartStore } from "../store/cartStore";
import { sendChatMessage } from "../services/api";
import { ChatMessage } from "../types/chat";
import { SuggestedPrompt } from "./SuggestedPrompt";
import { COLORS, TYPE, SPACING, RADIUS, shadow, shadowMedium } from "../constants/theme";
import { SPRING_BOUNCE, SPRING_SNAPPY } from "../constants/animations";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const SUGGESTIONS = [
  "What do you recommend?",
  "Add two spicy chicken sandwiches",
  "Add truffle fries",
  "Remove the fries",
  "Clear my cart",
];

const INITIAL_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "Hi! I'm your Bistro assistant. Tell me what you'd like to order, or ask for a recommendation. ✨",
  timestamp: Date.now(),
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/* ─── Typing indicator with animated dots ─── */
function TypingIndicator() {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    const anim = (sv: Animated.SharedValue<number>, delay: number) => {
      sv.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(-4, { duration: 300, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        )
      );
    };
    anim(dot1, 0);
    anim(dot2, 150);
    anim(dot3, 300);
  }, []);

  const d1 = useAnimatedStyle(() => ({ transform: [{ translateY: dot1.value }] }));
  const d2 = useAnimatedStyle(() => ({ transform: [{ translateY: dot2.value }] }));
  const d3 = useAnimatedStyle(() => ({ transform: [{ translateY: dot3.value }] }));

  return (
    <View style={styles.typingRow}>
      <View style={[styles.bubble, styles.bubbleAssistant, styles.typingBubble]}>
        <View style={styles.dots}>
          <Animated.View style={[styles.dot, d1]} />
          <Animated.View style={[styles.dot, d2]} />
          <Animated.View style={[styles.dot, d3]} />
        </View>
      </View>
    </View>
  );
}

/* ─── Message Bubble ─── */
function MessageBubble({ message, index }: { message: ChatMessage; index: number }) {
  const isUser = message.role === "user";
  return (
    <Animated.View
      entering={FadeInDown.delay(50).duration(400).springify().damping(20)}
      style={[styles.bubbleRow, { alignItems: isUser ? "flex-end" : "flex-start" }]}
    >
      {!isUser && (
        <View style={styles.avatarSmall}>
          <Text style={styles.avatarText}>✨</Text>
        </View>
      )}
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAssistant,
        ]}
      >
        <Text
          style={[
            styles.bubbleText,
            { color: isUser ? COLORS.white : COLORS.dark },
          ]}
        >
          {message.text}
        </Text>
      </View>
    </Animated.View>
  );
}

export function AIChatSheet({ visible, onClose }: Props) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<ScrollView>(null);
  const cartItems = useCartStore((s) => s.cartItems);
  const replaceCart = useCartStore((s) => s.replaceCart);

  const sendScale = useSharedValue(1);

  // Reset to clean state every time the sheet is reopened
  useEffect(() => {
    if (visible) {
      setError(null);
      setInput("");
    }
  }, [visible]);

  async function handleSend(text?: string) {
    const message = (text ?? input).trim();
    if (!message || loading) return;

    sendScale.value = withSequence(
      withSpring(0.85, SPRING_SNAPPY),
      withSpring(1, SPRING_BOUNCE)
    );

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: "user",
      text: message,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage(message, cartItems);
      replaceCart(response.updatedCart, response.cartSummary);
      const assistantMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: "assistant",
        text: response.reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setError(
        "I'm having trouble reaching the kitchen right now. You can still update your cart manually."
      );
    } finally {
      setLoading(false);
      setTimeout(
        () => scrollRef.current?.scrollToEnd({ animated: true }),
        100
      );
    }
  }

  const sendDisabled = loading || !input.trim();

  const sendBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sendScale.value }],
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.kbWrap}
        pointerEvents="box-none"
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          {/* ─── Header ─── */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>✨</Text>
              </View>
              <View>
                <Text style={styles.headerTitle}>AI Assistant</Text>
                <View style={styles.statusRow}>
                  <View style={styles.statusDot} />
                  <Text style={styles.headerSubtitle}>Online & ready</Text>
                </View>
              </View>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={10}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          {/* ─── Messages ─── */}
          <ScrollView
            ref={scrollRef}
            style={styles.messageList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              scrollRef.current?.scrollToEnd({ animated: true })
            }
          >
            {messages.map((msg, i) => (
              <MessageBubble key={msg.id} message={msg} index={i} />
            ))}
            {loading && <TypingIndicator />}
            {error && (
              <Animated.View
                entering={FadeInDown.duration(300)}
                style={[
                  styles.bubbleRow,
                  { alignItems: "flex-start" },
                ]}
              >
                <View style={[styles.bubble, styles.bubbleError]}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              </Animated.View>
            )}
          </ScrollView>

          {/* ─── Suggestions ─── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.suggestions}
            contentContainerStyle={{
              paddingHorizontal: SPACING.xl,
              paddingRight: SPACING.xxl,
            }}
          >
            {SUGGESTIONS.map((s) => (
              <SuggestedPrompt key={s} text={s} onPress={handleSend} />
            ))}
          </ScrollView>

          {/* ─── Input ─── */}
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Tell me what you're craving…"
                placeholderTextColor={COLORS.mutedSoft}
                style={styles.textInput}
                onSubmitEditing={() => handleSend()}
                returnKeyType="send"
                editable={!loading}
              />
            </View>
            <AnimatedPressable
              onPress={() => handleSend()}
              disabled={sendDisabled}
              style={[
                styles.sendButton,
                sendDisabled && styles.sendDisabled,
                sendBtnStyle,
              ]}
            >
              <Text
                style={[
                  styles.sendText,
                  sendDisabled && styles.sendTextDisabled,
                ]}
              >
                ↑
              </Text>
            </AnimatedPressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
  },
  kbWrap: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    backgroundColor: COLORS.cream,
    borderTopLeftRadius: RADIUS.xxxl,
    borderTopRightRadius: RADIUS.xxxl,
    paddingBottom: 32,
    maxHeight: "88%",
  },
  handle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.border,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  aiBadge: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.accentGlow,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.accentLight,
  },
  aiBadgeText: { fontSize: 20 },
  headerTitle: {
    ...TYPE.headlineMd,
    color: COLORS.dark,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.successDot,
    marginRight: 5,
  },
  headerSubtitle: {
    ...TYPE.labelSm,
    color: COLORS.successText,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.warm,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 18,
    color: COLORS.muted,
  },

  /* Messages */
  messageList: {
    maxHeight: 340,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  bubbleRow: {
    marginBottom: SPACING.md,
    flexDirection: "row",
    gap: SPACING.sm,
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentGlow,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  avatarText: { fontSize: 13 },
  bubble: {
    maxWidth: 280,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
  },
  bubbleUser: {
    backgroundColor: COLORS.dark,
    borderBottomRightRadius: RADIUS.sm,
  },
  bubbleAssistant: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderBottomLeftRadius: RADIUS.sm,
    ...shadow,
  },
  bubbleError: {
    backgroundColor: COLORS.errorBg,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
    borderBottomLeftRadius: RADIUS.sm,
  },
  bubbleText: {
    ...TYPE.bodyMd,
    lineHeight: 22,
  },
  errorText: {
    ...TYPE.bodyMd,
    color: COLORS.errorText,
    lineHeight: 22,
  },

  /* Typing indicator */
  typingRow: {
    marginBottom: SPACING.md,
    flexDirection: "row",
    gap: SPACING.sm,
    alignItems: "flex-start",
  },
  typingBubble: {
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.lg,
  },
  dots: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.mutedSoft,
  },

  /* Suggestions */
  suggestions: {
    paddingVertical: SPACING.md,
  },

  /* Input */
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
    gap: SPACING.sm,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.lg,
    ...shadow,
  },
  textInput: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md + 2,
    ...TYPE.bodyMd,
    color: COLORS.dark,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.dark,
    alignItems: "center",
    justifyContent: "center",
    ...shadowMedium,
  },
  sendDisabled: {
    backgroundColor: COLORS.border,
  },
  sendText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "700",
    marginTop: -2,
  },
  sendTextDisabled: {
    color: COLORS.muted,
  },
});
