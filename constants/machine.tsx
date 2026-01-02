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
    id: 'M-101',
    name: 'Cutter 1',
    status: 'RUNNING',
    lastUpdated: '2 mins ago',
  },
  {
    id: 'M-102',
    name: 'Roller A',
    status: 'STOPPED',
    lastUpdated: '5 mins ago',
  },
  {
    id: 'M-103',
    name: 'Packing West',
    status: 'MAINTENANCE',
    lastUpdated: '12 mins ago',
  },
];
