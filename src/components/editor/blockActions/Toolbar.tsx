import { useEffect } from "react";
import { useToolbarStore } from "../../../stores/editorStores/toolbarStore";
import ActionButton from "./ActionButton";
import { Bold, CodeXml, Highlighter, Italic, Link } from "lucide-react";

const Toolbar = () => {
	const { selectedText, toolbarPosition, toggleStyle, applyLink } = useToolbarStore();

	useEffect(() => {}, [selectedText.isStyled, selectedText.typesOfStyle]);

	if (toolbarPosition.top === 0 || toolbarPosition.centerX === 0) return;

	return (
		<div
			className="fixed outline-2 outline-light-border bg-background rounded shadow-lg p-1 flex gap-1 z-50"
			id="toolbar"
			style={{
				top: `${toolbarPosition.top}px`,
				left: `${toolbarPosition.centerX}px`,
				transform: "translateX(-50%)",
				transition: "bottom 0.2s ease, top 0.2s ease",
			}}
			onMouseDown={(e) => e.preventDefault()}
			onTouchStart={(e) => e.preventDefault()}
		>
			<ActionButton
				action={() => toggleStyle("bold")}
				className="p-1"
				buttonName="bold"
				ButtonContent={Bold}
				isActive={selectedText.typesOfStyle.has("bold")}
			/>
			<ActionButton
				action={() => toggleStyle("italic")}
				className="p-1"
				buttonName="italic"
				ButtonContent={Italic}
				isActive={selectedText.typesOfStyle.has("italic")}
			/>
			<ActionButton
				action={() => toggleStyle("code")}
				className="p-1"
				buttonName="code"
				ButtonContent={CodeXml}
				isActive={selectedText.typesOfStyle.has("code")}
			/>
			<ActionButton
				action={() => toggleStyle("mark")}
				className="p-1"
				buttonName="mark"
				ButtonContent={Highlighter}
				isActive={selectedText.typesOfStyle.has("mark")}
			/>
			<ActionButton
				action={() => {
					if (selectedText.typesOfStyle.has("link")) applyLink("");
					else {
						const url = window.prompt("Link URL");
						if (url) applyLink(url);
					}
				}}
				className="p-1"
				buttonName="link"
				ButtonContent={Link}
				isActive={selectedText.typesOfStyle.has("link")}
			/>
		</div>
	);
};

export default Toolbar;
