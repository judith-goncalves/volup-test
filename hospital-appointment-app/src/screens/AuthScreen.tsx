import React, { useState } from "react";
import { Button, View } from "react-native";
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
    <View style={{ flex: 1, justifyContent: "center", padding: 20, gap: 25 }}>
      <Button
        color="#0d4565ff"
        title="Login"
        onPress={() => setMode("login")}
      />
      <Button
        color="#0d4565ff"
        title="Register"
        onPress={() => setMode("register")}
      />
    </View>
  );
};

export default AuthScreen;
