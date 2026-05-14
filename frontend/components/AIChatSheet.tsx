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
import { useCartStore } from "../store/cartStore";
import { sendChatMessage } from "../services/api";
import { ChatMessage } from "../types/chat";
import { SuggestedPrompt } from "./SuggestedPrompt";
import { COLORS } from "../constants/theme";

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
  text: "Hi! I'm your Bistro assistant. Tell me what you'd like to order, or ask for a recommendation.",
  timestamp: Date.now(),
};

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <View style={[styles.bubbleRow, { alignItems: isUser ? "flex-end" : "flex-start" }]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        <Text style={[styles.bubbleText, { color: isUser ? COLORS.white : COLORS.dark }]}>
          {message.text}
        </Text>
      </View>
    </View>
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
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  const sendDisabled = loading || !input.trim();

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

          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>✨</Text>
              </View>
              <View>
                <Text style={styles.headerTitle}>Ask AI</Text>
                <Text style={styles.headerSubtitle}>Bistro assistant</Text>
              </View>
            </View>
            <Pressable onPress={onClose} hitSlop={10}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            ref={scrollRef}
            style={styles.messageList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {loading && (
              <View style={[styles.bubbleRow, { alignItems: "flex-start" }]}>
                <View style={[styles.bubble, styles.bubbleAssistant]}>
                  <ActivityIndicator size="small" color={COLORS.accent} />
                </View>
              </View>
            )}
            {error && (
              <View style={[styles.bubbleRow, { alignItems: "flex-start" }]}>
                <View style={[styles.bubble, styles.bubbleError]}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              </View>
            )}
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.suggestions}
            contentContainerStyle={{ paddingHorizontal: 16, paddingRight: 24 }}
          >
            {SUGGESTIONS.map((s) => (
              <SuggestedPrompt key={s} text={s} onPress={handleSend} />
            ))}
          </ScrollView>

          <View style={styles.inputRow}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask me anything about the menu..."
              placeholderTextColor={COLORS.muted}
              style={styles.textInput}
              onSubmitEditing={() => handleSend()}
              returnKeyType="send"
              editable={!loading}
            />
            <Pressable
              onPress={() => handleSend()}
              disabled={sendDisabled}
              style={[styles.sendButton, sendDisabled && styles.sendDisabled]}
            >
              <Text style={[styles.sendText, sendDisabled && styles.sendTextDisabled]}>
                Send
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(44, 24, 16, 0.35)",
  },
  kbWrap: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    backgroundColor: COLORS.cream,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
    maxHeight: "85%",
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 999,
    backgroundColor: COLORS.border,
    marginTop: 10,
    marginBottom: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  aiBadge: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  aiBadgeText: { fontSize: 18 },
  headerTitle: { fontSize: 16, fontWeight: "700", color: COLORS.dark },
  headerSubtitle: { fontSize: 12, color: COLORS.muted, marginTop: 1 },
  closeText: { fontSize: 22, color: COLORS.muted, paddingHorizontal: 4 },
  messageList: {
    maxHeight: 320,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  bubbleRow: { marginBottom: 8 },
  bubble: {
    maxWidth: 280,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  bubbleUser: {
    backgroundColor: COLORS.accent,
    borderTopRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: COLORS.warm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopLeftRadius: 4,
  },
  bubbleError: {
    backgroundColor: COLORS.errorBg,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
    borderTopLeftRadius: 4,
  },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  errorText: { fontSize: 14, color: COLORS.errorText, lineHeight: 20 },
  suggestions: { paddingVertical: 10 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.dark,
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
  },
  sendDisabled: { backgroundColor: COLORS.border },
  sendText: { color: COLORS.white, fontSize: 14, fontWeight: "600" },
  sendTextDisabled: { color: COLORS.muted },
});
