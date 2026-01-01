import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Maintenance = () => {
  const { machines, maintenanceChecklist, completeMaintenance } = useAppData();
  const { role } = useAuth();


  const [selectedMachineId, setSelectedMachineId] = useState<string | undefined>(undefined);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (!selectedMachineId && machines.length) {
      setSelectedMachineId(machines[0].id);
    }
  }, [machines, selectedMachineId]);

  const toggleItem = (id: number) => {
    setCheckedItems((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!selectedMachineId) {
      alert('Please select a machine');
      return;
    }

    completeMaintenance(selectedMachineId, checkedItems, remarks);

    alert('Maintenance submitted');
    setCheckedItems([]);
    setRemarks('');
  };


  // if (role !== 'OPERATOR') {
  //   return (
  //     <ScrollView className="flex-1 bg-gray-100 px-4 py-6 items-center justify-center">
  //       <Text className="text-lg font-bold text-red-600">Access Denied</Text>
  //       <Text className="text-sm text-gray-600 mt-2">Only Operators can complete maintenance</Text>
  //     </ScrollView>
  //   );
  // }
    
  return (
    <ScrollView className="flex-1 bg-gray-100 px-4 py-6">
      <View className="bg-blue-50 p-3 rounded-lg mb-4">
        <Text className="text-sm text-blue-700">Operator Mode</Text>
      </View>
     
      <Text className="text-2xl font-bold mb-4 text-gray-800">
        Maintenance Checklist
      </Text>

      <View className="bg-white rounded-xl p-4 mb-6 shadow">
        <Text className="text-sm text-secondary mb-2">Select Machine</Text>
        <ScrollView className="max-h-48">
          {machines.map((machine:any) => {
            const selected = machine.id === selectedMachineId;
            return (
              <TouchableOpacity
                key={machine.id}
                onPress={() => setSelectedMachineId(machine.id)}
                className={`p-3 mb-2 rounded-lg border ${
                  selected
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text className="font-semibold text-gray-800">
                  {machine.name}
                </Text>
                <Text className="text-xs" style={{color: machine.status==='STOPPED' || machine.status==='MAINTENANCE' ? "#dc143c" : "#006400"}}>
                  Status: {machine.status}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View className="bg-white rounded-xl p-4 mb-6 shadow">
        <Text className="text-lg font-semibold mb-4 text-gray-800">
          Checklist Items
        </Text>

        {maintenanceChecklist.map((item:any) => {
          const checked = checkedItems.includes(item.id);

          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => toggleItem(item.id)}
              className="flex-row items-center mb-3"
            >
              <View
                className={`h-5 w-5 rounded border mr-3 ${
                  checked
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-400'
                }`}
              />

              <Text
                className={`text-base ${
                  checked ? 'text-gray-400 line-through' : 'secondary'
                }`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      
      <View className="bg-white rounded-xl p-4 mb-6 shadow">
        <Text className="text-lg font-semibold mb-2 text-gray-800">
          Remarks
        </Text>

        <TextInput
          placeholder="Add Maintenance Remarks."
          value={remarks}
          onChangeText={setRemarks}
          multiline
          numberOfLines={4}
          className="border border-gray-300 rounded-lg p-3 text-base text-gray-800"
        />
      </View>

      <TouchableOpacity className="bg-blue-600 rounded-xl py-4 items-center">
        <Text onPress={handleSubmit} className="text-white text-lg font-semibold">
          Submit Maintenance
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default Maintenance