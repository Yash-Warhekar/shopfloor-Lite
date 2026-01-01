import { Machine, machinesSeed } from '@/constants/machine';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
export type MachineStatus = 'RUNNING' | 'STOPPED' | 'MAINTENANCE';

 
export interface Alert {
  id: string;
  message: string;
  machineName: string;
  severity?: AlertSeverity;
  time?: string;
  createdAt?: string;
}

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH';

export const alertsSeed: Alert[] = [
  {
    id: 'A1',
    message: 'Unexpected shutdown',
    machineName: 'Machine 1',
    severity: 'HIGH',
    time: new Date().toLocaleTimeString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'A2',
    message: 'Maintenance overdue',
    machineName: 'Machine 3',
    severity: 'MEDIUM',
    time: new Date().toLocaleTimeString(),
    createdAt: new Date().toISOString(),
  },
];

export interface ChecklistItem {
  id: number;
  label: string;
  done: boolean;
}

export interface MaintenanceRecord {
  id: string;
  machineId: string;
  machineName: string;
  completedItems: ChecklistItem[];
  remarks: string;
  timestamp: string;
}

export const maintenanceChecklistSeed: ChecklistItem[] = [
  { id: 1, label: 'check working', done: false },
  { id: 2, label: 'check oiling', done: false },
  { id: 3, label: 'Check sensors', done: false },
  { id: 4, label: 'Clean engine Temp.', done: false },
  { id: 5, label: 'Test  others.', done: false },
];

const AppDataContext = createContext<any>(null);

export const AppDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [machines, setMachines] = useState<Machine[]>(machinesSeed);
  const [alerts, setAlerts] = useState<Alert[]>(alertsSeed);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedMachines = await AsyncStorage.getItem('machines');
        const savedAlerts = await AsyncStorage.getItem('alerts');
        const savedRecords = await AsyncStorage.getItem('maintenanceRecords');

        if (savedMachines) setMachines(JSON.parse(savedMachines));
        if (savedAlerts) setAlerts(JSON.parse(savedAlerts));
        if (savedRecords) setMaintenanceRecords(JSON.parse(savedRecords));
      } catch (error) {
        console.error('Failed to load state from AsyncStorage:', error);
      } finally {
        setIsHydrated(true);
      }
    };
    loadState();
  }, []);

  // Save machines to AsyncStorage whenever they change
  useEffect(() => {
    if (isHydrated) {
      AsyncStorage.setItem('machines', JSON.stringify(machines)).catch(e =>
        console.error('Failed to save machines:', e)
      );
    }
  }, [machines, isHydrated]);

  // Saveing alerts to AsyncStorage whenever they change
  useEffect(() => {
    if (isHydrated) {
      AsyncStorage.setItem('alerts', JSON.stringify(alerts)).catch(e =>
        console.error('Failed to save alerts:', e)
      );
    }
  }, [alerts, isHydrated]);

  // Save maintenance records to AsyncStorage whenever they change
  useEffect(() => {
    if (isHydrated) {
      AsyncStorage.setItem('maintenanceRecords', JSON.stringify(maintenanceRecords)).catch(e =>
        console.error('Failed to save maintenance records:', e)
      );
    }
  }, [maintenanceRecords, isHydrated]);

 
  const reportDowntime = (machineId: string, reason: string) => {
    setMachines(prev => {
      const updated = prev.map(m =>
        m.id === machineId
          ? { ...m, status: 'STOPPED' as MachineStatus, downtimeReason: reason }
          : m
      );

      const machineName = prev.find(m => m.id === machineId)?.name || '';

      setAlerts(curr => [
        ...curr,
        {
          id: Date.now().toString(),
          message: `Downtime reported: ${reason}`,
          machineName,
          severity: 'HIGH' as AlertSeverity,
          time: new Date().toLocaleTimeString(),
          createdAt: new Date().toISOString(),
        } as any,
      ]);

      return updated;
    });
  };

  // Operator: complete maintenance
  const completeMaintenance = (machineId: string, checkedItemIds: number[], remarks: string) => {
    const machine = machines.find(m => m.id === machineId);
    if (!machine) return;

    const completedItems = maintenanceChecklistSeed.filter(item =>
      checkedItemIds.includes(item.id)
    );

    const record: MaintenanceRecord = {
      id: Date.now().toString(),
      machineId,
      machineName: machine.name,
      completedItems,
      remarks,
      timestamp: new Date().toISOString(),
    };

    setMaintenanceRecords(prev => [...prev, record]);

    // Update machine status to RUNNING after maintenance
    setMachines(prev =>
      prev.map(m =>
        m.id === machineId
          ? { ...m, status: 'RUNNING' as MachineStatus, downtimeReason: undefined }
          : m
      )
    );

    // Add alert
    setAlerts(curr => [
      ...curr,
      {
        id: Date.now().toString(),
        message: `Maintenance completed: ${completedItems.length}/${maintenanceChecklistSeed.length} items. ${remarks ? `Notes: ${remarks}` : ''}`,
        machineName: machine.name,
        severity: 'MEDIUM' as AlertSeverity,
        time: new Date().toLocaleTimeString(),
        createdAt: new Date().toISOString(),
      } as any,
    ]);
  };

  if (!isHydrated) {
    return null; // Don't render until state is loaded
  }

  return (
    <AppDataContext.Provider
      value={{
        machines,
        alerts,
        maintenanceRecords,
        maintenanceChecklist: maintenanceChecklistSeed,
        reportDowntime,
        completeMaintenance,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => useContext(AppDataContext);
