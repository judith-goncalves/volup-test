import React, { useEffect, useState } from "react";
import { FlatList, Modal, Text, View } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { Doctor } from "../types/doctor";
import { fetchDoctors } from "../utils/api";
import AddDoctorModal from "./AddDoctorModal";
import CreateAppointment from "./BookAppointment";
import Button from "./Button";

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
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={commonStyles.container}>
        <Text style={commonStyles.title}>Doctors</Text>

        <Button
          title="Close"
          onPress={onClose}
          color="#999"
          textColor="#FFF"
          closeList
        />

        <FlatList
          data={doctors}
          keyExtractor={(item) => item._id!}
          renderItem={({ item }) => (
            <View style={commonStyles.card}>
              <Text style={commonStyles.row}>
                {item.name} - {item.specialty}
              </Text>
              <Button
                title="Schedule Appointment"
                onPress={() => setAppointmentModal(item)}
                color="#0d4565ff"
                textColor="#FFF"
              />
            </View>
          )}
          ListEmptyComponent={
            <Text style={commonStyles.emptyText}>No doctors available</Text>
          }
        />

        <View style={{ padding: 20 }}>
          <Button
            title="Add Doctor"
            onPress={() => setAddDoctorVisible(true)}
            color="#0d4565ff"
          />
        </View>

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
