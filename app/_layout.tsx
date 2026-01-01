import { AppDataProvider } from "@/context/AppDataContext";
import { AuthProvider } from '@/context/AuthContext';
import { Stack } from "expo-router";
import "./globals.css";


export default function RootLayout() {
  return (
    <AuthProvider>
      <AppDataProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      </AppDataProvider>
    </AuthProvider>
  )
}
