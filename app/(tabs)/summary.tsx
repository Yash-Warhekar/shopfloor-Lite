import { useAppData } from '@/context/AppDataContext';
import { useSyncStore } from '@/lib/syncQueue';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

const Summary = () => {
  const { machines, alerts, maintenanceRecords } = useAppData();
  const { pending } = useSyncStore();

  const todayStr = useMemo(() => new Date().toDateString(), []);

  const totalMachines = machines?.length || 0;
  const runningCount = machines?.filter((m: any) => m.status === 'RUNNING').length || 0;
  const stoppedCount = machines?.filter((m: any) => m.status === 'STOPPED').length || 0;
  const maintenanceCount = machines?.filter((m: any) => m.status === 'MAINTENANCE').length || 0;

  // KPIs
  const uptimePercent = totalMachines ? Math.round((runningCount / totalMachines) * 100) : 0;

  const alertsToday = (alerts || []).filter((a: any) => {
    if (!a?.createdAt) return false;
    return new Date(a.createdAt).toDateString() === todayStr;
  });

  const downtimeReportsToday = alertsToday.filter((a: any) => (a.message || '').toLowerCase().includes('downtime')).length;

  const maintenanceCompletedToday = (maintenanceRecords || []).filter((r: any) => {
    if (!r?.timestamp) return false;
    return new Date(r.timestamp).toDateString() === todayStr;
  }).length;

  const acknowledgedAlertsToday = alertsToday.filter((a: any) => a.status === 'ACKNOWLEDGED').length;

  // Average acknowledge time (minutes) for alerts ack'd today
  const ackLatencies: number[] = alertsToday
    .filter((a: any) => a.status === 'ACKNOWLEDGED' && a.ackAt && a.createdAt)
    .map((a: any) => {
      const created = new Date(a.createdAt).getTime();
      const ack = new Date(a.ackAt).getTime();
      return Math.max(0, ack - created);
    });

  const avgAckMs = ackLatencies.length ? Math.round(ackLatencies.reduce((s: number, v: number) => s + v, 0) / ackLatencies.length) : 0;
  const avgAckMinutes = Math.round((avgAckMs / 1000 / 60) * 10) / 10;

  // Machines needing attention (stopped or maintenance)
  const machinesNeedingAttention = stoppedCount + maintenanceCount;

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-xl font-bold mb-4">Shift Summary</Text>

      <View className="bg-white p-4 rounded-xl mt-2 mb-4">
        <Text className="text-gray-600">KPIs for today ({todayStr})</Text>
      </View>

      <View className="flex-row flex-wrap justify-between p-3">
        <View className="bg-white w-[48%] p-4 rounded-xl mb-4 shadow">
          <Text className="text-gray-500">Total Machines</Text>
          <Text className="text-2xl font-bold">{totalMachines}</Text>
        </View>

        <View className="bg-white w-[48%] p-4 rounded-xl mb-4 shadow">
          <Text className="text-gray-500">Uptime</Text>
          <Text className="text-2xl font-bold text-green-600">{uptimePercent}%</Text>
        </View>

        <View className="bg-white w-[48%] p-4 rounded-xl mb-4 shadow">
          <Text className="text-gray-500">Running</Text>
          <Text className="text-2xl font-bold text-green-600">{runningCount}</Text>
        </View>

        <View className="bg-white w-[48%] p-4 rounded-xl mb-4 shadow">
          <Text className="text-gray-500">Needs Attention</Text>
          <Text className="text-2xl font-bold text-red-600">{machinesNeedingAttention}</Text>
        </View>

        <View className="bg-white w-[48%] p-4 rounded-xl mb-4 shadow">
          <Text className="text-gray-500">Downtime Events Today</Text>
          <Text className="text-2xl font-bold">{downtimeReportsToday}</Text>
        </View>

        <View className="bg-white w-[48%] p-4 rounded-xl mb-4 shadow">
          <Text className="text-gray-500">Alerts Today</Text>
          <Text className="text-2xl font-bold">{alertsToday.length}</Text>
        </View>

        <View className="bg-white w-[48%] p-4 rounded-xl mb-4 shadow">
          <Text className="text-gray-500">Acked Alerts Today</Text>
          <Text className="text-2xl font-bold">{acknowledgedAlertsToday}</Text>
        </View>

        <View className="bg-white w-[48%] p-4 rounded-xl mb-4 shadow">
          <Text className="text-gray-500">Avg Ack Time (mins)</Text>
          <Text className="text-2xl font-bold">{ackLatencies.length ? avgAckMinutes : '—'}</Text>
        </View>

        <View className="bg-white w-[48%] p-4 rounded-xl mb-4 shadow">
          <Text className="text-gray-500">Maintenance Completed Today</Text>
          <Text className="text-2xl font-bold">{maintenanceCompletedToday}</Text>
        </View>

        <View className="bg-white w-[48%] p-4 rounded-xl mb-4 shadow">
          <Text className="text-gray-500">Pending Sync Items</Text>
          <Text className="text-2xl font-bold">{pending || 0}</Text>
        </View>
      </View>
    </View>
  );
}

export default Summary