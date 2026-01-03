import DowntimeForm from '@/components/DowntimeForm';
import { useAppData } from '@/context/AppDataContext';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function MachineDetail() {
  const { id } = useLocalSearchParams() as { id: string };
  const { machines } = useAppData();


  const machine = machines?.find((m: any) => m.id === id);

  if (!machine) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Machine not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <View className="bg-white rounded-xl p-4 mb-4 shadow">
        <Text className="text-xl font-bold">{machine.name}</Text>
        <Text className="text-sm text-gray-600 mt-2">ID: {machine.id}</Text>
        <Text className="text-sm text-gray-600 mt-1">Status: {machine.status}</Text>
        {machine.downtimeReason && <Text className="text-sm text-red-600 mt-2">Reason: {machine.downtimeReason}</Text>}
      </View>

      <View className="mb-6">
        <DowntimeForm selectedMachineIdProp={machine.id} />
      </View>

      <View className="bg-white rounded-xl p-4">
        <Text className="font-semibold mb-2">Maintenance</Text>
        <Text className="text-sm text-gray-600">Open the Maintenance tab to complete checklists for this machine.</Text>
      </View>
    </ScrollView>
  );
}
