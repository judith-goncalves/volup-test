import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Alert, View } from "react-native";
import AppointmentListModal from "../components/AppointmentListModal";
import Button from "../components/Button";
import DoctorsListModal from "../components/DoctorsListModal";
import { commonStyles } from "../styles/commonStyles";
import { setAuthToken } from "../utils/api";

interface Props {
  onLogout: () => void;
}

const HomeScreen: React.FC<Props> = ({ onLogout }) => {
  const [showDoctors, setShowDoctors] = useState(false);
  const [showAppointments, setShowAppointments] = useState(false);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("patientId");
          setAuthToken("");
          onLogout();
        },
      },
    ]);
  };

  return (
    <View style={commonStyles.container}>
      <Button title="Logout" onPress={handleLogout} color="#999" closeList />
      <View style={{ width: "100%", padding: 10, gap: 25 }}>
        <Button
          color="#0d4565ff"
          title="Doctors"
          onPress={() => setShowDoctors(true)}
        />
        <Button
          color="#0d4565ff"
          title="Appointments"
          onPress={() => setShowAppointments(true)}
        />
      </View>

      <DoctorsListModal
        visible={showDoctors}
        onClose={() => setShowDoctors(false)}
      />
      <AppointmentListModal
        visible={showAppointments}
        onClose={() => setShowAppointments(false)}
      />
    </View>
  );
};

export default HomeScreen;
