import type { FormEvent } from "react";

export const handleUserInput = (
	e: FormEvent<HTMLElement>,
	blockIndex: number,
	blockContentUpdater: (index: number, content: string) => void
) => {
	let content = e.currentTarget.innerHTML;

	content = content.replace(/^<br>$/, "").replace(/^<div><br><\/div>$/, "");

	let prevContent;
	let hadEmptyTags = false;
	do {
		prevContent = content;
		content = content.replace(/<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*><\/\1>/gi, "");
		if (content !== prevContent) hadEmptyTags = true;
	} while (content !== prevContent);

	// Convert trailing spaces to &nbsp; for Firefox
	content = content.replace(/ (?=<)/g, "&nbsp;");
	content = content.replace(/ $/g, "&nbsp;");

	const textOnly = content.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ");
	if (textOnly.trim() === "") content = "";

	blockContentUpdater(blockIndex, content);
};
