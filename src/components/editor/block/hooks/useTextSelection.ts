import { getSelectionDetails, isSelectedTextStyled } from "../../../../lib/selectionFunctions";
import { useToolbarStore } from "../../../../stores/editorStores/toolbarStore";

const useTextSelection = () => {
	const { setSelectedText, showToolbar, hideToolbar, setToolbarPosition, setRange } =
		useToolbarStore();

	const handleTextSelection = () => {
		const sel = window.getSelection();
		if (!sel || sel.isCollapsed || !sel.rangeCount) {
			hideToolbar();
			return null;
		}

		const selection = getSelectionDetails(sel);
		if (selection === null) return;

		setRange(selection.range);
		setToolbarPosition(selection.top, selection.centerX);
		showToolbar();

		const { isStyled, typesOfStyle } = isSelectedTextStyled(sel);
		setSelectedText({ isStyled, typesOfStyle });
	};

	return { handleTextSelection };
};

export default useTextSelection;
