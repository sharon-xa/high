export function getRange(): Range | undefined {
	return window.getSelection()?.getRangeAt(0);
}
