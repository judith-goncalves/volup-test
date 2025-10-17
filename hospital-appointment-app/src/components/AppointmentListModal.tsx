import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { Appointment, AppointmentStatus } from "../types/appointment";
import { Doctor } from "../types/doctor";
import { Patient } from "../types/patient";
import {
  cancelAppointment,
  fetchAppointments,
  fetchDoctors,
  fetchPatients,
  updateAppointmentStatus,
} from "../utils/api";
import BookAppointment from "./BookAppointment";
import Button from "./Button";

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
  const [rescheduleData, setRescheduleData] = useState<{
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

  const getDoctorObject = (appt: Appointment) =>
    typeof appt.doctorId === "object"
      ? appt.doctorId
      : doctors.find((d) => d._id === appt.doctorId) || null;

  const getDoctorName = (appt: Appointment) =>
    getDoctorObject(appt)?.name ?? "";

  const getPatientName = (appt: Appointment) =>
    typeof appt.patientId === "object"
      ? appt.patientId.name
      : patients.find((p) => p._id === appt.patientId)?.name ?? "";

  const handleStatusAdvance = async (appt: Appointment) => {
    let nextStatus: AppointmentStatus | null = null;
    if (appt.status === "CREATED") nextStatus = "CONFIRMED";
    else if (appt.status === "CONFIRMED") nextStatus = "COMPLETED";
    if (!nextStatus) return;

    try {
      await updateAppointmentStatus(appt._id!, nextStatus);
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === appt._id ? { ...a, status: nextStatus! } : a
        )
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Could not update status");
    }
  };

  const handleCancel = async (appt: Appointment) => {
    const appointmentDate = new Date(appt.scheduledAt);
    const now = new Date();

    const differenceMs = appointmentDate.getTime() - now.getTime();
    const differenceHours = differenceMs / (1000 * 60 * 60);

    if (differenceHours < 24) {
      Alert.alert(
        "Cannot cancel",
        "Appointments can only be canceled at least 24 hours in advance."
      );
      return;
    }

    const confirmed = await new Promise<boolean>((resolve) => {
      Alert.alert("Cancel appointment", "Are you sure?", [
        { text: "No", onPress: () => resolve(false) },
        { text: "Yes", onPress: () => resolve(true) },
      ]);
    });
    if (!confirmed) return;

    try {
      await cancelAppointment(appt._id!);
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === appt._id ? { ...a, status: "CANCELLED" } : a
        )
      );
      Alert.alert("✅ Success", "Appointment canceled");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Could not cancel appointment");
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={commonStyles.title}>Appointments</Text>

        <Button title="Close" onPress={onClose} color="#999" closeList />

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : appointments.length === 0 ? (
          <Text style={commonStyles.emptyText}>
            No appointments registered.
          </Text>
        ) : (
          <FlatList
            data={appointments}
            keyExtractor={(item) => item._id!}
            renderItem={({ item }) => {
              const doctor = getDoctorObject(item);
              const isFinal =
                item.status === "COMPLETED" || item.status === "CANCELLED";

              return (
                <View style={commonStyles.card}>
                  <Text style={commonStyles.row}>
                    <Text style={commonStyles.label}>Doctor:</Text>{" "}
                    {getDoctorName(item)}
                  </Text>
                  <Text style={commonStyles.row}>
                    <Text style={commonStyles.label}>Patient:</Text>{" "}
                    {getPatientName(item)}
                  </Text>
                  <Text style={commonStyles.row}>
                    <Text style={commonStyles.label}>Date:</Text>{" "}
                    {formatDate(item.scheduledAt)}
                  </Text>
                  <Text style={commonStyles.row}>
                    <Text style={commonStyles.label}>Status: </Text>
                    <Text
                      style={{
                        color:
                          item.status === "CANCELLED"
                            ? "red"
                            : item.status === "COMPLETED"
                            ? "green"
                            : "#000",
                        fontWeight: "bold",
                      }}
                    >
                      {item.status}
                    </Text>
                  </Text>

                  {!isFinal && (
                    <View style={commonStyles.buttonRow}>
                      <Button
                        title="Cancel"
                        onPress={() => handleCancel(item)}
                        color="#6e0606ff"
                      />
                      {(item.status === "CREATED" ||
                        item.status === "CONFIRMED") && (
                        <Button
                          title={
                            item.status === "CREATED" ? "Confirm" : "Complete"
                          }
                          onPress={() => handleStatusAdvance(item)}
                          color="#0d4565ff"
                        />
                      )}
                      {doctor && (
                        <Button
                          title="Reschedule"
                          onPress={() =>
                            setRescheduleData({
                              appointmentId: item._id!,
                              doctor,
                              currentSlot: item.scheduledAt,
                            })
                          }
                          color="#065a48ff"
                        />
                      )}
                    </View>
                  )}
                </View>
              );
            }}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        )}

        {rescheduleData && (
          <BookAppointment
            doctor={rescheduleData.doctor}
            appointmentId={rescheduleData.appointmentId}
            currentSlot={rescheduleData.currentSlot}
            onClose={() => {
              setRescheduleData(null);
              loadData();
            }}
          />
        )}
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
});
export default AppointmentListModal;
