import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { BlockType } from "./block.types";
import type { LucideProps } from "lucide-react";

type CommandItem = {
	id: string;
	label: string;
	icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
	action: () => void;
};

export type CommandMenuState = {
	isCommandMenuOpen: boolean;
	selectedCommand: number;
	commands: CommandItem[];
};

export type CommandMenuAction = {
	setIsCommandMenuOpen: (isOpen: boolean) => void;
	setSelectedCommand: (selectedCommand: number) => void;
	handleInsertBlock: (blockType: BlockType, headerLevel?: 1 | 2 | 3) => void;
};

export type CommandMenuStore = CommandMenuState & CommandMenuAction;
