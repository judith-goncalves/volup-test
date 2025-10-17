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
import { commonStyles } from "../styles/commonStyles";
import { Doctor } from "../types/doctor";
import {
  createAppointment,
  fetchDoctors,
  rescheduleAppointment,
} from "../utils/api";
import ActionButtons from "./ActionButtons";

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
  const [slots, setSlots] = useState<string[]>(doctor.availableSlots || []);

  useEffect(() => {
    const loadUpdatedDoctor = async () => {
      const updated = await fetchDoctors();
      const found = updated.find((d) => d._id === doctor._id);
      if (found) {
        const available = currentSlot
          ? [...(found.availableSlots ?? []), currentSlot]
          : found.availableSlots ?? [];
        setSlots(available);
      }
    };
    loadUpdatedDoctor();
  }, [doctor._id, currentSlot]);

  const handleAction = async () => {
    if (!selectedSlot) return;

    try {
      if (appointmentId) {
        await rescheduleAppointment(appointmentId, selectedSlot);
        Alert.alert("✅ Success", "Appointment rescheduled successfully");
        setSlots((prev) =>
          [...prev.filter((s) => s !== selectedSlot), currentSlot!].filter(
            Boolean
          )
        );
      } else {
        const patientId = await AsyncStorage.getItem("patientId");
        await createAppointment({
          doctorId: doctor._id!,
          patientId: patientId!,
          scheduledAt: selectedSlot,
          status: "CREATED",
        });

        Alert.alert("✅ Success", "Appointment created successfully");
        setSlots((prev) => prev.filter((s) => s !== selectedSlot));
      }

      setSelectedSlot(null);
      onClose();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Could not complete action");
    }
  };

  return (
    <Modal visible transparent>
      <View style={commonStyles.overlay}>
        <View style={commonStyles.modal}>
          <Text style={commonStyles.title}>
            {appointmentId
              ? "Reschedule Appointment"
              : `Book with ${doctor.name}`}
          </Text>

          <FlatList
            data={slots}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setSelectedSlot(item)}
                style={[
                  localStyles.slot,
                  selectedSlot === item && localStyles.selectedSlot,
                ]}
              >
                <Text
                  style={[
                    localStyles.slotText,
                    selectedSlot === item && { color: "#fff" },
                  ]}
                >
                  {formatSlot(item)}
                </Text>
              </Pressable>
            )}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", marginTop: 10 }}>
                No available slots
              </Text>
            }
          />

          <ActionButtons
            onBack={onClose}
            onNext={handleAction}
            backLabel="Close"
            nextLabel={appointmentId ? "Reschedule" : "Book"}
            backColor="#373232ff"
            nextColor="#0d4565ff"
          />
        </View>
      </View>
    </Modal>
  );
};

export default AppointmentModal;

const localStyles = StyleSheet.create({
  slot: {
    padding: 8,
    backgroundColor: "#eee",
    marginVertical: 4,
    borderRadius: 6,
  },
  selectedSlot: { backgroundColor: "#0d4565ff" },
  slotText: { color: "#000" },
});
