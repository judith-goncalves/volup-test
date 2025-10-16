import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthScreen from "./src/screens/AuthScreen";
import HomeScreen from "./src/screens/HomeScreen";
import { setAuthToken } from "./src/utils/api";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [, setToken] = useState<string | null>(null);

  const handleLoginSuccess = (token: string) => {
    setAuthToken(token);
    setIsLoggedIn(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoggedIn ? (
        <HomeScreen
          onLogout={() => {
            setToken(null);
            setIsLoggedIn(false);
          }}
        />
      ) : (
        <AuthScreen onSuccess={handleLoginSuccess} />
      )}
    </SafeAreaView>
  );
}
