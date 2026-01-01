import { useAppData } from '@/context/AppDataContext';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DowntimeForm() {
  const { machines, reportDowntime } = useAppData();

  const [selectedMachineId, setSelectedMachineId] = useState<string | undefined>(
    undefined
  );
  const [reason, setReason] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (!selectedMachineId && machines.length) {
      setSelectedMachineId(machines[0].id);
    }
  }, [machines, selectedMachineId]);

  const handleSubmit = () => {
    if (!selectedMachineId || !reason) {
      alert('Please select a machine and reason');
      return;
    }

    const details = remarks ? `${reason} - ${remarks}` : reason;
    reportDowntime(selectedMachineId, details);

    alert('Downtime recorded');
    setReason('');
    setRemarks('');
  };


  return (
    <SafeAreaView className="p-7 my-auto">
      <View className="bg-blue-50 p-3 rounded-lg mb-4">
        <Text className="text-sm text-blue-700"> Operator Mode</Text>
      </View>
      
      <Text className="text-lg mb-2">Log Downtime</Text>

      <Text className="mt-3 mb-1">Machine</Text>
      <ScrollView className="max-h-56">
        {machines.map((machine: any) => {
          const selected = machine.id === selectedMachineId;
          return (
            <TouchableOpacity
              key={machine.id}
              className={`p-2.5 my-1.5 rounded-md border ${selected ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'}`}
              onPress={() => setSelectedMachineId(machine.id)}
            >
              <Text className="text-base">
                {machine.name} ({machine.status})
              </Text>
              {machine.downtimeReason ? (
                <Text className="text-sm text-gray-500 mt-1">{machine.downtimeReason}</Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text className="mt-3 mb-1">Reason</Text>
      <TextInput
        placeholder="Machine breakdown"
        value={reason}
        onChangeText={setReason}
        className="border border-gray-300 p-2 mb-3"
      />

      <Text className="mb-1">Remarks</Text>
      <TextInput
        placeholder="Optional remarks"
        value={remarks}
        onChangeText={setRemarks}
        className="border border-gray-300 p-2 mb-3"
      />

      <TouchableOpacity className="bg-blue-500 p-3 rounded-md items-center mt-2 mb-11" onPress={handleSubmit}>
        <Text className="text-white font-semibold">Submit Downtime</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}


