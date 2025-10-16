import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Doctor } from "../types/doctor";
import { fetchDoctors } from "../utils/api";
import AddDoctorModal from "./AddDoctorModal";
import CreateAppointment from "./BookAppointment";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const DoctorsListModal: React.FC<Props> = ({ visible, onClose }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [addDoctorVisible, setAddDoctorVisible] = useState(false);
  const [appointmentModal, setAppointmentModal] = useState<Doctor | null>(null);

  const loadDoctors = async () => {
    const data = await fetchDoctors();
    setDoctors(data);
  };

  useEffect(() => {
    if (visible) loadDoctors();
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={styles.title}>Doctors</Text>

        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>

        <FlatList
          data={doctors}
          keyExtractor={(item) => item._id!}
          renderItem={({ item }) => (
            <View style={styles.doctorCard}>
              <Text style={styles.doctorText}>
                {item.name} - {item.specialty}
              </Text>
              <Button
                color="#0d4565ff"
                title="Schedule Appointment"
                onPress={() => setAppointmentModal(item)}
              />
            </View>
          )}
        />

        <Button
          title="Add Doctor"
          onPress={() => setAddDoctorVisible(true)}
          color="#0d4565ff"
        />

        <AddDoctorModal
          visible={addDoctorVisible}
          onClose={() => setAddDoctorVisible(false)}
          onDoctorAdded={loadDoctors}
        />

        {appointmentModal && (
          <CreateAppointment
            doctor={appointmentModal}
            onClose={() => setAppointmentModal(null)}
          />
        )}
      </View>
    </Modal>
  );
};

export default DoctorsListModal;

const styles = StyleSheet.create({
  doctorCard: {
    marginVertical: 8,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  doctorText: { fontSize: 16, color: "#333", marginBottom: 4 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8, color: "#222" },
  closeButton: {
    alignSelf: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#999",
    borderRadius: 6,
    marginBottom: 8,
  },
  closeText: { color: "#fff", fontWeight: "bold" },
});
