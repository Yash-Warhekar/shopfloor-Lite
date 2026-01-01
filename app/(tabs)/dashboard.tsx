import MachineCard from '@/components/MachineCard'
// import { machines } from '@/constants/machinex'
import { useAppData } from '@/context/AppDataContext'
import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'





const Dashboard = () => {
  const {machines}=useAppData();

  return (
     <View style={{ flex: 1, padding: 16, backgroundColor: '#f2f2f2' }}>
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