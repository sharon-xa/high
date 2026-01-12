import type { FormEvent } from "react";

export const getSanitizedInnerHTML = (element: HTMLElement): string => {
	let content = element.innerHTML;

	content = content.replace(/^<br>$/, "").replace(/^<div><br><\/div>$/, "");

	let prevContent;
	do {
		prevContent = content;
		content = content.replace(/<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*><\/\1>/gi, "");
	} while (content !== prevContent);

	// convert trailing spaces to &nbsp; for Firefox
	content = content.replace(/ (?=<)/g, "&nbsp;");
	content = content.replace(/ $/g, "&nbsp;");

	const textOnly = content.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ");
	if (textOnly === "") content = "";

	return content;
};

export const handleUserInput = (
	e: FormEvent<HTMLElement>,
	blockIndex: number,
	blockContentUpdater: (index: number, content: string) => void
) => {
	let content = getSanitizedInnerHTML(e.currentTarget);

	blockContentUpdater(blockIndex, content);
};
