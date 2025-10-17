import React, { useState } from "react";
import { View } from "react-native";
import Button from "../components/Button";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";

interface Props {
  onSuccess: (token: string) => void;
}

const AuthScreen: React.FC<Props> = ({ onSuccess }) => {
  const [mode, setMode] = useState<"menu" | "login" | "register">("menu");

  if (mode === "login") {
    return <LoginScreen onSuccess={onSuccess} onBack={() => setMode("menu")} />;
  }

  if (mode === "register") {
    return (
      <RegisterScreen onSuccess={onSuccess} onBack={() => setMode("menu")} />
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <View style={{ gap: 20 }}>
        <Button title="Login" onPress={() => setMode("login")} />
        <Button title="Register" onPress={() => setMode("register")} />
      </View>
    </View>
  );
};

export default AuthScreen;
