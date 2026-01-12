import { useEffect, useRef } from "react";

import { useCommandMenuStore } from "../../../stores/editorStores/commandMenuStore";
import { getObjectPositionXY } from "../../../lib/selectionFunctions/getSelectionDetails";

const CommandMenu = () => {
	const {
		commands,
		selectedCommand,
		setSelectedCommand,
		isCommandMenuOpen,
		setIsCommandMenuOpen,
	} = useCommandMenuStore();
	const menuRef = useRef<HTMLElement>(null);

	const range = window.getSelection()?.getRangeAt(0);
	if (!range) return null;

	const { centerX, centerY } = getObjectPositionXY(
		range.getBoundingClientRect(),
		224,
		commands.length * 50 + 16
	);

	const handleKeyDown = (e: KeyboardEvent) => {
		if (!menuRef.current) return;

		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				setSelectedCommand(
					selectedCommand >= commands.length - 1 ? 0 : selectedCommand + 1
				);
				break;
			case "ArrowUp":
				e.preventDefault();
				setSelectedCommand(
					selectedCommand <= 0 ? commands.length - 1 : selectedCommand - 1
				);
				break;
			case "Enter":
				e.preventDefault();
				commands[selectedCommand]?.action();
				break;
			case "Escape":
				e.preventDefault();
				setIsCommandMenuOpen(false);
				break;
		}
	};

	useEffect(() => {
		if (!isCommandMenuOpen) return;
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [selectedCommand, commands, setIsCommandMenuOpen]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsCommandMenuOpen(false);
			}
		};

		const timeoutId = setTimeout(() => {
			document.addEventListener("mousedown", handleClickOutside);
		}, 0);

		return () => {
			clearTimeout(timeoutId);
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [setIsCommandMenuOpen]);

	return (
		<div
			ref={menuRef}
			className="min-w-56 fixed outline-2 outline-light-border bg-border text-white rounded-lg shadow-lg p-2 flex flex-col gap-1 z-50"
			style={{
				top: `${centerY}px`,
				left: `${centerX}px`,
				transform: "translate(-50%, -50%)",
			}}
			onMouseDown={(e) => e.preventDefault()}
		>
			{commands.map((command, index) => {
				const Icon = command.icon;
				const isSelected = index === selectedCommand;

				return (
					<button
						key={command.id}
						className={`flex justify-start items-center gap-2 p-2 hover:bg-light-border/25 active:bg-light-border/25 rounded transition-colors ${
							isSelected ? "bg-light-border/25" : ""
						}`}
						onClick={command.action}
						onMouseEnter={() => setSelectedCommand(index)}
					>
						<Icon size={22} strokeWidth={2} />
						<p>{command.label}</p>
					</button>
				);
			})}
		</div>
	);
};

export default CommandMenu;
