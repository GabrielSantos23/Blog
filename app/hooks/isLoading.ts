import { create } from 'zustand';

interface LoadingStore {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const useLoading = create<LoadingStore>((set) => ({
  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),
}));

export default useLoading;
