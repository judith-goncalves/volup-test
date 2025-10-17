import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { Doctor } from "../types/doctor";
import { createDoctor } from "../utils/api";
import { formatSlot } from "../utils/helpers";
import ActionButtons from "./ActionButtons";
import Button from "./Button";

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
      <View style={commonStyles.overlay}>
        <View style={commonStyles.modal}>
          <Text style={commonStyles.title}>Add Doctor</Text>

          <TextInput
            placeholder="Full Name"
            value={newDoctor.name || ""}
            onChangeText={(t) => setNewDoctor({ ...newDoctor, name: t })}
            style={commonStyles.input}
          />
          <TextInput
            placeholder="Specialty"
            value={newDoctor.specialty || ""}
            onChangeText={(t) => setNewDoctor({ ...newDoctor, specialty: t })}
            style={commonStyles.input}
          />

          <View style={{ width: "100%", marginVertical: 8 }}>
            <Button
              title="Add Available Slot"
              onPress={() => setPickerMode("date")}
              color="#0d4565ff"
            />
          </View>

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

          <ActionButtons
            onBack={onClose}
            onNext={handleAddDoctor}
            backLabel="Cancel"
            nextLabel="Save"
            backColor="#373232ff"
            nextColor="#0d4565ff"
            backTextColor="#FFF"
            nextTextColor="#FFF"
          />
        </View>
      </View>
    </Modal>
  );
};

export default AddDoctorModal;

const styles = StyleSheet.create({
  slotCard: {
    backgroundColor: "#eef4f7",
    padding: 8,
    marginRight: 6,
    borderRadius: 6,
  },
  slotText: { color: "#0d4565ff", fontWeight: "600" },
});
