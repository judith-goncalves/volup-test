import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Doctor } from "../types/doctor";
import { createDoctor } from "../utils/api";

interface Props {
  visible: boolean;
  onClose: () => void;
  onDoctorAdded: () => void;
}

const AddDoctorModal: React.FC<Props> = ({
  visible,
  onClose,
  onDoctorAdded,
}) => {
  const [newDoctor, setNewDoctor] = useState<Partial<Doctor>>({
    name: "",
    specialty: "",
    availableSlots: [],
  });

  const [pickerMode, setPickerMode] = useState<"date" | "time" | null>(null);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const formatSlot = (slot: string) => {
    const date = new Date(slot);
    return `${date.toLocaleDateString()} ${date
      .toLocaleTimeString()
      .slice(0, 5)}`;
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (!date) return;

    if (pickerMode === "date") {
      setSelectedDate(date);
      setPickerMode("time");
    } else if (pickerMode === "time") {
      if (!selectedDate) return;

      const finalDate = new Date(selectedDate);
      finalDate.setHours(date.getHours());
      finalDate.setMinutes(date.getMinutes());
      finalDate.setSeconds(0);
      finalDate.setMilliseconds(0);

      setNewDoctor((prev) => ({
        ...prev,
        availableSlots: [
          ...(prev.availableSlots || []),
          finalDate.toISOString(),
        ],
      }));
      setPickerMode(null);
    }
  };

  const handleAddDoctor = async () => {
    if (
      !newDoctor.name ||
      !newDoctor.specialty ||
      !newDoctor.availableSlots?.length
    )
      return;

    try {
      const savedDoctor = await createDoctor(newDoctor);
      if (!savedDoctor?._id) throw new Error("Doctor not saved properly");

      setNewDoctor({ name: "", specialty: "", availableSlots: [] });
      onClose();
      onDoctorAdded();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not save doctor");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add Doctor</Text>

          <TextInput
            placeholder="Full Name"
            value={newDoctor.name || ""}
            onChangeText={(t) => setNewDoctor({ ...newDoctor, name: t })}
            style={styles.input}
          />
          <TextInput
            placeholder="Specialty"
            value={newDoctor.specialty || ""}
            onChangeText={(t) => setNewDoctor({ ...newDoctor, specialty: t })}
            style={styles.input}
          />

          <Button
            title="Add Available Slot"
            onPress={() => setPickerMode("date")}
            color="#0d4565ff"
          />

          {pickerMode && (
            <DateTimePicker
              value={tempDate}
              mode={pickerMode}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
              minimumDate={pickerMode === "date" ? tomorrow : undefined}
            />
          )}

          <FlatList
            data={newDoctor.availableSlots || []}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <View style={styles.slotCard}>
                <Text style={styles.slotText}>{formatSlot(item)}</Text>
              </View>
            )}
            horizontal
            contentContainerStyle={{ paddingVertical: 8 }}
          />

          <View style={styles.buttonRow}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.saveButton} onPress={handleAddDoctor}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddDoctorModal;

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", backgroundColor: "#00000099" },
  modal: {
    margin: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    gap: 12,
  },
  title: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  slotCard: {
    backgroundColor: "#eef4f7",
    padding: 8,
    marginRight: 6,
    borderRadius: 6,
  },
  slotText: { color: "#0d4565ff", fontWeight: "600" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#FF3B30",
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
    marginRight: 8,
  },
  cancelText: { color: "#FFF", fontWeight: "bold" },
  saveButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  saveButtonText: { color: "#FFF", fontWeight: "bold" },
});
