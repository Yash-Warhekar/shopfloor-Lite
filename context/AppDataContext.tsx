import { Machine, machinesSeed } from '@/constants/machine';
import { enqueue, getQueue, initSyncListener, useSyncStore } from '@/lib/syncQueue';
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
  status?: 'CREATED' | 'ACKNOWLEDGED' | 'CLEARED';
  ackBy?: string;
  ackAt?: string;
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
    status: 'CREATED',
  },
  {
    id: 'A2',
    message: 'Maintenance overdue',
    machineName: 'Machine 3',
    severity: 'MEDIUM',
    time: new Date().toLocaleTimeString(),
    createdAt: new Date().toISOString(),
    status: 'CREATED',
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
  const [downtimeSessions, setDowntimeSessions] = useState<Record<string, any>>({});
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

    // start sync listener
    initSyncListener();

    // populate pending count
    getQueue().then(q => useSyncStore.getState().setPending(q.length)).catch(e=>{});
  }, []);

  // Alert simulator for demo: push a new alert every 60s
  useEffect(() => {
    const iv = setInterval(() => {
      const id = `A-${Date.now()}`;
      const machine = machines[Math.floor(Math.random() * machines.length)];
      if (!machine) return;
      const newAlert: Alert = {
        id,
        message: Math.random() > 0.5 ? 'Auto-generated alert' : 'Check machine parameters',
        machineName: machine.name,
        severity: Math.random() > 0.7 ? 'HIGH' : 'LOW',
        time: new Date().toLocaleTimeString(),
        createdAt: new Date().toISOString(),
        status: 'CREATED',
      };

      setAlerts(prev => {
        const next = [...prev, newAlert];
        AsyncStorage.setItem('alerts', JSON.stringify(next)).catch(e => console.error(e));
        return next;
      });
    }, 60000);

    return () => clearInterval(iv);
  }, [machines]);

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

      // enqueue for sync
      (async () => {
        try {
          const tenant_id = (await AsyncStorage.getItem('userId')) || 'tenant-unknown';
          await enqueue({
            id: Date.now().toString(),
            type: 'downtime',
            payload: { machineId, reason, machineName },
            tenant_id,
            createdAt: new Date().toISOString(),
          });
        } catch (e) {
          console.error('enqueue downtime', e);
        }
      })();

      return updated;
    });
  };

  const startDowntime = async (machineId: string, reason: string, photo?: any) => {
    const sessionId = `ds-${Date.now()}`;
    setDowntimeSessions(prev => ({ ...prev, [machineId]: { id: sessionId, machineId, reason, photo, startAt: new Date().toISOString() } }));

    setMachines(prev => prev.map(m => m.id === machineId ? { ...m, status: 'STOPPED' as MachineStatus, downtimeReason: reason } : m));

    try {
      const tenant_id = (await AsyncStorage.getItem('userId')) || 'tenant-unknown';
      await enqueue({
        id: sessionId,
        type: 'downtime_start',
        payload: { machineId, reason, photo },
        tenant_id,
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error('enqueue downtime_start', e);
    }
  };

  const endDowntime = async (machineId: string, remarks?: string) => {
    const session = downtimeSessions[machineId];
    const endAt = new Date().toISOString();
    if (!session) return;

    const start = new Date(session.startAt).getTime();
    const durationMs = Math.max(0, new Date(endAt).getTime() - start);

    setMachines(prev => prev.map(m => m.id === machineId ? { ...m, status: 'RUNNING' as MachineStatus, downtimeReason: undefined } : m));

    const machineName = machines.find(m => m.id === machineId)?.name || '';
    const alert: Alert = {
      id: `A-${Date.now()}`,
      message: `Downtime ended (${Math.round(durationMs/1000)}s)${remarks ? ` - ${remarks}` : ''}`,
      machineName,
      severity: 'MEDIUM',
      time: new Date().toLocaleTimeString(),
      createdAt: new Date().toISOString(),
      status: 'CREATED',
    };

    setAlerts(prev => [...prev, alert]);

    try {
      const tenant_id = (await AsyncStorage.getItem('userId')) || 'tenant-unknown';
      await enqueue({
        id: `de-${Date.now()}`,
        type: 'downtime_end',
        payload: { machineId, remarks, durationMs, session },
        tenant_id,
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error('enqueue downtime_end', e);
    }

    setDowntimeSessions(prev => {
      const copy = { ...prev };
      delete copy[machineId];
      return copy;
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

    // enqueue maintenance record for sync
    (async () => {
      try {
        const tenant_id = (await AsyncStorage.getItem('userId')) || 'tenant-unknown';
        await enqueue({
          id: record.id,
          type: 'maintenance',
          payload: record,
          tenant_id,
          createdAt: new Date().toISOString(),
        });
      } catch (e) {
        console.error('enqueue maintenance', e);
      }
    })();
  };

  // Supervisor: acknowledge alert
  const acknowledgeAlert = (alertId: string, userEmail: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'ACKNOWLEDGED', ackBy: userEmail, ackAt: new Date().toISOString() } : a));
    // enqueue ack event
    (async () => {
      try {
        const tenant_id = (await AsyncStorage.getItem('userId')) || 'tenant-unknown';
        await enqueue({
          id: `ack-${alertId}-${Date.now()}`,
          type: 'acknowledge',
          payload: { alertId, userEmail },
          tenant_id,
          createdAt: new Date().toISOString(),
        });
      } catch (e) {
        console.error('enqueue ack', e);
      }
    })();
  };

  const clearAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'CLEARED' } : a));
    (async () => {
      try {
        const tenant_id = (await AsyncStorage.getItem('userId')) || 'tenant-unknown';
        await enqueue({
          id: `clear-${alertId}-${Date.now()}`,
          type: 'clear',
          payload: { alertId },
          tenant_id,
          createdAt: new Date().toISOString(),
        });
      } catch (e) {
        console.error('enqueue clear', e);
      }
    })();
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
