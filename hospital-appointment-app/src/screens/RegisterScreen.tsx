import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";
import { registerPatient, setAuthToken } from "../utils/api";

interface Props {
  onSuccess: (token: string) => void;
  onBack: () => void;
}
const RegisterScreen: React.FC<Props> = ({ onSuccess, onBack }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const res = await registerPatient({ name, email, password });

    if (res?.token) {
      await AsyncStorage.setItem("token", res.token);
      await AsyncStorage.setItem("patientId", res.patient._id);
      setAuthToken(res.token);
      onSuccess(res.token);
    } else Alert.alert("Error", res?.message || "Could not register");
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text.toLowerCase())}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button color="#0d4565ff" title="Register" onPress={handleRegister} />
      <Button color="#0d4565ff" title="Go Back" onPress={onBack} />
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, gap: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 6,
  },
});
