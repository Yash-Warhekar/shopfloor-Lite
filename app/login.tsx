import { useAuth } from "@/context/AuthContext";
import { useRole } from "@/context/RoleContext";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  const { user, login, isLoading } = useAuth();
  const { setRole } = useRole();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState<"OPERATOR" | "SUPERVISOR">(
    "OPERATOR"
  );

  useEffect(() => {
    if (user) {
      router.replace("/(tabs)/dashboard");
    }
  }, [user]);

  const handleLogin = async () => {
    setError("");
    if (!username || !password) {
      setError("Username and password required");
      return;
    }

    const result = await login(username, password);
    if (!result.success) {
      setError(result.error || "Login failed");
      return;
    }

    setRole(selectedRole);
    router.replace("/(tabs)/dashboard");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 px-6 py-8 justify-center">
        <Text className="text-4xl font-bold mb-2 text-center text-accent">
          ShopFloor Lite
        </Text>

        <Text className="text-center text-gray-600 mb-8 text-lg">Welcome</Text>

        <View className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <Text className="text-2xl font-bold mb-6 text-gray-800">Login</Text>

          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Username
          </Text>
          <TextInput
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
            editable={!isLoading}
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
            placeholderTextColor="#999"
          />

          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Password
          </Text>
          <TextInput
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
            placeholderTextColor="#999"
          />
          {error && (
            <Text className="text-red-600 mb-4 text-sm font-semibold">
              {error}
            </Text>
          )}

          <View className="mb-4">
            <Button
              title={isLoading ? "Logging in..." : "Login"}
              onPress={handleLogin}
              disabled={isLoading}
              color="#3498db"
            />
          </View>

          {isLoading && <ActivityIndicator size="large" color="#3498db" />}
        </View>

        <View className="flex-row items-center justify-center mb-6">
          <Text className="mr-3 text-gray-700 text-2xl font-semibold">
            Operator
          </Text>

          <Switch
            value={selectedRole === "SUPERVISOR"}
            onValueChange={(value) =>
              setSelectedRole(value ? "SUPERVISOR" : "OPERATOR")
            }
          />

          <Text className="ml-3 text-2xl text-gray-700 font-semibold">
            Supervisor
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
