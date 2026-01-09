import ActionButton from "./ActionButton";
import { useCommandMenuStore } from "../../../stores/editorStores/commandMenuStore";

const MobileToolbarBlockActions = () => {
	const { commands } = useCommandMenuStore();

	return (
		<>
			{commands.map((command) => (
				<ActionButton
					key={command.id}
					action={command.action}
					buttonName={command.label}
					className="p-2"
					ButtonContent={command.icon}
				/>
			))}
		</>
	);
};

export default MobileToolbarBlockActions;
