import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { create } from 'zustand';

const QUEUE_KEY = 'syncQueue_v1';

export type QueueItem = {
  id: string;
  type: string;
  payload: any;
  tenant_id?: string;
  createdAt: string;
};

type SyncState = {
  pending: number;
  syncing: boolean;
  setPending: (n: number) => void;
  setSyncing: (b: boolean) => void;
};

export const useSyncStore = create<SyncState>(set => ({
  pending: 0,
  syncing: false,
  setPending: n => set({ pending: n }),
  setSyncing: b => set({ syncing: b }),
}));

export const enqueue = async (item: QueueItem) => {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    const arr: QueueItem[] = raw ? JSON.parse(raw) : [];
    arr.push(item);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(arr));
    useSyncStore.getState().setPending(arr.length);
  } catch (e) {
    console.error('enqueue error', e);
  }
};

export const getQueue = async (): Promise<QueueItem[]> => {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const clearQueue = async () => {
  await AsyncStorage.removeItem(QUEUE_KEY);
  useSyncStore.getState().setPending(0);
};

async function fakeUpload(item: QueueItem) {
  // Simulate network upload delay and success
  await new Promise(r => setTimeout(r, 500));
  return { success: true, id: item.id };
}

export const processQueue = async () => {
  const state = useSyncStore.getState();
  try {
    state.setSyncing(true);
    const queue = await getQueue();
    if (!queue.length) {
      state.setPending(0);
      return;
    }

    const remaining: QueueItem[] = [];
    for (const item of queue) {
      try {
        const res = await fakeUpload(item);
        if (!res || !res.success) {
          remaining.push(item);
        }
      } catch (e) {
        console.warn('upload failed, keep for retry', e);
        remaining.push(item);
      }
    }

    if (remaining.length) {
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
    } else {
      await AsyncStorage.removeItem(QUEUE_KEY);
    }

    state.setPending(remaining.length);
  } catch (e) {
    console.error('processQueue', e);
  } finally {
    state.setSyncing(false);
  }
};

// Initialize NetInfo listener to auto-process when online
let unsub: (() => void) | null = null;
export const initSyncListener = () => {
  if (unsub) return;
  unsub = NetInfo.addEventListener(state => {
    if (state.isConnected) {
      processQueue().catch(e => console.error(e));
    }
  });
};

export const stopSyncListener = () => {
  if (unsub) {
    unsub();
    unsub = null;
  }
};
