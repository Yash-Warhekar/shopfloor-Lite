import MachineCard from '@/components/MachineCard';
import { useAppData } from '@/context/AppDataContext';
import { useSyncStore } from '@/lib/syncQueue';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';





const Dashboard = () => {
  const {machines}=useAppData();
  const { pending, syncing } = useSyncStore();

  return (
     <View style={{ flex: 1, padding: 16, backgroundColor: '#f2f2f2' }}>
      <View style={{ marginBottom: 8, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Text style={{ fontSize: 12, color: '#444' }}>{syncing ? 'Syncing...' : `Pending: ${pending || 0}`}</Text>
      </View>
      <FlatList
        data={machines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MachineCard machine={item} />}
      />
    </View>
  )
}

export default Dashboard

const styles = StyleSheet.create({})