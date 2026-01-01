export type MachineStatus = 'RUNNING' | 'STOPPED' | 'MAINTENANCE';

export interface Machine {
  id: string;
  name: string;
  status: MachineStatus;
  lastUpdated: string;
  downtimeReason?:string;
}

export const machinesSeed: Machine[] = [
  {
    id: 'M1',
    name: 'Machine 1',
    status: 'RUNNING',
    lastUpdated: '2 mins ago',
  },
  {
    id: 'M2',
    name: 'Machine 2',
    status: 'STOPPED',
    lastUpdated: '5 mins ago',
  },
  {
    id: 'M3',
    name: 'Machine 3',
    status: 'MAINTENANCE',
    lastUpdated: '12 mins ago',
  },
];
