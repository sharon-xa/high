
export type CommandMenuState = {
    isCommandMenuOpen: boolean;
};

export type CommandMenuAction = {
    setIsCommandMenuOpen: (isOpen: boolean) => void;
};

export type CommandMenuStore = CommandMenuState & CommandMenuAction;