import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Doctor } from "../types/doctor";
import {
  createAppointment,
  fetchDoctors,
  rescheduleAppointment,
} from "../utils/api";

interface Props {
  doctor: Doctor;
  onClose: () => void;
  appointmentId?: string;
  currentSlot?: string;
}

const formatSlot = (slot: string) => {
  const date = new Date(slot);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} - ${hours}:${minutes}`;
};

const AppointmentModal: React.FC<Props> = ({
  doctor,
  onClose,
  appointmentId,
  currentSlot,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(
    currentSlot || null
  );
  const [slots, setSlots] = useState(doctor.availableSlots || []);
  const [takenSlots, setTakenSlots] = useState<string[]>(
    currentSlot ? [currentSlot] : []
  );

  useEffect(() => {
    setSlots(doctor.availableSlots || []);
    if (currentSlot) {
      setSelectedSlot(currentSlot);
      setTakenSlots([currentSlot]);
    }
  }, [doctor, currentSlot]);

  const handleAction = async () => {
    if (!selectedSlot) return;

    try {
      if (appointmentId) {
        await rescheduleAppointment(appointmentId, selectedSlot);
        Alert.alert("✅ Success", "Appointment rescheduled successfully");
      } else {
        const patientId = await AsyncStorage.getItem("patientId");
        await createAppointment({
          doctorId: doctor._id!,
          patientId: patientId!,
          scheduledAt: selectedSlot,
          status: "CREATED",
        });
        Alert.alert("✅ Success", "Appointment created successfully");

        setTakenSlots((prev) => [...prev, selectedSlot]);
      }

      const updatedDoctors = await fetchDoctors();
      const updatedDoctor = updatedDoctors.find((d) => d._id === doctor._id);
      if (updatedDoctor) setSlots(updatedDoctor.availableSlots || []);

      setSelectedSlot(null);
      if (!appointmentId) onClose();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Could not complete action");
    }
  };

  const isSlotTaken = (slot: string) => takenSlots.includes(slot);

  return (
    <Modal visible transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>
            {appointmentId
              ? "Reschedule Appointment"
              : `Book appointment with ${doctor.name}`}
          </Text>

          <FlatList
            data={slots}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => !isSlotTaken(item) && setSelectedSlot(item)}
                style={[
                  styles.slot,
                  selectedSlot === item && styles.selectedSlot,
                  isSlotTaken(item) && styles.takenSlot,
                ]}
              >
                <Text
                  style={[
                    styles.slotText,
                    isSlotTaken(item) && styles.takenSlotText,
                  ]}
                >
                  {formatSlot(item)} {isSlotTaken(item) && "(Taken)"}
                </Text>
              </Pressable>
            )}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", marginTop: 10 }}>
                No available slots
              </Text>
            }
          />

          <View style={styles.buttonRow}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Close</Text>
            </Pressable>
            <Pressable style={styles.saveButton} onPress={handleAction}>
              <Text style={styles.saveButtonText}>
                {appointmentId ? "Reschedule" : "Book"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AppointmentModal;

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", backgroundColor: "#000000aa" },
  modal: { margin: 20, padding: 20, backgroundColor: "#fff", borderRadius: 8 },
  title: { fontWeight: "bold", fontSize: 18, marginBottom: 12 },
  slot: {
    padding: 8,
    backgroundColor: "#eee",
    marginVertical: 4,
    borderRadius: 6,
  },
  selectedSlot: { backgroundColor: "#0d4565ff" },
  takenSlot: { backgroundColor: "#ccc" },
  slotText: { color: "#000" },
  takenSlotText: { color: "#888", fontStyle: "italic" },
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
