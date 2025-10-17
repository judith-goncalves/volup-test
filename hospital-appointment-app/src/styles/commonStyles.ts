// styles/common.ts
import { StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, gap: 20 },

  overlay: { flex: 1, justifyContent: "center", backgroundColor: "#000000aa" },
  modal: { margin: 20, padding: 20, backgroundColor: "#fff", borderRadius: 8 },
  title: { fontWeight: "bold", fontSize: 18, marginBottom: 12, color: "#222" },
  emptyText: { textAlign: "center", color: "gray", fontSize: 16 },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 6,
  },
  optionsButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    height: 40,
    minWidth: 0,
    paddingHorizontal: 12,
    flexGrow: 1,
    flexShrink: 1,
  },

  optionsText: { color: "#FFF", fontWeight: "bold" },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#999",
    borderRadius: 6,
    zIndex: 10,
  },

  card: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#F9FAFB",
  },
  row: { marginBottom: 4, fontSize: 16, color: "#333" },
  label: { fontWeight: "bold", color: "#000" },
});
