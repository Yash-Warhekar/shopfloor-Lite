import { Machine } from '@/constants/machine';
import { useAuth } from '@/context/AuthContext';
import { Text, View } from 'react-native';

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

  return (
    <View
      style={{
        backgroundColor: statusBgColor[machine.status] || '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
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
  );
}
