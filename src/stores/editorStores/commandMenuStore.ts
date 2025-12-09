import { create } from "zustand";
import type { CommandMenuStore } from "../../types/commandMenu.types";

export const useCommandMenuStore = create<CommandMenuStore>((set) => ({
    isCommandMenuOpen: false,

    setIsCommandMenuOpen: (isOpen: boolean) => set(() => ({ isCommandMenuOpen: isOpen })),
}));