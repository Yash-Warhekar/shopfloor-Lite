import { reasonTree as rawReasonTree } from '@/constants/reasons';
import { useAppData } from '@/context/AppDataContext';
import { File } from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function DowntimeForm({ selectedMachineIdProp }: { selectedMachineIdProp?: string }) {

  const { machines, startDowntime, endDowntime, downtimeSessions } = useAppData();

  const safeMachines = machines ?? [];
  const safeDowntimeSessions = downtimeSessions ?? {};
  const reasonTree = rawReasonTree ?? [];




  const [selectedMachineId, setSelectedMachineId] = useState<string | undefined>(
    selectedMachineIdProp
  );
  const [remarks, setRemarks] = useState('');
  const [parentReason, setParentReason] = useState<string | null>(null);
  const [childReason, setChildReason] = useState<string | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoSize, setPhotoSize] = useState<number | null>(null);
  const [permission, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  useEffect(() => {
    if (!selectedMachineId && safeMachines.length) {
      setSelectedMachineId(safeMachines[0].id);
    }
  }, [safeMachines, selectedMachineId]);

  useEffect(() => {
    if (!parentReason && reasonTree.length) {
      const first = reasonTree[0];
      setParentReason(first.code);
      setChildReason(first.children?.[0]?.code || null);
    }
  }, [parentReason, reasonTree]);

const isStarted = !!selectedMachineId && !!downtimeSessions?.[selectedMachineId];
  const handleStart = async () => {
    const finalReason = childReason ? `${parentReason}:${childReason}` : parentReason || '';
    if (!selectedMachineId || !finalReason) {
      Alert.alert('Validation', 'Please select a machine and reason');
      return;
    }

    await startDowntime(selectedMachineId, finalReason, photoUri ? { uri: photoUri, size: photoSize } : undefined);
    Alert.alert('Started', 'Downtime started and queued');
  };

  const handleEnd = async () => {
    if (!selectedMachineId) return;
    await endDowntime(selectedMachineId, remarks);
    Alert.alert('Ended', 'Downtime ended and queued');
    setRemarks('');
    setPhotoUri(null);
    setPhotoSize(null);
  };

 const pickImage = async () => {
  try {
    if (!permission?.granted) {
        const perm = await requestPermission();
        if (!perm.granted) {
          Alert.alert('Permission required', 'Need access to images');
          return;
        }
      }
    const res = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsEditing: true,
      mediaTypes: ['images'],
    });

    if (res.canceled) return;

    const uri = res.assets?.[0]?.uri;
    if (!uri) {
      Alert.alert('Image error', 'No image URI returned');
      return;
    }

    const compressed = await ImageManipulator.manipulateAsync(
      uri,
      [],
      {
        compress: 0.6,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );
    const file = new File(compressed.uri);
    const info = await file.info();
    const size = info.size ?? 0;
    
    setPhotoUri(compressed.uri);
    setPhotoSize(size);
  } catch (e) {
    console.error('pickImage', e);
    Alert.alert('Image error', 'Failed to pick or compress image');
  }
};

  return (
    <ScrollView className="p-7">
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
      <View className="mb-3">
        <Text className="text-sm font-semibold mb-1">Category</Text>
        <ScrollView horizontal className="mb-2">
          {reasonTree.map(r => (
            <TouchableOpacity key={r.code} onPress={() => { setParentReason(r.code); setChildReason(r.children?.[0]?.code || null); }} className={`px-3 py-2 mr-2 rounded ${parentReason === r.code ? 'bg-blue-500' : 'bg-gray-100'}`}>
              <Text className={`${parentReason === r.code ? 'text-white' : 'text-gray-800'}`}>{r.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text className="text-sm font-semibold mb-1">Subreason</Text>
        <ScrollView horizontal>
          {(reasonTree.find(r => r.code === parentReason)?.children || []).map(c => (
            <TouchableOpacity key={c.code} onPress={() => setChildReason(c.code)} className={`px-3 py-2 mr-2 rounded ${childReason === c.code ? 'bg-blue-400' : 'bg-gray-100'}`}>
              <Text className={`${childReason === c.code ? 'text-white' : 'text-gray-800'}`}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text className="mb-1">Remarks</Text>
      <TextInput
        placeholder="Optional remarks"
        value={remarks}
        onChangeText={setRemarks}
        className="border border-gray-300 p-2 mb-3"
      />

      <View className="mb-3">
        <Text className="text-sm font-semibold mb-2">Photo (optional)</Text>
        <View className="flex-row items-center">
          <TouchableOpacity className="bg-gray-200 px-3 py-2 rounded mr-3" onPress={pickImage}>
            <Text>Attach Photo</Text>
          </TouchableOpacity>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={{ width: 64, height: 64, borderRadius: 6 }} />
          ) : null}
        </View>
      </View>

      {!isStarted ? (
        <TouchableOpacity className="bg-blue-500 p-3 rounded-md items-center mt-2 mb-4" onPress={handleStart}>
          <Text className="text-white font-semibold">Start Downtime</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity className="bg-red-500 p-3 rounded-md items-center mt-2 mb-4" onPress={handleEnd}>
          <Text className="text-white font-semibold">End Downtime</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}


