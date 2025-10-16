import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, View } from "react-native";
import AppointmentListModal from "../components/AppointmentListModal";
import DoctorsListModal from "../components/DoctorsListModal";
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
    <View style={styles.container}>
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

      <DoctorsListModal
        visible={showDoctors}
        onClose={() => setShowDoctors(false)}
      />
      <AppointmentListModal
        visible={showAppointments}
        onClose={() => setShowAppointments(false)}
      />
      <Button color="#FF3B30" title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, gap: 20 },
});
