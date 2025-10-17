import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
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
import { registerPatient, setAuthToken } from "../utils/api";
import {
  formatBirthDate,
  formatPhoneNumber,
  validateEmail,
  validatePhone,
} from "../utils/helpers";

interface Props {
  onSuccess: (token: string) => void;
  onBack: () => void;
}

const RegisterScreen: React.FC<Props> = ({ onSuccess, onBack }) => {
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [phone, setPhone] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (text: string) => {
    setEmail(text.toLowerCase());
    setEmailError(validateEmail(text) ? "" : "Invalid email format");
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setBirthDate(selectedDate);
  };

  const handleNext = () => {
    if (!name.trim() || !birthDate) {
      Alert.alert("Error", "Please enter your full name and birthdate");
      return;
    }

    if (phone && !validatePhone(phone)) {
      Alert.alert("Error", "Invalid phone number");
      return;
    }

    setStep(2);
  };

  const handleRegister = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Error", "Invalid email format");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    const res = await registerPatient({
      name: name.trim(),
      birthDate: birthDate?.toISOString().split("T")[0],
      phone: phone.trim() || undefined,
      email: email.toLowerCase(),
      password,
    });

    if (res?.token) {
      await AsyncStorage.setItem("token", res.token);
      await AsyncStorage.setItem("patientId", res.patient._id);
      setAuthToken(res.token);
      onSuccess(res.token);
    } else {
      Alert.alert("Error", res?.message || "Could not register");
    }
  };

  return (
    <View style={commonStyles.container}>
      <View style={localStyles.stepper}>
        {[1, 2].map((s) => (
          <React.Fragment key={s}>
            <View
              style={[
                localStyles.stepCircle,
                step === s && localStyles.activeStep,
                step > s && localStyles.completedStep,
              ]}
            >
              <Text style={localStyles.stepText}>{s}</Text>
            </View>
            {s < 2 && <View style={localStyles.stepLine} />}
          </React.Fragment>
        ))}
      </View>

      {step === 1 ? (
        <>
          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            style={commonStyles.input}
          />
          <TextInput
            placeholder="Phone (optional)"
            value={phone}
            onChangeText={(t) => setPhone(formatPhoneNumber(t))}
            style={commonStyles.input}
            keyboardType="phone-pad"
          />
          <Pressable onPress={() => setShowDatePicker(true)}>
            <Text style={commonStyles.input}>
              {birthDate
                ? `${formatBirthDate(birthDate)}`
                : "Select your date of birth"}
            </Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={birthDate || new Date(2000, 0, 1)}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}

          <ActionButtons onBack={onBack} onNext={handleNext} />
        </>
      ) : (
        <>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={handleEmailChange}
            autoCapitalize="none"
            keyboardType="email-address"
            style={commonStyles.input}
          />
          {emailError && <Text style={{ color: "red" }}>{emailError}</Text>}

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
            onBack={() => setStep(1)}
            onNext={handleRegister}
            backColor="#373232ff"
            nextColor="#0d4565ff"
            nextLabel="Register"
          />
        </>
      )}
    </View>
  );
};

export default RegisterScreen;

const localStyles = StyleSheet.create({
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  activeStep: { borderColor: "#0d4565ff", backgroundColor: "#0d4565ff" },
  completedStep: { borderColor: "#0d4565ff", backgroundColor: "#0d4565ff" },
  stepText: { color: "#fff", fontWeight: "bold" },
  stepLine: { width: 40, height: 2, backgroundColor: "#ccc" },
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
