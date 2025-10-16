import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Appointment } from "../types/appointment";
import { Doctor } from "../types/doctor";
import { Patient } from "../types/patient";
import {
  cancelAppointment,
  fetchAppointments,
  fetchDoctors,
  fetchPatients,
} from "../utils/api";
import CreateAppointment from "./BookAppointment";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} - ${hours}:${minutes}`;
};

const AppointmentListModal: React.FC<Props> = ({ visible, onClose }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  const [rescheduleAppointmentData, setRescheduleAppointmentData] = useState<{
    appointmentId: string;
    doctor: Doctor;
    currentSlot: string;
  } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appts, docs, pats] = await Promise.all([
        fetchAppointments(),
        fetchDoctors(),
        fetchPatients(),
      ]);
      setAppointments(appts);
      setDoctors(docs);
      setPatients(pats);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Could not load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) loadData();
  }, [visible]);

  // Helpers seguros
  const getDoctorName = (appt: Appointment): string => {
    if (typeof appt.doctorId === "object" && appt.doctorId?.name)
      return appt.doctorId.name;
    const d = doctors.find((doc) => doc._id === appt.doctorId);
    return d?.name ?? "Desconocido";
  };

  const getPatientName = (appt: Appointment): string => {
    if (typeof appt.patientId === "object" && appt.patientId?.name)
      return appt.patientId.name;
    const p = patients.find((pat) => pat._id === appt.patientId);
    return p?.name ?? "Desconocido";
  };

  const getDoctorObject = (appt: Appointment): Doctor | null => {
    if (typeof appt.doctorId === "object") return appt.doctorId;
    return doctors.find((d) => d._id === appt.doctorId) || null;
  };

  const handleCancel = async (appt: Appointment) => {
    const confirmed = await new Promise<boolean>((resolve) => {
      Alert.alert("Cancel appointment", "Are you sure?", [
        { text: "No", onPress: () => resolve(false) },
        { text: "Yes", onPress: () => resolve(true) },
      ]);
    });
    if (!confirmed) return;

    try {
      await cancelAppointment(appt._id!);
      setAppointments((prev) => prev.filter((a) => a._id !== appt._id));
      Alert.alert("✅ Success", "Appointment canceled");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Could not cancel appointment");
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Appointments</Text>

        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : appointments.length === 0 ? (
          <Text style={styles.emptyText}>No appointments registered.</Text>
        ) : (
          <FlatList
            data={appointments}
            keyExtractor={(item) => item._id!}
            renderItem={({ item }) => {
              const doctor = getDoctorObject(item);
              return (
                <View style={styles.card}>
                  <Text style={styles.row}>
                    <Text style={styles.label}>Doctor:</Text>{" "}
                    {getDoctorName(item)}
                  </Text>
                  <Text style={styles.row}>
                    <Text style={styles.label}>Patient:</Text>{" "}
                    {getPatientName(item)}
                  </Text>
                  <Text style={styles.row}>
                    <Text style={styles.label}>Date:</Text>{" "}
                    {formatDate(item.scheduledAt)}
                  </Text>
                  <Text style={styles.row}>
                    <Text style={styles.label}>Status:</Text> {item.status}
                  </Text>

                  <View style={styles.buttonRow}>
                    <Pressable
                      style={styles.cancelButton}
                      onPress={() => handleCancel(item)}
                    >
                      <Text style={styles.cancelText}>Cancel</Text>
                    </Pressable>

                    {doctor && (
                      <Pressable
                        style={styles.rescheduleButton}
                        onPress={() =>
                          setRescheduleAppointmentData({
                            appointmentId: item._id!,
                            doctor,
                            currentSlot: item.scheduledAt,
                          })
                        }
                      >
                        <Text style={styles.rescheduleText}>Reschedule</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            }}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        )}

        {rescheduleAppointmentData && (
          <CreateAppointment
            doctor={rescheduleAppointmentData.doctor}
            appointmentId={rescheduleAppointmentData.appointmentId}
            currentSlot={rescheduleAppointmentData.currentSlot}
            onClose={() => {
              setRescheduleAppointmentData(null);
              loadData();
            }}
          />
        )}
      </View>
    </Modal>
  );
};

export default AppointmentListModal;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
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
  card: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#F9FAFB",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  row: { marginBottom: 4, fontSize: 16, color: "#333" },
  label: { fontWeight: "bold", color: "#000" },
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
  rescheduleButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  rescheduleText: { color: "#FFF", fontWeight: "bold" },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
    fontSize: 16,
  },
});
