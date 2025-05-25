import { create } from 'zustand';

type TAppStore = {
  isMainPage: boolean;
  setIsMainpage: (isMain: boolean) => void;
};

export const useAppStore = create<TAppStore>((set) => ({
  isMainPage: false,
  setIsMainpage: (isMain: boolean) => set(() => ({ isMainPage: isMain })),
}));
