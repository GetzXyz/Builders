import { create } from 'zustand';
import { BuildResponse } from '@/types/build';

interface BuildState {
  builds: BuildResponse[];
  currentBuild: BuildResponse | null;
  isLoading: boolean;
  error: string | null;
  setBuild: (build: BuildResponse) => void;
  clearBuild: () => void;
  addBuild: (build: BuildResponse) => void;
  removeBuild: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBuildStore = create<BuildState>((set) => ({
  builds: [],
  currentBuild: null,
  isLoading: false,
  error: null,

  setBuild: (build) =>
    set({
      currentBuild: build,
      isLoading: false,
      error: null,
    }),

  clearBuild: () =>
    set({
      currentBuild: null,
    }),

  addBuild: (build) =>
    set((state) => ({
      builds: [build, ...state.builds],
    })),

  removeBuild: (id) =>
    set((state) => ({
      builds: state.builds.filter((b) => b.id !== id),
    })),

  setLoading: (loading) =>
    set({ isLoading: loading }),

  setError: (error) =>
    set({ error }),
}));