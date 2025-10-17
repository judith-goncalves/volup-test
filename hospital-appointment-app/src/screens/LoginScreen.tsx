import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import ActionButtons from "../components/ActionButtons";
import { commonStyles } from "../styles/commonStyles";
import { loginPatient, setAuthToken } from "../utils/api";

interface Props {
  onSuccess: (token: string) => void;
  onBack: () => void;
}

const LoginScreen: React.FC<Props> = ({ onSuccess, onBack }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (text: string) => {
    setEmail(text.toLowerCase());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailRegex.test(text) ? "" : "Invalid email format");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    const res = await loginPatient(email, password);
    if (res?.token) {
      await AsyncStorage.setItem("token", res.token);
      await AsyncStorage.setItem("patientId", res.patient._id);
      setAuthToken(res.token);
      onSuccess(res.token);
    } else {
      Alert.alert("Error", res?.message || "Invalid credentials");
    }
  };

  return (
    <View style={commonStyles.container}>
      <View>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={handleEmailChange}
          autoCapitalize="none"
          keyboardType="email-address"
          style={commonStyles.input}
        />
        {emailError ? <Text style={{ color: "red" }}>{emailError}</Text> : null}
      </View>
      <View style={localStyles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={{ flex: 1 }}
        />
        <Pressable
          onPress={() => setShowPassword(!showPassword)}
          style={localStyles.eyeButton}
        >
          <MaterialIcons
            name={showPassword ? "visibility-off" : "visibility"}
            size={24}
            color="#888"
          />
        </Pressable>
      </View>

      <ActionButtons
        onBack={onBack}
        onNext={handleLogin}
        backColor="#373232ff"
        nextColor="#0d4565ff"
        backLabel="Go back"
        nextLabel="Login"
      />
    </View>
  );
};

export default LoginScreen;

const localStyles = StyleSheet.create({
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  eyeButton: { padding: 4 },
});
