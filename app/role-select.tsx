import { useRole } from '@/context/RoleContext';
import { router } from 'expo-router';
import React from 'react';
import { Button, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RoleSelect() {
  const { setRole } = useRole();

  const choose = async (r: 'OPERATOR' | 'SUPERVISOR') => {
    setRole(r);
    // after selecting, go to dashboard
    router.replace('/(tabs)/dashboard');
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center p-6 bg-gray-50">
      <View className="bg-white p-6 rounded-lg w-full">
        <Text className="text-xl font-bold mb-4">Choose your role</Text>
        <Text className="text-sm text-gray-600 mb-6">Select a role to continue. You can switch roles later.</Text>
        <View className="mb-3">
          <Button title="Operator" onPress={() => choose('OPERATOR')} color="#1f8ef1" />
        </View>
        <View>
          <Button title="Supervisor" onPress={() => choose('SUPERVISOR')} color="#10b981" />
        </View>
      </View>
    </SafeAreaView>
  );
}
