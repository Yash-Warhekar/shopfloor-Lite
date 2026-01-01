import { SEEDED_USERS, useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  const { user, login, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Auto-redirect if already logged in
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
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 px-6 py-8 justify-center">
        <Text className="text-4xl font-bold mb-2 text-center text-accent">
          ShopFloor Lite
        </Text>

        <Text className="text-center text-gray-600 mb-8 text-lg">
          Welcome
        </Text>

        {/* Login Form */}
        <View className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <Text className="text-2xl font-bold mb-6 text-gray-800">Login</Text>

          {/* Username Input */}
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

          {/* Password Input */}
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
        
        {/* Demo-seed data */}
        <View className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <ScrollView className="max-h-48">
            <Text className="text-sm font-bold text-gray-800 mb-3">
              Demo Accounts:
            </Text>

            {SEEDED_USERS.map((u) => (
              <View key={u.id} className="mb-3 pb-3 border-b border-blue-200">
                <Text className="text-xs font-semibold text-gray-700">
                  {u.role === "OPERATOR" ? "Operator" : "Supervisor"}
                </Text>
                <Text className="text-xs text-gray-600 mt-1">
                  <Text className="font-mono">Username: {u.username}</Text>
                </Text>
                <Text className="text-xs text-gray-600">
                  <Text className="font-mono">Password: {u.password}</Text>
                </Text>
                <Text className="text-xs text-gray-600 mt-1">
                  Name: {u.name}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
