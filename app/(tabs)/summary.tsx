import { useAppData } from '@/context/AppDataContext';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

const Summary = () => {
  const { machines, alerts, maintenanceRecords } = useAppData();

  const todayStr = useMemo(() => new Date().toDateString(), []);

  const totalMachines = machines?.length || 0;
  const runningCount = machines?.filter((m: any) => m.status === 'RUNNING').length || 0;
  const stoppedCount = machines?.filter((m: any) => m.status === 'STOPPED').length || 0;

  const alertsToday = (alerts || []).filter((a: any) => {
    if (!a?.createdAt) return false;
    return new Date(a.createdAt).toDateString() === todayStr;
  }).length;

  const downtimeReportsToday = (alerts || []).filter((a: any) => {
    if (!a?.createdAt) return false;
    const isToday = new Date(a.createdAt).toDateString() === todayStr;
    return isToday
  }).length;

  const maintenanceCompletedToday = (maintenanceRecords || []).filter((r: any) => {
    if (!r?.timestamp) return false;
    return new Date(r.timestamp).toDateString() === todayStr;
  }).length;

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-xl font-bold mb-4">Summary</Text>

      
      <View className="bg-white p-4 rounded-xl mt-2">
        <Text className="text-gray-600">
          This summary shows today's summary of all machines.
        </Text>
      </View>


      <View className="flex-row flex-wrap justify-between p-3">
        <View className="bg-white w-[48%] p-4 rounded-xl mb-4 shadow">
          <Text className="text-gray-500">Total Machines</Text>
          <Text className="text-2xl font-bold">{totalMachines}</Text>
        </View>

        <View className="bg-white w-[48%] p-4 rounded-xl mb-4 shadow">
          <Text className="text-gray-500">Running</Text>
          <Text className="text-2xl font-bold text-green-600">{runningCount}</Text>
        </View>

        <View className="bg-white w-[48%] p-4 rounded-xl mb-4 shadow">
          <Text className="text-gray-500">Stopped</Text>
          <Text className="text-2xl font-bold text-red-600">{stoppedCount}</Text>
        </View>

        <View className="bg-white w-[48%] p-4 rounded-xl mb-4 shadow">
          <Text className="text-gray-500">Downtime Reports Today</Text>
          <Text className="text-2xl font-bold">{downtimeReportsToday}</Text>
        </View>

        <View className="bg-white w-[48%] p-4 rounded-xl mb-4 shadow">
          <Text className="text-gray-500">Alerts Today</Text>
          <Text className="text-2xl font-bold">{alertsToday}</Text>
        </View>

        <View className="bg-white w-[48%] p-4 rounded-xl mb-4 shadow">
          <Text className="text-gray-500">Maintenance Completed Today</Text>
          <Text className="text-2xl font-bold">{maintenanceCompletedToday}</Text>
        </View>
      </View>

      
    </View>
  );
}

export default Summary