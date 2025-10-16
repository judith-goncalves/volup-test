import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";
import { loginPatient, setAuthToken } from "../utils/api";

interface Props {
  onSuccess: (token: string) => void;
  onBack: () => void;
}

const LoginScreen: React.FC<Props> = ({ onSuccess, onBack }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await loginPatient(email, password);
    if (res?.token) {
      await AsyncStorage.setItem("token", res.token);
      await AsyncStorage.setItem("patientId", res.patient._id);
      setAuthToken(res.token);
      onSuccess(res.token);
    } else Alert.alert("Error", res?.message || "Invalid credentials");
  };

  return (
    <View style={styles.container}>
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
      <Button title="Login" onPress={handleLogin} color="#0d4565ff" />
      <Button title="Go back" onPress={onBack} color="#0d4565ff" />
    </View>
  );
};

export default LoginScreen;

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
