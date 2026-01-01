import { useAppData } from '@/context/AppDataContext';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const Alerts = () => {
  const { alerts } = useAppData();
  // const { role } = useAuth();

  // if (role !== 'SUPERVISOR') {
  //   return (
  //     <ScrollView className="flex-1 bg-gray-100 p-4 items-center justify-center">
  //       <Text className="text-lg font-bold text-red-600">Access Denied</Text>
  //       <Text className="text-sm text-gray-600 mt-2">Only Supervisors can view alerts</Text>
  //     </ScrollView>
  //   );
  // }

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <View className="p-3 rounded-lg mb-4">
        <Text className="text-sm text-purple-700">Supervisor</Text>
      </View>
      
      <Text className="text-xl font-bold mb-4">Alerts ({alerts?.length || 0})</Text>

      {(!alerts || alerts.length === 0) && (
        <Text className="text-gray-600">No alerts at this time</Text>
      )}

      {alerts && alerts.slice().reverse().map((alert: any) => (
        <TouchableOpacity
          key={alert.id}
          className="bg-white p-4 rounded-xl mb-3 shadow active:bg-gray-50"
        >
          <View className="flex-row justify-between mb-1">
            <Text className="font-semibold text-gray-800">{alert.machineName || alert.machine}</Text>
            <Text
              className={`text-xs font-bold px-2 py-1 rounded ${
                alert.severity === 'HIGH'
                  ? 'bg-red-100 text-red-600'
                  : alert.severity === 'MEDIUM'
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {alert.severity || 'INFO'}
            </Text>
          </View>

          <Text className="text-gray-700 mb-2">{alert.message}</Text>
          <Text className="text-xs text-gray-400">
             {alert.time || new Date().toLocaleTimeString()}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

export default Alerts