import { useAuth } from '@/context/AuthContext';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Button, View } from 'react-native';

const TabLayout = () => {
  const { role, user, logout } = useAuth();
  const navigate = useRouter().push;;
  if (!role) return null;

  const isOperator = role === 'OPERATOR';

  const handleLogout = async () => {
    await logout();
    navigate('/login')
  };

  return (
    <Tabs>
      <Tabs.Screen
        name="dashboard"
        options={{ 
          title: 'Machines',
          headerShown: true,
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
                <Button title="Logout" onPress={handleLogout} color="#e74c3c" />
            </View>
          ),
          headerLeft: () => (
            <View style={{ marginLeft: 16 }}>
              <Button 
                title={`${isOperator ? 'operator' : 'supervisor'}`} 
                onPress={() => {}} 
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="downtime"
        options={{
          title: 'Downtime',
          href: isOperator ? '/downtime' : null,
        }}
      />

      <Tabs.Screen
        name="maintenance"
        options={{
          title: 'Maintenance',
          href: isOperator ? '/maintenance' : null,
        }}
      />

      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          href: !isOperator ? '/alerts' : null,
        }}
      />

      <Tabs.Screen
        name="summary"
        options={{
          title: 'Summary',
          href: !isOperator ? '/summary' : null,
        }}
      />
    </Tabs>
  );
}

export default TabLayout