import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
}

const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

export const useCount = () => useCounterStore((state) => state.count);
export const useIncrement = () => useCounterStore((state) => state.increment);
