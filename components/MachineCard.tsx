import { Machine } from '@/constants/machine';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

const statusColor: Record<string, string> = {
  RUNNING: '#2ecc71',
  STOPPED: '#e74c3c',
  MAINTENANCE: '#f39c12',
};

const statusBgColor: Record<string, string> = {
  RUNNING: '#e8f8f5',
  STOPPED: '#fadbd8',
  MAINTENANCE: '#fef9e7',
};

export default function MachineCard({ machine }: { machine: Machine }) {
  const { role } = useAuth();

  const handleOpen = () => {
    router.push(`/(tabs)/machine/${machine.id}`);
  };

  return (
    <TouchableOpacity onPress={handleOpen} style={{ borderRadius: 8, marginBottom: 12 }}>
      <View
        style={{
          backgroundColor: statusBgColor[machine.status] || '#fff',
          padding: 16,
          borderRadius: 8,
          borderLeftWidth: 6,
          borderLeftColor: statusColor[machine.status],
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '600', color: 'primary' }}>
          {machine.name}
        </Text>

        <Text style={{ marginVertical: 8, fontSize: 14, color: 'secondary' }}>
          Status:{' '}
          <Text
            style={{
              fontWeight: '700',
              color: statusColor[machine.status],
            }}
          >
            {machine.status}
          </Text>
        </Text>

        <Text style={{ fontSize: 13, color: '#888' }}>
          Updated: {machine.lastUpdated}
        </Text>

        {machine.downtimeReason && (
          <Text style={{ fontSize: 12, color: '#e74c3c', marginTop: 8 }}>
            Reason: {machine.downtimeReason}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
